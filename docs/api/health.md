# API Health

Endpoint real disponible en la base inicial del backend.

## Objetivo

Sirve para comprobar que el servidor Express esta levantado y que MongoDB Atlas esta conectado correctamente.

## Endpoint

```http
GET /api/health
```

URL local completa:

```txt
http://localhost:5000/api/health
```

## Requisitos

Antes de probar:

```bash
cd backend
npm install
npm run dev
```

Si solo se quiere verificar la conexion a MongoDB:

```bash
cd backend
npm run check:db
```

## Request

No necesita body ni token.

Ejemplo con navegador:

```txt
http://localhost:5000/api/health
```

Ejemplo con Thunder Client, Postman o curl:

```bash
curl http://localhost:5000/api/health
```

## Respuesta esperada

```json
{
  "ok": true,
  "service": "SIGEPEJ API",
  "database": "connected",
  "timestamp": "2026-06-04T15:40:05.440Z"
}
```

## Interpretacion

- `ok: true`: el backend esta respondiendo.
- `service: SIGEPEJ API`: confirma que se esta ejecutando el backend correcto.
- `database: connected`: MongoDB Atlas esta conectado.
- `timestamp`: fecha y hora generada por el backend al responder.

## Errores comunes

### No carga la URL

Revisar que el backend este corriendo:

```bash
cd backend
npm run dev
```

### Database disconnected

Revisar `backend/.env`, especialmente:

```env
MONGO_URI=mongodb+srv://generaldbUSer:general123@cluster0.he1pujk.mongodb.net/SIGEPEJ?retryWrites=true&w=majority&appName=Cluster0
```

### Error de IP en MongoDB Atlas

En Atlas debe estar permitido:

```txt
0.0.0.0/0
```

Esto es solo para demo academica.
