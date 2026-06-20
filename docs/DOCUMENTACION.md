# Documentación del Proyecto SIGEPEJ

**Sistema de Gestión de Solicitudes de Ausencia Estudiantil y Docente**

---

## 1. GitHub — Control de Versiones

### 1.1 Repositorio
- **URL:** https://github.com/ricardoNP0/SIGEPEJ
- **Plataforma:** GitHub
- **Visibilidad:** Privado (equipo de desarrollo)

### 1.2 Estructura de Ramas
| Rama | Propósito |
|------|-----------|
| `main` | Rama principal, estable |
| `LuisDev` | Desarrollo activo — funcionalidades generales y correcciones |
| `DanielDev` | Desarrollo de módulo docente y asistencia |
| `JosueDev` | Desarrollo de módulo de solicitudes |
| `Development` | Integración de cambios antes de main |
| `gh-pages` | Despliegue del frontend estático |

### 1.3 Flujo de Trabajo
1. Cada desarrollador trabaja en su rama individual (`LuisDev`, `DanielDev`, `JosueDev`)
2. Los cambios se integran mediante Pull Requests a `Development`
3. Después de validación, se fusionan a `main`
4. El frontend se despliega automáticamente desde `gh-pages`

### 1.4 Commits Relevantes (30+ commits total)
- Estructura base del proyecto y prototipo
- Implementación de layout por roles (estudiante, docente, director, secretario, admin)
- CRUD de solicitudes de ausencia con estados (pendiente, aprobada, rechazada)
- Integración de asistencias y marcación de faltas
- Módulo de notificaciones y auditoría
- Gestión de usuarios con roles, contraseñas y restablecimiento
- Reportes y catálogos académicos
- Despliegue con GitHub Pages + SPA redirect handler

---

## 2. Trello — Gestión del Proyecto

### 2.1 Metodología
Se utilizó **Trello** con metodología **Kanban** dividido en **3 sprints**. Cada sprint agrupa tareas por área (Frontend, Backend, Coordinación).

### 2.2 Estructura del Tablero

**Sprint 1 — Base funcional, datos y autenticación**
- T01: Layout frontend por roles
- T02: Colecciones y seed de MongoDB
- T03: Autenticación JWT + middleware de roles
- T04: CRUD de solicitudes (backend)
- T05: Formulario de solicitud de ausencia (frontend)

**Sprint 2 — Aprobaciones y notificaciones**
- T06: Bandeja de revisión para director/secretario
- T07: Notificaciones internas
- T08: Historial de solicitudes para el estudiante
- T09: Dashboard con estadísticas
- T10: Gestión de usuarios y roles

**Sprint 3 — Asistencia y cierre**
- T11: Registro de asistencia diaria por materia
- T12: Marcación de faltas (F) por parte del docente
- T13: Vinculación de solicitudes aprobadas con justificaciones
- T14: Reportes y exportación
- T15: Auditoría de cambios
- T16: Dashboard con datos dinámicos
- T18: Gestión de contraseñas y restablecimiento

### 2.3 Responsables por Área
- **Frontend 1 (Luis):** Layout, formularios, dashboard, usuarios, contraseñas
- **Frontend 2 (Josue):** Solicitudes, historial, notificaciones
- **Frontend 3 (Daniel):** Asistencia, faltas, marcación F
- **Backend (Coordinación):** API, modelos MongoDB, autenticación, seed

---

## 3. Código Fuente — Arquitectura del Sistema

### 3.1 Stack Tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Frontend | React 19 + Vite 6 | 19.x / 6.x |
| Lenguaje | JavaScript (JSX) | ES2022 |
|Routing | React Router DOM | 7.x |
| Íconos | Lucide React | Última |
| Backend | Node.js + Express | 20+ / 4.x |
| Base de Datos | MongoDB Atlas | 7.x |
| Despliegue | GitHub Pages | Estático |

### 3.2 Estructura del Proyecto

```
SIGEPEJ/
├── frontend/          # Aplicación React (Vite)
│   ├── src/
│   │   ├── api/           # Cliente HTTP + mock data (localStorage)
│   │   ├── components/    # Componentes reutilizables
│   │   ├── context/       # AuthContext (login/logout/roles)
│   │   ├── features/      # Páginas por módulo
│   │   │   ├── auth/      # Login, registro, restablecimiento
│   │   │   ├── requests/  # Solicitudes, revisión, historial
│   │   │   ├── attendance/ # Asistencia y faltas
│   │   │   ├── users/     # Gestión de usuarios
│   │   │   ├── notifications/ # Notificaciones
│   │   │   ├── reports/   # Reportes
│   │   │   ├── catalogs/  # Catálogos (carreras, materias)
│   │   │   └── audit/     # Auditoría
│   │   ├── layouts/       # AppLayout (sidebar + topbar)
│   │   ├── routes/        # Configuración de menús por rol
│   │   └── styles/        # CSS global
│   └── dist/              # Build de producción
├── backend/           # API REST (Express + MongoDB)
│   ├── src/           # Controladores, modelos, rutas
│   ├── scripts/       # Seed de datos
│   └── server.js      # Punto de entrada
├── docs/              # Documentación técnica
└── preview/           # Prototipo visual (HTML)
```

