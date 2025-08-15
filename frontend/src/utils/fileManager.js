/**
 * Sistema de Gestión de Archivos para OCR System Pro
 * Maneja la carga, conversión y descarga de archivos
 */

import eventManager, { EVENTS } from './eventManager.js';
import notificationSystem from './notificationSystem.js';

class FileManager {
  constructor() {
    this.uploadedFiles = new Map();
    this.conversionQueue = [];
    this.isProcessing = false;
    this.supportedFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/tiff'];
    this.maxFileSize = 10 * 1024 * 1024; // 10MB
    this.isInitialized = false;
  }

  /**
   * Inicializa el sistema de archivos
   */
  init() {
    if (this.isInitialized) return;
    
    this.setupEventListeners();
    this.isInitialized = true;
    console.log('📁 FileManager inicializado');
  }

  /**
   * Configura los listeners de eventos
   */
  setupEventListeners() {
    // Escuchar eventos de archivos
    eventManager.on(EVENTS.FILE.UPLOAD_START, (data) => {
      this.handleUploadStart(data);
    });

    eventManager.on(EVENTS.FILE.CONVERSION_START, (data) => {
      this.handleConversionStart(data);
    });
  }

  /**
   * Valida un archivo
   */
  validateFile(file) {
    const errors = [];

    // Validar tipo de archivo
    if (!this.supportedFormats.includes(file.type)) {
      errors.push(`Formato no soportado: ${file.type}. Use JPG, PNG, GIF, WEBP, BMP o TIFF.`);
    }

    // Validar tamaño
    if (file.size > this.maxFileSize) {
      errors.push(`Archivo demasiado grande: ${(file.size / 1024 / 1024).toFixed(2)}MB. Máximo permitido: ${(this.maxFileSize / 1024 / 1024).toFixed(2)}MB.`);
    }

    // Validar nombre
    if (file.name.length > 100) {
      errors.push('Nombre de archivo demasiado largo. Máximo 100 caracteres.');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Procesa la carga de un archivo
   */
  async processFileUpload(file) {
    // Validar archivo
    const validation = this.validateFile(file);
    if (!validation.isValid) {
      notificationSystem.error('Archivo inválido', validation.errors.join('\n'));
      return null;
    }

    try {
      // Emitir evento de inicio de carga
      eventManager.emit(EVENTS.FILE.UPLOAD_START, { file });

      // Crear ID único para el archivo
      const fileId = this.generateFileId(file);
      
      // Crear objeto de archivo
      const fileData = {
        id: fileId,
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadDate: new Date(),
        status: 'uploading',
        progress: 0,
        metadata: await this.extractMetadata(file)
      };

      // Simular progreso de carga
      await this.simulateUploadProgress(fileData);

      // Marcar como cargado
      fileData.status = 'uploaded';
      fileData.progress = 100;

      // Agregar a la lista de archivos
      this.uploadedFiles.set(fileId, fileData);

      // Emitir evento de carga completada
      eventManager.emit(EVENTS.FILE.UPLOAD_COMPLETE, { fileData });

      notificationSystem.success('Archivo cargado', `${file.name} se cargó correctamente`);

      return fileData;

    } catch (error) {
      console.error('Error al cargar archivo:', error);
      
      eventManager.emit(EVENTS.FILE.UPLOAD_ERROR, { 
        file, 
        error: error.message 
      });

      notificationSystem.error('Error al cargar', `No se pudo cargar ${file.name}`);
      return null;
    }
  }

  /**
   * Simula el progreso de carga
   */
  async simulateUploadProgress(fileData) {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        fileData.progress += Math.random() * 15 + 5;
        
        if (fileData.progress >= 100) {
          fileData.progress = 100;
          clearInterval(interval);
          resolve();
        }

        // Emitir progreso
        eventManager.emit(EVENTS.FILE.UPLOAD_PROGRESS, { 
          fileId: fileData.id, 
          progress: fileData.progress 
        });
      }, 200);
    });
  }

  /**
   * Extrae metadatos del archivo
   */
  async extractMetadata(file) {
    return new Promise((resolve) => {
      const metadata = {
        dimensions: null,
        colorSpace: null,
        dpi: null
      };

      if (file.type.startsWith('image/')) {
        const img = new Image();
        const url = URL.createObjectURL(file);
        
        img.onload = () => {
          metadata.dimensions = {
            width: img.width,
            height: img.height
          };
          
          URL.revokeObjectURL(url);
          resolve(metadata);
        };

        img.onerror = () => {
          URL.revokeObjectURL(url);
          resolve(metadata);
        };

        img.src = url;
      } else {
        resolve(metadata);
      }
    });
  }

  /**
   * Inicia la conversión de un archivo
   */
  async startConversion(fileId, targetFormat) {
    const fileData = this.uploadedFiles.get(fileId);
    if (!fileData) {
      notificationSystem.error('Archivo no encontrado', 'El archivo especificado no existe');
      return null;
    }

    if (fileData.status !== 'uploaded') {
      notificationSystem.error('Archivo no disponible', 'El archivo debe estar completamente cargado');
      return null;
    }

    try {
      // Cambiar estado
      fileData.status = 'converting';
      fileData.targetFormat = targetFormat;
      fileData.conversionStartDate = new Date();

      // Emitir evento de inicio de conversión
      eventManager.emit(EVENTS.FILE.CONVERSION_START, { fileData, targetFormat });

      // Agregar a la cola de conversión
      this.conversionQueue.push(fileId);

      // Procesar si no hay conversiones en curso
      if (!this.isProcessing) {
        this.processConversionQueue();
      }

      return fileData;

    } catch (error) {
      console.error('Error al iniciar conversión:', error);
      
      fileData.status = 'error';
      eventManager.emit(EVENTS.FILE.CONVERSION_ERROR, { 
        fileData, 
        error: error.message 
      });

      notificationSystem.error('Error en conversión', `No se pudo iniciar la conversión de ${fileData.name}`);
      return null;
    }
  }

  /**
   * Procesa la cola de conversión
   */
  async processConversionQueue() {
    if (this.conversionQueue.length === 0) {
      this.isProcessing = false;
      return;
    }

    this.isProcessing = true;
    const fileId = this.conversionQueue.shift();
    const fileData = this.uploadedFiles.get(fileId);

    if (!fileData) {
      this.processConversionQueue();
      return;
    }

    try {
      // Simular conversión
      await this.simulateConversion(fileData);

      // Marcar como completado
      fileData.status = 'converted';
      fileData.conversionEndDate = new Date();
      fileData.downloadUrl = this.generateDownloadUrl(fileData);

      // Emitir evento de conversión completada
      eventManager.emit(EVENTS.FILE.CONVERSION_COMPLETE, { 
        fileData, 
        format: fileData.targetFormat 
      });

      notificationSystem.success('Conversión completada', 
        `${fileData.name} se convirtió a ${fileData.targetFormat}`,
        {
          actions: [
            {
              id: 'download',
              label: 'Descargar',
              variant: 'primary',
              onClick: () => this.downloadFile(fileData)
            }
          ]
        }
      );

    } catch (error) {
      console.error('Error en conversión:', error);
      
      fileData.status = 'error';
      eventManager.emit(EVENTS.FILE.CONVERSION_ERROR, { 
        fileData, 
        error: error.message 
      });

      notificationSystem.error('Error en conversión', `No se pudo convertir ${fileData.name}`);
    }

    // Procesar siguiente archivo
    setTimeout(() => {
      this.processConversionQueue();
    }, 1000);
  }

  /**
   * Simula el proceso de conversión
   */
  async simulateConversion(fileData) {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20 + 10;
        
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          resolve();
        }

        // Emitir progreso
        eventManager.emit(EVENTS.FILE.CONVERSION_PROGRESS, { 
          fileId: fileData.id, 
          progress 
        });
      }, 300);
    });
  }

  /**
   * Descarga un archivo convertido
   */
  downloadFile(fileData) {
    if (fileData.status !== 'converted') {
      notificationSystem.error('Archivo no disponible', 'El archivo no ha sido convertido');
      return;
    }

    try {
      // Emitir evento de inicio de descarga
      eventManager.emit(EVENTS.FILE.DOWNLOAD_START, { fileData });

      // Crear elemento de descarga
      const link = document.createElement('a');
      link.href = fileData.downloadUrl;
      link.download = `${fileData.name.split('.')[0]}.${fileData.targetFormat}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Emitir evento de descarga completada
      eventManager.emit(EVENTS.FILE.DOWNLOAD_COMPLETE, { fileData });

      notificationSystem.success('Descarga iniciada', `${fileData.name} se está descargando`);

    } catch (error) {
      console.error('Error al descargar:', error);
      notificationSystem.error('Error en descarga', `No se pudo descargar ${fileData.name}`);
    }
  }

  /**
   * Genera URL de descarga simulada
   */
  generateDownloadUrl(fileData) {
    // En una implementación real, esto sería una URL del servidor
    return `data:application/octet-stream;base64,${btoa('Archivo convertido simulado')}`;
  }

  /**
   * Obtiene información de un archivo
   */
  getFileInfo(fileId) {
    return this.uploadedFiles.get(fileId);
  }

  /**
   * Obtiene todos los archivos
   */
  getAllFiles() {
    return Array.from(this.uploadedFiles.values());
  }

  /**
   * Remueve un archivo
   */
  removeFile(fileId) {
    const fileData = this.uploadedFiles.get(fileId);
    if (!fileData) return false;

    // Remover de la cola de conversión si está ahí
    this.conversionQueue = this.conversionQueue.filter(id => id !== fileId);

    // Remover de la lista
    this.uploadedFiles.delete(fileId);

    notificationSystem.info('Archivo removido', `${fileData.name} fue eliminado`);
    return true;
  }

  /**
   * Limpia todos los archivos
   */
  clearAllFiles() {
    this.uploadedFiles.clear();
    this.conversionQueue = [];
    this.isProcessing = false;
    
    notificationSystem.info('Archivos limpiados', 'Todos los archivos fueron eliminados');
  }

  /**
   * Genera un ID único para archivos
   */
  generateFileId(file) {
    return `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Obtiene estadísticas de archivos
   */
  getStats() {
    const files = Array.from(this.uploadedFiles.values());
    
    return {
      total: files.length,
      uploading: files.filter(f => f.status === 'uploading').length,
      uploaded: files.filter(f => f.status === 'uploaded').length,
      converting: files.filter(f => f.status === 'converting').length,
      converted: files.filter(f => f.status === 'converted').length,
      error: files.filter(f => f.status === 'error').length,
      queueLength: this.conversionQueue.length,
      isProcessing: this.isProcessing
    };
  }
}

// Instancia global
const fileManager = new FileManager();

export default fileManager;
