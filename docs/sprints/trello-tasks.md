# Tarjetas detalladas para Trello - SIGEPEJ

Este documento contiene las tarjetas listas para copiar a Trello. Cada tarjeta incluye sprint, responsable por area, descripcion amplia, checklist y comentario/tutorial.

Contexto importante:

- La estructura base del proyecto ya esta creada.
- El backend ya tiene Express, MongoDB Atlas, `.env`, `.env.example` y endpoint `/api/health`.
- El frontend ya tiene React + Vite, `.env`, `.env.example` y pantalla base.
- El archivo `.env` ya viene configurado para demo; no hace falta crear conexion MongoDB manualmente.
- La base MongoDB configurada se llama `SIGEPEJ`.
- Las credenciales demo son `generaldbUSer` / `general123`.
- El mockup visual esta en `preview/index.html`.
- Las colecciones planificadas estan en `docs/database/collections.md`.
- Las tareas de modelos MongoDB, seed inicial, autenticacion backend y middleware de roles quedan fuera de Trello porque seran realizadas por coordinacion.
- La coordinacion inicial no participa como responsable de estas tarjetas.

## Sprint 1 - Base funcional, datos y autenticacion

### T01 - Crear layout frontend por roles

Responsable: Frontend 1

Descripcion:

Esta tarea crea la estructura visual base del frontend. Debe existir un layout con sidebar, topbar y zona de contenido. Cada rol debe tener su menu correspondiente. No se implementa logica de solicitudes todavia; solo la navegacion, rutas protegidas visualmente y pantallas placeholder. Usar como guia el mockup de `preview/index.html`.

Checklist:

- Crear `frontend/src/layouts/AppLayout.jsx`.
- Crear sidebar.
- Crear topbar.
- Crear menu por rol.
- Crear rutas base.
- Crear paginas placeholder.
- Aplicar colores azul/dorado.
- Hacer responsive basico.
- Agregar opcion cerrar sesion visual.

Comentario/tutorial para Trello:

```txt
Tutorial paso a paso:
1. Abrir frontend/src/layouts.
2. Crear AppLayout.jsx.
3. Revisar preview/index.html para copiar la idea visual.
4. Crear un array de menus por rol:
   estudiante, docente, director, secretario, administrador.
5. Crear sidebar con los items del rol actual.
6. Crear topbar con nombre del usuario y rol.
7. Crear paginas placeholder en frontend/src/features.
8. Usar React Router para navegar.
9. No conectar APIs todavia, solo estructura.
10. Ejecutar npm run dev y revisar en navegador.
```

### T02 - Implementar login frontend

Responsable: Frontend 1

Descripcion:

Esta tarea crea la pantalla de login y la conecta con el backend. El usuario debe ingresar correo o username y password. Si el backend responde bien, se guarda el token y se redirige al panel segun rol. Si falla, se muestra un mensaje claro. Esta tarea depende de que el backend de login ya este listo.

Checklist:

- Crear pantalla `LoginPage.jsx`.
- Crear formulario con identifier y password.
- Consumir `POST /api/auth/login`.
- Guardar token en localStorage.
- Guardar usuario en contexto.
- Crear `AuthContext`.
- Redirigir segun rol.
- Mostrar errores.
- Crear cierre de sesion.

Comentario/tutorial para Trello:

```txt
Tutorial paso a paso:
1. Trabajar en frontend/src/features/auth.
2. Crear LoginPage.jsx.
3. Crear AuthContext.jsx en frontend/src/context.
4. El formulario debe tener usuario/correo y password.
5. Al enviar, hacer fetch a:
   ${VITE_API_URL}/auth/login
6. Si responde token, guardarlo en localStorage.
7. Guardar tambien el usuario devuelto.
8. Redirigir:
   estudiante -> historial o dashboard
   docente -> asistencia o dashboard
   director -> bandeja
   secretario -> seguimiento
   administrador -> administracion
9. Si falla, mostrar mensaje debajo del formulario.
10. Crear funcion logout que borre localStorage.
```

### T03 - Documentar API inicial y usuarios de prueba

Responsable: QA / Documentacion

Descripcion:

Esta tarea documenta lo necesario para que todos prueben igual: endpoint de health, login, usuarios demo, roles y comandos. La documentacion debe ser corta pero util. No debe ser teoria extensa; debe servir para ejecutar y probar.

