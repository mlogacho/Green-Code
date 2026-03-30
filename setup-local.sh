#!/bin/bash
# ============================================================
# setup-local.sh - Configuración inicial para desarrollo local
# Ejecutar UNA sola vez: bash setup-local.sh
# ============================================================

echo ""
echo "======================================================"
echo "  Setup local - KYC Seguros Latina"
echo "======================================================"

# Backend .env
if [ ! -f "backend/.env" ]; then
  cat > backend/.env << 'EOF'
PORT=3001
NODE_ENV=development

DATABASE_URL=postgresql://kyc_user:kyc_password@localhost:5432/kyc_db

REGISTRO_CIVIL_API_URL=https://api.registrocivil.gob.ec
REGISTRO_CIVIL_API_KEY=PENDIENTE

OPENAI_API_KEY=REEMPLAZAR_CON_TU_KEY

JWT_SECRET=kyc_dev_secret_local_2026

STORAGE_PATH=./uploads

ERP_API_URL=https://erp.seguroslatina.com
ERP_API_KEY=PENDIENTE
EOF
  echo "✅ backend/.env creado"
else
  echo "⏭  backend/.env ya existe"
fi

# Frontend .env
if [ ! -f "frontend/.env" ]; then
  cat > frontend/.env << 'EOF'
VITE_API_URL=http://localhost:3001
EOF
  echo "✅ frontend/.env creado"
else
  echo "⏭  frontend/.env ya existe"
fi

# Instalar dependencias
echo ""
echo "📦 Instalando dependencias backend..."
cd backend && npm install --legacy-peer-deps --silent && cd ..

echo "📦 Instalando dependencias frontend..."
cd frontend && npm install --legacy-peer-deps --silent && cd ..

echo ""
echo "======================================================"
echo "  ✅ Setup completo"
echo ""
echo "  Para iniciar el proyecto en VS Code:"
echo "  → Cmd+Shift+P → 'Tasks: Run Task' → '🚀 Iniciar KYC Completo'"
echo ""
echo "  O manualmente:"
echo "  Terminal 1: cd backend && npm run dev"
echo "  Terminal 2: cd frontend && npm run dev"
echo ""
echo "  Frontend: http://localhost:5173"
echo "  Backend:  http://localhost:3001"
echo "  Health:   http://localhost:3001/health"
echo ""
echo "  Cédula demo: 1715790513"
echo "======================================================"
