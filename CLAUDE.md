# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**xkale-inventory** is an IT asset management system for tracking laptops, employees (usuarios), technicians (técnicos), and support tickets. The UI is entirely in Spanish. It uses a React frontend and FastAPI backend with a cloud-hosted PostgreSQL database (Aiven).

---

## Development Commands

### Frontend (`frontend/`)

```bash
npm run dev       # Start Vite dev server at http://localhost:5173
npm run build     # Production build
npm run lint      # ESLint (flat config, React hooks + React Refresh rules)
npm run preview   # Preview production build
```

### Backend (`backend/`)

```bash
source venv/bin/activate          # Activate virtual environment
pip install -r requirements.txt   # Install dependencies
uvicorn app.main:app --reload     # Start API at http://127.0.0.1:8000
python create_admin.py            # Seed initial admin user
```

The frontend proxies API calls to `http://127.0.0.1:8000` via `VITE_API_URL` in `frontend/.env`.

---

## Architecture

### Frontend (`frontend/src/`)

- **React 19 + Vite + React Router v7** — all pages except `LoginPage` are lazy-loaded with `React.lazy` + `Suspense`
- **`App.jsx`** — root router; wraps everything in `AuthProvider` and uses `ProtectedRoute` for auth/role gating
- **`context/AuthContext.jsx`** — single source of truth for auth state; JWT and user info are stored in `localStorage` under keys `token` and `user`; exposes `isAdmin`, `isTecnico`, `isInventario`, `canManageUsers`, `canCreateTicket`, `canCreateLaptop`
- **`api/client.js`** — Axios instance with a Bearer token interceptor; on 401 it clears localStorage and hard-redirects to `/login`; all API modules import from here
- **`api/`** — one module per resource (`auth.js`, `laptops.js`, `tickets.js`, `usuarios.js`, `tecnicos.js`)
- **TanStack Query v5** is installed; use it for server-state fetching in new features
- **Tailwind CSS** with a custom dark-theme palette (see `tailwind.config.js` and `src/theme/index.js`): primary `#6AE000`, dark bg `#0D0D0D`, card `#141414`, elevated `#1F1F1F`, modal `#111111`; fonts are Inter (sans) and JetBrains Mono
- **`lucide-react`** for icons; **`clsx`** for conditional class composition

### Backend (`backend/app/`)

- **FastAPI** with modular routers in `routers/` — one file per resource (`auth`, `laptops`, `tickets`, `usuarios`, `tecnicos`, `consultas`); interactive API docs at `http://127.0.0.1:8000/docs`
- **`main.py`** — mounts all routers, permissive CORS (all origins allowed)
- **`auth.py`** — JWT (HS256, 480 min expiry), bcrypt password hashing, three roles: `admin`, `tecnico`, `inventario`; role guards are FastAPI `Depends` decorators (`require_admin`, `require_admin_or_tecnico`, `require_any_role`)
- **`database.py`** — SQLAlchemy `SessionLocal`; routers inject a DB session via `Depends(get_db)`
- **`models/`** — SQLAlchemy ORM models; key relationships: `Usuario` ← `Laptop` ← `Ticket`; primary keys follow the pattern `id_<tablename>`
- **`schemas/`** — Pydantic v2 models for request/response validation
- **Alembic** is installed for migrations but not yet wired up — schema changes currently require manual migration steps
- **No test suite exists** in this project

### Two distinct user concepts

This is the most important architectural distinction:

| Model | Table | Purpose |
|-------|-------|---------|
| `AuthUser` | `auth_user` | App login credentials (username, hashed_password, rol, `activo` flag) |
| `Usuario` | `usuario` | Business-level employee record (nombre, apellido, correo) |

There is **no foreign key** between them. `AuthUser` controls who can log in; `Usuario` is the inventory entity that owns laptops. The `activo` boolean on `AuthUser` soft-disables login without deleting the record.

### `consultas` router — cross-resource queries

The frontend's `LaptopDetail` page (`/laptops/:hostname`) resolves via `GET /consultas/laptops/hostname/{hostname}/detalle`, **not** the standard CRUD endpoint `GET /laptops/{id}`. All `consultas` endpoints use `require_any_role` and return joined/nested data:

- `GET /consultas/laptops/hostname/{hostname}/detalle` — laptop with nested `usuario` and `tickets`
- `GET /consultas/tickets/hostname/{hostname}/detalle` — tickets for a laptop
- `GET /consultas/usuarios/correo/{correo}/laptops` — employee with their laptops
- `GET /consultas/usuarios/correo/{correo}` — employee lookup by email
- `GET /consultas/laptops/marca/{marca}` — laptops filtered by brand
- `GET /consultas/tickets/tecnico/{correo}` — tickets assigned to a technician

### Roles & Access Control

| Role         | Capabilities                                      |
|--------------|---------------------------------------------------|
| `admin`      | Full access; manage auth users                   |
| `tecnico`    | Create/manage tickets; view laptops               |
| `inventario` | Create/manage laptops and usuarios; view tickets  |

---

## Key Conventions

- Field names and UI labels are in **Spanish** — keep new additions consistent.
- Backend schemas use `model_config = ConfigDict(from_attributes=True)` (Pydantic v2 ORM mode).
- Do not add `allow_origins` restrictions until the deployment target is defined — the current permissive CORS is intentional for development.
- The `consultas` router handles cross-resource query endpoints (not a standard CRUD resource) — see the dedicated section above.
- Standard CRUD routers address resources by integer PK (`/laptops/{id}`); the `consultas` router uses natural keys (hostname, correo, marca).
