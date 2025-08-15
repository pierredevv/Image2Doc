import React, { useState, useRef, useEffect, useCallback } from 'react';

// Función throttle optimizada para el cursor
const useThrottle = (callback, delay) => {
  const lastRun = useRef(Date.now());
  
  return useCallback((...args) => {
    if (Date.now() - lastRun.current >= delay) {
      callback(...args);
      lastRun.current = Date.now();
    }
  }, [callback, delay]);
};

const TargetCursor = ({ children, className = '', disabled = false }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef(null);

  // Función throttled para el movimiento del mouse
  const handleMouseMove = useThrottle((e) => {
    if (containerRef.current && !disabled) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  }, 50); // Throttle a 50ms para mejor rendimiento

  // Manejadores de eventos
  const handleMouseEnter = useCallback(() => {
    if (!disabled) {
      setIsHovering(true);
    }
  }, [disabled]);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
  }, []);

  // Efecto para agregar/remover event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container || disabled) return;

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseEnter, handleMouseLeave, disabled]);

  return (
    <div 
      ref={containerRef} 
      className={`relative ${className}`}
      style={{ cursor: disabled ? 'default' : 'none' }}
    >
      {/* Cursor personalizado */}
      {isHovering && !disabled && (
        <div
          className="absolute pointer-events-none z-50 transition-opacity duration-200"
          style={{
            left: mousePosition.x - 20,
            top: mousePosition.y - 20,
            opacity: isHovering ? 1 : 0
          }}
        >
          {/* Círculo exterior */}
          <div className="w-10 h-10 border-2 border-indigo-400 rounded-full animate-pulse">
            {/* Círculo interior pulsante */}
            <div className="w-6 h-6 bg-indigo-400 rounded-full absolute top-2 left-2 animate-ping opacity-30"></div>
            {/* Punto central */}
            <div className="w-2 h-2 bg-indigo-300 rounded-full absolute top-4 left-4"></div>
          </div>
        </div>
      )}
      
      {/* Contenido del componente */}
      {children}
    </div>
  );
};

export default TargetCursor;
