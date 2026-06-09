# SIGEPEJ - Prototipo HTML estático

## Cómo abrir

Abrir `index.html` con doble clic o desde el navegador.

No requiere `npm install`, backend, MongoDB ni servidor local. Todo funciona con datos simulados en `app.js`.

## Roles disponibles

- Estudiante
- Docente
- Director de Carrera
- Secretario Académico
- Administrador

## Pantallas incluidas

- Login por roles.
- Panel del estudiante.
- Nueva solicitud de ausencia estudiantil.
- Historial del estudiante.
- Notificaciones del estudiante.
- Apelación de solicitud rechazada.
- Panel del docente.
- Solicitud de ausencia docente.
- Registro de asistencia por materia, paralelo y fecha.
- Panel del Director de Carrera.
- Detalle y revisión de solicitudes.
- Aprobación, observación y rechazo.
- Apelaciones.
- Auditoría.
- Panel de Secretaría Académica.
- Administración y catálogos.
- Reportes.

## Reglas simuladas

- Existe un solo formulario de solicitud de ausencia.
- Si la fecha es futura, funciona como permiso anticipado.
- Si la fecha ya pasó, funciona como justificación posterior.
- Algunos motivos requieren evidencia obligatoria.
- Una solicitud observada debe corregirse.
- Al aprobar una ausencia estudiantil, la asistencia pasa a `L`.
- Si antes existía `F`, se cambia de `F` a `L`.
- Si la fecha es futura, se agenda `L`.
- El estado `L` queda bloqueado para docentes.
- Solo Dirección puede cambiar una licencia con justificación.
- Al aprobar se simula una transacción: solicitud, asistencia, notificación y auditoría.
- Si el docente pide ausencia y se aprueba, los estudiantes quedan como `P` automáticamente en las clases afectadas.

## URLs rápidas de revisión

- Login: `index.html`
- Director: `index.html?role=director&view=dashboard`
- Docente asistencia: `index.html?role=docente&view=asistencia`
- Estudiante solicitud: `index.html?role=estudiante&view=solicitud`
- Reportes: `index.html?role=director&view=reportes`
