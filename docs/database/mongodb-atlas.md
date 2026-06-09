# MongoDB Atlas

## Base de datos

Nombre recomendado:

```txt
SIGEPEJ
```

Las colecciones planificadas estan descritas en:

```txt
docs/database/collections.md
```

## Usuario demo

El archivo `backend/.env` ya incluye un usuario demo para facilitar la ejecucion del equipo.

Credenciales generales:

```txt
Usuario: generaldbUSer
Password: general123
```

No es necesario que cada integrante cree su propio `.env` para la demo. El archivo ya esta incluido en el proyecto.

## Acceso por IP

Para una demo rapida con varios equipos, en MongoDB Atlas se puede agregar:

```txt
0.0.0.0/0
```

Esto permite conexiones desde cualquier IP.

## Advertencia

Esta configuracion es aceptable para demo academica temporal, pero no para produccion. Al terminar la entrega, se debe cambiar la contrasena o eliminar el usuario demo.