Checklist:

- Crear `docs/api/health.md`.
- Crear `docs/api/auth.md`.
- Crear `docs/api/usuarios-demo.md`.
- Agregar ejemplos de login.
- Agregar respuestas esperadas.
- Agregar comandos backend.
- Agregar comandos frontend.
- Confirmar que usuarios coincidan con seed.

Comentario/tutorial para Trello:

```txt
Tutorial paso a paso:
1. Entrar a docs/api.
2. Crear health.md con GET /api/health.
3. Crear auth.md con POST /api/auth/login y GET /api/auth/me.
4. Crear usuarios-demo.md con correo, username, password y rol.
5. Para cada endpoint poner:
   metodo, URL, body de ejemplo y respuesta esperada.
6. Probar los endpoints antes de documentarlos.
7. Si cambia el seed, actualizar usuarios-demo.md.
```

## Sprint 2 - Solicitudes, evidencias y revision

### T04 - Backend para crear solicitudes de ausencia

Responsable: Backend 1

Descripcion:

Esta tarea crea el endpoint que permite registrar solicitudes de ausencia. La solicitud puede ser de estudiante o de docente, pero se guarda en el mismo modelo. El backend debe validar fechas, motivo, materias afectadas y usuario autenticado. El estado inicial siempre debe ser `pendiente`. Al crear la solicitud tambien debe generarse auditoria y notificacion para Direccion.

Checklist:

- Crear `requestController`.
- Crear `requestRoutes`.
- Crear `POST /api/requests`.
- Validar usuario autenticado.
- Validar fechas.
- Validar materias.
- Validar motivo.
- Determinar modalidad automaticamente.
- Guardar estado `pendiente`.
- Crear auditoria.
- Crear notificacion para Director.
- Registrar ruta en app.js.

Comentario/tutorial para Trello:

```txt
Tutorial paso a paso:
1. Crear backend/src/controllers/requestController.js.
2. Crear backend/src/routes/requestRoutes.js.
3. Proteger la ruta con authMiddleware.
4. No recibir requesterId desde el body; usar req.user._id.
5. Recibir motiveId, dates, courseIds, detail y evidence si existe.
6. Validar que dates no este vacio.
7. Si todas las fechas son futuras, guardar mode "permiso anticipado".
8. Si hay fechas pasadas, guardar mode "justificacion posterior".
9. Guardar status "pendiente".
10. Crear AuditLog con accion "crear_solicitud".
11. Crear Notification para el usuario Director.
12. Probar con Thunder Client usando token.
```

### T05 - Backend para subir evidencias

Responsable: Backend 2

Descripcion:

Esta tarea permite cargar archivos de respaldo para solicitudes. Las evidencias pueden ser PDF o imagenes. El backend debe recibir el archivo, validar tipo y tamano, guardarlo localmente en `backend/uploads/evidences` y guardar la URL publica local dentro de la solicitud. No se usara servicio externo para esta demo.

Checklist:

- Configurar Multer.
- Configurar carpeta local `uploads/evidences`.
- Crear `uploadService`.
- Aceptar PDF, JPG y PNG.
- Validar tamano maximo.
- Guardar URL.
- Guardar ruta local.
- Guardar nombre original.
- Manejar errores.

Comentario/tutorial para Trello:

```txt
Tutorial paso a paso:
1. Crear backend/src/services/uploadService.js.
2. Crear automaticamente la carpeta `uploads/evidences` si no existe.
3. Configurar multer en la ruta de solicitudes.
4. Permitir solo:
   application/pdf, image/jpeg, image/png.
5. Definir limite de tamano, por ejemplo 5MB.
6. Guardar archivo localmente con nombre unico, por ejemplo fecha + nombre original.
7. Guardar en la solicitud:
   evidence.url, evidence.localPath, evidence.originalName.
8. Probar desde Postman con form-data.
9. Exponer `/uploads` con express.static para ver el archivo desde el navegador.
10. No subir la carpeta `uploads/` al repo.
```

### T06 - Frontend formulario de solicitud estudiantil

Responsable: Frontend 1

Descripcion:

Esta tarea crea la pantalla para que el estudiante registre una solicitud de ausencia. El formulario debe permitir seleccionar materias inscritas, fechas, motivo, detalle y evidencia. Debe mostrar validaciones antes de enviar y consumir el endpoint real del backend.

