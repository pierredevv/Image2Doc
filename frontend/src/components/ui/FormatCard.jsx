import React from 'react';

const FormatCard = ({ 
  format, 
  isSelected, 
  onSelect,
  isDarkMode = true,
  disabled = false,
  className = ''
}) => {
  const Icon = format.icon;
  
  // Colores del tema
  const themeColors = {
    selected: {
      border: 'border-indigo-500',
      background: 'bg-indigo-500/10',
      text: 'text-white'
    },
    default: {
      border: isDarkMode ? 'border-white/10' : 'border-gray-200',
      background: isDarkMode ? 'bg-white/5' : 'bg-gray-50',
      text: isDarkMode ? 'text-white' : 'text-gray-900'
    },
    hover: {
      border: isDarkMode ? 'border-white/20' : 'border-gray-300',
      background: isDarkMode ? 'bg-white/10' : 'bg-gray-100'
    },
    disabled: {
      opacity: 'opacity-50',
      cursor: 'cursor-not-allowed'
    }
  };

  // Estado del componente
  const isDisabled = disabled || format.coming;
  
  // Clases dinámicas
  const cardClasses = `
    p-4 rounded-xl border cursor-pointer transition-all duration-200 
    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
    ${isSelected 
      ? `${themeColors.selected.border} ${themeColors.selected.background}` 
      : `${themeColors.default.border} ${themeColors.default.background} hover:${themeColors.hover.border} hover:${themeColors.hover.background}`
    }
    ${isDisabled ? themeColors.disabled.opacity + ' ' + themeColors.disabled.cursor : ''}
    ${className}
  `.trim();

  // Manejador de clic
  const handleClick = () => {
    if (!isDisabled && onSelect) {
      onSelect(format.id);
    }
  };

  // Manejador de teclado
  const handleKeyDown = (e) => {
    if (!isDisabled && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onSelect(format.id);
    }
  };

  return (
    <div
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      aria-pressed={isSelected}
      aria-disabled={isDisabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cardClasses}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Icono del formato */}
          <div className={`flex-shrink-0 ${format.color}`}>
            <Icon className="w-5 h-5" aria-hidden="true" />
          </div>
          
          {/* Información del formato */}
          <div className="min-w-0 flex-1">
            <div className={`font-medium flex items-center ${themeColors.selected.text || themeColors.default.text}`}>
              {format.name}
              {format.coming && (
                <span className="ml-2 px-2 py-1 text-xs bg-yellow-500/20 text-yellow-600 rounded-full font-medium">
                  Próximamente
                </span>
              )}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {format.ext}
            </div>
            {format.description && (
              <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                {format.description}
              </div>
            )}
          </div>
        </div>
        
        {/* Indicador de selección */}
        {isSelected && (
          <div className="flex-shrink-0 ml-3">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" aria-hidden="true"></div>
          </div>
        )}
      </div>
      
      {/* Badge de características (opcional) */}
      {format.features && (
        <div className="mt-3 pt-3 border-t border-current/10">
          <div className="flex flex-wrap gap-1">
            {format.features.map((feature, index) => (
              <span 
                key={index}
                className={`px-2 py-1 text-xs rounded-full ${
                  isDarkMode 
                    ? 'bg-white/10 text-gray-300' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FormatCard;
