import React, { useState, useEffect } from 'react';
import { FileText, FileSpreadsheet, File, Settings, Download, History, HelpCircle, Info, Zap, Shield, Globe, ChevronRight, Star, Clock, TrendingUp } from 'lucide-react';

const Sidebar = ({ isOpen, isDarkMode }) => {
  const [activeSection, setActiveSection] = useState('formatos');
  const [expandedItems, setExpandedItems] = useState(new Set(['word']));
  const [recentFiles, setRecentFiles] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Simular archivos recientes
  useEffect(() => {
    setRecentFiles([
      { name: 'documento1.docx', type: 'word', date: 'Hace 2 min', size: '2.3 MB' },
      { name: 'hoja_calculo.xlsx', type: 'excel', date: 'Hace 15 min', size: '1.8 MB' },
      { name: 'notas.txt', type: 'txt', date: 'Hace 1 hora', size: '0.5 MB' }
    ]);
  }, []);

  const menuItems = [
    {
      id: 'word',
      icon: FileText,
      label: 'Documentos Word',
      count: 14,
      active: true,
      description: 'Archivos .docx',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30'
    },
    {
      id: 'excel',
      icon: FileSpreadsheet,
      label: 'Hojas de cálculo',
      count: 8,
      description: 'Archivos .xlsx',
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30'
    },
    {
      id: 'txt',
      icon: File,
      label: 'Archivos de texto',
      count: 24,
      description: 'Archivos .txt',
      color: 'text-gray-400',
      bgColor: 'bg-gray-500/10',
      borderColor: 'border-gray-500/30'
    },
    {
      id: 'downloads',
      icon: Download,
      label: 'Descargas',
      count: 2,
      description: 'Recientes',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30'
    },
    {
      id: 'history',
      icon: History,
      label: 'Historial',
      count: 156,
      description: 'Todas las conversiones',
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/30'
    }
  ];

  const helpItems = [
    {
      icon: HelpCircle,
      label: 'Centro de ayuda',
      href: '#',
      description: 'Tutoriales y soporte',
      badge: 'Nuevo'
    },
    {
      icon: Info,
      label: 'Acerca de',
      href: '#',
      description: 'Información del sistema'
    }
  ];

  const statsItems = [
    {
      icon: Zap,
      label: 'Conversiones hoy',
      value: '23',
      color: 'text-green-400',
      trend: '+12%',
      trendUp: true
    },
    {
      icon: Shield,
      label: 'Archivos seguros',
      value: '156',
      color: 'text-blue-400',
      trend: '+5%',
      trendUp: true
    },
    {
      icon: Globe,
      label: 'Idiomas soportados',
      value: '12',
      color: 'text-purple-400',
      trend: '+2',
      trendUp: true
    }
  ];

  const toggleExpanded = (itemId) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleItemClick = (itemId) => {
    setActiveSection(itemId);
    // Aquí implementarías la navegación
    console.log('Navegando a:', itemId);
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'word': return <FileText className="w-4 h-4 text-blue-400" />;
      case 'excel': return <FileSpreadsheet className="w-4 h-4 text-green-400" />;
      case 'txt': return <File className="w-4 h-4 text-gray-400" />;
      default: return <File className="w-4 h-4" />;
    }
  };

  return (
    <aside className={`sidebar fixed lg:static top-0 left-0 h-full z-50 transform transition-all duration-500 ease-in-out ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    } ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="h-full flex flex-col bg-gradient-to-b from-slate-900/95 to-slate-800/95 backdrop-blur-xl border-r border-white/10 shadow-2xl shadow-black/30">
        {/* Header del sidebar */}
        <div className="p-6 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Settings className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="text-lg font-semibold text-white">Navegación</h2>
                <p className="text-xs text-gray-400">Sistema OCR Pro</p>
              </div>
            )}
          </div>
        </div>

        {/* Estadísticas rápidas */}
        {!isCollapsed && (
          <div className="p-4 border-b border-white/10">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Estadísticas
            </h3>
            <div className="space-y-2">
              {statsItems.map((item, index) => (
                <div key={index} className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 group cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <item.icon className={`w-4 h-4 ${item.color}`} />
                      <span className="text-xs text-gray-300">{item.label}</span>
                    </div>
                    <span className={`text-sm font-bold ${item.color}`}>{item.value}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`text-xs ${item.trendUp ? 'text-green-400' : 'text-red-400'}`}>
                      {item.trend}
                    </span>
                    <TrendingUp className={`w-3 h-3 ${item.trendUp ? 'text-green-400' : 'text-red-400'} ${!item.trendUp ? 'rotate-180' : ''}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Menú principal */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              {!isCollapsed && 'Formatos'}
            </h3>
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <div
                    onClick={() => handleItemClick(item.id)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all duration-300 group cursor-pointer ${
                      activeSection === item.id
                        ? `bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 border border-indigo-500/30 shadow-lg shadow-indigo-500/25`
                        : 'text-gray-300 hover:bg-white/10 hover:text-white hover:scale-105'
                    }`}
                  >
                    <div className={`p-2 rounded-lg transition-all duration-200 ${
                      activeSection === item.id 
                        ? 'bg-indigo-500/30' 
                        : `${item.bgColor} ${item.borderColor} border group-hover:bg-white/10`
                    }`}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    
                    {!isCollapsed && (
                      <>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium">{item.label}</div>
                          <div className="text-xs text-gray-500 group-hover:text-gray-400 truncate">
                            {item.description}
                          </div>
                        </div>
                        
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                          activeSection === item.id
                            ? 'bg-indigo-500/40 text-indigo-200'
                            : 'bg-white/10 text-gray-400 group-hover:bg-white/20'
                        }`}>
                          {item.count}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Submenú expandible para archivos recientes */}
                  {activeSection === item.id && expandedItems.has(item.id) && !isCollapsed && (
                    <div className="ml-8 mt-2 space-y-1 animate-slide-in">
                      {recentFiles.filter(file => file.type === item.id || (item.id === 'downloads' && file.type !== 'history')).map((file, index) => (
                        <div key={index} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 cursor-pointer group">
                          {getFileIcon(file.type)}
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-gray-300 group-hover:text-white truncate">
                              {file.name}
                            </div>
                            <div className="text-xs text-gray-500 group-hover:text-gray-400">
                              {file.date} • {file.size}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Ayuda y soporte */}
          {!isCollapsed && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                Soporte
              </h3>
              <ul className="space-y-1">
                {helpItems.map((item, index) => (
                  <li key={index}>
                    <a
                      href={item.href}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-200 group hover:scale-105"
                    >
                      <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 relative">
                        <item.icon className="w-4 h-4" />
                        {item.badge && (
                          <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs bg-green-500 text-white rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{item.label}</div>
                        <div className="text-xs text-gray-500 group-hover:text-gray-400 truncate">
                          {item.description}
                        </div>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </nav>

        {/* Footer del sidebar */}
        <div className="p-4 border-t border-white/10 bg-white/5">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-indigo-500/25">
              <FileText className="w-6 h-6 text-white" />
            </div>
            {!isCollapsed && (
              <>
                <p className="text-sm font-medium text-white mb-1">OCR System Pro</p>
                <p className="text-xs text-gray-400">
                  v1.0.0 • Con tecnología IA
                </p>
              </>
            )}
          </div>
        </div>

        {/* Botón para colapsar/expandir sidebar */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-slate-800 border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-slate-700 transition-all duration-200 hover:scale-110"
        >
          <ChevronRight className={`w-3 h-3 transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
