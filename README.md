# Módulo KYC - Seguros Latina

Sistema de verificación de identidad (Know Your Customer) para Seguros Latina.

## Tecnologías

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Base de datos**: PostgreSQL
- **Almacenamiento**: Sistema de archivos local
- **Validación de documentos**: OpenAI GPT-4o Vision
- **Autenticación**: JWT

## Estructura del Proyecto

```
/
├── frontend/          # Aplicación React
│   └── src/
│       ├── components/    # Componentes del wizard KYC
│       ├── pages/         # Página principal KycPage
│       ├── services/      # Cliente HTTP (api.ts)
│       ├── types/         # Tipos TypeScript
│       └── utils/         # Utilidades (documentos)
├── backend/           # API Express
│   └── src/
│       ├── adapters/      # Registro Civil y ERP (patrón Adapter)
│       ├── controllers/   # Controladores de rutas
│       ├── db/            # Conexión PostgreSQL
│       ├── middleware/    # Auth JWT y manejo de errores
│       ├── routes/        # Definición de rutas
│       ├── services/      # Lógica de negocio
│       ├── types/         # Tipos TypeScript
│       └── utils/         # Logger (Winston)
├── db/
│   └── migrations/    # Scripts SQL
└── docker-compose.yml # PostgreSQL para desarrollo
```

## Requisitos Previos

- Node.js 18+
- Docker y Docker Compose (para la base de datos)
- Cuenta de OpenAI con acceso a GPT-4o

## Instalación

### 1. Clonar y configurar variables de entorno

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

Editar `backend/.env` y completar:
- `OPENAI_API_KEY`: Clave de la API de OpenAI
- `JWT_SECRET`: Secreto para firmar JWT (cambiar en producción)
- `DATABASE_URL`: URL de conexión a PostgreSQL

### 2. Iniciar la base de datos

```bash
docker-compose up -d
```

La migración inicial se ejecuta automáticamente al iniciar el contenedor.

### 3. Instalar dependencias

```bash
npm run install:all
```

### 4. Iniciar en desarrollo

```bash
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001
- **Adminer** (gestión DB): http://localhost:8080

## Uso en Desarrollo

### Token de prueba

En modo desarrollo, use el token `test_token_kyc_dev_2024` como Bearer token. El frontend lo envía automáticamente desde `localStorage` o usa el token por defecto.

### Cédulas de prueba (mock Registro Civil)

| Cédula | Nombre | Estado Civil |
|--------|--------|--------------|
| 1712345678 | JUAN CARLOS PEREZ LOPEZ | CASADO |
| 0912345678 | MARIA ELENA RODRIGUEZ TORRES | SOLTERA |
| 1709876543 | CARLOS ANDRES GOMEZ VARGAS | DIVORCIADO |

Cualquier otra cédula de 10 dígitos válida retornará datos genéricos.

## API Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/health` | Estado del servidor |
| GET | `/api/cedula/:numero` | Consultar cédula en Registro Civil |
| POST | `/api/kyc/init` | Inicializar solicitud KYC |
| POST | `/api/kyc/upload` | Subir documento |
| POST | `/api/kyc/validate-document` | Validar documento con OpenAI |
| POST | `/api/kyc/submit` | Enviar KYC al ERP |
| GET | `/api/kyc/audit/:id` | Historial de auditoría |

Todos los endpoints (excepto `/health`) requieren el header:
```
Authorization: Bearer <token>
```

## Flujo del Wizard

1. **Identificación**: Ingreso de cédula → consulta al Registro Civil → fallback manual
2. **Tipo de Persona**: Selección entre Persona Natural o Jurídica
3. **Documentos**: Carga y validación de documentos con OpenAI (bloqueante)
4. **Revisión**: Confirmación de datos antes del envío
5. **Confirmación**: Número de referencia del ERP

## Documentos Requeridos

### Persona Natural
- Copia de Cédula (obligatorio)
- Comprobante de Servicio Básico (obligatorio)
- Cédula del Cónyuge (solo si está casado/a o en unión libre)

### Persona Jurídica
- Copia del RUC (obligatorio)
- Cédula del Representante Legal (obligatorio)
- Nombramiento del Representante Legal (obligatorio)
- Balances Empresariales (obligatorio)

## Integración de Adaptadores (v2+)

### Registro Civil Real

En `backend/src/adapters/registroCivil.adapter.ts`, implementar `RealRegistroCivilAdapter` con las credenciales del Registro Civil de Ecuador y actualizar el factory `crearRegistroCivilAdapter()`.

### ERP Real

En `backend/src/adapters/erp.adapter.ts`, implementar `RealErpAdapter` con los endpoints del ERP de Seguros Latina y actualizar el factory `crearErpAdapter()`.

## Base de Datos

### Tablas

- `kyc_submissions`: Solicitudes KYC
- `kyc_documentos`: Documentos subidos
- `kyc_auditoria`: Log de auditoría completo

Ver `db/migrations/001_initial.sql` para el esquema completo.

## Variables de Entorno - Backend

| Variable | Descripción | Requerida |
|----------|-------------|-----------|
| `PORT` | Puerto del servidor | No (default: 3001) |
| `DATABASE_URL` | URL de PostgreSQL | Sí |
| `OPENAI_API_KEY` | Clave API de OpenAI | Sí (para validación real) |
| `JWT_SECRET` | Secreto para JWT | Sí |
| `STORAGE_PATH` | Ruta de almacenamiento | No (default: ./uploads) |
| `REGISTRO_CIVIL_API_URL` | URL del Registro Civil | Para producción |
| `REGISTRO_CIVIL_API_KEY` | Clave del Registro Civil | Para producción |
| `ERP_API_URL` | URL del ERP | Para producción |
| `ERP_API_KEY` | Clave del ERP | Para producción |

## Producción

```bash
npm run build
```

Para producción:
1. Cambiar `NODE_ENV=production` en el backend
2. Configurar `JWT_SECRET` con un valor seguro
3. Configurar las credenciales reales del Registro Civil
4. Implementar los adaptadores reales del ERP
5. Configurar CORS con el dominio del portal de Seguros Latina
