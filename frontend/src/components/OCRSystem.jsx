import React, { useState, useRef, useEffect } from 'react';
import { Download, Eye, Settings, FileText, FileSpreadsheet, File, FileImage } from 'lucide-react';

// Importar componentes mejorados
import Header from './Header';
import Sidebar from './Sidebar';
import UploadArea from './UploadArea';
import FormatSelector from './FormatSelector';
import ProgressBar from './ProgressBar';
import { FeaturesSection } from './FeatureCard';
import { ConvertButton, IconButton } from './Button';
import TargetCursor from './TargetCursor';
import { useTheme } from './ThemeProvider';

// Importar sistemas de utilidades
import eventManager, { EVENTS } from '../utils/eventManager';
import notificationSystem from '../utils/notificationSystem';
import fileManager from '../utils/fileManager';
import headerUtils from '../utils/headerUtils';

const OCRSystem = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [selectedFormat, setSelectedFormat] = useState('word');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Cambiado a false por defecto
  const [processingStatus, setProcessingStatus] = useState('idle');
  const [fileStats, setFileStats] = useState({});
  const [recentConversions, setRecentConversions] = useState([]);

  // Inicializar sistemas
  useEffect(() => {
    eventManager.init();
    notificationSystem.init();
    fileManager.init();
    headerUtils.init();
    
    // Configurar listeners de eventos
    setupEventListeners();
    
    // Cargar estadísticas iniciales
    updateFileStats();
    
    console.log('🚀 OCRSystem inicializado con todos los sistemas');
  }, []);

  // Configurar listeners de eventos
  const setupEventListeners = () => {
    // Eventos de archivos
    eventManager.on(EVENTS.FILE.UPLOAD_PROGRESS, (data) => {
      if (selectedFile && data.fileId === selectedFile.id) {
        setUploadProgress(data.progress);
      }
    });

    eventManager.on(EVENTS.FILE.UPLOAD_COMPLETE, (data) => {
      setSelectedFile(data.fileData);
      setUploadProgress(100);
      setIsProcessing(false);
      setProcessingStatus('completed');
      updateFileStats();
    });

    eventManager.on(EVENTS.FILE.CONVERSION_PROGRESS, (data) => {
      if (selectedFile && data.fileId === selectedFile.id) {
        setUploadProgress(data.progress);
      }
    });

    eventManager.on(EVENTS.FILE.CONVERSION_COMPLETE, (data) => {
      setIsProcessing(false);
      setProcessingStatus('completed');
      updateFileStats();
      
      // Agregar a conversiones recientes
      setRecentConversions(prev => [
        {
          id: data.fileData.id,
          name: data.fileData.name,
          format: data.format,
          date: new Date(),
          status: 'success'
        },
        ...prev.slice(0, 4) // Mantener solo las últimas 5
      ]);
    });

    eventManager.on(EVENTS.FILE.CONVERSION_ERROR, (data) => {
      setIsProcessing(false);
      setProcessingStatus('error');
      updateFileStats();
    });

    // Eventos de UI
    eventManager.on(EVENTS.UI.SIDEBAR_TOGGLE, () => {
      setIsSidebarOpen(!isSidebarOpen);
    });

    eventManager.on(EVENTS.UI.THEME_CHANGE, () => {
      toggleTheme();
    });

    // Eventos de navegación
    eventManager.on(EVENTS.NAVIGATION.SEARCH, (data) => {
      console.log('🔍 Búsqueda iniciada:', data.query);
      // Aquí implementarías la lógica de búsqueda real
      notificationSystem.info('Búsqueda', `Buscando: "${data.query}"`);
    });

    // Atajos de teclado
    eventManager.on('shortcut:search', () => {
      headerUtils.focusSearch();
    });

    eventManager.on('shortcut:sidebar', () => {
      setIsSidebarOpen(!isSidebarOpen);
    });

    eventManager.on('shortcut:theme', () => {
      toggleTheme();
    });
  };

  // Actualizar estadísticas de archivos
  const updateFileStats = () => {
    const stats = fileManager.getStats();
    setFileStats(stats);
  };

  const handleFileSelect = async (file) => {
    if (!file) {
      setSelectedFile(null);
      setUploadProgress(0);
      setIsProcessing(false);
      setProcessingStatus('idle');
      return;
    }

    try {
      setIsProcessing(true);
      setProcessingStatus('processing');
      setUploadProgress(0);

      // Procesar archivo con FileManager
      const fileData = await fileManager.processFileUpload(file);
      
      if (fileData) {
        setSelectedFile(fileData);
      } else {
        setIsProcessing(false);
        setProcessingStatus('error');
      }
    } catch (error) {
      console.error('Error al procesar archivo:', error);
      setIsProcessing(false);
      setProcessingStatus('error');
      notificationSystem.error('Error', 'No se pudo procesar el archivo');
    }
  };

  const handleConvert = async () => {
    if (!selectedFile || selectedFile.status !== 'uploaded') {
      notificationSystem.warning('Archivo no disponible', 'Selecciona un archivo válido para convertir');
      return;
    }

    try {
      setIsProcessing(true);
      setProcessingStatus('processing');
      setUploadProgress(0);

      // Iniciar conversión con FileManager
      const result = await fileManager.startConversion(selectedFile.id, selectedFormat);
      
      if (!result) {
        setIsProcessing(false);
        setProcessingStatus('error');
      }
    } catch (error) {
      console.error('Error al convertir:', error);
      setIsProcessing(false);
      setProcessingStatus('error');
      notificationSystem.error('Error en conversión', 'No se pudo iniciar la conversión');
    }
  };

  const toggleSidebar = () => {
    console.log('🔄 Toggle sidebar - Estado actual:', isSidebarOpen);
    setIsSidebarOpen(!isSidebarOpen);
    eventManager.emit(EVENTS.UI.SIDEBAR_TOGGLE, { isOpen: !isSidebarOpen });
    console.log('🔄 Nuevo estado del sidebar:', !isSidebarOpen);
  };

  const getProgressStatus = () => {
    if (processingStatus === 'completed') return 'completed';
    if (processingStatus === 'error') return 'error';
    if (isProcessing) return 'processing';
    return 'idle';
  };

  const getFormatIcon = (format) => {
    switch (format) {
      case 'word': return <FileText className="w-4 h-4" />;
      case 'excel': return <FileSpreadsheet className="w-4 h-4" />;
      case 'txt': return <File className="w-4 h-4" />;
      case 'pdf': return <FileImage className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-slate-950' : 'bg-gradient-to-br from-gray-50 to-blue-50'
    }`}>
      {/* Header */}
      <Header 
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />

      {/* Layout principal con padding-top para compensar header fijo */}
      <div className="flex pt-[4.5rem]">
        {/* Sidebar */}
        <Sidebar 
          isOpen={isSidebarOpen}
          isDarkMode={isDarkMode}
        />

        {/* Contenido principal */}
        <main className={`flex-1 transition-all duration-300`}>
          <div className="max-w-6xl mx-auto px-6 py-8">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h2 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Convierte imágenes a documentos
                <span className={`block text-2xl gradient-text mt-2`}>
                  con tecnología OCR avanzada
                </span>
              </h2>
              <p className={`text-lg max-w-2xl mx-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Transforma cualquier imagen con texto en documentos editables de alta calidad
              </p>
              
              {/* Estadísticas rápidas */}
              <div className="flex justify-center gap-8 mt-8">
                <div className={`text-center p-4 rounded-xl ${isDarkMode ? 'bg-white/5' : 'bg-white/80'}`}>
                  <div className="text-2xl font-bold text-indigo-500">{fileStats.total || 0}</div>
                  <div className="text-sm text-gray-500">Archivos totales</div>
                </div>
                <div className={`text-center p-4 rounded-xl ${isDarkMode ? 'bg-white/5' : 'bg-white/80'}`}>
                  <div className="text-2xl font-bold text-green-500">{fileStats.converted || 0}</div>
                  <div className="text-sm text-gray-500">Conversiones</div>
                </div>
                <div className={`text-center p-4 rounded-xl ${isDarkMode ? 'bg-white/5' : 'bg-white/80'}`}>
                  <div className="text-2xl font-bold text-blue-500">{fileStats.queueLength || 0}</div>
                  <div className="text-sm text-gray-500">En cola</div>
                </div>
              </div>
            </div>

            {/* Contenido principal */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Área de carga */}
              <div className="lg:col-span-2">
                <TargetCursor className="h-full">
                  <div className={`h-full backdrop-blur-sm border rounded-2xl p-8 transition-colors duration-300 ${
                    isDarkMode 
                      ? 'bg-slate-900/50 border-white/10' 
                      : 'bg-white/80 border-gray-200 shadow-xl'
                  }`}>
                    <h3 className={`text-xl font-semibold mb-6 flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      <Eye className="w-5 h-5 mr-2 text-indigo-500" />
                      Subir imagen
                    </h3>
                    
                    <UploadArea 
                      onFileSelect={handleFileSelect}
                      isDarkMode={isDarkMode}
                    />

                    {/* Barra de progreso */}
                    {isProcessing && (
                      <div className="mt-6">
                        <ProgressBar 
                          progress={uploadProgress}
                          label={selectedFile?.status === 'uploading' ? 'Subiendo archivo...' : 'Procesando imagen...'}
                          status={getProgressStatus()}
                          isDarkMode={isDarkMode}
                        />
                      </div>
                    )}

                    {/* Conversiones recientes */}
                    {recentConversions.length > 0 && (
                      <div className="mt-6">
                        <h4 className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Conversiones recientes
                        </h4>
                        <div className="space-y-2">
                          {recentConversions.map((conversion) => (
                            <div key={conversion.id} className={`flex items-center gap-3 p-3 rounded-lg ${
                              isDarkMode ? 'bg-white/5' : 'bg-gray-50'
                            }`}>
                              {getFormatIcon(conversion.format)}
                              <div className="flex-1 min-w-0">
                                <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {conversion.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Convertido a {conversion.format} • {conversion.date.toLocaleTimeString()}
                                </div>
                              </div>
                              <div className={`w-2 h-2 rounded-full ${
                                conversion.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                              }`}></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </TargetCursor>
              </div>

              {/* Selector de formato */}
              <div className="space-y-6">
                <TargetCursor>
                  <div className={`backdrop-blur-sm border rounded-2xl p-6 transition-colors duration-300 ${
                    isDarkMode 
                      ? 'bg-slate-900/50 border-white/10' 
                      : 'bg-white/80 border-gray-200 shadow-xl'
                  }`}>
                    <FormatSelector 
                      selectedFormat={selectedFormat}
                      onFormatSelect={setSelectedFormat}
                      isDarkMode={isDarkMode}
                    />
                  </div>
                </TargetCursor>

                {/* Botón de acción mejorado */}
                <TargetCursor>
                  <ConvertButton
                    icon={Download}
                    onClick={handleConvert}
                    disabled={isProcessing || !selectedFile || selectedFile?.status !== 'uploaded'}
                    isLoading={isProcessing}
                    isDarkMode={isDarkMode}
                  >
                    {isProcessing ? 'Procesando...' : 'Convertir y Descargar'}
                  </ConvertButton>
                </TargetCursor>

                {/* Información adicional */}
                {selectedFile && (
                  <div className={`p-4 rounded-xl ${
                    isDarkMode ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-200'
                  }`}>
                    <h4 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      📁 Archivo seleccionado
                    </h4>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {selectedFile.name} • {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    {selectedFile.metadata?.dimensions && (
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                        📐 {selectedFile.metadata.dimensions.width} × {selectedFile.metadata.dimensions.height} px
                      </p>
                    )}
                  </div>
                )}

                {/* Estado del procesamiento */}
                {isProcessing && (
                  <div className={`p-4 rounded-xl ${
                    isDarkMode ? 'bg-indigo-500/10 border border-indigo-500/20' : 'bg-indigo-50 border border-indigo-200'
                  }`}>
                    <h4 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>
                      ⚡ Procesando...
                    </h4>
                    <p className={`text-xs ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                      {selectedFile?.status === 'uploading' ? 'Subiendo archivo...' : `Convirtiendo imagen a ${selectedFormat}...`}
                    </p>
                  </div>
                )}

                {/* Acciones rápidas */}
                <div className={`p-4 rounded-xl ${
                  isDarkMode ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-200'
                }`}>
                  <h4 className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    🚀 Acciones rápidas
                  </h4>
                  <div className="space-y-2">
                    <button 
                      onClick={() => fileManager.clearAllFiles()}
                      className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${
                        isDarkMode ? 'text-gray-400 hover:bg-white/10 hover:text-white' : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      🗑️ Limpiar todos los archivos
                    </button>
                    <button 
                      onClick={() => notificationSystem.info('Información', 'Sistema OCR funcionando correctamente')}
                      className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${
                        isDarkMode ? 'text-gray-400 hover:bg-white/10 hover:text-white' : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      ℹ️ Ver estado del sistema
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sección de características */}
            <div className="mt-16">
              <FeaturesSection isDarkMode={isDarkMode} />
            </div>

            {/* Información adicional */}
            <div className="mt-16 text-center">
              <div className={`p-8 rounded-2xl ${
                isDarkMode ? 'bg-white/5 border border-white/10' : 'bg-white/80 border border-gray-200'
              }`}>
                <h3 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  ¿Por qué elegir nuestro OCR?
                </h3>
                <p className={`text-lg max-w-3xl mx-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Nuestro sistema utiliza la última tecnología de inteligencia artificial para 
                  proporcionar resultados de alta precisión en segundos, con soporte para múltiples 
                  idiomas y formatos de salida.
                </p>
                
                {/* Atajos de teclado */}
                <div className="mt-6 flex justify-center gap-4 text-sm">
                  <div className={`px-3 py-2 rounded-lg ${isDarkMode ? 'bg-white/10' : 'bg-gray-100'}`}>
                    <kbd className="px-2 py-1 bg-gray-800 text-white rounded text-xs">Ctrl</kbd> + <kbd className="px-2 py-1 bg-gray-800 text-white rounded text-xs">K</kbd> Buscar
                  </div>
                  <div className={`px-3 py-2 rounded-lg ${isDarkMode ? 'bg-white/10' : 'bg-gray-100'}`}>
                    <kbd className="px-2 py-1 bg-gray-800 text-white rounded text-xs">Ctrl</kbd> + <kbd className="px-2 py-1 bg-gray-800 text-white rounded text-xs">B</kbd> Sidebar
                  </div>
                  <div className={`px-3 py-2 rounded-lg ${isDarkMode ? 'bg-white/10' : 'bg-gray-100'}`}>
                    <kbd className="px-2 py-1 bg-gray-800 text-white rounded text-xs">Ctrl</kbd> + <kbd className="px-2 py-1 bg-gray-800 text-white rounded text-xs">D</kbd> Tema
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Overlay para sidebar móvil */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default OCRSystem;