Checklist:

- Crear `StudentRequestForm.jsx`.
- Cargar materias inscritas.
- Permitir seleccionar fechas.
- Permitir seleccionar motivo.
- Mostrar si motivo requiere evidencia.
- Adjuntar archivo.
- Validar campos obligatorios.
- Enviar al backend.
- Mostrar confirmacion.
- Redirigir al historial.

Comentario/tutorial para Trello:

```txt
Tutorial paso a paso:
1. Trabajar en frontend/src/features/requests.
2. Crear StudentRequestForm.jsx.
3. Revisar el formulario del mockup en preview/index.html.
4. Cargar materias desde la API o desde datos temporales si la API aun no esta lista.
5. Crear inputs: fechas, motivo, materias, detalle y archivo.
6. Si el motivo requiere evidencia, no permitir enviar sin archivo.
7. Si hay archivo, usar FormData.
8. Enviar a POST /api/requests.
9. Mostrar mensaje "Solicitud enviada".
10. Redirigir a historial.
```

### T07 - Frontend formulario de solicitud docente

Responsable: Frontend 2

Descripcion:

Esta tarea crea el formulario para docentes. A diferencia del estudiante, una ausencia docente puede afectar varias materias y varias fechas. Si se aprueba, impacta a la asistencia de todos los estudiantes inscritos. En esta tarea solo se crea y envia la solicitud; el impacto lo resuelve backend.

Checklist:

- Crear `TeacherRequestForm.jsx`.
- Cargar materias asignadas.
- Permitir seleccionar varias materias.
- Permitir varias fechas.
- Permitir fechas no consecutivas.
- Seleccionar motivo.
- Adjuntar evidencia.
- Enviar solicitud.
- Mostrar confirmacion.

Comentario/tutorial para Trello:

```txt
Tutorial paso a paso:
1. Trabajar en frontend/src/features/requests.
2. Crear TeacherRequestForm.jsx.
3. Mostrar materias asignadas al docente autenticado.
4. Permitir seleccionar una o varias materias con checkbox.
5. Permitir agregar varias fechas.
6. Usar el mismo endpoint POST /api/requests.
7. Enviar requesterRole docente o dejar que backend lo detecte por req.user.role.
8. Mostrar resumen antes de enviar.
9. Al enviar, mostrar confirmacion y volver al dashboard docente.
```

### T08 - Historial de solicitudes

Responsable: Frontend 1

Descripcion:

Esta tarea muestra al estudiante o docente todas sus solicitudes. El usuario debe poder ver estado, fechas, materias, comentario del revisor, evidencia y acciones disponibles. Las acciones dependen del estado: observada permite corregir, rechazada permite apelar, aprobada solo consultar.

Checklist:

- Crear `RequestHistoryPage.jsx`.
- Consumir `GET /api/requests/my`.
- Mostrar tabla o lista.
- Mostrar estado con color.
- Mostrar comentario del revisor.
- Mostrar evidencia.
- Boton ver detalle.
- Boton corregir si esta observada.
- Boton apelar si esta rechazada.

Comentario/tutorial para Trello:

```txt
Tutorial paso a paso:
1. Crear RequestHistoryPage.jsx.
2. Consumir GET /api/requests/my con token.
3. Renderizar codigo, estado, fechas, materias y motivo.
4. Crear chips de estado:
   pendiente, observada, aprobada, rechazada.
5. Si status es observada, mostrar boton "Corregir".
6. Si status es rechazada, mostrar boton "Apelar".
7. Si status es aprobada, mostrar solo "Ver".
8. Probar con solicitudes del seed.
```

### T09 - Bandeja de revision del Director

Responsable: Frontend 2

Descripcion:

Esta tarea crea la pantalla principal del Director de Carrera. Debe mostrar las solicitudes que requieren revision y permitir abrir dos tipos de modal: Ver y Revisar. Ver solo muestra informacion. Revisar muestra detalle completo y acciones aprobar, observar o rechazar.

Checklist:

- Crear `DirectorReviewQueue.jsx`.
- Consumir `GET /api/requests`.
- Mostrar pendientes.
- Mostrar observadas.
- Mostrar rechazadas/apeladas.
- Crear filtros.
- Boton Ver.
- Boton Revisar.
- Mostrar evidencia.
- Proteger por rol director.

