# Estructura base del proyecto

```txt
SIGEPEJ/
  backend/
    src/
      config/
      constants/
      controllers/
      middlewares/
      models/
      routes/
      seed/
      services/
      utils/
      validators/
    tests/
  frontend/
    src/
      api/
      assets/
      components/
      context/
      features/
      layouts/
      routes/
      styles/
    tests/
  docs/
    api/
    architecture/
    database/
    screens/
    sprints/
  preview/
```

## Criterio de trabajo

La base solo deja preparado el arranque tecnico. Cada modulo funcional debe implementarse como tarea separada en Trello.

## Flujo recomendado de ramas

- `main`: version estable.
- `Development`: integracion del equipo.
- Rama por integrante: desarrollo individual.

Antes de mezclar cambios, probar:

```bash
cd backend
npm install
npm run dev
```

```bash
cd frontend
npm install
npm run dev
```
