#!/bin/bash
echo "Iniciando backend..."
cd backend
source venv/bin/activate
uvicorn app:app --reload --host 0.0.0.0 --port 8000