### 3.3 Principales Funcionalidades

1. **Autenticación por roles** — Login con username/email + contraseña; 5 roles con rutas protegidas
2. **Solicitudes de ausencia** — Creación, revisión, aprobación/rechazo por director/secretario
3. **Asistencia diaria** — Registro de asistencia por materia, marcación de faltas (F)
4. **Dashboard dinámico** — Estadísticas según el rol del usuario
5. **Notificaciones** — Sistema interno de notificaciones en tiempo real
6. **Usuarios y roles** — CRUD de usuarios con códigos auto-generados por rol
7. **Gestión de contraseñas** — Cambio de contraseña, solicitud de restablecimiento, aprobación
8. **Reportes y auditoría** — Trazabilidad de acciones críticas

### 3.4 Almacenamiento de Datos
- **Online:** MongoDB Atlas (cuando el backend está disponible)
- **Offline/Demo:** localStorage con datos mock (`sigepej_mock_*`)
- La aplicación funciona completamente en modo demo sin backend activo

---

## 4. IA — Uso de Inteligencia Artificial

### 4.1 Herramientas Utilizadas

| Herramienta | Propósito |
|-------------|-----------|
| **OpenCode (Claude)** | Asistente de codificación en terminal |
| **Claude (Anthropic)** | Generación y revisión de código |
| **GitHub Copilot** | Autocompletado y sugerencias en VSCode |

### 4.2 Áreas de Aplicación

1. **Generación de componentes React** — Formularios, tablas, modales y paneles generados con IA
2. **Corrección de bugs** — Detección y solución de errores (timezone, conteo de estadísticas, roles)
3. **Implementación de flujos completos** — Sistema de restablecimiento de contraseñas con aprobación por roles
4. **Despliegue automatizado** — Configuración de GitHub Pages con SPA redirect handler
5. **Refactorización de código** — Mejora de estructura y legibilidad
6. **Documentación** — Generación de esta documentación

### 4.3 Prompts Significativos
- Creación del layout responsivo por roles de usuario
- Implementación de persistencia de contraseñas en modo mock
- Corrección de formato de fechas (DD/MM/AAAA con timezone)
- Sistema de solicitud y aprobación de restablecimiento de contraseña
- Configuración de despliegue a GitHub Pages con SPA routing

---

## 5. Agentes — Agentes de IA Utilizados

### 5.1 Agentes disponibles en OpenCode

| Agente | Función |
|--------|---------|
| **Explore** | Búsqueda y exploración de código fuente |
| **General** | Tareas multi-paso complejas |

### 5.2 Flujo de Trabajo con Agentes

1. **Exploración inicial:** El agente `explore` analiza la estructura del proyecto y archivos relevantes
2. **Planificación:** Se definen los cambios necesarios basados en los requisitos
3. **Implementación:** El agente `general` ejecuta tareas multi-paso:
   - Lectura de archivos existentes
   - Edición de código
   - Verificación de compilación (build)
4. **Verificación:** Se ejecuta `npm run build` para confirmar que no hay errores
5. **Commit y push:** Los cambios se suben a la rama correspondiente

### 5.3 Ejemplo de Ciclo con Agente

```
Usuario: "Agregar campo contraseña al crear usuario"
→ Agente busca UsersPage.jsx y client.js
→ Agente edita formulario, API y mock data
→ Build exitoso → commit → push
```

---

## 6. Instalación y Ejecución

### 6.1 Requisitos
- Node.js 20+
- npm
- Git
- Conexión a internet (para MongoDB Atlas)

### 6.2 Instalación Local

```bash
# Clonar repositorio
git clone https://github.com/ricardoNP0/SIGEPEJ.git
cd SIGEPEJ

# Backend
cd backend
npm install
npm run check:db
npm run seed
npm run dev

# Frontend (nueva terminal)
cd frontend
npm install
npm run dev
```

### 6.3 Usuarios de Prueba

| Usuario | Rol | Contraseña |
|---------|-----|------------|
| admin | Administrador | password123 |
| director_sistemas | Director de Carrera | password123 |
| secretaria_sistemas | Secretario Académico | password123 |
| ana_rojas | Docente | password123 |
| ricardo_np | Estudiante | password123 |

### 6.4 Despliegue en Producción

```bash
cd frontend
npm run build
# El contenido de frontend/dist se sirve como estático
```

---

## 7. Enlaces de Interés

| Recurso | URL |
|---------|-----|
| Repositorio GitHub | https://github.com/ricardoNP0/SIGEPEJ |
| Sitio desplegado (GitHub Pages) | https://ricardonp0.github.io/SIGEPEJ |
| Documentación técnica | `/docs/` en el repositorio |
| Prototipo visual | `preview/index.html` |

---

*Documentación generada para la presentación del proyecto SIGEPEJ.*
*Junio 2026*
