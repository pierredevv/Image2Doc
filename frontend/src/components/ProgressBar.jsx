import React from 'react';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

const ProgressBar = ({ 
  progress, 
  label, 
  status = 'processing', // 'processing', 'completed', 'error'
  showPercentage = true,
  size = 'md', // 'sm', 'md', 'lg'
  isDarkMode = true,
  className = ''
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-indigo-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gradient-to-r from-indigo-500 to-purple-600';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'completed':
        return 'Completado';
      case 'error':
        return 'Error';
      default:
        return 'Procesando...';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-1 text-xs';
      case 'lg':
        return 'h-3 text-base';
      default:
        return 'h-2 text-sm';
    }
  };

  const getProgressBarHeight = () => {
    switch (size) {
      case 'sm':
        return 'h-1';
      case 'lg':
        return 'h-3';
      default:
        return 'h-2';
    }
  };

  return (
    <div className={`progress-container ${className}`}>
      {/* Header con label y estado */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {label}
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          {showPercentage && (
            <span className={`font-mono ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {Math.round(progress)}%
            </span>
          )}
          <span className={`text-xs px-2 py-1 rounded-full ${
            status === 'completed'
              ? 'bg-green-500/20 text-green-600'
              : status === 'error'
              ? 'bg-red-500/20 text-red-600'
              : 'bg-indigo-500/20 text-indigo-600'
          }`}>
            {getStatusText()}
          </span>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className={`progress-bar ${getProgressBarHeight()} ${getSizeClasses()}`}>
        <div 
          className={`progress-fill ${getStatusColor()} ${getProgressBarHeight()} rounded-full transition-all duration-500 ease-out relative overflow-hidden`}
          style={{ width: `${Math.min(progress, 100)}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin="0"
          aria-valuemax="100"
          aria-label={`${label}: ${progress}% completado`}
        >
          {/* Efecto shimmer para estado de procesamiento */}
          {status === 'processing' && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          )}
          
          {/* Efecto de pulso para estado activo */}
          {status === 'processing' && progress < 100 && (
            <div className="absolute inset-0 bg-white/10 animate-pulse" />
          )}
        </div>
      </div>

      {/* Información adicional */}
      {status === 'processing' && progress > 0 && progress < 100 && (
        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
          <span>Procesando imagen...</span>
          <span className="font-mono">
            {progress < 25 && 'Inicializando...'}
            {progress >= 25 && progress < 50 && 'Analizando...'}
            {progress >= 50 && progress < 75 && 'Extrayendo texto...'}
            {progress >= 75 && progress < 100 && 'Finalizando...'}
          </span>
        </div>
      )}

      {/* Mensaje de error */}
      {status === 'error' && (
        <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-xs text-red-600">
            Error durante el procesamiento. Intenta nuevamente.
          </p>
        </div>
      )}

      {/* Mensaje de éxito */}
      {status === 'completed' && (
        <div className="mt-2 p-2 bg-green-500/10 border border-green-500/20 rounded-lg">
          <p className="text-xs text-green-600">
            Procesamiento completado exitosamente.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
