import React, { useState, useRef, useEffect } from 'react';

const TargetCursor = ({ 
  children, 
  className = '',
  variant = 'default', // 'default', 'minimal', 'glow', 'pulse'
  size = 'md', // 'sm', 'md', 'lg'
  isDarkMode = true,
  disabled = false
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const containerRef = useRef(null);

  // Throttle function para optimizar el rendimiento
  const throttle = (func, limit) => {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  };

  useEffect(() => {
    if (disabled) return;

    const handleMouseMove = throttle((e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    }, 16); // 60fps

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => {
      setIsHovering(false);
      setIsClicking(false);
    };
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);
      container.addEventListener('mousedown', handleMouseDown);
      container.addEventListener('mouseup', handleMouseUp);

      return () => {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
        container.removeEventListener('mousedown', handleMouseDown);
        container.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [disabled]);

  const getVariantClasses = () => {
    switch (variant) {
      case 'minimal':
        return 'w-6 h-6 border border-indigo-400 rounded-full';
      case 'glow':
        return 'w-8 h-8 border-2 border-indigo-400 rounded-full shadow-lg shadow-indigo-400/50';
      case 'pulse':
        return 'w-10 h-10 border-2 border-indigo-400 rounded-full animate-pulse';
      default:
        return 'w-10 h-10 border-2 border-indigo-400 rounded-full';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-6 h-6';
      case 'lg':
        return 'w-14 h-14';
      default:
        return 'w-10 h-10';
    }
  };

  const getCursorContent = () => {
    switch (variant) {
      case 'minimal':
        return (
          <div className={`${getSizeClasses()} border border-indigo-400 rounded-full transition-all duration-200`}>
            <div className="w-2 h-2 bg-indigo-400 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
        );
      
      case 'glow':
        return (
          <div className={`${getSizeClasses()} border-2 border-indigo-400 rounded-full shadow-lg shadow-indigo-400/50 transition-all duration-200`}>
            <div className="w-3 h-3 bg-indigo-400 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-ping opacity-75" />
            <div className="w-2 h-2 bg-indigo-300 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
        );
      
      case 'pulse':
        return (
          <div className={`${getSizeClasses()} border-2 border-indigo-400 rounded-full animate-pulse transition-all duration-200`}>
            <div className="w-4 h-4 bg-indigo-400 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-ping opacity-30" />
            <div className="w-2 h-2 bg-indigo-300 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
        );
      
      default:
        return (
          <div className={`${getSizeClasses()} border-2 border-indigo-400 rounded-full transition-all duration-200`}>
            <div className="w-6 h-6 bg-indigo-400 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-ping opacity-30" />
            <div className="w-3 h-3 bg-indigo-300 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            <div className="w-1 h-1 bg-indigo-200 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
        );
    }
  };

  if (disabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Cursor personalizado */}
      {isHovering && (
        <div
          className="absolute pointer-events-none z-50 transition-all duration-200"
          style={{
            left: mousePosition.x - (size === 'sm' ? 12 : size === 'lg' ? 28 : 20),
            top: mousePosition.y - (size === 'sm' ? 12 : size === 'lg' ? 28 : 20),
            opacity: isHovering ? 1 : 0,
            transform: `scale(${isClicking ? 0.8 : 1})`
          }}
        >
          {getCursorContent()}
        </div>
      )}
      
      {/* Contenido del componente */}
      {children}
    </div>
  );
};

// Variantes especializadas
export const MinimalCursor = (props) => <TargetCursor variant="minimal" {...props} />;
export const GlowCursor = (props) => <TargetCursor variant="glow" {...props} />;
export const PulseCursor = (props) => <TargetCursor variant="pulse" {...props} />;

// Cursor responsivo
export const ResponsiveCursor = ({ children, className = '', isDarkMode = true }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) {
    return <div className={className}>{children}</div>;
  }

  return (
    <TargetCursor 
      variant="default" 
      size="md" 
      isDarkMode={isDarkMode}
      className={className}
    >
      {children}
    </TargetCursor>
  );
};

export default TargetCursor;
