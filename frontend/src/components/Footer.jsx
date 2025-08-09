// src/components/Footer.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { useMemo } from 'react';

// Configuración por defecto
const DEFAULT_APP_NAME = 'Imagen2Doc';
const DEFAULT_COPYRIGHT_TEXT = 'Todos los derechos reservados';
const DEFAULT_YEAR = new Date().getFullYear();

/**
 * Pie de página simple y altamente configurable
 * 
 * Características principales:
 * - Personalización mínima pero efectiva
 * - Soporte para internacionalización
 * - Accesibilidad incorporada
 * - Versión automática del año
 * - Estructura preparada para futuras extensiones
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} [props.appName=DEFAULT_APP_NAME] - Nombre de la aplicación
 * @param {string} [props.copyrightText=DEFAULT_COPYRIGHT_TEXT] - Texto de copyright
 * @param {number} [props.year=DEFAULT_YEAR] - Año para el copyright (por defecto el actual)
 * @param {string} [props.className=""] - Clases CSS adicionales
 * @param {string} [props.textColor="text-white"] - Clase para el color del texto
 * @param {string} [props.backgroundColor="bg-gray-800"] - Clase para el fondo
 * @param {string} [props.padding="py-4"] - Clase para el padding
 * @param {string} [props.alignment="text-center"] - Clase para la alineación
 * @param {React.ReactNode} [props.additionalLinks] - Enlaces adicionales
 * @param {boolean} [props.showLinks=true] - Muestra los enlaces de política
 */
const Footer = ({
  appName = DEFAULT_APP_NAME,
  copyrightText = DEFAULT_COPYRIGHT_TEXT,
  year = DEFAULT_YEAR,
  className = "",
  textColor = "text-white",
  backgroundColor = "bg-gray-800",
  padding = "py-4",
  alignment = "text-center",
  additionalLinks = null,
  showLinks = true
}) => {
  // Generar el texto de copyright
  const copyright = useMemo(() => 
    `© ${year} ${appName} - ${copyrightText}`,
    [year, appName, copyrightText]
  );
  
  return (
    <footer 
      className={`${backgroundColor} ${textColor} ${padding} ${className}`}
      role="contentinfo"
      aria-label="Información de copyright y enlaces legales"
    >
      <div className="container mx-auto px-4">
        <div className={alignment}>
          <p className="text-sm">
            {copyright}
          </p>
          
          {showLinks && (
            <div className="mt-2 text-xs opacity-75 flex flex-wrap justify-center gap-x-4">
              {additionalLinks || (
                <>
                  <a 
                    href="/privacy" 
                    className="hover:underline hover:opacity-100 transition-opacity"
                    aria-label="Política de privacidad"
                  >
                    Política de privacidad
                  </a>
                  <a 
                    href="/terms" 
                    className="hover:underline hover:opacity-100 transition-opacity"
                    aria-label="Términos y condiciones"
                  >
                    Términos y condiciones
                  </a>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

// Documentación de props para autocompletado en IDEs
Footer.propTypes = {
  /**
   * Nombre de la aplicación mostrado en el copyright
   */
  appName: PropTypes.string,
  
  /**
   * Texto de copyright (ej: "Todos los derechos reservados")
   */
  copyrightText: PropTypes.string,
  
  /**
   * Año específico para el copyright (por defecto usa el año actual)
   */
  year: PropTypes.number,
  
  /**
   * Clases CSS adicionales para el footer
   */
  className: PropTypes.string,
  
  /**
   * Clase para el color del texto (ej: "text-white")
   */
  textColor: PropTypes.string,
  
  /**
   * Clase para el color de fondo (ej: "bg-gray-800")
   */
  backgroundColor: PropTypes.string,
  
  /**
   * Clase para el padding (ej: "py-4")
   */
  padding: PropTypes.string,
  
  /**
   * Clase para la alineación del texto (ej: "text-center")
   */
  alignment: PropTypes.string,
  
  /**
   * Enlaces adicionales para mostrar (reemplaza los predeterminados)
   */
  additionalLinks: PropTypes.node,
  
  /**
   * Muestra los enlaces predeterminados (política de privacidad, términos)
   */
  showLinks: PropTypes.bool
};

// Valores por defecto para props
Footer.defaultProps = {
  appName: DEFAULT_APP_NAME,
  copyrightText: DEFAULT_COPYRIGHT_TEXT,
  year: DEFAULT_YEAR,
  className: "",
  textColor: "text-white",
  backgroundColor: "bg-gray-800",
  padding: "py-4",
  alignment: "text-center",
  additionalLinks: null,
  showLinks: true
};

export default Footer;