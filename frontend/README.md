# 🚀 Sistema OCR Avanzado - Frontend

Un frontend moderno y elegante para el sistema de reconocimiento óptico de caracteres (OCR) que convierte imágenes a documentos digitales.

## ✨ Características Principales

### 🎨 Sistema de Diseño Moderno
- **Paleta de colores profesional** con gradientes y efectos glassmorphism
- **Tipografía optimizada** usando Inter, Poppins y JetBrains Mono
- **Tema oscuro/claro** con transiciones suaves
- **Diseño responsivo** para todos los dispositivos
- **Animaciones fluidas** y efectos de hover

### 🔧 Componentes Reutilizables
- **Header** con navegación y cambio de tema
- **Sidebar** con menú de navegación
- **UploadArea** con drag & drop y validación
- **FormatSelector** para elegir formato de salida
- **ProgressBar** con estados y animaciones
- **FeatureCard** para mostrar características
- **Button** con múltiples variantes
- **TargetCursor** personalizado

### 🌟 Funcionalidades Avanzadas
- **Drag & Drop** para subir archivos
- **Validación de archivos** (tipo y tamaño)
- **Procesamiento en tiempo real** con barras de progreso
- **Soporte multiidioma** preparado
- **Accesibilidad completa** (ARIA, navegación por teclado)
- **PWA ready** con manifest y service workers

## 🛠️ Tecnologías Utilizadas

- **React 18** - Biblioteca de interfaz de usuario
- **Vite** - Herramienta de construcción rápida
- **Tailwind CSS** - Framework CSS utilitario
- **Lucide React** - Iconos modernos y consistentes
- **Google Fonts** - Tipografías web optimizadas

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/          # Componentes React
│   │   ├── Header.jsx      # Encabezado principal
│   │   ├── Sidebar.jsx     # Barra lateral
│   │   ├── UploadArea.jsx  # Área de carga
│   │   ├── FormatSelector.jsx # Selector de formato
│   │   ├── ProgressBar.jsx # Barra de progreso
│   │   ├── FeatureCard.jsx # Tarjetas de características
│   │   ├── Button.jsx      # Botones reutilizables
│   │   ├── TargetCursor.jsx # Cursor personalizado
│   │   ├── ThemeProvider.jsx # Proveedor de tema
│   │   └── OCRSystem.jsx   # Componente principal
│   ├── styles/
│   │   └── design-system.css # Sistema de diseño CSS
│   ├── App.jsx             # Aplicación principal
│   ├── main.jsx            # Punto de entrada
│   └── index.css           # Estilos globales
├── public/                 # Archivos estáticos
├── index.html              # HTML principal
└── package.json            # Dependencias
```

## 🎯 Sistema de Diseño

### Colores
- **Primarios**: Indigo (#6366f1) y Púrpura (#8b5cf6)
- **Secundarios**: Verde (#10b981) y Azul (#3b82f6)
- **Fondos**: Negro profundo (#0f0f23) y Azul oscuro (#1a1a2e)
- **Texto**: Blanco (#ffffff) y Gris claro (#a1a1aa)

### Tipografía
- **Inter**: Fuente principal para texto
- **Poppins**: Títulos y encabezados
- **JetBrains Mono**: Código y monospace

### Espaciado
- Sistema de espaciado consistente (xs: 0.25rem a 3xl: 4rem)
- Grid responsivo con breakpoints estándar
- Márgenes y padding optimizados

### Efectos
- **Glassmorphism**: Fondos translúcidos con blur
- **Gradientes**: Transiciones suaves entre colores
- **Sombras**: Sistema de elevación consistente
- **Animaciones**: Transiciones y hover effects

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js 16+ 
- npm o yarn

### Instalación
```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/image2doc.git
cd image2doc/frontend

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Vista previa de producción
npm run preview
```

### Variables de Entorno
```bash
# Crear archivo .env
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=OCR System Pro
VITE_APP_VERSION=1.0.0
```

## 🎨 Personalización

### Cambiar Colores
Edita `src/styles/design-system.css`:
```css
:root {
  --color-primary-main: #tu-color;
  --color-primary-light: #tu-color-claro;
  --color-primary-dark: #tu-color-oscuro;
}
```

### Agregar Nuevos Componentes
1. Crea el componente en `src/components/`
2. Importa en `OCRSystem.jsx`
3. Usa las clases CSS del sistema de diseño

### Modificar Tema
Edita `src/components/ThemeProvider.jsx`:
```jsx
const [isDarkMode, setIsDarkMode] = useState(true);
// Cambia el valor por defecto
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Características Móviles
- Sidebar colapsable en móviles
- Touch-friendly interfaces
- Optimización para pantallas pequeñas

## ♿ Accesibilidad

### Características Implementadas
- **ARIA labels** en todos los componentes
- **Navegación por teclado** completa
- **Contraste alto** entre elementos
- **Screen reader support**
- **Focus management** mejorado

### Mejores Prácticas
- Uso de roles semánticos apropiados
- Textos alternativos para imágenes
- Estructura de encabezados lógica
- Estados de carga y error claros

## 🔧 Desarrollo

### Scripts Disponibles
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Construcción para producción
npm run preview      # Vista previa de producción
npm run lint         # Linting del código
npm run test         # Ejecutar tests
```

### Estructura de Commits
```
feat: nueva funcionalidad
fix: corrección de bug
docs: documentación
style: cambios de estilo
refactor: refactorización
test: tests
chore: tareas de mantenimiento
```

## 🧪 Testing

### Ejecutar Tests
```bash
# Tests unitarios
npm run test

# Tests con coverage
npm run test:coverage

# Tests en modo watch
npm run test:watch
```

### Estructura de Tests
```
tests/
├── components/      # Tests de componentes
├── utils/          # Tests de utilidades
└── integration/    # Tests de integración
```

## 📦 Build y Despliegue

### Construcción
```bash
# Desarrollo
npm run build:dev

# Producción
npm run build:prod

# Análisis del bundle
npm run build:analyze
```

### Despliegue
- **Netlify**: Drag & drop del build
- **Vercel**: Integración automática con Git
- **AWS S3**: Subida manual del build
- **Docker**: Containerización completa

## 🤝 Contribución

### Guía de Contribución
1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Estándares de Código
- **ESLint** para linting
- **Prettier** para formateo
- **Husky** para pre-commit hooks
- **Conventional Commits** para mensajes

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🙏 Agradecimientos

- **React Team** por el framework
- **Vite Team** por la herramienta de build
- **Tailwind CSS** por el framework CSS
- **Lucide** por los iconos
- **Google Fonts** por las tipografías

## 📞 Soporte

- **Issues**: [GitHub Issues](https://github.com/tu-usuario/image2doc/issues)
- **Discussions**: [GitHub Discussions](https://github.com/tu-usuario/image2doc/discussions)
- **Email**: soporte@image2doc.com

---

**Desarrollado con ❤️ por el equipo de Image2Doc**
