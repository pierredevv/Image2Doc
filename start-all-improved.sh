#!/bin/bash

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Iniciando Image2Doc - Backend y Frontend${NC}"
echo "==============================================="
echo

# Función para mostrar errores
show_error() {
    echo -e "${RED}❌ Error: $1${NC}"
    echo "   $2"
    exit 1
}

# Verificar si Python está instalado
if ! command -v python3 &> /dev/null; then
    show_error "Python3 no está instalado" "Instala Python desde https://python.org"
fi

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    show_error "Node.js no está instalado" "Instala Node.js desde https://nodejs.org"
fi

# Verificar si npm está instalado
if ! command -v npm &> /dev/null; then
    show_error "npm no está instalado" "Instala npm junto con Node.js"
fi

echo -e "${GREEN}✅ Dependencias verificadas correctamente${NC}"
echo

# Verificar si existe el entorno virtual
if [ ! -d ".venv" ]; then
    echo -e "${YELLOW}⚠️  No se encontró entorno virtual. Creando uno nuevo...${NC}"
    python3 -m venv .venv
    if [ $? -ne 0 ]; then
        show_error "Error creando entorno virtual" "Verifica que python3-venv esté instalado"
    fi
    echo -e "${GREEN}✅ Entorno virtual creado${NC}"
fi

# Activar entorno virtual
echo -e "${BLUE}🔧 Activando entorno virtual...${NC}"
source .venv/bin/activate
if [ $? -ne 0 ]; then
    show_error "Error activando entorno virtual" "Verifica los permisos del directorio"
fi

# Instalar dependencias del backend si no existen
if [ ! -d "backend/venv" ]; then
    echo -e "${BLUE}📦 Instalando dependencias del backend...${NC}"
    cd backend
    pip install -r ../requirements.txt
    if [ $? -ne 0 ]; then
        show_error "Error instalando dependencias del backend" "Verifica la conexión a internet"
    fi
    cd ..
    echo -e "${GREEN}✅ Dependencias del backend instaladas${NC}"
fi

# Instalar dependencias del frontend si no existen
if [ ! -d "frontend/node_modules" ]; then
    echo -e "${BLUE}📦 Instalando dependencias del frontend...${NC}"
    cd frontend
    npm install
    if [ $? -ne 0 ]; then
        show_error "Error instalando dependencias del frontend" "Verifica la conexión a internet"
    fi
    cd ..
    echo -e "${GREEN}✅ Dependencias del frontend instaladas${NC}"
fi

echo
echo -e "${BLUE}🚀 Iniciando Backend en segundo plano...${NC}"
cd backend
nohup python run_backend.py > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

echo -e "${YELLOW}⏳ Esperando que el backend se inicie...${NC}"
sleep 8

# Verificar si el backend está funcionando
if ! curl -s http://127.0.0.1:8000/api/health > /dev/null; then
    echo -e "${RED}❌ El backend no responde. Revisa backend.log para más detalles${NC}"
    echo "PID del backend: $BACKEND_PID"
    exit 1
fi

echo -e "${BLUE}🌐 Iniciando Frontend...${NC}"
cd frontend
nohup npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

echo
echo -e "${GREEN}✅ Servidores iniciados:${NC}"
echo -e "${BLUE}📍 Backend:  http://127.0.0.1:8000${NC}"
echo -e "${BLUE}📍 Frontend: http://localhost:3000${NC}"
echo -e "${BLUE}📍 API Docs: http://127.0.0.1:8000/docs${NC}"
echo
echo -e "${GREEN}🎯 Abre tu navegador en: http://localhost:3000${NC}"
echo -e "${YELLOW}🔄 Para detener los servidores, ejecuta:${NC}"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo
echo -e "${BLUE}💡 Para probar la conexión, ejecuta: python test_connection.py${NC}"
echo
echo -e "${GREEN}📝 Logs disponibles en:${NC}"
echo "   Backend:  backend.log"
echo "   Frontend: frontend.log"
echo

# Función para limpiar al salir
cleanup() {
    echo -e "\n${YELLOW}🛑 Deteniendo servidores...${NC}"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    echo -e "${GREEN}✅ Servidores detenidos${NC}"
    exit 0
}

# Capturar señales para limpiar
trap cleanup SIGINT SIGTERM

echo -e "${BLUE}Presiona Ctrl+C para detener los servidores${NC}"
echo

# Mantener el script ejecutándose
while true; do
    sleep 1
done
