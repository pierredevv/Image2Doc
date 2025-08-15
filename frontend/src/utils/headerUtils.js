/**
 * Utilidades para el Header del OCR System Pro
 * Mejora la funcionalidad y experiencia de usuario
 */

import eventManager, { EVENTS } from './eventManager.js';

class HeaderUtils {
  constructor() {
    this.isInitialized = false;
    this.searchHistory = [];
    this.maxSearchHistory = 10;
  }

  /**
   * Inicializa las utilidades del header
   */
  init() {
    if (this.isInitialized) return;
    
    this.setupKeyboardShortcuts();
    this.loadSearchHistory();
    this.isInitialized = true;
    console.log('🔧 HeaderUtils inicializado');
  }

  /**
   * Configura atajos de teclado
   */
  setupKeyboardShortcuts() {
    // Atajo Ctrl+K para búsqueda
    eventManager.on('shortcut:search', () => {
      this.focusSearch();
    });

    // Atajo Ctrl+B para sidebar
    eventManager.on('shortcut:sidebar', () => {
      this.toggleSidebar();
    });

    // Atajo Ctrl+D para tema
    eventManager.on('shortcut:theme', () => {
      this.toggleTheme();
    });

    // Atajo Ctrl+L para limpiar búsqueda
    eventManager.on('shortcut:clear-search', () => {
      this.clearSearch();
    });
  }

  /**
   * Enfoca el campo de búsqueda
   */
  focusSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-button');
    
    if (searchInput) {
      searchInput.focus();
    } else if (searchButton) {
      // Si el campo no está expandido, expandirlo primero
      searchButton.click();
      setTimeout(() => {
        const expandedInput = document.querySelector('.search-input');
        if (expandedInput) {
          expandedInput.focus();
        }
      }, 100);
    }
  }

  /**
   * Alterna el sidebar
   */
  toggleSidebar() {
    eventManager.emit(EVENTS.UI.SIDEBAR_TOGGLE);
  }

  /**
   * Alterna el tema
   */
  toggleTheme() {
    eventManager.emit(EVENTS.UI.THEME_CHANGE);
  }

  /**
   * Limpia el campo de búsqueda
   */
  clearSearch() {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
      searchInput.value = '';
      searchInput.focus();
    }
  }

  /**
   * Agrega término a historial de búsqueda
   */
  addToSearchHistory(term) {
    if (!term || term.trim().length === 0) return;
    
    // Remover si ya existe
    this.searchHistory = this.searchHistory.filter(item => item !== term);
    
    // Agregar al inicio
    this.searchHistory.unshift(term);
    
    // Limitar tamaño
    if (this.searchHistory.length > this.maxSearchHistory) {
      this.searchHistory = this.searchHistory.slice(0, this.maxSearchHistory);
    }
    
    // Guardar en localStorage
    this.saveSearchHistory();
  }

  /**
   * Obtiene historial de búsqueda
   */
  getSearchHistory() {
    return [...this.searchHistory];
  }

  /**
   * Limpia historial de búsqueda
   */
  clearSearchHistory() {
    this.searchHistory = [];
    this.saveSearchHistory();
  }

  /**
   * Guarda historial en localStorage
   */
  saveSearchHistory() {
    try {
      localStorage.setItem('ocr_search_history', JSON.stringify(this.searchHistory));
    } catch (error) {
      console.warn('No se pudo guardar historial de búsqueda:', error);
    }
  }

  /**
   * Carga historial desde localStorage
   */
  loadSearchHistory() {
    try {
      const saved = localStorage.getItem('ocr_search_history');
      if (saved) {
        this.searchHistory = JSON.parse(saved);
      }
    } catch (error) {
      console.warn('No se pudo cargar historial de búsqueda:', error);
      this.searchHistory = [];
    }
  }

  /**
   * Sugiere términos de búsqueda basados en historial
   */
  getSearchSuggestions(query) {
    if (!query || query.length < 2) return [];
    
    const suggestions = this.searchHistory.filter(term => 
      term.toLowerCase().includes(query.toLowerCase())
    );
    
    // Agregar sugerencias comunes si no hay suficientes
    const commonSuggestions = [
      'documento',
      'imagen',
      'conversión',
      'OCR',
      'PDF',
      'Word',
      'Excel',
      'texto'
    ];
    
    const commonMatches = commonSuggestions.filter(term => 
      term.toLowerCase().includes(query.toLowerCase()) &&
      !suggestions.includes(term)
    );
    
    return [...suggestions, ...commonMatches].slice(0, 5);
  }

  /**
   * Maneja la búsqueda
   */
  handleSearch(query) {
    if (!query || query.trim().length === 0) return;
    
    // Agregar al historial
    this.addToSearchHistory(query.trim());
    
    // Emitir evento de búsqueda
    eventManager.emit(EVENTS.NAVIGATION.SEARCH, {
      query: query.trim(),
      timestamp: Date.now(),
      source: 'header'
    });
    
    // Aquí implementarías la lógica de búsqueda real
    console.log('🔍 Búsqueda:', query.trim());
  }

  /**
   * Obtiene estadísticas del header
   */
  getStats() {
    return {
      searchHistoryCount: this.searchHistory.length,
      isInitialized: this.isInitialized,
      shortcuts: {
        search: 'Ctrl+K',
        sidebar: 'Ctrl+B',
        theme: 'Ctrl+D',
        clearSearch: 'Ctrl+L'
      }
    };
  }

  /**
   * Resetea el header
   */
  reset() {
    this.searchHistory = [];
    this.saveSearchHistory();
    console.log('🔄 Header reseteado');
  }
}

// Instancia global
const headerUtils = new HeaderUtils();

export default headerUtils;
