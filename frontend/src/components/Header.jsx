// src/components/Header.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Eye, Settings, Moon, Sun, Menu, X, Bell, Search, User, ChevronDown, LogOut, UserCircle, Cog, HelpCircle } from 'lucide-react';
import './Header.css';

const Header = ({ isDarkMode, toggleTheme, toggleSidebar, isSidebarOpen }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  
  const searchRef = useRef(null);
  const notificationRef = useRef(null);
  const userMenuRef = useRef(null);

  // Detectar scroll para cambiar el header
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 20);
      
      // Agregar clase CSS para efectos adicionales
      const header = document.querySelector('.header');
      if (header) {
        if (scrollTop > 20) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cerrar menús al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Atajo de teclado para búsqueda
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        setIsSearchExpanded(true);
        setTimeout(() => {
          const searchInput = document.querySelector('.search-input');
          if (searchInput) searchInput.focus();
        }, 100);
      }
      if (event.key === 'Escape') {
        setIsSearchExpanded(false);
        setShowNotifications(false);
        setShowUserMenu(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Buscando:', searchQuery);
      setSearchQuery('');
      setIsSearchExpanded(false);
    }
  };

  const toggleSearch = () => {
    setIsSearchExpanded(!isSearchExpanded);
    if (!isSearchExpanded) {
      setTimeout(() => {
        const searchInput = document.querySelector('.search-input');
        if (searchInput) searchInput.focus();
      }, 100);
    }
  };

  return (
    <header className={`header fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-black/30 border-b border-white/10' 
        : 'bg-slate-900/90 backdrop-blur-lg border-b border-white/5'
    }`}>
      <div className="header-container">
        {/* Logo y título - Lado izquierdo */}
        <div className="header-left">
          <button
            onClick={toggleSidebar}
            className="mobile-menu-btn"
            aria-label="Alternar menú lateral"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <div className="logo-section">
            <div className="logo-icon">
              <Eye className="w-5 h-5 text-white" />
            </div>
            
            <div className="logo-text">
              <h1 className="logo-title">OCR System Pro</h1>
              <p className="logo-version">v1.0.0</p>
            </div>
          </div>
        </div>

        {/* Campo de búsqueda - Centro */}
        <div className="header-center" ref={searchRef}>
          <div className="search-container">
            {isSearchExpanded ? (
              <form onSubmit={handleSearch} className="search-form">
                <div className="search-input-wrapper">
                  <Search className="search-icon" />
                  <input
                    type="text"
                    placeholder="Buscar documentos, conversiones..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                  <button
                    type="button"
                    onClick={toggleSearch}
                    className="search-close-btn"
                    aria-label="Cerrar búsqueda"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={toggleSearch}
                className="search-trigger"
                aria-label="Abrir búsqueda"
              >
                <Search className="w-4 h-4" />
                <span className="search-placeholder">Buscar...</span>
                <kbd className="search-shortcut">Ctrl+K</kbd>
              </button>
            )}
          </div>
        </div>

        {/* Acciones del header - Lado derecho */}
        <div className="header-right">
          {/* Notificaciones */}
          <div className="header-action-item" ref={notificationRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="action-btn notification-btn"
              aria-label="Notificaciones"
            >
              <Bell className="w-5 h-5" />
              <span className="notification-badge"></span>
            </button>
            
            {/* Dropdown de notificaciones */}
            {showNotifications && (
              <div className="dropdown-menu notification-dropdown">
                <div className="dropdown-header">
                  <h3 className="dropdown-title">Notificaciones</h3>
                  <span className="dropdown-subtitle">3 nuevas</span>
                </div>
                <div className="dropdown-content">
                  <div className="notification-item">
                    <div className="notification-icon success">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="notification-content">
                      <p className="notification-text">Conversión completada: imagen.docx</p>
                      <p className="notification-time">Hace 2 minutos</p>
                    </div>
                  </div>
                  <div className="notification-item">
                    <div className="notification-icon info">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                    <div className="notification-content">
                      <p className="notification-text">Nuevo formato disponible: PDF</p>
                      <p className="notification-time">Hace 1 hora</p>
                    </div>
                  </div>
                  <div className="notification-item">
                    <div className="notification-icon warning">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    </div>
                    <div className="notification-content">
                      <p className="notification-text">Actualización del sistema completada</p>
                      <p className="notification-time">Hace 3 horas</p>
                    </div>
                  </div>
                </div>
                <div className="dropdown-footer">
                  <button className="dropdown-action-btn">
                    Ver todas las notificaciones
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Configuración */}
          <div className="header-action-item">
            <button 
              className="action-btn"
              aria-label="Configuración"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
          
          {/* Cambio de tema */}
          <div className="header-action-item">
            <button 
              onClick={toggleTheme}
              className="action-btn"
              aria-label={`Cambiar a modo ${isDarkMode ? 'claro' : 'oscuro'}`}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>

          {/* Menú de usuario */}
          <div className="header-action-item" ref={userMenuRef}>
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="action-btn user-btn"
              aria-label="Menú de usuario"
            >
              <div className="user-avatar">
                <User className="w-4 h-4 text-white" />
              </div>
              <ChevronDown className={`user-chevron ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Dropdown del usuario */}
            {showUserMenu && (
              <div className="dropdown-menu user-dropdown">
                <div className="dropdown-header">
                  <div className="user-info">
                    <div className="user-avatar-large">
                      <UserCircle className="w-8 h-8 text-indigo-500" />
                    </div>
                    <div className="user-details">
                      <p className="user-name">Usuario OCR</p>
                      <p className="user-email">usuario@ocrsystem.com</p>
                    </div>
                  </div>
                </div>
                <div className="dropdown-content">
                  <a href="#" className="dropdown-item">
                    <UserCircle className="w-4 h-4" />
                    <span>Perfil</span>
                  </a>
                  <a href="#" className="dropdown-item">
                    <Cog className="w-4 h-4" />
                    <span>Configuración</span>
                  </a>
                  <a href="#" className="dropdown-item">
                    <HelpCircle className="w-4 h-4" />
                    <span>Ayuda</span>
                  </a>
                </div>
                <div className="dropdown-footer">
                  <button className="dropdown-action-btn logout-btn">
                    <LogOut className="w-4 h-4" />
                    <span>Cerrar sesión</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;