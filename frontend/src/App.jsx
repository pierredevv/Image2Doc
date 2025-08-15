// src/App.jsx

import React from 'react';
import OCRSystem from './components/OCRSystem';
import { ThemeProvider } from './components/ThemeProvider';

/**
 * Componente principal de la aplicación
 * 
 * Características principales:
 * - Estructura base de la aplicación
 * - Usa el nuevo sistema de temas (ThemeProvider)
 * - Componente OCRSystem como contenido principal
 * - Optimización para SEO
 */
const App = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen" role="main">
        <OCRSystem />
      </div>
    </ThemeProvider>
  );
};

export default App;
