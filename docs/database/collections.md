# Colecciones MongoDB planificadas

MongoDB usa colecciones, no tablas. Para el proyecto SIGEPEJ se usaran estas colecciones desde el inicio.

## users

Usuarios del sistema.

Campos principales:

- name
- email
- username
- passwordHash
- role
- careerId
- active

Roles:

- estudiante
- docente
- director
- secretario
- administrador

## careers

Carreras de la universidad.

Campos principales:

- name
- code
- directorId
- active

## courses

Materias, paralelos y horarios.

Campos principales:

- name
- code
- careerId
- parallel
- teacherId
- schedule
- active

## enrollments

Inscripciones de estudiantes a materias.

Campos principales:

- studentId
- courseId
- period
- active

## motives

Motivos de solicitud de ausencia.

Campos principales:

- name
- requiresEvidence
- appliesTo
- active

## absenceRequests

Solicitudes de ausencia estudiantil o docente.

Campos principales:

- requesterId
- requesterRole
- mode
- motiveId
- dates
- courseIds
- detail
- evidence
- status
- reviewerId
- reviewComment
- reviewedAt
- createdAt

Estados:

- pendiente
- observada
- aprobada
- rechazada

Modalidades:

- permiso anticipado
- justificacion posterior

## attendance

Registros de asistencia.

Campos principales:

- studentId
- courseId
- date
- state
- locked
- sourceRequestId
- updatedBy

Estados:

- P: presente
- F: falta
- L: licencia

## notifications

Notificaciones del sistema.

Campos principales:

- userId
- title
- message
- read
- relatedRequestId
- createdAt

## auditLogs

Auditoria de acciones importantes.

Campos principales:

- userId
- role
- action
- entity
- entityId
- before
- after
- comment
- createdAt

## appeals

Apelaciones de solicitudes rechazadas.

Campos principales:

- requestId
- userId
- comment
- evidence
- status
- createdAt
