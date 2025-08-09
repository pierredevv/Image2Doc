// src/components/LanguageSelector.jsx

import PropTypes from 'prop-types';
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';

// Configuración por defecto
const DEFAULT_LANGUAGES = [
  { code: 'eng', name: 'Inglés' },
  { code: 'spa', name: 'Español' },
  { code: 'fra', name: 'Francés' },
  { code: 'deu', name: 'Alemán' }
];

const DEFAULT_API_URL = '/api/languages';
const DEFAULT_ERROR_MESSAGE = 'Error cargando idiomas. Usando opciones básicas.';
const DEFAULT_LOADING_MESSAGE = 'Cargando idiomas...';

const LanguageSelector = ({
  selectedLanguage,
  onChange,
  defaultLanguages = DEFAULT_LANGUAGES,
  apiUrl = DEFAULT_API_URL,
  allowCombinations = true,
  label = "Idioma del OCR",
  loadingMessage = DEFAULT_LOADING_MESSAGE,
  errorMessage = DEFAULT_ERROR_MESSAGE,
  onError = (error) => console.error('LanguageSelector error:', error),
  languageNameFormatter = (lang) => lang.name || lang.code.toUpperCase(),
  className = ""
}) => {
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estado para evitar múltiples solicitudes
  const hasFetched = useRef(false);
  const isMounted = useRef(true);

  // Manejador de cambio simplificado
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  // Carga de idiomas desde API - VERSIÓN CORREGIDA
  const fetchLanguages = useCallback(async () => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(apiUrl);
      
      if (!isMounted.current) return;
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // FORMATO ESPERADO: { languages: ['eng', 'spa', ...] }
      if (!data.languages || !Array.isArray(data.languages)) {
        throw new Error('Formato de respuesta inválido. Se esperaba { languages: [...] }');
      }
      
      // Filtrar idiomas no útiles (como "osd")
      const filteredLangs = data.languages.filter(lang => 
        lang !== 'osd' && lang.trim() !== ''
      );
      
      // Si no hay idiomas útiles, usar los predeterminados
      if (filteredLangs.length === 0) {
        throw new Error('No se encontraron idiomas válidos');
      }
      
      // Crear array de objetos {code, name}
      const normalizedLanguages = filteredLangs.map(lang => ({
        code: lang,
        name: lang.toUpperCase()
      }));
      
      setLanguages(normalizedLanguages);
    } catch (err) {
      if (!isMounted.current) return;
      
      setError(err.message);
      onError(err);
      
      // Usar idiomas predeterminados en caso de error
      setLanguages(defaultLanguages);
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [apiUrl, defaultLanguages, onError]);

  // Carga inicial
  useEffect(() => {
    isMounted.current = true;
    fetchLanguages();
    
    return () => {
      isMounted.current = false;
    };
  }, [fetchLanguages]);

  // Opciones para el select - VERSIÓN SIMPLIFICADA
  const options = useMemo(() => {
    return languages.map(lang => ({
      value: lang.code,
      label: languageNameFormatter(lang)
    }));
  }, [languages, languageNameFormatter]);

  return (
    <div className={className}>
      <label 
        htmlFor="language-selector" 
        className="block mb-2 text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 
                         flex items-center justify-center rounded-md z-10">
            <span className="text-sm text-gray-600">{loadingMessage}</span>
          </div>
        )}
        
        {error && (
          <div className="mb-2 p-2 bg-red-50 border border-red-200 
                         rounded-md text-xs text-red-700">
            {errorMessage}
          </div>
        )}
        
        <select
          id="language-selector"
          value={selectedLanguage}
          onChange={handleChange}
          disabled={loading}
          className={`w-full p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 
            focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-red-300' : 'border-gray-300'}`}
        >
          {/* Mostrar siempre las opciones, incluso durante la carga */}
          {options.map(option => (
            <option 
              key={option.value} 
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>
      
      {allowCombinations && options.length > 0 && (
        <p className="mt-1 text-xs text-gray-500 italic">
          Usa + para combinar idiomas (ej: {options[0]?.value}+{options[1]?.value})
        </p>
      )}
    </div>
  );
};

// Documentación de props para autocompletado en IDEs
LanguageSelector.propTypes = {
  /**
   * Idioma actualmente seleccionado (ej: 'spa', 'eng+spa')
   */
  selectedLanguage: PropTypes.string.isRequired,
  
  /**
   * Callback cuando cambia el idioma seleccionado
   */
  onChange: PropTypes.func.isRequired,
  
  /**
   * Lista de idiomas predeterminados en caso de fallo de API
   * Puede ser array de strings o objetos {code, name}
   */
  defaultLanguages: PropTypes.array,
  
  /**
   * URL para obtener la lista de idiomas desde API
   */
  apiUrl: PropTypes.string,
  
  /**
   * Permite combinar múltiples idiomas (ej: spa+eng)
   */
  allowCombinations: PropTypes.bool,
  
  /**
   * Etiqueta para el selector
   */
  label: PropTypes.string,
  
  /**
   * Mensaje mostrado durante la carga
   */
  loadingMessage: PropTypes.string,
  
  /**
   * Mensaje mostrado en caso de error
   */
  errorMessage: PropTypes.string,
  
  /**
   * Callback para manejar errores
   */
  onError: PropTypes.func,
  
  /**
   * Función para formatear nombres de idioma
   */
  languageNameFormatter: PropTypes.func,
  
  /**
   * Clases CSS adicionales
   */
  className: PropTypes.string
};

// Valores por defecto para props
LanguageSelector.defaultProps = {
  defaultLanguages: DEFAULT_LANGUAGES,
  apiUrl: DEFAULT_API_URL,
  allowCombinations: true,
  label: "Idioma del OCR",
  loadingMessage: DEFAULT_LOADING_MESSAGE,
  errorMessage: DEFAULT_ERROR_MESSAGE,
  onError: (error) => console.error('LanguageSelector error:', error),
  languageNameFormatter: (lang) => lang.name || lang.code.toUpperCase(),
  className: ""
};

export default LanguageSelector;
