from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.usuario import Usuario
from app.schemas.usuario import UsuarioCreate, UsuarioUpdate, UsuarioOut
from app.auth import require_admin, require_any_role
from typing import List

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])

@router.get("/", response_model=List[UsuarioOut])
def listar_usuarios(db: Session = Depends(get_db), _=Depends(require_any_role)):
    return db.query(Usuario).all()

@router.get("/{id}", response_model=UsuarioOut)
def obtener_usuario(id: int, db: Session = Depends(get_db), _=Depends(require_any_role)):
    usuario = db.query(Usuario).filter(Usuario.id_usuario == id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return usuario

@router.post("/", response_model=UsuarioOut)
def crear_usuario(data: UsuarioCreate, db: Session = Depends(get_db), _=Depends(require_admin)):
    usuario = Usuario(**data.model_dump())
    db.add(usuario)
    db.commit()
    db.refresh(usuario)
    return usuario

@router.put("/{id}", response_model=UsuarioOut)
def actualizar_usuario(id: int, data: UsuarioUpdate, db: Session = Depends(get_db), _=Depends(require_admin)):
    usuario = db.query(Usuario).filter(Usuario.id_usuario == id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(usuario, key, value)
    db.commit()
    db.refresh(usuario)
    return usuario

@router.delete("/{id}")
def eliminar_usuario(id: int, db: Session = Depends(get_db), _=Depends(require_admin)):
    usuario = db.query(Usuario).filter(Usuario.id_usuario == id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    db.delete(usuario)
    db.commit()
    return {"message": "Usuario eliminado"}
