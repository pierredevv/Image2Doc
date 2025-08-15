// src/components/Uploader.jsx

import React, { 
  useState, 
  useEffect, 
  useCallback, 
  useRef 
} from 'react';
import PropTypes from 'prop-types';

// Configuración por defecto
const DEFAULT_ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];
const DEFAULT_MAX_SIZE = 10 * 1024 * 1024; // 10MB

const Uploader = ({
  onFileSelected,
  selectedFile,
  allowedTypes = DEFAULT_ALLOWED_TYPES,
  maxSize = DEFAULT_MAX_SIZE,
  onError = (error) => console.error(error),
  className = '',
  label = "Seleccionar imagen",
  maxFileSizeLabel = "Max. 10MB",
  allowedTypesLabel = "PNG, JPG, JPEG"
}) => {
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Validación de archivo
  const validateFile = useCallback((file) => {
    // Validar tipo
    if (allowedTypes.length && !allowedTypes.includes(file.type)) {
      const validTypes = allowedTypes
        .map(type => type.split('/')[1].toUpperCase())
        .join(', ');
      return new Error(`Tipo no válido. Permitidos: ${validTypes}`);
    }

    // Validar tamaño
    if (file.size > maxSize) {
      return new Error(
        `El archivo excede ${Math.floor(maxSize / (1024 * 1024))}MB`
      );
    }
    
    return null;
  }, [allowedTypes, maxSize]);

  // Manejo seguro de URLs de preview
  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      
      return () => URL.revokeObjectURL(url); // Limpieza automática
    } else {
      setPreviewUrl(null);
    }
  }, [selectedFile]);

  // Manejador de selección
  const handleFileSelection = useCallback((file) => {
    const validationError = validateFile(file);
    
    if (validationError) {
      setError(validationError.message);
      onError(validationError);
      return;
    }

    setError(null);
    onFileSelected(file);
  }, [onFileSelected, validateFile, onError]);

  // Eventos
  const handleFileChange = useCallback((e) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (file) handleFileSelection(file);
  }, [handleFileSelection]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelection(file);
  }, [handleFileSelection]);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleRetry = useCallback((e) => {
    e.stopPropagation();
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  return (
    <div className={className}>
      <label className="block mb-2 text-sm font-medium text-gray-700">
        {label}
      </label>
      
      <div 
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-all duration-200 ease-in-out
          ${
            error 
              ? 'border-red-300 bg-red-50' 
              : isDragging
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 hover:border-blue-400'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept={allowedTypes.join(',')}
        />
        
        {error ? (
          <div className="space-y-3">
            <div className="text-red-500 flex items-center justify-center">
              <svg 
                className="w-5 h-5 mr-2" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">{error}</span>
            </div>
            <button
              type="button"
              onClick={handleRetry}
              className="mt-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-md 
                         text-sm font-medium hover:bg-red-200 transition-colors"
            >
              Intentar de nuevo
            </button>
          </div>
        ) : selectedFile ? (
          <div className="space-y-3">
            <div className="relative">
              {previewUrl ? (
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="max-h-40 w-full object-contain mx-auto rounded border border-gray-200"
                />
              ) : (
                <div className="h-40 w-full bg-gray-100 rounded flex items-center justify-center border border-dashed">
                  <span className="text-gray-500">Cargando vista previa...</span>
                </div>
              )}
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-gray-700 font-medium truncate" title={selectedFile.name}>
                {selectedFile.name}
              </p>
              <p className="text-xs text-gray-500">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • 
                Haz clic o arrastra para cambiar
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <svg 
              className="mx-auto h-12 w-12 text-gray-400" 
              stroke="currentColor" 
              fill="none" 
              viewBox="0 0 48 48"
            >
              <path 
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            
            <div>
              <p className="mt-1 text-sm text-gray-600">
                <span className="font-semibold">Haz clic para subir</span> o arrastra una imagen
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {allowedTypesLabel} ({maxFileSizeLabel})
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// PropTypes para validación
Uploader.propTypes = {
  onFileSelected: PropTypes.func.isRequired,
  selectedFile: PropTypes.object,
  allowedTypes: PropTypes.array,
  maxSize: PropTypes.number,
  onError: PropTypes.func,
  className: PropTypes.string,
  label: PropTypes.string,
  maxFileSizeLabel: PropTypes.string,
  allowedTypesLabel: PropTypes.string
};

// Propiedades por defecto para escalabilidad
Uploader.defaultProps = {
  allowedTypes: DEFAULT_ALLOWED_TYPES,
  maxSize: DEFAULT_MAX_SIZE,
  onError: (error) => console.error(error),
  className: '',
  label: "Seleccionar imagen",
  maxFileSizeLabel: "Max. 10MB",
  allowedTypesLabel: "PNG, JPG, JPEG"
};

export default Uploader;
