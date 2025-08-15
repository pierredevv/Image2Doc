@echo off
chcp 65001 > nul
echo 🚀 Iniciando Image2Doc - Backend y Frontend
echo ===============================================
echo.

:: Verificar si Python está instalado
python --version > nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Python no está instalado o no está en el PATH
    echo    Instala Python desde https://python.org
    pause
    exit /b 1
)

:: Verificar si Node.js está instalado
node --version > nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Node.js no está instalado o no está en el PATH
    echo    Instala Node.js desde https://nodejs.org
    pause
    exit /b 1
)

:: Verificar si npm está instalado
npm --version > nul 2>&1
if errorlevel 1 (
    echo ❌ Error: npm no está instalado o no está en el PATH
    echo    Instala npm junto con Node.js
    pause
    exit /b 1
)

echo ✅ Dependencias verificadas correctamente
echo.

:: Verificar si existe el entorno virtual
if not exist ".venv" (
    echo ⚠️  No se encontró entorno virtual. Creando uno nuevo...
    python -m venv .venv
    if errorlevel 1 (
        echo ❌ Error creando entorno virtual
        pause
        exit /b 1
    )
    echo ✅ Entorno virtual creado
)

:: Activar entorno virtual
echo 🔧 Activando entorno virtual...
call .venv\Scripts\activate.bat
if errorlevel 1 (
    echo ❌ Error activando entorno virtual
    pause
    exit /b 1
)

:: Instalar dependencias del backend si no existen
if not exist "backend\venv" (
    echo 📦 Instalando dependencias del backend...
    cd backend
    pip install -r ..\requirements.txt
    if errorlevel 1 (
        echo ❌ Error instalando dependencias del backend
        pause
        exit /b 1
    )
    cd ..
    echo ✅ Dependencias del backend instaladas
)

:: Instalar dependencias del frontend si no existen
if not exist "frontend\node_modules" (
    echo 📦 Instalando dependencias del frontend...
    cd frontend
    npm install
    if errorlevel 1 (
        echo ❌ Error instalando dependencias del frontend
        pause
        exit /b 1
    )
    cd ..
    echo ✅ Dependencias del frontend instaladas
)

echo.
echo 🚀 Iniciando Backend en segundo plano...
start "Backend Server" cmd /k "cd backend && python run_backend.py"

echo ⏳ Esperando que el backend se inicie...
timeout /t 8 /nobreak > nul

echo 🌐 Iniciando Frontend...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo ✅ Servidores iniciados:
echo 📍 Backend:  http://127.0.0.1:8000
echo 📍 Frontend: http://localhost:3000
echo 📍 API Docs: http://127.0.0.1:8000/docs
echo.
echo 🎯 Abre tu navegador en: http://localhost:3000
echo 🔄 Para detener los servidores, cierra las ventanas de comando
echo.
echo 💡 Para probar la conexión, ejecuta: python test_connection.py
echo.
pause
