// src/components/UploadForm.jsx

import PropTypes from 'prop-types';
import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import LanguageSelector from './LanguageSelector';
import Uploader from './Uploader';

// Configuración por defecto
const DEFAULT_SUPPORTED_FORMATS = [
  { value: 'docx', label: 'Word (.docx)', extension: 'docx' },
  { value: 'xlsx', label: 'Excel (.xlsx)', extension: 'xlsx' },
  { value: 'pdf', label: 'PDF (.pdf)', extension: 'pdf' },
  { value: 'txt', label: 'Texto Plano (.txt)', extension: 'txt' }
];

const DEFAULT_CONVERT_API = '/api/convert';
const DEFAULT_SUCCESS_MESSAGE = '¡Conversión completada exitosamente!';
const DEFAULT_ERROR_MESSAGE = 'Ocurrió un error durante la conversión';
const DEFAULT_FILENAME = 'documento';

/**
 * Formulario completo para subir y convertir imágenes a documentos
 * 
 * Características principales:
 * - Subida de imágenes con validación
 * - Selección de idioma y formato de salida
 * - Manejo robusto de errores
 * - Soporte para cancelación
 * - Estados de éxito y error
 * - Altamente configurable
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Array} [props.supportedFormats=DEFAULT_SUPPORTED_FORMATS] - Formatos soportados
 * @param {string} [props.convertApi=DEFAULT_CONVERT_API] - URL de la API de conversión
 * @param {string} [props.defaultFormat='docx'] - Formato por defecto
 * @param {string} [props.defaultLanguage='spa'] - Idioma por defecto
 * @param {Function} [props.onSuccess] - Callback en caso de éxito
 * @param {Function} [props.onError] - Callback en caso de error
 * @param {string} [props.successMessage=DEFAULT_SUCCESS_MESSAGE] - Mensaje de éxito
 * @param {string} [props.errorMessage=DEFAULT_ERROR_MESSAGE] - Mensaje de error
 * @param {string} [props.filename=DEFAULT_FILENAME] - Nombre base del archivo
 * @param {boolean} [props.showSuccessMessage=true] - Muestra mensaje de éxito
 * @param {boolean} [props.showProgress=true] - Muestra barra de progreso
 * @param {boolean} [props.allowCancel=true] - Permite cancelar la conversión
 * @param {string} [props.className=""] - Clases CSS adicionales
 * @param {Object} [props.languageSelectorProps] - Props para LanguageSelector
 * @param {Object} [props.uploaderProps] - Props para Uploader
 */
