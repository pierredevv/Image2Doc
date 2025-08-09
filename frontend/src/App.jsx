// src/App.jsx

import { useState, useEffect, useCallback } from 'react';
import UploadForm from './components/UploadForm';
import Header from './components/Header';
import Footer from './components/Footer';
import PropTypes from 'prop-types';

/**
 * Componente principal de la aplicación
 * 
 * Características principales:
 * - Estructura base de la aplicación
 * - Manejo básico de errores
 * - Soporte para tema oscuro
 * - Preparado para internacionalización
 * - Optimización para SEO
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} [props.appName="Imagen2Doc"] - Nombre de la aplicación
 * @param {string} [props.title="Conversor de Imagen a Documento"] - Título de la página
 * @param {string} [props.description="Convierte imágenes a documentos editables"] - Descripción para SEO
 * @param {boolean} [props.darkMode=false] - Habilita el modo oscuro
 * @param {string} [props.className=""] - Clases CSS adicionales
 * @param {React.ReactNode} [props.children] - Contenido adicional (opcional)
 */
const App = ({
  appName = "Imagen2Doc",
  title = "Conversor de Imagen a Documento",
  description = "Convierte imágenes a documentos editables en segundos",
  darkMode = false,
  className = "",
  children = null
}) => {
  // Estado para manejo de errores
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Configuración del tema
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Limpiar al desmontar
    return () => {
      document.documentElement.classList.remove('dark');
    };
  }, [darkMode]);
  
  // Actualizar título y meta tags
  useEffect(() => {
    document.title = `${title} | ${appName}`;
    
    // Configurar meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = "description";
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = description;
    
    // Configurar Open Graph tags para redes sociales
    const setMetaTag = (property, content) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.content = content;
    };
    
    setMetaTag('og:title', `${title} | ${appName}`);
    setMetaTag('og:description', description);
    setMetaTag('og:type', 'website');
    
  }, [title, description, appName]);
  
  // Reiniciar aplicación en caso de error
  const handleReset = useCallback(() => {
    setHasError(false);
    setErrorMessage('');
    // Aquí podrías añadir lógica para reiniciar el estado de la app
  }, []);
  
  // Renderizado del error
  const renderError = useCallback(() => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-4 p-6 bg-white rounded-xl shadow-md">
        <div className="text-center">
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            <div className="flex">
              <div className="ml-3">
                <p className="font-bold">Error en la aplicación</p>
                <p>{errorMessage || 'Ocurrió un problema inesperado'}</p>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Reiniciar aplicación
          </button>
          
          <p className="mt-4 text-sm text-gray-500">
            Si el problema persiste, por favor contacta al soporte
          </p>
        </div>
      </div>
    </div>
  ), [errorMessage, handleReset]);
  
  return (
    <div 
      className={`min-h-screen flex flex-col ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50'} ${className}`}
      role="main"
    >
      <Header 
        appName={appName}
        backgroundColor={darkMode ? "bg-gray-800" : "bg-blue-600"}
      />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className={`bg-white rounded-xl shadow-md p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h1 className="text-2xl font-bold text-center mb-6 
                          text-gray-800 dark:text-white">
              {title}
            </h1>
            
            {/* ★★★ Componente con toda la lógica ★★★ */}
            {hasError ? (
              renderError()
            ) : (
              <>
                {children || <UploadForm />}
                <div className="mt-6 text-center text-sm text-gray-500">
                  <p>Convertidor de imágenes a documentos en línea</p>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      
      <Footer 
        appName={appName}
        backgroundColor={darkMode ? "bg-gray-900" : "bg-gray-800"}
        textColor={darkMode ? "text-gray-300" : "text-white"}
      />
      
      {/* Meta tags gestionados por useEffect */}
    </div>
  );
};

// Documentación de props para autocompletado en IDEs
App.propTypes = {
  /**
   * Nombre de la aplicación para mostrar en el header y metadatos
   */
  appName: PropTypes.string,
  
  /**
   * Título de la página para SEO y mostrar en el contenido
   */
  title: PropTypes.string,
  
  /**
   * Descripción de la página para SEO
   */
  description: PropTypes.string,
  
  /**
   * Habilita el modo oscuro
   */
  darkMode: PropTypes.bool,
  
  /**
   * Clases CSS adicionales
   */
  className: PropTypes.string,
  
  /**
   * Contenido adicional (reemplaza UploadForm si se proporciona)
   */
  children: PropTypes.node
};

// Valores por defecto para props
App.defaultProps = {
  appName: "Imagen2Doc",
  title: "Conversor de Imagen a Documento",
  description: "Convierte imágenes a documentos editables en segundos",
  darkMode: false,
  className: "",
  children: null
};

export default App;
