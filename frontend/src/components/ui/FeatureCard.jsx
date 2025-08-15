import React from 'react';
import TargetCursor from './TargetCursor';

const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  isDarkMode = true,
  variant = 'default',
  className = '',
  onClick,
  disabled = false
}) => {
  // Variantes de estilo
  const variants = {
    default: {
      background: isDarkMode ? 'bg-slate-900/30' : 'bg-white/60',
      border: isDarkMode ? 'border-white/10' : 'border-gray-200',
      hover: isDarkMode ? 'hover:bg-slate-900/50' : 'hover:bg-white/80'
    },
    primary: {
      background: isDarkMode ? 'bg-indigo-500/10' : 'bg-indigo-50/80',
      border: isDarkMode ? 'border-indigo-500/20' : 'border-indigo-200',
      hover: isDarkMode ? 'hover:bg-indigo-500/20' : 'hover:bg-indigo-100/80'
    },
    success: {
      background: isDarkMode ? 'bg-green-500/10' : 'bg-green-50/80',
      border: isDarkMode ? 'border-green-500/20' : 'border-green-200',
      hover: isDarkMode ? 'hover:bg-green-500/20' : 'hover:bg-green-100/80'
    }
  };

  const currentVariant = variants[variant] || variants.default;

  // Colores del tema
  const themeColors = {
    text: isDarkMode ? 'text-white' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-400' : 'text-gray-600',
    icon: isDarkMode ? 'text-indigo-400' : 'text-indigo-500'
  };

  // Clases del componente
  const cardClasses = `
    backdrop-blur-sm border rounded-xl p-6 transition-all duration-300
    ${currentVariant.background} ${currentVariant.border} ${currentVariant.hover}
    ${onClick && !disabled ? 'cursor-pointer' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `.trim();

  // Manejador de clic
  const handleClick = () => {
    if (onClick && !disabled) {
      onClick();
    }
  };

  // Manejador de teclado
  const handleKeyDown = (e) => {
    if (onClick && !disabled && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  const CardContent = (
    <div
      className={cardClasses}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
      aria-label={onClick ? `${title} - ${description}` : undefined}
    >
      {/* Icono */}
      <div className={`text-3xl mb-4 ${themeColors.icon}`} aria-hidden="true">
        {icon}
      </div>
      
      {/* Título */}
      <h4 className={`text-lg font-semibold mb-2 ${themeColors.text}`}>
        {title}
      </h4>
      
      {/* Descripción */}
      <p className={`${themeColors.textSecondary} leading-relaxed`}>
        {description}
      </p>
      
      {/* Indicador de acción (si es clickeable) */}
      {onClick && !disabled && (
        <div className="mt-4 flex items-center text-sm text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span>Haz clic para más información</span>
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      )}
    </div>
  );

  // Envolver en TargetCursor si no está deshabilitado
  if (disabled) {
    return CardContent;
  }

  return (
    <TargetCursor className="group">
      {CardContent}
    </TargetCursor>
  );
};

export default FeatureCard;