Comentario/tutorial para Trello:

```txt
Tutorial paso a paso:
1. Trabajar en frontend/src/features/requests.
2. Crear DirectorReviewQueue.jsx.
3. Consumir GET /api/requests con token de director.
4. Crear filtros por estado.
5. En la tabla mostrar solicitante, tipo, fechas, materias y estado.
6. Boton Ver abre modal sin acciones.
7. Boton Revisar abre modal con acciones.
8. No mostrar esta pantalla a otros roles.
9. Revisar el mockup del director en preview.
```

### T10 - Backend revision de solicitudes

Responsable: Backend 1

Descripcion:

Esta tarea permite que el Director apruebe, observe o rechace una solicitud. Toda decision debe tener comentario obligatorio. Si aprueba, debe llamar al servicio de impacto de asistencia. Si observa, el solicitante podra corregir. Si rechaza, el solicitante podra apelar.

Checklist:

- Crear `PATCH /api/requests/:id/review`.
- Permitir solo rol director.
- Validar accion.
- Validar comentario obligatorio.
- Guardar revisor.
- Guardar fecha de revision.
- Cambiar estado.
- Crear auditoria.
- Crear notificacion.
- Llamar impacto si se aprueba.

Comentario/tutorial para Trello:

```txt
Tutorial paso a paso:
1. En requestRoutes crear PATCH /:id/review.
2. Proteger con authMiddleware y requireRole("director").
3. Recibir body:
   action y comment.
4. action puede ser aprobar, observar o rechazar.
5. Si comment esta vacio, responder 400.
6. Buscar la solicitud por id.
7. Cambiar status segun action.
8. Guardar reviewerId y reviewedAt.
9. Crear AuditLog.
10. Crear Notification al solicitante.
11. Si action es aprobar, llamar al servicio de impacto de asistencia.
12. Probar cada accion con Postman.
```

### T11 - Correccion de solicitudes observadas

Responsable: Frontend 1

Descripcion:

Esta tarea permite que el solicitante corrija una solicitud observada. La pantalla debe mostrar el comentario del Director para que el usuario entienda que debe arreglar. Se debe permitir modificar detalle y evidencia, pero no cambiar datos criticos sin validacion.

Checklist:

- Crear modal o pantalla de correccion.
- Mostrar comentario del revisor.
- Permitir editar detalle.
- Permitir reemplazar evidencia.
- Validar archivo.
- Enviar correccion.
- Cambiar estado a pendiente.
- Mostrar confirmacion.

Comentario/tutorial para Trello:

```txt
Tutorial paso a paso:
1. Crear EditObservedRequest.jsx.
2. Abrirlo desde historial cuando status sea observada.
3. Mostrar arriba el comentario del Director.
4. Permitir editar detalle.
5. Permitir subir nueva evidencia.
6. Enviar PATCH o PUT al endpoint de correccion.
7. Al guardar, backend debe volver la solicitud a pendiente.
8. Mostrar mensaje "Solicitud corregida y enviada nuevamente".
9. Volver al historial.
```

### T12 - Apelacion de solicitudes rechazadas

Responsable: Frontend 2

Descripcion:

Esta tarea permite que un usuario apele una solicitud rechazada. La apelacion debe incluir un argumento obligatorio y evidencia adicional opcional. Al enviarse, Direccion debe recibir notificacion y la solicitud debe volver a revision.

Checklist:

- Crear `AppealForm.jsx`.
- Mostrar solo en solicitudes rechazadas.
- Pedir argumento obligatorio.
- Permitir evidencia opcional.
- Enviar apelacion.
- Mostrar confirmacion.
- Actualizar estado visual.
- Notificar a Direccion.

Comentario/tutorial para Trello:

```txt
Tutorial paso a paso:
1. Crear AppealForm.jsx.
2. En historial mostrar boton Apelar solo si status es rechazada.
3. El formulario debe pedir comentario obligatorio.
4. Adjuntar evidencia opcional si el usuario tiene.
5. Enviar al endpoint de apelaciones.
6. Mostrar mensaje "Apelacion enviada".
7. La solicitud debe quedar como pendiente por apelacion.
8. Probar con una solicitud rechazada del seed.
```

## Sprint 3 - Asistencia, impacto automatico y notificaciones

### T13 - Backend asistencia por materia y fecha

Responsable: Backend 2

