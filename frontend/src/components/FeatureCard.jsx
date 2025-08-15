import React from 'react';
import { Sparkles, Zap, Shield, Globe, Smartphone, Download } from 'lucide-react';

const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  features = [],
  isDarkMode = true,
  className = '',
  onClick = null,
  isInteractive = false
}) => {
  const IconComponent = icon;
  
  const cardClasses = `
    feature-card ${className}
    ${isInteractive ? 'cursor-pointer hover:scale-105' : ''}
    ${isDarkMode 
      ? 'bg-white/5 border-white/10 hover:border-white/20' 
      : 'bg-white/80 border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl'
    }
  `;

  const handleClick = () => {
    if (isInteractive && onClick) {
      onClick();
    }
  };

  return (
    <div
      className={cardClasses}
      onClick={handleClick}
      role={isInteractive ? 'button' : 'article'}
      tabIndex={isInteractive ? 0 : undefined}
      onKeyDown={isInteractive ? (e) => e.key === 'Enter' && handleClick() : undefined}
    >
      {/* Icono principal */}
      <div className="text-center mb-6">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${
          isDarkMode ? 'bg-indigo-500/20' : 'bg-indigo-100'
        }`}>
          <IconComponent className={`w-8 h-8 ${
            isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
          }`} />
        </div>
      </div>

      {/* Contenido */}
      <div className="text-center mb-6">
        <h3 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {title}
        </h3>
        <p className={`text-base leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {description}
        </p>
      </div>

      {/* Características */}
      {features.length > 0 && (
        <div className="space-y-2">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div className={`w-2 h-2 rounded-full ${
                isDarkMode ? 'bg-indigo-400' : 'bg-indigo-500'
              }`} />
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                {feature}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Indicador de interacción */}
      {isInteractive && (
        <div className={`mt-4 text-center ${
          isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
        }`}>
          <span className="text-xs font-medium">Haz clic para más información</span>
        </div>
      )}
    </div>
  );
};

// Componente de características principales
const FeaturesSection = ({ isDarkMode = true, className = '' }) => {
  const features = [
    {
      icon: Sparkles,
      title: 'OCR Avanzado con IA',
      description: 'Reconocimiento óptico de caracteres potenciado por inteligencia artificial para máxima precisión y velocidad.',
      features: [
        'Precisión del 99.5%',
        'Procesamiento en tiempo real',
        'Soporte multiidioma'
      ]
    },
    {
      icon: Zap,
      title: 'Procesamiento Ultra Rápido',
      description: 'Convierte imágenes a documentos en segundos con nuestra tecnología de procesamiento optimizada.',
      features: [
        'Menos de 5 segundos',
        'Procesamiento en lote',
        'Optimización automática'
      ]
    },
    {
      icon: Shield,
      title: 'Seguridad y Privacidad',
      description: 'Tus archivos están protegidos con encriptación de nivel bancario y nunca se almacenan permanentemente.',
      features: [
        'Encriptación AES-256',
        'Eliminación automática',
        'Cumple GDPR'
      ]
    },
    {
      icon: Globe,
      title: 'Múltiples Formatos',
      description: 'Exporta a Word, Excel, PDF y texto plano con opciones de personalización avanzadas.',
      features: [
        'Word (.docx)',
        'Excel (.xlsx)',
        'PDF (.pdf)',
        'Texto (.txt)'
      ]
    },
    {
      icon: Smartphone,
      title: 'Diseño Responsivo',
      description: 'Interfaz optimizada para todos los dispositivos, desde móviles hasta pantallas de escritorio.',
      features: [
        'Mobile-first design',
        'Touch-friendly',
        'Accesibilidad completa'
      ]
    },
    {
      icon: Download,
      title: 'Descarga Inmediata',
      description: 'Obtén tus documentos convertidos al instante con opciones de descarga múltiple y envío por email.',
      features: [
        'Descarga directa',
        'Envío por email',
        'Almacenamiento en la nube'
      ]
    }
  ];

  return (
    <section className={`features-section ${className}`}>
      <div className="text-center mb-12">
        <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Características principales
        </h2>
        <p className={`text-lg max-w-2xl mx-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Descubre por qué nuestro sistema OCR es la elección preferida para profesionales y empresas
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            features={feature.features}
            isDarkMode={isDarkMode}
            isInteractive={true}
            onClick={() => console.log(`Feature clicked: ${feature.title}`)}
          />
        ))}
      </div>
    </section>
  );
};

export default FeatureCard;
export { FeaturesSection };
