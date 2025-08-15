import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  variant = 'primary', // 'primary', 'secondary', 'outline', 'ghost', 'danger'
  size = 'md', // 'sm', 'md', 'lg', 'xl'
  isLoading = false,
  disabled = false,
  fullWidth = false,
  icon = null,
  iconPosition = 'left', // 'left', 'right'
  onClick = null,
  type = 'button',
  className = '',
  isDarkMode = true,
  ...props
}) => {
  const baseClasses = `
    btn inline-flex items-center justify-center gap-3 font-semibold rounded-xl
    transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    ${fullWidth ? 'w-full' : ''}
  `;

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600
      hover:from-indigo-600 hover:via-purple-600 hover:to-indigo-700
      text-white shadow-lg hover:shadow-xl hover:shadow-indigo-500/30
      focus:ring-indigo-500 focus:ring-offset-slate-900
      hover:scale-105 hover:-translate-y-1
      border border-indigo-400/20
    `,
    secondary: `
      bg-transparent text-gray-300 border border-white/20
      hover:bg-white/10 hover:text-white hover:border-white/30
      focus:ring-white/50 focus:ring-offset-slate-900
      hover:scale-105 hover:bg-white/5
    `,
    outline: `
      bg-transparent text-indigo-400 border border-indigo-500/40
      hover:bg-indigo-500/10 hover:text-indigo-300 hover:border-indigo-500/60
      focus:ring-indigo-500 focus:ring-offset-slate-900
      hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/20
    `,
    ghost: `
      bg-transparent text-gray-400 hover:text-white hover:bg-white/5
      focus:ring-white/50 focus:ring-offset-slate-900
      hover:scale-105
    `,
    danger: `
      bg-gradient-to-r from-red-500 via-pink-500 to-red-600
      hover:from-red-600 hover:via-pink-600 hover:to-red-700
      text-white shadow-lg hover:shadow-xl hover:shadow-red-500/30
      focus:ring-red-500 focus:ring-offset-slate-900
      hover:scale-105 hover:-translate-y-1
      border border-red-400/20
    `,
    success: `
      bg-gradient-to-r from-green-500 via-emerald-500 to-green-600
      hover:from-green-600 hover:via-emerald-600 hover:to-green-700
      text-white shadow-lg hover:shadow-xl hover:shadow-green-500/30
      focus:ring-green-500 focus:ring-offset-slate-900
      hover:scale-105 hover:-translate-y-1
      border border-green-400/20
    `
  };

  const sizeClasses = {
    sm: 'px-4 py-2.5 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  };

  const IconComponent = icon;
  const LoadingIcon = Loader2;

  const handleClick = (e) => {
    if (!disabled && !isLoading && onClick) {
      onClick(e);
    }
  };

  return (
    <button
      type={type}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      onClick={handleClick}
      disabled={disabled || isLoading}
      {...props}
    >
      {/* Icono izquierdo */}
      {icon && iconPosition === 'left' && !isLoading && (
        <IconComponent className="w-5 h-5" />
      )}

      {/* Icono de carga */}
      {isLoading && (
        <LoadingIcon className="w-5 h-5 animate-spin" />
      )}

      {/* Contenido del botón */}
      <span>{children}</span>

      {/* Icono derecho */}
      {icon && iconPosition === 'right' && !isLoading && (
        <IconComponent className="w-5 h-5" />
      )}
    </button>
  );
};

// Botones especializados
export const PrimaryButton = (props) => <Button variant="primary" {...props} />;
export const SecondaryButton = (props) => <Button variant="secondary" {...props} />;
export const OutlineButton = (props) => <Button variant="outline" {...props} />;
export const GhostButton = (props) => <Button variant="ghost" {...props} />;
export const DangerButton = (props) => <Button variant="danger" {...props} />;
export const SuccessButton = (props) => <Button variant="success" {...props} />;

// Botones de acción comunes
export const ActionButton = ({ 
  icon, 
  children, 
  onClick, 
  isDarkMode = true,
  className = '',
  ...props 
}) => (
  <Button
    variant="primary"
    size="md"
    icon={icon}
    onClick={onClick}
    isDarkMode={isDarkMode}
    className={`action-button ${className}`}
    {...props}
  >
    {children}
  </Button>
);

// Botón de conversión especializado
export const ConvertButton = ({ 
  icon, 
  children, 
  onClick, 
  isDarkMode = true,
  isLoading = false,
  disabled = false,
  className = '',
  ...props 
}) => (
  <Button
    variant="primary"
    size="lg"
    icon={icon}
    onClick={onClick}
    isLoading={isLoading}
    disabled={disabled}
    isDarkMode={isDarkMode}
    fullWidth
    className={`convert-button ${className}`}
    {...props}
  >
    {children}
  </Button>
);

export const IconButton = ({ 
  icon, 
  onClick, 
  isDarkMode = true,
  size = 'md',
  variant = 'ghost',
  className = '',
  ...props 
}) => {
  const IconComponent = icon;
  
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-14 h-14'
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      isDarkMode={isDarkMode}
      className={`icon-button p-0 ${sizeClasses[size]} ${className}`}
      {...props}
    >
      <IconComponent className="w-5 h-5" />
    </Button>
  );
};

export default Button;
