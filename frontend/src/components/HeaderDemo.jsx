// src/components/HeaderDemo.jsx

import React, { useState } from 'react';
import Header from './Header';
import './Header.css';

const HeaderDemo = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-slate-950' : 'bg-gradient-to-br from-gray-50 to-blue-50'
    }`}>
      {/* Header Mejorado */}
      <Header 
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />

      {/* Contenido de demostración */}
      <div className="pt-[4.5rem] px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              🚀 Header Mejorado - OCR System Pro
            </h1>
            <p className={`text-lg max-w-2xl mx-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Este es el header completamente rediseñado que soluciona todos los problemas identificados
            </p>
          </div>

          {/* Secciones de demostración */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className={`p-6 rounded-2xl border ${
              isDarkMode ? 'bg-slate-900/50 border-white/10' : 'bg-white/80 border-gray-200'
            }`}>
              <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                ✅ Problemas Solucionados
              </h3>
              <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <li>• Proporciones incorrectas del header</li>
                <li>• Alineación del lado derecho del menú</li>
                <li>• Campo de búsqueda mal diseñado</li>
                <li>• Dropdowns sin efectos visuales</li>
              </ul>
            </div>

            <div className={`p-6 rounded-2xl border ${
              isDarkMode ? 'bg-slate-900/50 border-white/10' : 'bg-white/80 border-gray-200'
            }`}>
              <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                🎨 Nuevas Características
              </h3>
              <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <li>• Diseño glassmorphism moderno</li>
                <li>• Animaciones y transiciones suaves</li>
                <li>• Responsive design completo</li>
                <li>• Atajos de teclado</li>
              </ul>
            </div>
          </div>

          {/* Instrucciones de uso */}
          <div className={`p-8 rounded-2xl border ${
            isDarkMode ? 'bg-slate-900/50 border-white/10' : 'bg-white/80 border-gray-200'
          }`}>
            <h3 className={`text-2xl font-bold mb-6 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              🎯 Cómo Probar el Header
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  isDarkMode ? 'bg-indigo-500/20' : 'bg-indigo-100'
                }`}>
                  <span className="text-2xl">🔍</span>
                </div>
                <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Campo de Búsqueda
                </h4>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Haz clic en el campo de búsqueda para expandirlo. Usa Ctrl+K como atajo.
                </p>
              </div>

              <div className="text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  isDarkMode ? 'bg-purple-500/20' : 'bg-purple-100'
                }`}>
                  <span className="text-2xl">🔔</span>
                </div>
                <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Notificaciones
                </h4>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Haz clic en el botón de notificaciones para ver el dropdown elegante.
                </p>
              </div>

              <div className="text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  isDarkMode ? 'bg-green-500/20' : 'bg-green-100'
                }`}>
                  <span className="text-2xl">👤</span>
                </div>
                <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Menú de Usuario
                </h4>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Haz clic en el botón de usuario para ver el menú desplegable.
                </p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <strong>💡 Tip:</strong> Haz scroll para ver cómo el header cambia de apariencia
              </p>
            </div>
          </div>

          {/* Características técnicas */}
          <div className={`mt-12 p-6 rounded-2xl border ${
            isDarkMode ? 'bg-slate-900/50 border-white/10' : 'bg-white/80 border-gray-200'
          }`}>
            <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              🔧 Características Técnicas
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>
                  React Hooks
                </h4>
                <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <li>• useState para gestión de estado</li>
                  <li>• useEffect para efectos secundarios</li>
                  <li>• useRef para referencias del DOM</li>
                </ul>
              </div>
              <div>
                <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                  CSS Moderno
                </h4>
                <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <li>• Flexbox y Grid para layout</li>
                  <li>• CSS Variables para temas</li>
                  <li>• Animaciones y transiciones</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-16 text-center">
            <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Header rediseñado con ❤️ para OCR System Pro
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderDemo;
