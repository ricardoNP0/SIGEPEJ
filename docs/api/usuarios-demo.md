# Usuarios Demo

Usuarios cargados por el seed inicial del backend.

## Comando para recrear datos demo

```bash
cd backend
npm run seed
```

Este comando limpia y vuelve a cargar la base demo `SIGEPEJ`.

## Password general

Todos los usuarios demo usan:

```txt
password123
```

## Tabla de usuarios

| Nombre | Email | Username | Password | Rol | Codigo |
| --- | --- | --- | --- | --- | --- |
| Administrador SIGEPEJ | admin@sigepej.com | admin | password123 | administrador | ADM-001 |
| Christian Montano | director.sistemas@univalle.edu | director_sistemas | password123 | director | DIR-SIS-001 |
| Secretaria Academica | secretaria.sistemas@univalle.edu | secretaria_sistemas | password123 | secretario | SEC-SIS-001 |
| Ana Rojas | ana.rojas@univalle.edu | ana_rojas | password123 | docente | DOC-001 |
| Carlos Mendez | carlos.mendez@univalle.edu | carlos_mendez | password123 | docente | DOC-002 |
| Ricardo Nunez del Prado | ricardo.nunez@univalle.edu | ricardo_np | password123 | estudiante | EST-2026-001 |
| Daniel Escobar Pozo | daniel.escobar@univalle.edu | daniel_escobar | password123 | estudiante | EST-2026-002 |
| Josue Rodriguez Vera | josue.rodriguez@univalle.edu | josue_rodriguez | password123 | estudiante | EST-2026-003 |
| Luis Fernando Lopez | luis.lopez@univalle.edu | luis_lopez | password123 | estudiante | EST-2026-004 |

## Usuarios recomendados para probar

### Estudiante

```json
{
  "identifier": "ricardo_np",
  "password": "password123"
}
```

### Docente

```json
{
  "identifier": "ana_rojas",
  "password": "password123"
}
```

### Director de Carrera

```json
{
  "identifier": "director_sistemas",
  "password": "password123"
}
```

### Secretario Academico

```json
{
  "identifier": "secretaria_sistemas",
  "password": "password123"
}
```

### Administrador

```json
{
  "identifier": "admin",
  "password": "password123"
}
```

## Datos academicos relacionados

El seed tambien carga:

- Carrera: Ingenieria de Sistemas.
- Materias: Programacion Web III, Base de Datos II y Programacion III.
- Cursos/paralelos: `WEB3-G1-2026-1`, `BD2-G1-2026-1`, `PROG3-G2-2026-1`.
- Inscripciones demo para los cuatro estudiantes.
- Solicitudes demo con estados pendiente, observado y aprobado.
- Asistencias demo con estados `P` y `F`.
- Notificaciones demo.
- Auditoria demo.

## Nota para el equipo

Si se cambia `backend/scripts/seed.js`, tambien se debe actualizar este archivo.
