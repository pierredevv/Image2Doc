/**
 * Sistema de Gestión de Eventos para OCR System Pro
 * Maneja todos los eventos de la aplicación de forma centralizada
 */

class EventManager {
  constructor() {
    this.events = new Map();
    this.globalListeners = new Map();
    this.isInitialized = false;
  }

  /**
   * Inicializa el sistema de eventos
   */
  init() {
    if (this.isInitialized) return;
    
    this.setupGlobalListeners();
    this.isInitialized = true;
    console.log('🚀 EventManager inicializado');
  }

  /**
   * Configura listeners globales
   */
  setupGlobalListeners() {
    // Listener para clicks fuera de elementos
    document.addEventListener('click', (e) => {
      this.handleGlobalClick(e);
    });

    // Listener para teclas
    document.addEventListener('keydown', (e) => {
      this.handleGlobalKeydown(e);
    });

    // Listener para scroll
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.emit('scroll:end');
      }, 150);
    });

    // Listener para resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.emit('resize:end');
      }, 250);
    });

    // Listener para visibilidad de página
    document.addEventListener('visibilitychange', () => {
      this.emit('visibility:change', {
        isVisible: !document.hidden,
        timestamp: Date.now()
      });
    });
  }

  /**
   * Registra un evento
   */
  on(eventName, callback, options = {}) {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }
    
    const eventData = {
      callback,
      options,
      id: this.generateId(),
      timestamp: Date.now()
    };
    
    this.events.get(eventName).push(eventData);
    
    if (options.once) {
      this.once(eventName, callback, options);
    }
    
    return eventData.id;
  }

  /**
   * Registra un evento que se ejecuta una sola vez
   */
  once(eventName, callback, options = {}) {
    const wrappedCallback = (...args) => {
      callback(...args);
      this.off(eventName, wrappedCallback);
    };
    
    return this.on(eventName, wrappedCallback, options);
  }

  /**
   * Emite un evento
   */
  emit(eventName, data = null) {
    if (!this.events.has(eventName)) return;
    
    const eventListeners = this.events.get(eventName);
    const results = [];
    
    eventListeners.forEach(({ callback, options }) => {
      try {
        if (options.async) {
          Promise.resolve(callback(data)).then(result => {
            results.push(result);
          });
        } else {
          const result = callback(data);
          results.push(result);
        }
      } catch (error) {
        console.error(`Error en evento ${eventName}:`, error);
        this.emit('error', { eventName, error, data });
      }
    });
    
    return results;
  }

  /**
   * Remueve un evento
   */
  off(eventName, callbackOrId) {
    if (!this.events.has(eventName)) return;
    
    const eventListeners = this.events.get(eventName);
    
    if (typeof callbackOrId === 'string') {
      // Remover por ID
      const index = eventListeners.findIndex(listener => listener.id === callbackOrId);
      if (index !== -1) {
        eventListeners.splice(index, 1);
      }
    } else {
      // Remover por callback
      const index = eventListeners.findIndex(listener => listener.callback === callbackOrId);
      if (index !== -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  /**
   * Remueve todos los eventos de un tipo
   */
  offAll(eventName) {
    this.events.delete(eventName);
  }

  /**
   * Limpia todos los eventos
   */
  clear() {
    this.events.clear();
    this.globalListeners.clear();
  }

  /**
   * Maneja clicks globales
   */
  handleGlobalClick(e) {
    // Emitir evento de click global
    this.emit('click:global', {
      target: e.target,
      x: e.clientX,
      y: e.clientY,
      timestamp: Date.now()
    });
  }

  /**
   * Maneja teclas globales
   */
  handleGlobalKeydown(e) {
    // Atajos de teclado globales
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'k':
          e.preventDefault();
          this.emit('shortcut:search');
          break;
        case 'b':
          e.preventDefault();
          this.emit('shortcut:sidebar');
          break;
        case 'd':
          e.preventDefault();
          this.emit('shortcut:theme');
          break;
      }
    }

    // Emitir evento de tecla global
    this.emit('keydown:global', {
      key: e.key,
      ctrlKey: e.ctrlKey,
      metaKey: e.metaKey,
      shiftKey: e.shiftKey,
      altKey: e.altKey,
      timestamp: Date.now()
    });
  }

  /**
   * Genera un ID único
   */
  generateId() {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Obtiene estadísticas de eventos
   */
  getStats() {
    const stats = {};
    for (const [eventName, listeners] of this.events) {
      stats[eventName] = listeners.length;
    }
    return stats;
  }
}

// Instancia global
const eventManager = new EventManager();

// Eventos predefinidos
export const EVENTS = {
  // Eventos de UI
  UI: {
    SIDEBAR_TOGGLE: 'ui:sidebar:toggle',
    THEME_CHANGE: 'ui:theme:change',
    MODAL_OPEN: 'ui:modal:open',
    MODAL_CLOSE: 'ui:modal:close',
    NOTIFICATION_SHOW: 'ui:notification:show',
    NOTIFICATION_HIDE: 'ui:notification:hide'
  },
  
  // Eventos de archivos
  FILE: {
    UPLOAD_START: 'file:upload:start',
    UPLOAD_PROGRESS: 'file:upload:progress',
    UPLOAD_COMPLETE: 'file:upload:complete',
    UPLOAD_ERROR: 'file:upload:error',
    CONVERSION_START: 'file:conversion:start',
    CONVERSION_PROGRESS: 'file:conversion:progress',
    CONVERSION_COMPLETE: 'file:conversion:complete',
    CONVERSION_ERROR: 'file:conversion:error',
    DOWNLOAD_START: 'file:download:start',
    DOWNLOAD_COMPLETE: 'file:download:complete'
  },
  
  // Eventos de navegación
  NAVIGATION: {
    SECTION_CHANGE: 'navigation:section:change',
    PAGE_CHANGE: 'navigation:page:change',
    SEARCH: 'navigation:search'
  },
  
  // Eventos de sistema
  SYSTEM: {
    ERROR: 'system:error',
    WARNING: 'system:warning',
    INFO: 'system:info',
    PERFORMANCE: 'system:performance'
  }
};

export default eventManager;
