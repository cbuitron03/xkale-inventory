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

- **React 19 + Vite + React Router v7** — all pages are lazy-loaded with `React.lazy` + `Suspense`
- **`App.jsx`** — root router; wraps everything in `AuthProvider` and uses `ProtectedRoute` for auth/role gating
- **`context/AuthContext.jsx`** — single source of truth for auth state; exposes `isAdmin`, `isTecnico`, `isInventario`, `canManageUsers`, `canCreateTicket`, `canCreateLaptop`
- **`api/client.js`** — Axios instance with a Bearer token interceptor; on 401 it redirects to `/login`; all API modules import from here
- **`api/`** — one module per resource (`auth.js`, `laptops.js`, `tickets.js`, `usuarios.js`, `tecnicos.js`)
- **TanStack Query v5** is installed; use it for server-state fetching in new features
- **Tailwind CSS** with a custom dark-theme palette (see `tailwind.config.js`): primary `#6AE000`, dark bg `#0D0D0D`, card `#141414`, elevated `#1F1F1F`, modal `#111111`; fonts are Inter (sans) and JetBrains Mono

### Backend (`backend/app/`)

- **FastAPI** with modular routers in `routers/` — one file per resource (`auth`, `laptops`, `tickets`, `usuarios`, `tecnicos`, `consultas`)
- **`main.py`** — mounts all routers, permissive CORS (all origins allowed)
- **`auth.py`** — JWT (HS256, 480 min expiry), bcrypt password hashing, three roles: `admin`, `tecnico`, `inventario`; role guards are FastAPI `Depends` decorators (`require_admin`, `require_admin_or_tecnico`, `require_any_role`)
- **`database.py`** — SQLAlchemy `SessionLocal`; routers inject a DB session via `Depends(get_db)`
- **`models/`** — SQLAlchemy ORM models; key relationships: `Usuario` ← `Laptop` ← `Ticket`
- **`schemas/`** — Pydantic v2 models for request/response validation
- **Alembic** is installed for migrations but not yet wired up — schema changes currently require manual migration steps

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
- The `consultas` router handles cross-resource query endpoints (not a standard CRUD resource).
