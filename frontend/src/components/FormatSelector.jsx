import React from 'react';
import { FileText, FileSpreadsheet, File, FileImage, Download, Check } from 'lucide-react';

const FormatSelector = ({ 
  selectedFormat, 
  onFormatSelect, 
  isDarkMode = true,
  className = '' 
}) => {
  const formats = [
    {
      id: 'word',
      name: 'Word Document',
      description: 'Documento editable de Microsoft Word',
      icon: FileText,
      ext: '.docx',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      coming: false,
      features: ['Editable', 'Formato profesional', 'Compatible con Office']
    },
    {
      id: 'excel',
      name: 'Excel Spreadsheet',
      description: 'Hoja de cálculo de Microsoft Excel',
      icon: FileSpreadsheet,
      ext: '.xlsx',
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
      coming: false,
      features: ['Tablas organizadas', 'Fórmulas automáticas', 'Análisis de datos']
    },
    {
      id: 'txt',
      name: 'Plain Text',
      description: 'Archivo de texto simple y universal',
      icon: File,
      ext: '.txt',
      color: 'text-gray-400',
      bgColor: 'bg-gray-500/10',
      borderColor: 'border-gray-500/30',
      coming: false,
      features: ['Universal', 'Ligero', 'Compatible con todo']
    },
    {
      id: 'pdf',
      name: 'PDF Document',
      description: 'Documento PDF de alta calidad',
      icon: FileImage,
      ext: '.pdf',
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
      coming: true,
      features: ['Alta calidad', 'No editable', 'Perfecto para compartir']
    }
  ];

  return (
    <div className={`format-selector ${className}`}>
      <div className="mb-6">
        <h3 className={`text-xl font-semibold mb-2 flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          <Download className="w-5 h-5 mr-2 text-indigo-500" />
          Formato de salida
        </h3>
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Selecciona el formato en el que deseas convertir tu imagen
        </p>
      </div>

      <div className="space-y-3" role="radiogroup" aria-label="Seleccionar formato de salida">
        {formats.map((format) => (
          <FormatCard
            key={format.id}
            format={format}
            isSelected={selectedFormat === format.id}
            onSelect={() => !format.coming && onFormatSelect(format.id)}
            isDarkMode={isDarkMode}
          />
        ))}
      </div>

      {/* Información adicional */}
      <div className={`mt-6 p-4 rounded-lg ${
        isDarkMode ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-200'
      }`}>
        <h4 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          💡 Consejo
        </h4>
        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {selectedFormat === 'word' && 'Word es ideal para documentos que necesitas editar posteriormente.'}
          {selectedFormat === 'excel' && 'Excel es perfecto para datos tabulares y análisis.'}
          {selectedFormat === 'txt' && 'Texto plano es la opción más universal y ligera.'}
          {selectedFormat === 'pdf' && 'PDF mantiene el formato exacto para compartir.'}
        </p>
      </div>
    </div>
  );
};

const FormatCard = ({ format, isSelected, onSelect, isDarkMode }) => {
  const Icon = format.icon;
  
  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      aria-disabled={format.coming}
      onClick={() => !format.coming && onSelect()}
      onKeyDown={(e) => !format.coming && (e.key === 'Enter' || e.key === ' ') && onSelect()}
      className={`format-card p-4 rounded-xl border transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
        isSelected
          ? `border-indigo-500 ${format.bgColor} bg-indigo-500/20`
          : isDarkMode
            ? 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
            : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'
      } ${format.coming ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className={`p-2 rounded-lg ${format.bgColor} ${format.borderColor} border`}>
            <Icon className={`w-5 h-5 ${format.color}`} aria-hidden="true" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {format.name}
              </h4>
              {format.coming && (
                <span className="px-2 py-1 text-xs bg-yellow-500/20 text-yellow-600 rounded-full">
                  Próximamente
                </span>
              )}
            </div>
            
            <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {format.description}
            </p>
            
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="font-mono">{format.ext}</span>
              <span>•</span>
              <span>{format.features.join(', ')}</span>
            </div>
          </div>
        </div>
        
        {/* Indicador de selección */}
        {isSelected && (
          <div className="flex-shrink-0">
            <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormatSelector;