Descripcion:

Esta tarea crea la API de asistencia. El docente debe poder consultar una materia y fecha, ver estudiantes inscritos y marcar `P` o `F`. Si un registro esta en `L`, el docente no puede cambiarlo. Solo Direccion podria modificar una licencia con justificacion y auditoria.

Checklist:

- Crear `attendanceController`.
- Crear `attendanceRoutes`.
- Crear `GET /api/attendance`.
- Crear `PATCH /api/attendance/:id`.
- Filtrar por curso y fecha.
- Validar docente asignado.
- Bloquear `L` para docentes.
- Permitir cambio director con justificacion.
- Registrar auditoria.

Comentario/tutorial para Trello:

```txt
Tutorial paso a paso:
1. Crear attendanceController.js y attendanceRoutes.js.
2. GET debe recibir courseId y date.
3. Buscar estudiantes inscritos con Enrollment.
4. Devolver estado de asistencia de cada estudiante.
5. PATCH debe recibir state P o F.
6. Si el registro esta en L y user.role es docente, responder 403.
7. Si user.role es director, permitir cambio solo con comment.
8. Registrar AuditLog por cada cambio.
9. Probar con un registro P, uno F y uno L.
```

### T14 - Frontend registro de asistencia docente

Responsable: Frontend 1

Descripcion:

Esta tarea crea la pantalla donde el docente pasa asistencia. Debe seleccionar materia, paralelo y fecha. Luego se carga la lista de estudiantes inscritos y se marca P o F. Las licencias L aparecen bloqueadas, con estilo visual diferente.

Checklist:

- Crear `AttendancePage.jsx`.
- Cargar materias del docente.
- Seleccionar fecha.
- Cargar estudiantes.
- Mostrar botones P, F y L.
- Deshabilitar L bloqueada.
- Guardar cambios.
- Mostrar estado de guardado.
- Mostrar errores.

Comentario/tutorial para Trello:

```txt
Tutorial paso a paso:
1. Trabajar en frontend/src/features/attendance.
2. Crear AttendancePage.jsx.
3. Consumir materias asignadas al docente.
4. Al seleccionar materia y fecha, consumir GET /api/attendance.
5. Renderizar una fila por estudiante.
6. Mostrar botones P, F y L.
7. Si locked es true, deshabilitar botones y mostrar "Bloqueado por Direccion".
8. Al cambiar P o F, llamar PATCH /api/attendance/:id.
9. Mostrar toast o mensaje de guardado.
```

### T15 - Servicio de impacto por aprobacion estudiantil

Responsable: Backend 1

Descripcion:

Esta tarea implementa la regla mas importante para estudiantes: cuando Direccion aprueba una solicitud, la asistencia debe quedar como `L`. Si ya existia una falta `F`, cambia a `L`. Si la asistencia es futura y aun no existe, se crea como `L` agendada. El docente no puede editar ese registro.

Checklist:

- Crear `attendanceImpactService.js`.
- Detectar solicitud estudiantil.
- Buscar asistencia existente.
- Cambiar `F` a `L`.
- Crear `L` futura si no existe.
- Marcar `locked: true`.
- Registrar auditoria.
- Crear notificacion.

Comentario/tutorial para Trello:

```txt
Tutorial paso a paso:
1. Crear backend/src/services/attendanceImpactService.js.
2. Crear funcion applyStudentApprovalImpact(request, session).
3. Recibir solicitud aprobada.
4. Recorrer fechas y materias de la solicitud.
5. Buscar Attendance por studentId, courseId y date.
6. Si existe, actualizar state = "L" y locked = true.
7. Si no existe, crear nuevo Attendance con state = "L" y locked = true.
8. Guardar sourceRequestId para saber de donde viene.
9. Crear AuditLog indicando F -> L o L futura.
10. Llamar esta funcion desde reviewController cuando se aprueba.
```

### T16 - Servicio de impacto por ausencia docente

Responsable: Backend 2

Descripcion:

Esta tarea implementa la regla de ausencia docente. Cuando una ausencia docente se aprueba, las clases afectadas quedan autorizadas. Para efectos de asistencia, los estudiantes inscritos deben quedar como `P` automaticamente, salvo que ya tengan una `L` aprobada.

Checklist:

