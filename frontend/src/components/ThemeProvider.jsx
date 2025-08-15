import React, { createContext, useContext, useState, useEffect } from 'react';

// Contexto del tema
const ThemeContext = createContext();

// Hook personalizado para usar el tema
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe ser usado dentro de un ThemeProvider');
  }
  return context;
};

// Proveedor del tema
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSystemTheme, setIsSystemTheme] = useState(false);
  const [theme, setTheme] = useState('dark');

  // Detectar tema del sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      if (isSystemTheme) {
        setIsDarkMode(e.matches);
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    
    // Establecer tema inicial
    if (isSystemTheme) {
      setIsDarkMode(mediaQuery.matches);
      setTheme(mediaQuery.matches ? 'dark' : 'light');
    }

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [isSystemTheme]);

  // Aplicar tema al documento
  useEffect(() => {
    const root = document.documentElement;
    
    if (isDarkMode) {
      root.setAttribute('data-theme', 'dark');
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.setAttribute('data-theme', 'light');
      root.classList.add('light');
      root.classList.remove('dark');
    }

    // Guardar en localStorage
    localStorage.setItem('theme', theme);
    localStorage.setItem('isSystemTheme', isSystemTheme.toString());
  }, [isDarkMode, theme, isSystemTheme]);

  // Cargar tema guardado al inicializar
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const savedIsSystemTheme = localStorage.getItem('isSystemTheme');
    
    if (savedIsSystemTheme === 'true') {
      setIsSystemTheme(true);
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setIsDarkMode(mediaQuery.matches);
      setTheme(mediaQuery.matches ? 'dark' : 'light');
    } else if (savedTheme) {
      setIsSystemTheme(false);
      setIsDarkMode(savedTheme === 'dark');
      setTheme(savedTheme);
    }
  }, []);

  // Cambiar tema manualmente
  const toggleTheme = () => {
    if (isSystemTheme) {
      setIsSystemTheme(false);
    }
    setIsDarkMode(!isDarkMode);
    setTheme(isDarkMode ? 'light' : 'dark');
  };

  // Cambiar a tema específico
  const setSpecificTheme = (newTheme) => {
    setIsSystemTheme(false);
    setIsDarkMode(newTheme === 'dark');
    setTheme(newTheme);
  };

  // Usar tema del sistema
  const useSystemTheme = () => {
    setIsSystemTheme(true);
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mediaQuery.matches);
    setTheme(mediaQuery.matches ? 'dark' : 'light');
  };

  // Obtener información del tema actual
  const getThemeInfo = () => ({
    isDarkMode,
    theme,
    isSystemTheme,
    systemTheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  });

  const value = {
    isDarkMode,
    theme,
    isSystemTheme,
    toggleTheme,
    setSpecificTheme,
    useSystemTheme,
    getThemeInfo
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Componente de cambio de tema
export const ThemeToggle = ({ 
  variant = 'default', // 'default', 'minimal', 'switch'
  size = 'md',
  showLabel = true,
  className = ''
}) => {
  const { isDarkMode, toggleTheme, isSystemTheme } = useTheme();

  const getVariantClasses = () => {
    switch (variant) {
      case 'minimal':
        return 'p-2 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500';
      case 'switch':
        return 'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2';
      default:
        return 'px-4 py-2 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return variant === 'switch' ? 'h-5 w-9' : 'text-sm';
      case 'lg':
        return variant === 'switch' ? 'h-7 w-14' : 'text-lg';
      default:
        return variant === 'switch' ? 'h-6 w-11' : 'text-base';
    }
  };

  if (variant === 'switch') {
    return (
      <button
        onClick={toggleTheme}
        className={`${getVariantClasses()} ${getSizeClasses()} ${
          isDarkMode ? 'bg-indigo-600' : 'bg-gray-200'
        } ${className}`}
        aria-label={`Cambiar a modo ${isDarkMode ? 'claro' : 'oscuro'}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isDarkMode ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={`${getVariantClasses()} ${getSizeClasses()} ${
        isDarkMode 
          ? 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-400 hover:text-white' 
          : 'bg-gray-100 border-gray-200 hover:bg-gray-200 text-gray-600 hover:text-gray-900'
      } ${className}`}
      aria-label={`Cambiar a modo ${isDarkMode ? 'claro' : 'oscuro'}`}
    >
      {isDarkMode ? (
        <>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
          </svg>
          {showLabel && <span>Modo claro</span>}
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
          {showLabel && <span>Modo oscuro</span>}
        </>
      )}
      
      {isSystemTheme && (
        <span className="ml-2 text-xs px-2 py-1 bg-indigo-500/20 text-indigo-600 rounded-full">
          Sistema
        </span>
      )}
    </button>
  );
};

export default ThemeProvider;