const UploadForm = ({
  supportedFormats = DEFAULT_SUPPORTED_FORMATS,
  convertApi = DEFAULT_CONVERT_API,
  defaultFormat = 'docx',
  defaultLanguage = 'spa',
  onSuccess = (result) => console.log('Conversión exitosa:', result),
  onError = (error) => console.error('Error en conversión:', error),
  successMessage = DEFAULT_SUCCESS_MESSAGE,
  errorMessage = DEFAULT_ERROR_MESSAGE,
  filename = DEFAULT_FILENAME,
  showSuccessMessage = true,
  showProgress = true,
  allowCancel = true,
  className = "",
  languageSelectorProps = {},
  uploaderProps = {}
}) => {
  // Estados principales
  const [file, setFile] = useState(null);
  const [format, setFormat] = useState(defaultFormat);
  const [language, setLanguage] = useState(defaultLanguage);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('idle'); // idle | uploading | success | error
  const [error, setError] = useState(null);
  
  // Referencia para abortar operaciones
  const abortControllerRef = useRef(null);

  // Formato actual seleccionado
  const currentFormat = useMemo(() => 
    supportedFormats.find(f => f.value === format) || supportedFormats[0],
    [format, supportedFormats]
  );
  
  // Validación del archivo
  const validateFile = useCallback(() => {
    if (!file) {
      setError('Por favor, selecciona una imagen');
      return false;
    }
    
    // Validar tipo
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setError('Formato de imagen no soportado. Usa PNG, JPG o JPEG');
      return false;
    }
    
    // Validar tamaño (10MB máximo)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError(`El archivo excede el tamaño máximo de ${maxSize / (1024 * 1024)}MB`);
      return false;
    }
    
    setError(null);
    return true;
  }, [file]);
  
  // Manejador de submit
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!validateFile()) return;
    
    // Cancelar operación anterior si existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    const controller = new AbortController();
    abortControllerRef.current = controller;
    
    setLoading(true);
    setStatus('uploading');
    setProgress(0);
    setError(null);
    
    // Simular progreso (opcional - eliminar si no se quiere)
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 5;
      });
    }, 300);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('format', format);
      formData.append('lang', language);
      
      const response = await fetch(convertApi, {
        method: 'POST',
        body: formData,
        signal: controller.signal
      });
      
      clearInterval(progressInterval);
      setProgress(99); // Mostrar casi completo
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      // Generar nombre de archivo inteligente
      const safeFilename = filename
        .replace(/[^a-z0-9]/gi, '_')
        .toLowerCase();
      
      // Descargar archivo
      const link = document.createElement('a');
      link.href = url;
      link.download = `${safeFilename}.${currentFormat.extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // Estado de éxito
      setProgress(100);
      setStatus('success');
      if (showSuccessMessage) {
        alert(successMessage);
      }
      onSuccess({
        format,
        language,
        filename: `${safeFilename}.${currentFormat.extension}`
      });
      
    } catch (err) {
      if (err.name === 'AbortError') {
        setStatus('idle');
        return; // Cancelación limpia, no es un error
      }
      
      clearInterval(progressInterval);
      setStatus('error');
      setError(err.message);
      onError(err);
      
      // Mostrar mensaje de error
      if (errorMessage) {
        alert(`${errorMessage}: ${err.message}`);
      }
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, [
    file,
    format,
    language,
    validateFile,
    convertApi,
    filename,
    currentFormat,
    showSuccessMessage,
    successMessage,
    errorMessage,
    onSuccess,
    onError
  ]);
  
  // Manejador de cancelación
  const handleCancel = useCallback(() => {
    if (abortControllerRef.current && allowCancel) {
      abortControllerRef.current.abort();
      setLoading(false);
      setStatus('idle');
      setError(null);
    }
  }, [allowCancel]);
  
  // Resetear formulario después del éxito
  useEffect(() => {
    if (status === 'success' && !loading) {
      const timer = setTimeout(() => {
        setFile(null);
        setStatus('idle');
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [status, loading]);
  
  // Limpiar recursos al desmontar
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);
  
  // Renderizado del botón principal
  const renderSubmitButton = useCallback(() => {
    if (status === 'success') {
      return (
        <button
          type="button"
          onClick={() => {
            setFile(null);
            setStatus('idle');
          }}
          className="w-full py-3 px-4 rounded-md bg-green-600 text-white font-medium 
                     hover:bg-green-700 transition-colors"
        >
          ¡Convertir otro documento!
        </button>
      );
    }
    
    if (status === 'error' && error) {
      return (
        <button
          type="button"
          onClick={handleCancel}
          className="w-full py-3 px-4 rounded-md bg-red-600 text-white font-medium 
                     hover:bg-red-700 transition-colors"
        >
          Intentar de nuevo
        </button>
      );
    }
    
    return (
      <button
        type="submit"
        disabled={loading || !file}
        className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors ${
          loading || !file
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? 'Procesando...' : 'Convertir Documento'}
      </button>
    );
  }, [loading, file, status, error, handleCancel]);
  
  // Renderizado de la barra de progreso
  const renderProgress = useCallback(() => {
    if (!showProgress || !loading) return null;
    
    return (
      <div className="pt-2">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="mt-1 text-sm text-gray-500 text-center">
          {progress < 100 ? `Procesando... ${progress}%` : 'Finalizando'}
        </p>
      </div>
    );
  }, [showProgress, loading, progress]);
  
  // Renderizado del mensaje de éxito
  const renderSuccessMessage = useCallback(() => {
    if (status !== 'success' || !showSuccessMessage) return null;
    
    return (
      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-green-700 text-sm">{successMessage}</span>
        </div>
      </div>
    );
  }, [status, showSuccessMessage, successMessage]);
  
  // Renderizado del mensaje de error
  const renderErrorMessage = useCallback(() => {
    if (status !== 'error' || !error) return null;
    
    return (
      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-red-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-red-700 text-sm">{error}</p>
            {allowCancel && (
              <button
                type="button"
                onClick={handleCancel}
                className="mt-1 text-xs text-red-600 hover:text-red-800"
              >
                Cancelar y limpiar
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }, [status, error, allowCancel, handleCancel]);

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`space-y-4 ${className}`}
      noValidate
    >
      {/* Selector de idioma con props personalizables */}
      <LanguageSelector 
        selectedLanguage={language}
        onChange={setLanguage}
        {...languageSelectorProps}
      />
      
      {/* Componente de subida con props personalizables */}
      <Uploader 
        onFileSelected={setFile}
        selectedFile={file}
        {...uploaderProps}
      />
      
      {/* Selector de formato */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Formato de salida
        </label>
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm 
                     focus:ring-blue-500 focus:border-blue-500"
          disabled={loading}
        >
          {supportedFormats.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      
      {/* Barra de progreso */}
      {renderProgress()}
      
      {/* Mensajes de estado */}
      {renderSuccessMessage()}
      {renderErrorMessage()}
      
      {/* Botón principal */}
      {renderSubmitButton()}
      
      {/* Botón de cancelación (solo durante carga) */}
      {loading && allowCancel && (
        <button
          type="button"
          onClick={handleCancel}
          className="w-full mt-2 py-2 px-4 rounded-md border border-gray-300 
                     text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
      )}
      
      {/* Información adicional */}
      <div className="mt-4 text-xs text-gray-500">
        <p>Soporta: PNG, JPG, JPEG (Max. 10MB)</p>
        <p className="mt-1">Para mejores resultados, usa imágenes claras y bien iluminadas</p>
      </div>
    </form>
  );
};

// Documentación de props para autocompletado en IDEs
UploadForm.propTypes = {
  /**
   * Formatos soportados para la conversión
   * Ejemplo: [{value: 'docx', label: 'Word (.docx)', extension: 'docx'}]
   */
  supportedFormats: PropTypes.array,
  
  /**
   * URL de la API para la conversión
   */
  convertApi: PropTypes.string,
  
  /**
   * Formato por defecto seleccionado
   */
  defaultFormat: PropTypes.string,
  
  /**
   * Idioma por defecto seleccionado
   */
  defaultLanguage: PropTypes.string,
  
  /**
   * Callback cuando la conversión es exitosa
   */
  onSuccess: PropTypes.func,
  
  /**
   * Callback cuando ocurre un error
   */
  onError: PropTypes.func,
  
  /**
   * Mensaje de éxito mostrado al completar
   */
  successMessage: PropTypes.string,
  
  /**
   * Mensaje de error mostrado en caso de fallo
   */
  errorMessage: PropTypes.string,
  
  /**
   * Nombre base para el archivo descargado
   */
  filename: PropTypes.string,
  
  /**
   * Muestra el mensaje de éxito
   */
  showSuccessMessage: PropTypes.bool,
  
  /**
   * Muestra la barra de progreso
   */
  showProgress: PropTypes.bool,
  
  /**
   * Permite cancelar la operación
   */
  allowCancel: PropTypes.bool,
  
  /**
   * Clases CSS adicionales
   */
  className: PropTypes.string,
  
  /**
   * Props adicionales para el selector de idioma
   */
  languageSelectorProps: PropTypes.object,
  
  /**
   * Props adicionales para el componente Uploader
   */
  uploaderProps: PropTypes.object
};

// Valores por defecto para props
UploadForm.defaultProps = {
  supportedFormats: DEFAULT_SUPPORTED_FORMATS,
  convertApi: DEFAULT_CONVERT_API,
  defaultFormat: 'docx',
  defaultLanguage: 'spa',
  onSuccess: (result) => console.log('Conversión exitosa:', result),
  onError: (error) => console.error('Error en conversión:', error),
  successMessage: DEFAULT_SUCCESS_MESSAGE,
  errorMessage: DEFAULT_ERROR_MESSAGE,
  filename: DEFAULT_FILENAME,
  showSuccessMessage: true,
  showProgress: true,
  allowCancel: true,
  className: "",
  languageSelectorProps: {},
  uploaderProps: {}
};

export default UploadForm;
