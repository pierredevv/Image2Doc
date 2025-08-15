import React, { createContext, useContext, useState, useEffect } from 'react';

// Crear el contexto del tema
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
  // Obtener el tema inicial del localStorage o preferencia del sistema
  const getInitialTheme = () => {
    // Verificar si hay un tema guardado en localStorage
    const savedTheme = localStorage.getItem('image2doc-theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    
    // Si no hay tema guardado, usar la preferencia del sistema
    if (window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    // Por defecto, modo oscuro
    return true;
  };

  const [isDarkMode, setIsDarkMode] = useState(getInitialTheme);

  // Función para cambiar el tema
  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  // Función para establecer un tema específico
  const setTheme = (dark) => {
    setIsDarkMode(dark);
  };

  // Efecto para aplicar el tema al documento
  useEffect(() => {
    const root = document.documentElement;
    
    if (isDarkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    
    // Guardar en localStorage
    localStorage.setItem('image2doc-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Efecto para escuchar cambios en la preferencia del sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      // Solo cambiar si no hay un tema guardado en localStorage
      if (!localStorage.getItem('image2doc-theme')) {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const value = {
    isDarkMode,
    toggleTheme,
    setTheme,
    theme: isDarkMode ? 'dark' : 'light'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
