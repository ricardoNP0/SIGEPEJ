# Plan de actualizacion del Backlog en Trello

Tablero: `SIGEPEJ`

URL: `https://trello.com/b/OR5JNpYs/sigepej`

Segun el Backlog visible, actualmente hay tarjetas antiguas desde `T05 Conectar MongoDB Atlas` hasta tarjetas del Sprint 2. La estructura base, MongoDB, modelos, seed, autenticacion backend y middleware de roles no deben quedar como tareas del equipo en Trello porque seran realizadas por coordinacion.

## Tarjetas antiguas que se deben archivar o eliminar

Estas tarjetas ya no deben quedar como tareas del equipo:

- `T05 Conectar MongoDB Atlas`
- `T07 Crear modelos de base de datos`
- `T08 Crear seed de usuarios y materias`
- `T09 Login backend con JWT`
- `T11 Middleware de roles`

Motivo:

- MongoDB ya conecta con el `.env` incluido.
- Modelos y seed seran hechos por coordinacion.
- Autenticacion backend y middleware seran hechos por coordinacion.

## Tarjetas finales que deben quedar en Backlog

El Backlog final debe tener estas 26 tarjetas:

1. `T01 Crear layout frontend por roles`
2. `T02 Implementar login frontend`
3. `T03 Documentar API inicial y usuarios de prueba`
4. `T04 Backend para crear solicitudes de ausencia`
5. `T05 Backend para subir evidencias`
6. `T06 Frontend formulario de solicitud estudiantil`
7. `T07 Frontend formulario de solicitud docente`
8. `T08 Historial de solicitudes`
9. `T09 Bandeja de revision del Director`
10. `T10 Backend revision de solicitudes`
11. `T11 Correccion de solicitudes observadas`
12. `T12 Apelacion de solicitudes rechazadas`
13. `T13 Backend asistencia por materia y fecha`
14. `T14 Frontend registro de asistencia docente`
15. `T15 Servicio de impacto por aprobacion estudiantil`
16. `T16 Servicio de impacto por ausencia docente`
17. `T17 Transaccion de aprobacion`
18. `T18 Backend notificaciones`
19. `T19 Frontend notificaciones`
20. `T20 Administracion de catalogos`
21. `T21 Auditoria automatica y vista de auditoria`
22. `T22 Reportes`
23. `T23 Pruebas de API`
24. `T24 Pruebas de reglas de negocio`
25. `T25 Integracion final frontend/backend`
26. `T26 README final, demo y exposicion`

## Renombres recomendados para tarjetas antiguas visibles

Si se quiere reutilizar tarjetas existentes en lugar de crear nuevas, aplicar estos cambios:

| Tarjeta antigua | Nueva tarjeta |
|---|---|
| `T06 Configurar servicio externo de archivos` | `T05 Backend para subir evidencias locales` |
| `T10 Login frontend` | `T02 Implementar login frontend` |
| `T12 Documentacion tecnica inicial` | `T03 Documentar API inicial y usuarios de prueba` |
| `T13 Formulario de solicitud estudiantil` | `T06 Frontend formulario de solicitud estudiantil` |
| `T14 Formulario de solicitud docente` | `T07 Frontend formulario de solicitud docente` |
| `T15 Endpoint crear solicitud` | `T04 Backend para crear solicitudes de ausencia` |
| `T17 Subida de evidencia` | `T05 Backend para subir evidencias locales` |
| `T18 Historial de solicitudes` | `T08 Historial de solicitudes` |
| `T19 Bandeja de revision` | `T09 Bandeja de revision del Director` |
| `T22 Endpoint revisar solicitud` | `T10 Backend revision de solicitudes` |
| `T23 Correccion de observadas` | `T11 Correccion de solicitudes observadas` |
| `T24 Apelacion de rechazadas` | `T12 Apelacion de solicitudes rechazadas` |
| `T25 Registro de asistencia docente` | `T14 Frontend registro de asistencia docente` |
| `T26 Endpoints de asistencia` | `T13 Backend asistencia por materia y fecha` |
| `T27 Impacto en asistencia estudiantil` | `T15 Servicio de impacto por aprobacion estudiantil` |
| `T28 Impacto en ausencia docente` | `T16 Servicio de impacto por ausencia docente` |
| `T29 Gestion de usuarios` | `T20 Administracion de catalogos` |
| `T35 Auditoria automatica` | `T21 Auditoria automatica y vista de auditoria` |
| `T37 Reportes por estado` | `T22 Reportes` |
| `T39 Pruebas de API` | `T23 Pruebas de API` |
| `T40 Pruebas de reglas de negocio` | `T24 Pruebas de reglas de negocio` |
| `T41 Integracion frontend/backend` | `T25 Integracion final frontend/backend` |
| `T43 README final` | `T26 README final, demo y exposicion` |

## Tarjetas que probablemente faltan en el Backlog actual

Agregar si no existen:

- `T01 Crear layout frontend por roles`
- `T17 Transaccion de aprobacion`
- `T18 Backend notificaciones`
- `T19 Frontend notificaciones`
- `T21 Auditoria automatica y vista de auditoria`
- `T22 Reportes`
- `T23 Pruebas de API`
- `T24 Pruebas de reglas de negocio`
- `T25 Integracion final frontend/backend`
- `T26 README final, demo y exposicion`

## Que poner en descripcion, checklist y comentario

El contenido completo de cada tarjeta esta en:

```txt
docs/sprints/trello-tasks.md
```

Para cada tarjeta:

1. Copiar el bloque `Descripcion` en la descripcion de Trello.
2. Copiar cada item de `Checklist` como checklist llamada `Tasks`.
3. Copiar el bloque `Comentario/tutorial para Trello` como comentario de la tarjeta.
