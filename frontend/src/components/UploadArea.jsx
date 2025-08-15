import React, { useState, useRef } from 'react';
import { Upload, FileText, Image, X, CheckCircle, AlertCircle } from 'lucide-react';

const UploadArea = ({ onFileSelect, isDarkMode, className = '' }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragCounter, setDragCounter] = useState(0);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev + 1);
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev - 1);
    if (dragCounter <= 1) {
      setIsDragOver(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    setDragCounter(0);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file) => {
    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/tiff'];
    if (!validTypes.includes(file.type)) {
      alert('Formato de archivo no válido. Use JPG, PNG, GIF, WEBP, BMP o TIFF.');
      return;
    }

    // Validar tamaño (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('El archivo es demasiado grande. Máximo 10MB permitido.');
      return;
    }

    setSelectedFile(file);
    onFileSelect?.(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
    onFileSelect?.(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) {
      return <Image className="w-6 h-6" />;
    }
    return <FileText className="w-6 h-6" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`upload-area ${className}`}>
      {/* Input oculto */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileInput}
        accept="image/*"
        className="sr-only"
        aria-label="Seleccionar archivo de imagen"
      />

      {!selectedFile ? (
        /* Estado de carga */
        <div
          className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 cursor-pointer group ${
            isDragOver
              ? 'border-indigo-500 bg-indigo-500/10 scale-105'
              : 'border-indigo-500/30 bg-indigo-500/5 hover:border-indigo-500/50 hover:bg-indigo-500/10'
          }`}
          onClick={openFileDialog}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && openFileDialog()}
          aria-label="Área de carga de archivos - Arrastra archivos aquí o haz clic para seleccionar"
        >
          {/* Indicador de arrastre */}
          {isDragOver && (
            <div className="absolute inset-0 bg-indigo-500/20 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <Upload className="w-16 h-16 text-indigo-500 mx-auto mb-4 animate-pulse" />
                <p className="text-lg font-medium text-indigo-500">Suelta el archivo aquí</p>
              </div>
            </div>
          )}

          {/* Contenido normal */}
          <div className={`transition-all duration-300 ${isDragOver ? 'opacity-0' : 'opacity-100'}`}>
            <div className="mb-4">
              <Upload className={`w-12 h-12 mx-auto group-hover:scale-110 transition-transform duration-200 ${
                isDarkMode ? 'text-indigo-400' : 'text-indigo-500'
              }`} />
            </div>
            
            <h4 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Arrastra tu imagen aquí
            </h4>
            
            <p className={`mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              o haz clic para seleccionar archivos
            </p>
            
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Image className="w-4 h-4" />
                JPG, PNG, GIF
              </span>
              <span>•</span>
              <span>Máx. 10MB</span>
            </div>
          </div>
        </div>
      ) : (
        /* Archivo seleccionado */
        <div className={`p-6 border-2 border-dashed rounded-xl ${
          isDarkMode 
            ? 'border-green-500/30 bg-green-500/5' 
            : 'border-green-300/50 bg-green-50/50'
        }`}>
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${
              isDarkMode ? 'bg-green-500/20' : 'bg-green-100'
            }`}>
              <CheckCircle className={`w-6 h-6 ${
                isDarkMode ? 'text-green-400' : 'text-green-600'
              }`} />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {getFileIcon(selectedFile.type)}
                <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {selectedFile.name}
                </h4>
              </div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {formatFileSize(selectedFile.size)} • {selectedFile.type}
              </p>
            </div>
            
            <button
              onClick={removeFile}
              className={`p-2 rounded-lg transition-all duration-200 hover:bg-red-500/10 hover:text-red-500 ${
                isDarkMode ? 'text-gray-400 hover:bg-red-500/10' : 'text-gray-500 hover:bg-red-100'
              }`}
              aria-label="Eliminar archivo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadArea;
