# Backend SIGEPEJ

Base inicial para la API del sistema.

## Comandos

```bash
npm install
npm run check:db
npm run seed
npm run dev
```

## Verificacion

Abrir:

```txt
http://localhost:5000/api/health
```

Si MongoDB esta bien configurado, debe responder `database: connected`.

## Modelos base

Ya existen los modelos:

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

El equipo debe usar estos modelos para sus tareas y no crear colecciones nuevas sin revisar.

## Seed

Para cargar usuarios, carreras, materias, cursos, inscripciones, solicitudes, evidencias, asistencias, notificaciones y auditoria:

```bash
npm run seed
```

Todos los usuarios demo usan la contrasena:

```txt
password123
```

## Evidencias locales

No se usan servicios externos de archivos. Las evidencias se guardaran localmente en:

```txt
backend/uploads/evidences
```

Variables:

```env
UPLOAD_DIR=uploads/evidences
PUBLIC_UPLOAD_BASE_URL=http://localhost:5000/uploads
```

La carpeta `uploads/` no debe subirse al repo.
