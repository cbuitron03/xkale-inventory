from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.auth_user import AuthUser
from app.auth import hash_password, verify_password, create_access_token, get_current_user, require_admin
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/auth", tags=["Autenticación"])

# ── Schemas ───────────────────────────────────────────────
class UserCreate(BaseModel):
    username: str
    email:    Optional[str] = None
    password: str
    rol:      Optional[str] = "inventario"

class UserOut(BaseModel):
    id_auth:  int
    username: str
    email:    Optional[str]
    rol:      str
    activo:   bool
    class Config:
        from_attributes = True

class ChangePassword(BaseModel):
    username:     str
    new_password: str

class ChangeRole(BaseModel):
    rol: str

class TokenOut(BaseModel):
    access_token: str
    token_type:   str
    rol:          str
    username:     str

# ── Login ─────────────────────────────────────────────────
@router.post("/login", response_model=TokenOut)
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(AuthUser).filter(AuthUser.username == form.username).first()
    if not user or not verify_password(form.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")
    if not user.activo:
        raise HTTPException(status_code=403, detail="Usuario desactivado")
    token = create_access_token({"sub": user.username, "rol": user.rol})
    return {"access_token": token, "token_type": "bearer", "rol": user.rol, "username": user.username}

# ── Registro (solo admin) ─────────────────────────────────
@router.post("/register", response_model=UserOut)
def register(data: UserCreate, db: Session = Depends(get_db), _=Depends(require_admin)):
    if db.query(AuthUser).filter(AuthUser.username == data.username).first():
        raise HTTPException(status_code=400, detail="El username ya existe")
    if data.rol not in ("admin", "tecnico", "inventario"):
        raise HTTPException(status_code=400, detail="Rol inválido")
    user = AuthUser(
        username=data.username,
        email=data.email,
        hashed_password=hash_password(data.password),
        rol=data.rol,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

# ── Listar usuarios (solo admin) ──────────────────────────
@router.get("/users", response_model=list[UserOut])
def listar_users(db: Session = Depends(get_db), _=Depends(require_admin)):
    return db.query(AuthUser).all()

# ── Cambiar contraseña (solo admin) ───────────────────────
@router.put("/change-password")
def change_password(data: ChangePassword, db: Session = Depends(get_db), _=Depends(require_admin)):
    user = db.query(AuthUser).filter(AuthUser.username == data.username).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    user.hashed_password = hash_password(data.new_password)
    db.commit()
    return {"message": "Contraseña actualizada"}

# ── Activar / Desactivar usuario (solo admin) ─────────────
@router.put("/toggle/{username}")
def toggle_user(username: str, db: Session = Depends(get_db), _=Depends(require_admin)):
    user = db.query(AuthUser).filter(AuthUser.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    user.activo = not user.activo
    db.commit()
    return {"message": f"Usuario {'activado' if user.activo else 'desactivado'}", "activo": user.activo}

# ── Cambiar rol (solo admin) ──────────────────────────────
@router.put("/role/{username}", response_model=UserOut)
def change_role(username: str, data: ChangeRole, db: Session = Depends(get_db), _=Depends(require_admin)):
    if data.rol not in ("admin", "tecnico", "inventario"):
        raise HTTPException(status_code=400, detail="Rol inválido")
    user = db.query(AuthUser).filter(AuthUser.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    if user.rol == "admin" and data.rol != "admin":
        admins_activos = db.query(AuthUser).filter(AuthUser.rol == "admin", AuthUser.activo == True).count()
        if user.activo and admins_activos <= 1:
            raise HTTPException(status_code=400, detail="Debe quedar al menos un admin activo")
    user.rol = data.rol
    db.commit()
    db.refresh(user)
    return user

# ── Perfil propio ─────────────────────────────────────────
@router.get("/me", response_model=UserOut)
def me(current_user: AuthUser = Depends(get_current_user)):
    return current_user
