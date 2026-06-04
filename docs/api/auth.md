# API Auth

Documento de contrato para autenticacion. Estos endpoints todavia no estan implementados en la base inicial.

## Estado actual

La base tecnica actual ya tiene:

- Modelo `User`.
- Roles del sistema.
- Usuarios demo cargados por seed.
- Password hasheado con bcrypt.
- `JWT_SECRET` configurado en `backend/.env`.

Pendiente de implementar por la tarea de login backend:

- `POST /api/auth/login`
- `GET /api/auth/me`
- Middleware de autenticacion JWT.
- Middleware de roles.

## Roles validos

```txt
estudiante
docente
director
secretario
administrador
```

## Endpoint planificado: login

```http
POST /api/auth/login
```

URL local completa:

```txt
http://localhost:5000/api/auth/login
```

## Body esperado

El login debe aceptar correo o username.

Ejemplo con username:

```json
{
  "identifier": "ricardo_np",
  "password": "password123"
}
```

Ejemplo con email:

```json
{
  "identifier": "ricardo.nunez@univalle.edu",
  "password": "password123"
}
```

## Respuesta esperada

```json
{
  "ok": true,
  "token": "JWT_GENERADO",
  "user": {
    "id": "ID_DEL_USUARIO",
    "firstName": "Ricardo",
    "lastName": "Nunez del Prado",
    "email": "ricardo.nunez@univalle.edu",
    "username": "ricardo_np",
    "role": "estudiante",
    "code": "EST-2026-001"
  }
}
```

## Error esperado por credenciales incorrectas

```json
{
  "ok": false,
  "message": "Credenciales invalidas"
}
```

Status sugerido:

```txt
401 Unauthorized
```

## Endpoint planificado: usuario autenticado

```http
GET /api/auth/me
```

URL local completa:

```txt
http://localhost:5000/api/auth/me
```

## Header requerido

```txt
Authorization: Bearer JWT_GENERADO
```

## Respuesta esperada

```json
{
  "ok": true,
  "user": {
    "id": "ID_DEL_USUARIO",
    "firstName": "Ricardo",
    "lastName": "Nunez del Prado",
    "email": "ricardo.nunez@univalle.edu",
    "username": "ricardo_np",
    "role": "estudiante",
    "code": "EST-2026-001"
  }
}
```

## Error esperado sin token

```json
{
  "ok": false,
  "message": "Token requerido"
}
```

Status sugerido:

```txt
401 Unauthorized
```

## Flujo esperado para frontend

1. Usuario ingresa correo o username.
2. Usuario ingresa password.
3. Frontend envia `POST /api/auth/login`.
4. Backend valida usuario activo y password.
5. Backend devuelve token y datos del usuario.
6. Frontend guarda token en `localStorage`.
7. Frontend redirige segun rol.

## Redireccion sugerida por rol

```txt
estudiante -> /dashboard o /mis-solicitudes
docente -> /dashboard o /asistencia
director -> /revision
secretario -> /revision
administrador -> /usuarios
```

## Nota importante

Este documento no significa que el login ya funcione. Es la referencia que deben seguir quienes implementen la tarea de autenticacion.
