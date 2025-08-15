@echo off
echo 🚀 Iniciando Image2Doc - Backend y Frontend
echo ===============================================

:: Activar entorno virtual
call .venv\Scripts\activate.bat

echo 🔧 Iniciando Backend en segundo plano...
start "Backend Server" cmd /k "cd backend && python run_backend.py"

echo ⏳ Esperando que el backend se inicie...
timeout /t 5 /nobreak > nul

echo 🌐 Iniciando Frontend...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo ✅ Servidores iniciados:
echo 📍 Backend:  http://127.0.0.1:8000
echo 📍 Frontend: http://localhost:3000
echo 📍 API Docs: http://127.0.0.1:8000/docs
echo.
echo 🎯 Abre tu navegador en: http://localhost:3000
echo 🔄 Para detener los servidores, cierra las ventanas de comando
pause
