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

## Usuarios demo y flujos por rol

Todos los usuarios demo del seed usan:

```txt
password123
```

| Rol | Usuario | Contraseña | Uso principal |
|---|---|---|---|
| Administrador | `admin` | `password123` | Gestionar usuarios, catálogos, reportes y auditoría. |
| Director de carrera | `director_sistemas` | `password123` | Revisar solicitudes, aprobar/rechazar/observar y modificar licencias con justificación. |
| Secretario académico | `secretaria_sistemas` | `password123` | Apoyar revisión, gestionar catálogos y consultar reportes. |
| Docente | `ana_rojas` | `password123` | Solicitar permiso docente y registrar asistencia en sus materias. |
| Docente | `carlos_mendez` | `password123` | Registrar asistencia en sus materias asignadas. |
| Estudiante | `ricardo_np` | `password123` | Crear solicitudes, ver historial, evidencias y notificaciones. |
| Estudiante | `daniel_escobar` | `password123` | Probar solicitud observada y corrección. |
| Estudiante | `josue_rodriguez` | `password123` | Probar historial y flujo estudiantil. |
| Estudiante | `luis_lopez` | `password123` | Probar historial y flujo estudiantil. |

### Flujo del administrador

1. Iniciar sesión con `admin` / `password123`.
2. Entrar a `Usuarios`.
3. Crear un usuario demo o cambiar rol/estado de un usuario existente.
4. Entrar a `Catálogos`.
5. Crear carrera, materia o paralelo.
6. En paralelos, registrar uno o varios horarios por semana.
7. Entrar a `Reportes` y validar indicadores.
8. Entrar a `Auditoría` y confirmar que las acciones quedaron registradas.

### Flujo del director de carrera

1. Iniciar sesión con `director_sistemas` / `password123`.
2. Entrar a `Revisión`.
3. Revisar solicitudes pendientes, observadas, apeladas, aprobadas o rechazadas.
4. Abrir `Ver` para consultar detalle, fechas, materias y evidencia adjunta.
5. Aprobar una solicitud estudiantil.
6. Entrar a `Asistencia` y verificar que la fecha/materia aprobada quedó marcada como `L`.
7. Si corresponde, modificar manualmente una asistencia a `P`, `F` o `L` con justificación.
8. Revisar `Auditoría` para confirmar trazabilidad.

### Flujo del secretario académico

1. Iniciar sesión con `secretaria_sistemas` / `password123`.
2. Entrar a `Revisión` para consultar solicitudes.
3. Entrar a `Catálogos` para crear o revisar carreras, materias y paralelos.
4. Entrar a `Reportes` para filtrar por carrera, materia, estado y fechas.
5. Revisar `Notificaciones` si existen acciones pendientes.

### Flujo del docente

1. Iniciar sesión con `ana_rojas` / `password123`.
2. Entrar a `Solicitud docente`.
3. Seleccionar materia, fecha y motivo.
4. Probar que el sistema no permite enviar una fecha donde no existe horario para ese paralelo.
5. Entrar a `Asistencia`.
6. Elegir materia y fecha válida.
7. Marcar estudiantes como `P` o `F`.
8. Confirmar que una licencia `L` aplicada por Dirección queda bloqueada para el docente.
9. Revisar `Notificaciones`.

### Flujo del estudiante

1. Iniciar sesión con `ricardo_np` / `password123`.
2. Entrar a `Nueva solicitud`.
3. Crear un permiso anticipado con fecha futura válida y materia inscrita.
4. Probar que un permiso anticipado con fecha pasada es rechazado.
5. Probar que una justificación posterior con fecha futura es rechazada.
6. Si el motivo es salud, adjuntar evidencia obligatoria.
7. Entrar a `Mis solicitudes`.
8. Ver estado, fecha de solicitud, materias, evidencia y comentarios de revisión.
9. Si la solicitud fue observada, usar `Corregir`.
10. Si la solicitud fue rechazada, usar `Apelar`.
11. Revisar `Notificaciones` para ver respuestas de Dirección.

### Flujo completo recomendado para defensa

1. Estudiante `ricardo_np` crea una solicitud válida.
2. Director `director_sistemas` entra a `Revisión`, ve la evidencia y aprueba.
3. Director entra a `Asistencia` y confirma que el estudiante quedó como `L`.
4. Docente `ana_rojas` entra a `Asistencia` y confirma que no puede modificar esa `L`.
5. Administrador `admin` entra a `Auditoría` y verifica el registro de la acción.
6. Administrador o secretario entra a `Reportes` y valida que los indicadores se actualizan.

## Base de datos inicial

La base de datos demo ya tiene modelos y seed preparados. Para recrear las colecciones y datos iniciales:

```bash
cd backend
npm run seed
```

Este comando limpia y vuelve a cargar los datos demo de `SIGEPEJ`. Usarlo solo en la base académica de prueba.

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

Esto es solo para demo académica. Despues de la entrega se debe cambiar la contraseña o eliminar el usuario demo.

## Estado final del repositorio

La aplicacion final ya esta integrada para demo académica:

- `backend/`: Express, MongoDB Atlas, variables de entorno, modelos, seed y endpoint de prueba.
- `frontend/`: React + Vite, login, layout por roles y pantallas funcionales.
- `docs/`: documentacion inicial y tarjetas sugeridas para Trello.
- `preview/`: mockup HTML estatico y capturas.

El proyecto permite gestionar solicitudes de ausencia para estudiantes y docentes, revisión por Dirección, evidencias, asistencia `P/F/L`, notificaciones, auditoría y reportes.

Los modulos reales de login, solicitudes, asistencia, auditoría, notificaciones, usuarios, catálogos y reportes ya estan integrados en la app final.

## Validacion final ejecutada

Se verifico:

- Conexion éxitosa a MongoDB Atlas con `npm run check:db`.
- Seed completo con 9 usuarios, 1 carrera, 3 materias, 3 cursos, 12 inscripciones, solicitudes, evidencias, asistencias, notificaciones y auditoría.
- Build del frontend con `npm run build`.
- Login real contra backend.
- Proteccion de rutas de solicitudes: sin token responde 401.
- Revisión de solicitud por Dirección.
- Impacto automatico de aprobación estudiantil: asistencia marcada como `L` y bloqueada.
- Consulta de reportes, auditoría, usuarios, notificaciones, cursos y asistencia.

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
- Descripción.
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
git commit -m "Descripción del avance"
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

Si aparece error de autenticacion, revisar usuario y contraseña en `backend/.env`.

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


