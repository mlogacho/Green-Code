#!/bin/bash
# =============================================================
# deploy.sh - Script de despliegue KYC Seguros Latina
# Uso: bash deploy.sh
# Requisito: ejecutar desde tu Mac en la carpeta del proyecto
# =============================================================

set -e

# --- Configuración ---
PEM_KEY="/Users/marcologacho/Documents/Green-Code/bot.pem"
SERVER_IP="3.135.214.120"
SERVER_USER="admin"
REMOTE_DIR="/home/admin/kyc-seguros-latina"
REPO_LOCAL="$(cd "$(dirname "$0")" && pwd)"

echo ""
echo "======================================================"
echo "  Deploy KYC - Seguros Latina"
echo "  Servidor: ${SERVER_USER}@${SERVER_IP}"
echo "======================================================"
echo ""

# --- Verificar que existe el PEM ---
if [ ! -f "$PEM_KEY" ]; then
  echo "[ERROR] No se encontró el archivo PEM: $PEM_KEY"
  exit 1
fi
chmod 400 "$PEM_KEY"

# --- Función para ejecutar comandos remotos ---
remote() {
  ssh -i "$PEM_KEY" -o StrictHostKeyChecking=no "${SERVER_USER}@${SERVER_IP}" "$@"
}

echo "[1/7] Verificando conexión al servidor..."
remote "echo 'Conexión OK'"

# -------------------------------------------------------
# [2] Instalar dependencias en el servidor
# -------------------------------------------------------
echo "[2/7] Instalando dependencias del sistema..."
remote "bash -s" << 'ENDSSH'
set -e

# Node.js 20 LTS
if ! command -v node &>/dev/null; then
  echo "  Instalando Node.js 20..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
else
  echo "  Node.js ya instalado: $(node -v)"
fi

# PM2 (process manager)
if ! command -v pm2 &>/dev/null; then
  echo "  Instalando PM2..."
  sudo npm install -g pm2
else
  echo "  PM2 ya instalado"
fi

# PostgreSQL 15
if ! command -v psql &>/dev/null; then
  echo "  Instalando PostgreSQL..."
  sudo apt-get install -y postgresql postgresql-contrib
  sudo systemctl enable postgresql
  sudo systemctl start postgresql
else
  echo "  PostgreSQL ya instalado"
fi

# Nginx
if ! command -v nginx &>/dev/null; then
  echo "  Instalando Nginx..."
  sudo apt-get install -y nginx
  sudo systemctl enable nginx
  sudo systemctl start nginx
else
  echo "  Nginx ya instalado"
fi

echo "  Dependencias OK"
ENDSSH

# -------------------------------------------------------
# [3] Configurar base de datos
# -------------------------------------------------------
echo "[3/7] Configurando base de datos PostgreSQL..."
remote "bash -s" << 'ENDSSH'
set -e

# Crear usuario y base de datos si no existen
sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname='kyc_user'" | grep -q 1 || \
  sudo -u postgres psql -c "CREATE USER kyc_user WITH PASSWORD 'kyc_password_prod';"

sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='kyc_db'" | grep -q 1 || \
  sudo -u postgres psql -c "CREATE DATABASE kyc_db OWNER kyc_user;"

sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE kyc_db TO kyc_user;"
echo "  Base de datos OK"
ENDSSH

# -------------------------------------------------------
# [4] Sincronizar código al servidor
# -------------------------------------------------------
echo "[4/7] Sincronizando código al servidor..."

# Crear directorio remoto
remote "mkdir -p ${REMOTE_DIR}"

# Sincronizar excluyendo node_modules, dist, .env, uploads
rsync -avz --progress \
  --exclude 'node_modules' \
  --exclude 'frontend/dist' \
  --exclude 'backend/dist' \
  --exclude '.env' \
  --exclude 'uploads' \
  --exclude '.git' \
  --exclude 'deploy.sh' \
  -e "ssh -i ${PEM_KEY} -o StrictHostKeyChecking=no" \
  "${REPO_LOCAL}/" \
  "${SERVER_USER}@${SERVER_IP}:${REMOTE_DIR}/"

echo "  Código sincronizado"

# -------------------------------------------------------
# [5] Configurar variables de entorno (.env)
# -------------------------------------------------------
echo "[5/7] Configurando variables de entorno..."

# Verificar si ya existe .env en el servidor para no sobreescribir
ENV_EXISTS=$(remote "[ -f ${REMOTE_DIR}/backend/.env ] && echo 'yes' || echo 'no'")

if [ "$ENV_EXISTS" = "no" ]; then
  echo "  Creando .env inicial en el servidor..."
  remote "bash -s" << ENDSSH
cat > ${REMOTE_DIR}/backend/.env << 'EOF'
PORT=3001
NODE_ENV=production

# Base de datos
DATABASE_URL=postgresql://kyc_user:kyc_password_prod@localhost:5432/kyc_db

# Registro Civil API (mock v1 - reemplazar con API real)
REGISTRO_CIVIL_API_URL=https://api.registrocivil.gob.ec
REGISTRO_CIVIL_API_KEY=REEMPLAZAR_CON_KEY_REAL

# OpenAI para validación de documentos
OPENAI_API_KEY=REEMPLAZAR_CON_TU_OPENAI_KEY