- Detectar solicitud docente.
- Buscar cursos afectados.
- Buscar estudiantes inscritos.
- Recorrer fechas afectadas.
- Crear asistencia `P`.
- No sobrescribir `L`.
- Registrar auditoria.
- Notificar estudiantes.

Comentario/tutorial para Trello:

```txt
Tutorial paso a paso:
1. En attendanceImpactService crear applyTeacherApprovalImpact(request, session).
2. Verificar que request.requesterRole sea docente.
3. Obtener courseIds y dates de la solicitud.
4. Buscar enrollments de cada curso.
5. Por cada estudiante y fecha, buscar Attendance.
6. Si no existe, crear state P.
7. Si existe F o P, dejar P segun regla del proyecto.
8. Si existe L, no sobrescribirla.
9. Crear AuditLog por impacto docente.
10. Crear notificaciones para estudiantes afectados.
```

### T17 - Transaccion de aprobacion

Responsable: Backend 1

Descripcion:

Esta tarea asegura que una aprobacion no quede a medias. Cuando se aprueba una solicitud se actualizan varias cosas: solicitud, asistencia, auditoria y notificaciones. Si una parte falla, todo debe revertirse. MongoDB Atlas permite usar transacciones con Mongoose sessions.

Checklist:

- Usar `mongoose.startSession`.
- Usar `session.withTransaction`.
- Actualizar solicitud dentro de session.
- Actualizar asistencia dentro de session.
- Crear auditoria dentro de session.
- Crear notificacion dentro de session.
- Hacer commit automatico.
- Revertir si falla.
- Probar error simulado.

Comentario/tutorial para Trello:

```txt
Tutorial paso a paso:
1. En reviewController importar mongoose.
2. Crear session:
   const session = await mongoose.startSession();
3. Ejecutar:
   await session.withTransaction(async () => { ... });
4. Dentro de la transaccion actualizar AbsenceRequest.
5. Llamar a attendanceImpactService pasando session.
6. Crear AuditLog con session.
7. Crear Notification con session.
8. Si algo falla, lanzar error.
9. Mongoose revierte la transaccion automaticamente.
10. Al final cerrar session con session.endSession().
11. Probar provocando un error antes de terminar.
```

### T18 - Backend notificaciones

Responsable: Backend 2

Descripcion:

Esta tarea crea el modulo de notificaciones. Las notificaciones informan al usuario cuando una solicitud fue creada, observada, aprobada, rechazada o apelada. Cada usuario solo debe ver sus propias notificaciones.

Checklist:

- Crear `notificationController`.
- Crear `notificationRoutes`.
- Crear helper `createNotification`.
- Crear `GET /api/notifications`.
- Crear `PATCH /api/notifications/:id/read`.
- Filtrar por usuario autenticado.
- Crear notificaciones desde solicitudes.
- Crear notificaciones desde revision.
- Crear notificaciones desde apelacion.

Comentario/tutorial para Trello:

```txt
Tutorial paso a paso:
1. Crear notificationController.js.
2. Crear notificationRoutes.js.
3. Crear service o helper createNotification(userId, title, message, relatedRequestId).
4. GET /api/notifications debe usar req.user._id.
5. PATCH /:id/read debe marcar read = true.
6. No permitir leer notificaciones de otro usuario.
7. Llamar createNotification desde requestController y reviewController.
8. Probar con estudiante, docente y director.
```

### T19 - Frontend notificaciones

Responsable: Frontend 2

Descripcion:

Esta tarea crea la pantalla donde cada usuario ve sus notificaciones. Debe mostrar no leidas, leidas, fecha y mensaje. Tambien debe existir un contador en la barra superior para que el usuario note que tiene solicitudes con respuesta o acciones pendientes.

Checklist:

- Crear `NotificationsPage.jsx`.
- Consumir `GET /api/notifications`.
- Mostrar no leidas.
- Mostrar leidas.
- Marcar como leida.
- Mostrar contador.
- Mostrar fecha.
- Mostrar mensaje claro.

Comentario/tutorial para Trello:

```txt
Tutorial paso a paso:
1. Trabajar en frontend/src/features/notifications.
2. Crear NotificationsPage.jsx.
3. Consumir GET /api/notifications con token.
4. Separar visualmente leidas y no leidas.
5. Mostrar contador en topbar.
6. Al hacer click en una notificacion, llamar PATCH /api/notifications/:id/read.
7. Actualizar la lista sin recargar toda la pagina.
8. Probar con acciones de crear, aprobar, observar y rechazar.
```

