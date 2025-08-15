// src/components/UploadForm.jsx

import PropTypes from 'prop-types';
import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import LanguageSelector from './LanguageSelector';
import Uploader from './Uploader';
import { API_CONFIG, convertImage, checkServerHealth } from '../config/api';

// Configuración por defecto
const DEFAULT_SUPPORTED_FORMATS = [
  { value: 'docx', label: 'Word (.docx)', extension: 'docx' },
  { value: 'xlsx', label: 'Excel (.xlsx)', extension: 'xlsx' },
  { value: 'txt', label: 'Texto Plano (.txt)', extension: 'txt' }
];

const DEFAULT_SUCCESS_MESSAGE = API_CONFIG.SUCCESS_MESSAGES.CONVERSION_COMPLETE;
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
 * @param {string} [props.convertApi] - URL de la API de conversión (opcional, usa config por defecto)
 * @param {string} [props.defaultFormat=API_CONFIG.DEFAULT_OUTPUT_FORMAT] - Formato por defecto
 * @param {string} [props.defaultLanguage=API_CONFIG.DEFAULT_LANGUAGE] - Idioma por defecto
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
  convertApi,
  defaultFormat = API_CONFIG.DEFAULT_OUTPUT_FORMAT,
  defaultLanguage = API_CONFIG.DEFAULT_LANGUAGE,
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
  const [serverStatus, setServerStatus] = useState('checking'); // checking | healthy | unhealthy
  
  // Referencia para abortar operaciones
  const abortControllerRef = useRef(null);

  // Formato actual seleccionado
  const currentFormat = useMemo(() => 
    supportedFormats.find(f => f.value === format) || supportedFormats[0],
    [format, supportedFormats]
  );
  
  // Verificar estado del servidor al montar
  useEffect(() => {
    const checkServer = async () => {
      const health = await checkServerHealth();
      setServerStatus(health.isHealthy ? 'healthy' : 'unhealthy');
    };
    
    checkServer();
  }, []);
  
  // Validación del archivo
  const validateFile = useCallback(() => {
    if (!file) {
      setError('Por favor, selecciona una imagen');
      return false;
    }
    
    // Validar tipo
    if (!API_CONFIG.REQUEST_CONFIG.SUPPORTED_FORMATS.includes(file.type)) {
      setError(API_CONFIG.ERROR_MESSAGES.INVALID_FORMAT);
      return false;
    }
    
    // Validar tamaño
    if (file.size > API_CONFIG.REQUEST_CONFIG.MAX_FILE_SIZE) {
      setError(API_CONFIG.ERROR_MESSAGES.FILE_TOO_LARGE);
      return false;
    }
    
    setError(null);
    return true;
  }, [file]);
  
  // Manejador de submit
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!validateFile()) return;
    
    // Verificar que el servidor esté disponible
    if (serverStatus !== 'healthy') {
      setError(API_CONFIG.ERROR_MESSAGES.NETWORK_ERROR);
      setStatus('error');
      return;
    }
    
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
    
    // Simular progreso
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
      console.log('Iniciando conversión con:', {
        file: file.name,
        format: format,
        language: language,
        apiUrl: convertApi || 'config por defecto'
      });
      
      // Usar la función centralizada de conversión
      const result = await convertImage(file, language, format);
      
      clearInterval(progressInterval);
      setProgress(99);
      
      if (!result.success) {
        throw new Error(result.error || API_CONFIG.ERROR_MESSAGES.UNKNOWN_ERROR);
      }
      
      const responseData = result.data;
      
      // Convertir base64 a blob
      const base64Data = responseData.content;
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: responseData.mime_type });
      const url = URL.createObjectURL(blob);
      
      // Usar el nombre del archivo del servidor
      const downloadFilename = responseData.filename;
      
      // Descargar archivo
      const link = document.createElement('a');
      link.href = url;
      link.download = downloadFilename;
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
        filename: downloadFilename,
        textLength: responseData.text_length
      });
      
    } catch (err) {
      if (err.name === 'AbortError') {
        setStatus('idle');
        return; // Cancelación limpia, no es un error
      }
      
      clearInterval(progressInterval);
      setStatus('error');
      
      // Mejorar el manejo de errores
      let errorMsg = err.message;
      
      // Mapear errores específicos
      if (err.message.includes('Failed to fetch') || err.message.includes('fetch')) {
        errorMsg = API_CONFIG.ERROR_MESSAGES.NETWORK_ERROR;
      } else if (err.message.includes('No se pudo extraer texto')) {
        errorMsg = API_CONFIG.ERROR_MESSAGES.NO_TEXT_EXTRACTED;
      } else if (err.message.includes('Error del servidor')) {
        errorMsg = API_CONFIG.ERROR_MESSAGES.SERVER_ERROR;
      }
      
      console.error('Error completo:', err);
      setError(errorMsg);
      onError(err);
      
      // Mostrar mensaje de error
      alert(`Error de conversión: ${errorMsg}`);
      
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
    serverStatus,
    filename,
    currentFormat,
    showSuccessMessage,
    successMessage,
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
  
  // Renderizado del estado del servidor
  const renderServerStatus = useCallback(() => {
    if (serverStatus === 'checking') {
      return (
        <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-500 mr-2"></div>
            <span className="text-yellow-700 text-sm">Verificando conexión con el servidor...</span>
          </div>
        </div>
      );
    }
    
    if (serverStatus === 'unhealthy') {
      return (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-red-700 text-sm font-medium">Servidor no disponible</p>
              <p className="text-red-600 text-xs mt-1">
                Verifica que el backend esté ejecutándose en http://127.0.0.1:8000
              </p>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="mb-4 p-2 bg-green-50 border border-green-200 rounded-md">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-green-700 text-sm">Servidor conectado correctamente</span>
        </div>
      </div>
    );
  }, [serverStatus]);
  
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
    
    const isDisabled = loading || !file || serverStatus !== 'healthy';
    
    return (
      <button
        type="submit"
        disabled={isDisabled}
        className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors ${
          isDisabled
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? 'Procesando...' : 'Convertir Documento'}
      </button>
    );
  }, [loading, file, status, error, handleCancel, serverStatus]);
  
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
      {/* Estado del servidor */}
      {renderServerStatus()}
      
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
        <p className="mt-1">Servidor: {API_CONFIG.BASE_URL}</p>
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
  convertApi: API_CONFIG.CONVERT_IMAGE_API,
  defaultFormat: API_CONFIG.DEFAULT_OUTPUT_FORMAT,
  defaultLanguage: API_CONFIG.DEFAULT_LANGUAGE,
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
