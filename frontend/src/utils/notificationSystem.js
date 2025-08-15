/**
 * Sistema de Notificaciones para OCR System Pro
 * Maneja notificaciones toast, alertas y mensajes del sistema
 */

import eventManager, { EVENTS } from './eventManager.js';

class NotificationSystem {
  constructor() {
    this.notifications = [];
    this.maxNotifications = 5;
    this.defaultDuration = 5000;
    this.container = null;
    this.isInitialized = false;
  }

  /**
   * Inicializa el sistema de notificaciones
   */
  init() {
    if (this.isInitialized) return;
    
    this.createContainer();
    this.setupEventListeners();
    this.isInitialized = true;
    console.log('🔔 NotificationSystem inicializado');
  }

  /**
   * Crea el contenedor de notificaciones
   */
  createContainer() {
    this.container = document.createElement('div');
    this.container.id = 'notification-container';
    this.container.className = 'fixed top-20 right-4 z-50 space-y-3 max-w-sm';
    document.body.appendChild(this.container);
  }

  /**
   * Configura los listeners de eventos
   */
  setupEventListeners() {
    // Escuchar eventos del sistema
    eventManager.on(EVENTS.SYSTEM.ERROR, (data) => {
      this.show('error', data.message || 'Error del sistema', data.details);
    });

    eventManager.on(EVENTS.SYSTEM.WARNING, (data) => {
      this.show('warning', data.message || 'Advertencia', data.details);
    });

    eventManager.on(EVENTS.SYSTEM.INFO, (data) => {
      this.show('info', data.message || 'Información', data.details);
    });

    eventManager.on(EVENTS.FILE.CONVERSION_COMPLETE, (data) => {
      this.show('success', 'Conversión completada', `Archivo convertido a ${data.format}`);
    });

    eventManager.on(EVENTS.FILE.CONVERSION_ERROR, (data) => {
      this.show('error', 'Error en conversión', data.error || 'No se pudo convertir el archivo');
    });
  }

  /**
   * Muestra una notificación
   */
  show(type = 'info', title, message = '', options = {}) {
    const notification = {
      id: this.generateId(),
      type,
      title,
      message,
      timestamp: Date.now(),
      duration: options.duration || this.defaultDuration,
      persistent: options.persistent || false,
      actions: options.actions || []
    };

    // Agregar a la lista
    this.notifications.unshift(notification);
    
    // Limitar el número de notificaciones
    if (this.notifications.length > this.maxNotifications) {
      this.notifications = this.notifications.slice(0, this.maxNotifications);
    }

    // Crear y mostrar el elemento visual
    this.renderNotification(notification);

    // Auto-remover si no es persistente
    if (!notification.persistent && notification.duration > 0) {
      setTimeout(() => {
        this.remove(notification.id);
      }, notification.duration);
    }

    // Emitir evento
    eventManager.emit(EVENTS.UI.NOTIFICATION_SHOW, notification);

    return notification.id;
  }

  /**
   * Renderiza una notificación
   */
  renderNotification(notification) {
    const element = document.createElement('div');
    element.id = `notification-${notification.id}`;
    element.className = `notification-item transform transition-all duration-300 ${this.getTypeClasses(notification.type)}`;
    
    element.innerHTML = `
      <div class="flex items-start gap-3 p-4 rounded-xl border backdrop-blur-xl shadow-lg">
        <div class="flex-shrink-0">
          ${this.getTypeIcon(notification.type)}
        </div>
        
        <div class="flex-1 min-w-0">
          <h4 class="text-sm font-semibold mb-1">${notification.title}</h4>
          ${notification.message ? `<p class="text-xs opacity-80">${notification.message}</p>` : ''}
          
          ${notification.actions.length > 0 ? `
            <div class="flex gap-2 mt-3">
              ${notification.actions.map(action => `
                <button class="px-3 py-1 text-xs rounded-lg transition-colors duration-200 ${action.variant === 'danger' ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-white/10 text-white hover:bg-white/20'}" 
                        onclick="window.notificationSystem.handleAction('${notification.id}', '${action.id}')">
                  ${action.label}
                </button>
              `).join('')}
            </div>
          ` : ''}
        </div>
        
        <button class="flex-shrink-0 p-1 rounded-lg hover:bg-white/10 transition-colors duration-200" 
                onclick="window.notificationSystem.remove('${notification.id}')">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    `;

    // Agregar al contenedor
    this.container.appendChild(element);

    // Animación de entrada
    requestAnimationFrame(() => {
      element.classList.add('translate-x-0', 'opacity-100');
    });
  }

  /**
   * Obtiene las clases CSS según el tipo
   */
  getTypeClasses(type) {
    const baseClasses = 'translate-x-full opacity-0';
    
    switch (type) {
      case 'success':
        return `${baseClasses} bg-green-500/20 border-green-500/30 text-green-100`;
      case 'error':
        return `${baseClasses} bg-red-500/20 border-red-500/30 text-red-100`;
      case 'warning':
        return `${baseClasses} bg-yellow-500/20 border-yellow-500/30 text-yellow-100`;
      case 'info':
      default:
        return `${baseClasses} bg-blue-500/20 border-blue-500/30 text-blue-100`;
    }
  }

  /**
   * Obtiene el icono según el tipo
   */
  getTypeIcon(type) {
    const iconClasses = 'w-5 h-5';
    
    switch (type) {
      case 'success':
        return `<svg class="${iconClasses} text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>`;
      case 'error':
        return `<svg class="${iconClasses} text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>`;
      case 'warning':
        return `<svg class="${iconClasses} text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
        </svg>`;
      case 'info':
      default:
        return `<svg class="${iconClasses} text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>`;
    }
  }

  /**
   * Remueve una notificación
   */
  remove(id) {
    const element = document.getElementById(`notification-${id}`);
    if (!element) return;

    // Animación de salida
    element.classList.remove('translate-x-0', 'opacity-100');
    element.classList.add('translate-x-full', 'opacity-0');

    setTimeout(() => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    }, 300);

    // Remover de la lista
    this.notifications = this.notifications.filter(n => n.id !== id);

    // Emitir evento
    eventManager.emit(EVENTS.UI.NOTIFICATION_HIDE, { id });
  }

  /**
   * Maneja acciones de notificaciones
   */
  handleAction(notificationId, actionId) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (!notification) return;

    const action = notification.actions.find(a => a.id === actionId);
    if (action && action.onClick) {
      action.onClick();
    }

    // Remover la notificación después de la acción
    this.remove(notificationId);
  }

  /**
   * Limpia todas las notificaciones
   */
  clear() {
    this.notifications.forEach(notification => {
      this.remove(notification.id);
    });
  }

  /**
   * Genera un ID único
   */
  generateId() {
    return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Métodos de conveniencia
   */
  success(title, message, options = {}) {
    return this.show('success', title, message, options);
  }

  error(title, message, options = {}) {
    return this.show('error', title, message, options);
  }

  warning(title, message, options = {}) {
    return this.show('warning', title, message, options);
  }

  info(title, message, options = {}) {
    return this.show('info', title, message, options);
  }
}

// Instancia global
const notificationSystem = new NotificationSystem();

// Hacer disponible globalmente para acciones inline
window.notificationSystem = notificationSystem;

export default notificationSystem;