## Sprint 4 - Administracion, reportes, pruebas y entrega

### T20 - Administracion de catalogos

Responsable: Backend / Frontend

Descripcion:

Esta tarea crea mantenimiento basico para datos que el sistema necesita: usuarios, carreras, cursos, paralelos y motivos. No debe ser una administracion exagerada; basta con CRUD simple para demo y para demostrar que el sistema es configurable.

Checklist:

- CRUD usuarios.
- CRUD carreras.
- CRUD cursos.
- CRUD motivos.
- Asignar docente a curso.
- Asignar director a carrera.
- Definir evidencia obligatoria por motivo.
- Proteger por rol administrador.
- Crear pantallas simples.

Comentario/tutorial para Trello:

```txt
Tutorial paso a paso:
1. Backend crea rutas /api/admin/users, /api/admin/careers, /api/admin/courses, /api/admin/motives.
2. Proteger con requireRole("administrador").
3. Frontend crea pantallas de tabla + formulario.
4. No usar modales complejos si no hace falta.
5. Validar campos obligatorios.
6. Probar crear un motivo nuevo.
7. Confirmar que el motivo aparezca en formularios de solicitud.
8. Probar crear un curso y asignarle docente.
```

### T21 - Auditoria automatica y vista de auditoria

Responsable: Backend / Frontend

Descripcion:

Esta tarea registra acciones importantes del sistema y permite consultarlas. La auditoria es clave para defender el proyecto porque muestra fecha, usuario, rol, accion, estado anterior, estado nuevo y comentario. La auditoria no debe poder editarse desde frontend.

Checklist:

- Crear helper `createAuditLog`.
- Registrar creacion de solicitud.
- Registrar revision.
- Registrar apelacion.
- Registrar cambio de asistencia.
- Guardar antes y despues.
- Crear endpoint de consulta.
- Crear vista de auditoria.
- Filtrar por usuario, accion y fecha.

Comentario/tutorial para Trello:

```txt
Tutorial paso a paso:
1. Backend crea auditLogService.js con createAuditLog.
2. Llamar createAuditLog desde controladores importantes.
3. Guardar:
   userId, role, action, entity, entityId, before, after, comment.
4. Crear GET /api/audit-logs.
5. Proteger para director, secretario y administrador.
6. Frontend crea AuditLogPage.jsx.
7. Mostrar tabla con filtros simples.
8. No crear botones de editar ni eliminar auditoria.
```

### T22 - Reportes

Responsable: Frontend / Backend

Descripcion:

Esta tarea crea reportes para la exposicion y control academico. Los reportes deben mostrar datos utiles: solicitudes por estado, carrera, materia, docente, estudiante y motivos mas usados. No se necesita una herramienta compleja; basta con tarjetas, tablas y barras simples.

Checklist:

- Reporte por estado.
- Reporte por carrera.
- Reporte por materia.
- Reporte por docente.
- Reporte por estudiante.
- Reporte por motivo.
- Filtro por fechas.
- Vista dashboard.
- Exportacion simulada o simple.

Comentario/tutorial para Trello:

```txt
Tutorial paso a paso:
1. Backend crea endpoints /api/reports/summary y similares.
2. Usar MongoDB aggregate para contar por status, career, course y motive.
3. Frontend crea ReportsPage.jsx.
4. Mostrar tarjetas numericas.
5. Mostrar barras simples con CSS.
6. Agregar filtros por fecha, carrera y materia.
7. Usar datos del seed para probar.
8. La demo debe poder explicar que materias o motivos tienen mas solicitudes.
```

### T23 - Pruebas de API

Responsable: QA / Backend

Descripcion:

Esta tarea prueba todos los endpoints importantes antes de integrarlos completamente al frontend. Se debe crear una coleccion en Thunder Client o Postman para que cualquiera pueda repetir las pruebas con el mismo token y datos.

Checklist:

- Probar `/api/health`.
- Probar login.
- Probar `/api/auth/me`.
- Probar crear solicitud.
- Probar subir evidencia.
- Probar revisar solicitud.
- Probar asistencia.
- Probar notificaciones.
- Probar auditoria.
- Exportar coleccion.

Comentario/tutorial para Trello:

