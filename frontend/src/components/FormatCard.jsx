import React from 'react';

const FormatCard = ({ format, isSelected, onSelect, isDarkMode }) => {
  const Icon = format.icon;
  
  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      aria-disabled={format.coming}
      onClick={() => !format.coming && onSelect(format.id)}
      onKeyDown={(e) => !format.coming && (e.key === 'Enter' || e.key === ' ') && onSelect(format.id)}
      className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
        isSelected 
          ? 'border-indigo-500 bg-indigo-500/10' 
          : isDarkMode 
            ? 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
            : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'
      } ${format.coming ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Icon className={`w-5 h-5 ${format.color}`} aria-hidden="true" />
          <div>
            <div className={`font-medium flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {format.name}
              {format.coming && (
                <span className="ml-2 px-2 py-1 text-xs bg-yellow-500/20 text-yellow-600 rounded">
                  Próximamente
                </span>
              )}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {format.ext}
            </div>
          </div>
        </div>
        {isSelected && (
          <div className="w-2 h-2 bg-indigo-500 rounded-full" aria-hidden="true"></div>
        )}
      </div>
    </div>
  );
};

export default FormatCard;
