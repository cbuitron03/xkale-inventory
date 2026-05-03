# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Xkale Inventory is an IT equipment management system for Xkale. It has three parts:

- **`/backend`** — FastAPI + SQLAlchemy REST API backed by a hosted PostgreSQL database (Aiven Cloud)
- **`/frontend`** — React + Vite web SPA (dark-themed, Tailwind CSS)
- **Root (`/`)** — An Expo/React Native mobile app (currently a stub; `src/` and `App.js` are the entry points)

## Development Commands

### Backend

```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload
```

The API runs at `http://127.0.0.1:8000`. Interactive docs at `/docs`.

To create an initial admin user:
```bash
cd backend
source venv/bin/activate
python create_admin.py
```

To install dependencies:
```bash
cd backend && pip install -r requirements.txt
```

### Frontend

```bash
cd frontend
npm install
npm run dev      # dev server
npm run build    # production build
npm run lint     # ESLint
```

The frontend dev server runs at `http://localhost:5173` and proxies to the backend at `http://127.0.0.1:8000` via `VITE_API_URL`.

### Mobile (Expo)

```bash
npm install      # from root
npm start        # expo start
```

## Architecture

### Backend (`/backend/app/`)

- **`main.py`** — FastAPI app creation, CORS middleware, router registration
- **`database.py`** — SQLAlchemy engine and `get_db()` session dependency; reads `DATABASE_URL` from `.env`
- **`auth.py`** — JWT auth (HS256, 480-minute tokens), bcrypt password hashing, and three role-guard dependencies: `require_admin`, `require_admin_or_tecnico`, `require_any_role`
- **`models/`** — SQLAlchemy ORM models: `AuthUser`, `Laptop`, `Usuario`, `Tecnico`, `Ticket`
- **`schemas/`** — Pydantic v2 request/response schemas per entity
- **`routers/`** — One router per entity (`laptops`, `tickets`, `usuarios`, `tecnicos`, `auth`) plus `consultas.py` for multi-table join queries

**Key relationship**: `Laptop` belongs to a `Usuario` (via `usu_id_laptop`), and has many `Ticket`s. `Ticket` belongs to both `Laptop` and `Tecnico`. `AuthUser` is a separate auth-only table (not the same as `Usuario`).

### Frontend (`/frontend/src/`)

- **`main.jsx`** → **`App.jsx`** — Root render; `App.jsx` defines all routes and `ProtectedRoute` (role-based access)
- **`context/AuthContext.jsx`** — Global auth state. Persists JWT + user object in `localStorage`. Exposes `useAuth()` hook with `user`, `login`, `logout`, and permission booleans (`isAdmin`, `canCreateTicket`, etc.)
- **`api/client.js`** — Axios instance. Auto-attaches `Authorization: Bearer` header from `localStorage`. Redirects to `/login` on 401
- **`api/*.js`** — One file per resource (`auth`, `laptops`, `tickets`, `usuarios`, `tecnicos`); each calls `client.js`
- **`pages/`** — Route-level components organized by feature (`auth/`, `dashboard/`, `laptops/`, `tickets/`, `usuarios/`, `tecnicos/`)
- **`components/layout/`** — `Sidebar.jsx` filters nav items by `user.rol`; `Layout.jsx` wraps all protected pages

### Roles & Permissions

Three roles exist in `AuthUser.rol`: `admin`, `tecnico`, `inventario`.

| Route / Action     | admin | tecnico | inventario |
|--------------------|-------|---------|------------|
| All pages          | ✓     | ✓       | ✓          |
| Usuarios page      | ✓     |         | ✓          |
| Técnicos page      | ✓     |         |            |
| Accesos page       | ✓     |         |            |
| Create ticket      | ✓     | ✓       |            |
| Create laptop      | ✓     |         | ✓          |

### Design System

The frontend uses Tailwind with a dark-mode-only custom palette defined in [frontend/tailwind.config.js](frontend/tailwind.config.js). Key color tokens: `primary` (#6AE000 green), `card` (#141414), `elevated` (#1F1F1F), `border` (#2A2A2A), `danger` (#FF4545). Use these tokens rather than arbitrary hex values.

## Environment

Backend needs `backend/.env`:
```
DATABASE_URL=postgresql+psycopg2://...
SECRET_KEY=...
```

Frontend needs `frontend/.env`:
```
VITE_API_URL=http://127.0.0.1:8000
```