```txt
Tutorial paso a paso:
1. Abrir Thunder Client o Postman.
2. Crear variable base_url = http://localhost:5000/api.
3. Crear request de login.
4. Copiar token generado.
5. En requests protegidos agregar header:
   Authorization: Bearer TOKEN
6. Probar cada endpoint con datos correctos.
7. Probar tambien errores: sin token, rol incorrecto, datos incompletos.
8. Exportar la coleccion y guardarla en docs/api si el equipo lo decide.
```

### T24 - Pruebas de reglas de negocio

Responsable: QA

Descripcion:

Esta tarea valida las reglas que hacen serio el proyecto. No basta con que la pantalla se vea bien; debe cumplirse la logica academica: fechas, evidencias, estados, bloqueo de licencias e impacto automatico en asistencia.

Checklist:

- Probar permiso para fecha futura.
- Probar justificacion para fecha pasada.
- Probar evidencia obligatoria.
- Probar solicitud observada.
- Probar correccion de observada.
- Probar rechazo.
- Probar apelacion.
- Probar `F -> L`.
- Probar licencia futura.
- Probar bloqueo de `L`.
- Probar ausencia docente aprobada.

Comentario/tutorial para Trello:

```txt
Tutorial paso a paso:
1. Usar usuarios creados por el seed.
2. Crear una solicitud futura y verificar que sea permiso anticipado.
3. Crear una solicitud pasada y verificar que sea justificacion posterior.
4. Elegir motivo con evidencia obligatoria y probar enviar sin archivo.
5. Observar una solicitud y verificar que el usuario pueda corregir.
6. Rechazar una solicitud y verificar que pueda apelar.
7. Aprobar solicitud estudiantil con falta F y verificar que cambie a L.
8. Intentar cambiar L como docente y verificar que no deje.
9. Aprobar ausencia docente y verificar asistencia P para estudiantes.
10. Anotar fallas como tarjetas nuevas.
```

### T25 - Integracion final frontend/backend

Responsable: Frontend / Backend

Descripcion:

Esta tarea une todo: pantallas reales con endpoints reales. Se debe probar el flujo completo desde login hasta auditoria. El objetivo es detectar errores de comunicacion entre frontend y backend, permisos mal aplicados o datos que no coinciden.

Checklist:

- Login conectado.
- Rutas protegidas.
- Solicitudes conectadas.
- Revision conectada.
- Asistencia conectada.
- Notificaciones conectadas.
- Auditoria conectada.
- Reportes conectados.
- Probar cada rol.

Comentario/tutorial para Trello:

```txt
Tutorial paso a paso:
1. Abrir terminal 1:
   cd backend
   npm run dev
2. Abrir terminal 2:
   cd frontend
   npm run dev
3. Confirmar backend en http://localhost:5000/api/health.
4. Confirmar frontend en http://localhost:5173.
5. Entrar como estudiante y crear solicitud.
6. Entrar como director y revisarla.
7. Aprobar y verificar asistencia.
8. Entrar como docente y revisar que L este bloqueada.
9. Revisar notificaciones.
10. Revisar auditoria.
11. Registrar bugs encontrados.
```

### T26 - README final, demo y exposicion

Responsable: QA / Documentacion / Equipo

Descripcion:

Esta tarea prepara la entrega final. El README debe explicar como instalar y ejecutar el proyecto sin ayuda externa. La demo debe tener un guion claro para mostrar problema, solucion, roles, flujo de solicitud, aprobacion, impacto en asistencia y auditoria.

Checklist:

- README final.
- Usuarios de prueba.
- Comandos backend.
- Comandos frontend.
- Explicacion de `.env`.
- Explicacion de MongoDB.
- Guion de demo.
- Capturas.
- Ensayo de exposicion.
- Revision final del repo.

Comentario/tutorial para Trello:

```txt
Tutorial paso a paso:
1. Actualizar README.md con comandos reales.
2. Verificar que backend y frontend corran siguiendo solo el README.
3. Agregar usuarios de prueba con rol y password.
4. Crear guion de demo:
   login estudiante, crear solicitud, revisar director, aprobar, ver L, ver auditoria.
5. Tomar capturas de pantallas clave.
6. Revisar que no se suba node_modules ni dist.
7. Cada integrante debe preparar una explicacion de su modulo.
8. Ensayar la demo completa antes de presentar.
```


