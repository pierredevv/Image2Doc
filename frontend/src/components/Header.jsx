// src/components/Header.jsx

import React from 'react';
import { useMemo } from 'react';
import PropTypes from 'prop-types';

// Configuración por defecto
const DEFAULT_APP_NAME = 'Imagen2Doc';
const DEFAULT_LOGO_TEXT = 'I2D';
const DEFAULT_HEADER_HEIGHT = 'py-4';

/**
 * Encabezado simple y altamente configurable
 * 
 * Características principales:
 * - Personalización mínima pero efectiva
 * - Soporte para logo y texto
 * - Accesibilidad incorporada
 * - Estructura preparada para menús de navegación
 * - Responsive por defecto
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} [props.appName=DEFAULT_APP_NAME] - Nombre de la aplicación
 * @param {string} [props.logoText=DEFAULT_LOGO_TEXT] - Texto para el logo (si no hay imagen)
 * @param {string|React.ReactNode} [props.logo] - Logo personalizado (texto o componente)
 * @param {boolean} [props.showAppName=true] - Muestra el nombre de la aplicación
 * @param {string} [props.className=""] - Clases CSS adicionales
 * @param {string} [props.textColor="text-white"] - Clase para el color del texto
 * @param {string} [props.backgroundColor="bg-blue-600"] - Clase para el fondo
 * @param {string} [props.height=DEFAULT_HEADER_HEIGHT] - Clase para la altura
 * @param {string} [props.shadow="shadow-md"] - Clase para la sombra
 * @param {React.ReactNode} [props.navigation] - Componente de navegación
 * @param {boolean} [props.centerContent=true] - Centra el contenido
 * @param {string} [props.contentWidth="container"] - Clase para el ancho del contenido
 */
const Header = ({
  appName = DEFAULT_APP_NAME,
  logoText = DEFAULT_LOGO_TEXT,
  logo,
  showAppName = true,
  className = "",
  textColor = "text-white",
  backgroundColor = "bg-blue-600",
  height = DEFAULT_HEADER_HEIGHT,
  shadow = "shadow-md",
  navigation = null,
  centerContent = true,
  contentWidth = "container"
}) => {
  // Determinar qué mostrar como logo
  const renderLogo = useMemo(() => {
    if (logo) return logo;
    
    return (
      <div className="flex items-center">
        <span className="font-bold text-xl">{logoText}</span>
        {showAppName && (
          <span className="ml-2 font-bold hidden sm:inline">{appName}</span>
        )}
      </div>
    );
  }, [logo, logoText, showAppName, appName]);
  
  return (
    <header 
      className={`${backgroundColor} ${textColor} ${height} ${shadow} ${className}`}
      role="banner"
    >
      <div className={`${contentWidth} mx-auto px-4 flex ${centerContent ? 'justify-center' : 'justify-between'} items-center`}>
        {navigation ? (
          <div className="flex items-center w-full">
            <div className="flex-shrink-0">
              {renderLogo}
            </div>
            <nav className="ml-auto" aria-label="Navegación principal">
              {navigation}
            </nav>
          </div>
        ) : (
          <div className="w-full">
            {renderLogo}
          </div>
        )}
      </div>
    </header>
  );
};

// Documentación de props para autocompletado en IDEs
Header.propTypes = {
  /**
   * Nombre de la aplicación mostrado junto al logo
   */
  appName: PropTypes.string,
  
  /**
   * Texto para el logo cuando no hay imagen (ej: "I2D")
   */
  logoText: PropTypes.string,
  
  /**
   * Logo personalizado (puede ser texto o componente de imagen)
   */
  logo: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]),
  
  /**
   * Muestra el nombre de la aplicación junto al logo
   */
  showAppName: PropTypes.bool,
  
  /**
   * Clases CSS adicionales para el header
   */
  className: PropTypes.string,
  
  /**
   * Clase para el color del texto (ej: "text-white")
   */
  textColor: PropTypes.string,
  
  /**
   * Clase para el color de fondo (ej: "bg-blue-600")
   */
  backgroundColor: PropTypes.string,
  
  /**
   * Clase para la altura (ej: "py-4")
   */
  height: PropTypes.string,
  
  /**
   * Clase para la sombra (ej: "shadow-md")
   */
  shadow: PropTypes.string,
  
  /**
   * Componente de navegación (menú, enlaces, etc.)
   */
  navigation: PropTypes.node,
  
  /**
   * Centra el contenido del header
   */
  centerContent: PropTypes.bool,
  
  /**
   * Clase para el ancho del contenido (ej: "container" o "max-w-6xl")
   */
  contentWidth: PropTypes.string
};

// Valores por defecto para props
Header.defaultProps = {
  appName: DEFAULT_APP_NAME,
  logoText: DEFAULT_LOGO_TEXT,
  logo: null,
  showAppName: true,
  className: "",
  textColor: "text-white",
  backgroundColor: "bg-blue-600",
  height: DEFAULT_HEADER_HEIGHT,
  shadow: "shadow-md",
  navigation: null,
  centerContent: true,
  contentWidth: "container"
};

export default Header;