# JWT
JWT_SECRET=REEMPLAZAR_CON_SECRET_SEGURO_EN_PRODUCCION

# Almacenamiento
STORAGE_PATH=/home/admin/kyc-uploads

# ERP (mock v1 - reemplazar cuando tengas la API)
ERP_API_URL=https://erp.seguroslatina.com
ERP_API_KEY=REEMPLAZAR_CON_ERP_KEY
EOF
ENDSSH
  echo ""
  echo "  ⚠️  IMPORTANTE: Edita el archivo .env en el servidor:"
  echo "  ssh -i $PEM_KEY ${SERVER_USER}@${SERVER_IP}"
  echo "  nano ${REMOTE_DIR}/backend/.env"
  echo ""
else
  echo "  .env ya existe, no se sobreescribe"
fi

# -------------------------------------------------------
# [6] Build e instalación en el servidor
# -------------------------------------------------------
echo "[6/7] Instalando dependencias y construyendo..."
remote "bash -s" << ENDSSH
set -e
cd ${REMOTE_DIR}

# Directorio de uploads
mkdir -p /home/admin/kyc-uploads
chmod 755 /home/admin/kyc-uploads

# Instalar dependencias raíz
echo "  Instalando dependencias raíz..."
npm install --legacy-peer-deps

# Backend
echo "  Construyendo backend..."
cd ${REMOTE_DIR}/backend
npm install --legacy-peer-deps
npm run build

# Frontend
echo "  Construyendo frontend..."
cd ${REMOTE_DIR}/frontend

# Crear .env del frontend apuntando al backend
cat > .env << 'EOF'
VITE_API_URL=http://${SERVER_IP}:3001
EOF

npm install --legacy-peer-deps
npm run build

# Ejecutar migraciones de base de datos
echo "  Ejecutando migraciones..."
cd ${REMOTE_DIR}
PGPASSWORD=kyc_password_prod psql -h localhost -U kyc_user -d kyc_db -f db/migrations/001_initial.sql || echo "  Migraciones ya aplicadas"

echo "  Build completado"
ENDSSH

# Frontend .env con IP correcta
remote "cat > ${REMOTE_DIR}/frontend/.env << EOF
VITE_API_URL=http://${SERVER_IP}:3001
EOF"
remote "cd ${REMOTE_DIR}/frontend && npm run build"

# -------------------------------------------------------
# [7] Configurar Nginx y PM2
# -------------------------------------------------------
echo "[7/7] Configurando Nginx y PM2..."
remote "bash -s" << ENDSSH
set -e

# Configurar Nginx
sudo tee /etc/nginx/sites-available/kyc-seguros-latina << 'EOF'
server {
    listen 8050;
    server_name _;

    # Frontend React
    location / {
        root /home/admin/kyc-seguros-latina/frontend/dist;
        index index.html;
        try_files \$uri \$uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_cache_bypass \$http_upgrade;
        client_max_body_size 20M;
    }

    # Health check
    location /health {
        proxy_pass http://localhost:3001/health;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/kyc-seguros-latina /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

# Crear ecosystem PM2
cat > /home/admin/kyc-seguros-latina/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'kyc-backend',
    script: './backend/dist/index.js',
    cwd: '/home/admin/kyc-seguros-latina',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '512M',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
}
EOF

# Detener instancia anterior si existe
pm2 delete kyc-backend 2>/dev/null || true

# Iniciar con PM2
cd /home/admin/kyc-seguros-latina
pm2 start ecosystem.config.js
pm2 save
pm2 startup | grep "sudo" | bash || true

echo "  Servicios iniciados"
ENDSSH

# -------------------------------------------------------
# Verificación final
# -------------------------------------------------------
echo ""
echo "======================================================"
echo "  Verificando despliegue..."
echo "======================================================"
sleep 3

HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://${SERVER_IP}:8050/health" 2>/dev/null || echo "000")

if [ "$HTTP_STATUS" = "200" ]; then
  echo ""
  echo "  ✅ Deploy exitoso"
  echo ""
  echo "  Acceso al sistema:"
  echo "  → Aplicación KYC:  http://${SERVER_IP}:8050"
  echo "  → API Backend:     http://${SERVER_IP}:8050/api"
  echo "  → Health check:    http://${SERVER_IP}:8050/health"
  echo ""
  echo "  ⚠️  Pendiente configurar en backend/.env:"
  echo "     - OPENAI_API_KEY"
  echo "     - JWT_SECRET"
  echo "     - REGISTRO_CIVIL_API_KEY (cuando tengas la real)"
  echo "     - ERP_API_KEY (cuando tengas el endpoint)"
  echo ""
  echo "  Para editar .env en el servidor:"
  echo "  ssh -i $PEM_KEY ${SERVER_USER}@${SERVER_IP}"
  echo "  nano ${REMOTE_DIR}/backend/.env"
  echo "  pm2 restart kyc-backend"
else
  echo ""
  echo "  ⚠️  El servidor respondió HTTP $HTTP_STATUS en puerto 8050"
  echo "  Verifica que el puerto 8050 esté abierto en el Security Group de AWS"
  echo "  Verifica los logs con:"
  echo "  ssh -i $PEM_KEY ${SERVER_USER}@${SERVER_IP} 'pm2 logs kyc-backend --lines 50'"
fi

echo ""
echo "======================================================"
