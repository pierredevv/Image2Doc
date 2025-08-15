import React from 'react';

const ProgressBar = ({ 
  progress, 
  label, 
  isDarkMode = true,
  showPercentage = true,
  size = 'md',
  variant = 'default',
  className = ''
}) => {
  // Validar el progreso
  const validProgress = Math.min(Math.max(progress || 0, 0), 100);
  
  // Variantes de tamaño
  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
    xl: 'h-4'
  };
  
  // Variantes de estilo
  const variantClasses = {
    default: 'bg-gradient-to-r from-indigo-500 to-purple-500',
    success: 'bg-gradient-to-r from-green-500 to-emerald-500',
    warning: 'bg-gradient-to-r from-yellow-500 to-orange-500',
    error: 'bg-gradient-to-r from-red-500 to-pink-500'
  };
  
  // Colores del tema
  const themeColors = {
    background: isDarkMode ? 'bg-slate-800' : 'bg-gray-200',
    text: isDarkMode ? 'text-white' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-400' : 'text-gray-600'
  };

  return (
    <div className={`mt-6 ${className}`}>
      {/* Header con label y porcentaje */}
      <div className="flex items-center justify-between mb-2">
        {label && (
          <span className={`text-sm font-medium ${themeColors.text}`}>
            {label}
          </span>
        )}
        {showPercentage && (
          <span className={`text-sm ${themeColors.textSecondary}`}>
            {Math.round(validProgress)}%
          </span>
        )}
      </div>
      
      {/* Barra de progreso */}
      <div 
        className={`w-full rounded-full ${sizeClasses[size]} ${themeColors.background} overflow-hidden`}
        role="progressbar"
        aria-valuenow={validProgress}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label={label || `Progreso: ${Math.round(validProgress)}%`}
      >
        {/* Barra de progreso con animación */}
        <div 
          className={`${variantClasses[variant]} ${sizeClasses[size]} rounded-full transition-all duration-300 relative overflow-hidden`}
          style={{ width: `${validProgress}%` }}
        >
          {/* Efecto de brillo */}
          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          
          {/* Efecto de shimmer */}
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"
            style={{
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite'
            }}
          ></div>
        </div>
      </div>
      
      {/* Indicador de estado (opcional) */}
      {validProgress === 100 && (
        <div className="flex items-center justify-center mt-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-green-500 ml-2 font-medium">
            Completado
          </span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
