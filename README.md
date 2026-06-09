# SIGEPEJ

Sistema de Gestion de Solicitudes de Ausencia Estudiantil y Docente.

## Requisitos

Instalar antes de ejecutar:

- Node.js 20 o superior.
- npm.
- Git.
- Conexion a internet para MongoDB Atlas.

## Instalacion rapida

Abrir una terminal en la raiz del proyecto.

Backend:

```bash
cd backend
npm install
npm run check:db
npm run seed
npm run dev
```

Abrir otra terminal en la raiz del proyecto.

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Abrir en el navegador:

```txt
http://localhost:5173
```

El backend queda en:

```txt
http://localhost:5000
```

Probar backend:

```txt
http://localhost:5000/api/health
```

Respuesta esperada:

```json
{
  "ok": true,
  "service": "SIGEPEJ API",
  "database": "connected"
}
```

## Orden recomendado

1. Clonar el repositorio.
2. Entrar a `backend/`.
3. Ejecutar `npm install`.
4. Ejecutar `npm run check:db`.
5. Ejecutar `npm run seed`.
6. Ejecutar `npm run dev`.
7. Abrir otra terminal.
8. Entrar a `frontend/`.
9. Ejecutar `npm install`.
10. Ejecutar `npm run dev`.
11. Abrir `http://localhost:5173`.

## Backend

Desde la raiz del proyecto:

```bash
cd backend
npm install
```

Verificar conexion con MongoDB:

```bash
npm run check:db
```

Cargar datos iniciales demo:

```bash
npm run seed
```

Levantar backend:

```bash
npm run dev
```

Resultado esperado al verificar la base:

```txt
MongoDB connected to SIGEPEJ
MongoDB connection OK
```

## Frontend

Abrir otra terminal desde la raiz del proyecto:

```bash
cd frontend
npm install
npm run dev
```

El frontend queda en:

```txt
http://localhost:5173
```

La URL del backend esta configurada en:

```txt
frontend/.env
```

Valor esperado:

```env
VITE_API_URL=http://localhost:5000/api
```

## Evidencias locales

Para esta demo no se usan servicios externos de archivos. Las evidencias se guardaran localmente desde el backend.

Variables configuradas en `backend/.env`:

```env
UPLOAD_DIR=uploads/evidences
PUBLIC_UPLOAD_BASE_URL=http://localhost:5000/uploads
```

La ruta publica para archivos locales es:

```txt
http://localhost:5000/uploads
```

Cuando se implemente la subida de evidencias, los archivos deben guardarse dentro de:

```txt
backend/uploads/evidences
```

Importante: `uploads/` no debe subirse al repo. Solo sirve para archivos cargados durante la demo local.

Build frontend:

```bash
cd frontend
npm run build
```

## Usuarios demo

Todos los usuarios demo del seed usan:

```txt
password123
```

Usuarios principales:

- `admin`
- `director_sistemas`
- `secretaria_sistemas`
- `ana_rojas`
- `carlos_mendez`
- `ricardo_np`
- `daniel_escobar`
- `josue_rodriguez`
- `luis_lopez`

## Base de datos inicial

La base de datos demo ya tiene modelos y seed preparados. Para recrear las colecciones y datos iniciales:

```bash
cd backend
npm run seed
```

Este comando limpia y vuelve a cargar los datos demo de `SIGEPEJ`. Usarlo solo en la base academica de prueba.

Modelos ya creados en `backend/src/models/`:

- `User`
- `Career`
- `Subject`
- `Course`
- `Enrollment`
- `Request`
- `Evidence`
- `Attendance`
- `Notification`
- `AuditLog`

Regla para el equipo: usar estos modelos existentes. No crear colecciones nuevas sin revisar primero con el grupo.

## MongoDB Atlas

El backend ya trae un `.env` demo en:

```txt
backend/.env
```

Por defecto no necesitan crear ni conectar nada manualmente. El proyecto ya viene con la conexion de MongoDB configurada para la demo.

La base configurada es:

```txt
SIGEPEJ
```

Credenciales generales de MongoDB Atlas para demo:

```txt
Usuario: generaldbUSer
Password: general123
```

URI configurada en `backend/.env`:

```env
MONGO_URI=mongodb+srv://generaldbUSer:general123@cluster0.he1pujk.mongodb.net/SIGEPEJ?retryWrites=true&w=majority&appName=Cluster0
```

Para que cualquier integrante pueda conectarse desde su laptop, en MongoDB Atlas debe estar agregada la IP:

```txt
0.0.0.0/0
```

Esto es solo para demo academica. Despues de la entrega se debe cambiar la contrasena o eliminar el usuario demo.

## Estado del repositorio

La base tecnica ya esta preparada para que el equipo trabaje:

- `backend/`: Express, MongoDB Atlas, variables de entorno, modelos, seed y endpoint de prueba.
- `frontend/`: React + Vite, variables de entorno y pantalla base.
- `docs/`: documentacion inicial y tarjetas sugeridas para Trello.
- `preview/`: mockup HTML estatico y capturas.

El proyecto permite gestionar solicitudes de ausencia para estudiantes y docentes, revision por Direccion, evidencias, asistencia `P/F/L`, notificaciones, auditoria y reportes.

Los modulos reales de login, solicitudes, asistencia, auditoria, notificaciones y reportes se implementan como tareas del equipo.

## Mockup visual

El prototipo estatico esta en:

```txt
preview/index.html
```

Se puede abrir con doble clic. Sirve como referencia visual para construir las pantallas reales en React.

## Tareas para Trello

Las tarjetas completas por sprint estan en:

```txt
docs/sprints/trello-tasks.md
```

Cada tarjeta incluye:

- Sprint.
- Responsable por area.
- Titulo.
- Descripcion.
- Checklist.
- Comentario/tutorial para pegar en Trello.

## Ramas recomendadas

- `main`: version estable.
- `Development`: integracion general.
- Rama por integrante: trabajo individual.

Flujo sugerido:

```bash
git checkout Development
git pull
git checkout -b nombre-rama
```

Antes de subir cambios:

```bash
git status
git add .
git commit -m "Descripcion del avance"
git push origin nombre-rama
```

## Archivos que no deben subirse

No subir:

- `node_modules/`
- `dist/`
- `build/`
- `uploads/`
- Archivos temporales.

Para esta demo, `.env` se deja dentro del repo por decision del equipo, para que todos puedan ejecutar rapidamente.

No borrar ni reemplazar `backend/.env` ni `frontend/.env` si solo se quiere correr la demo. Ya vienen configurados.

## Problemas comunes

### MongoDB no conecta

Probar:

```bash
cd backend
npm run check:db
```

Si aparece `ENOTFOUND`, el host del cluster esta mal escrito.

Si aparece error de autenticacion, revisar usuario y contrasena en `backend/.env`.

Si aparece error de IP, revisar en Atlas:

```txt
Network Access > IP Access List > 0.0.0.0/0
```

### Frontend no conecta con backend

Revisar que el backend este corriendo en:

```txt
http://localhost:5000/api/health
```

Revisar `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Despues de cambiar `.env`, reiniciar Vite.

### Puerto ocupado

Backend usa:

```txt
5000
```

Frontend usa:

```txt
5173
```

Si un puerto esta ocupado, cerrar el proceso anterior o cambiar el puerto en la configuracion.
