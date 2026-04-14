from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.tecnico import Tecnico
from app.schemas.tecnico import TecnicoCreate, TecnicoUpdate, TecnicoOut
from app.auth import require_admin, require_admin_or_tecnico, require_any_role
from typing import List

router = APIRouter(prefix="/tecnicos", tags=["Técnicos"])

@router.get("/", response_model=List[TecnicoOut])
def listar_tecnicos(db: Session = Depends(get_db), _=Depends(require_any_role)):
    return db.query(Tecnico).all()

@router.get("/{id}", response_model=TecnicoOut)
def obtener_tecnico(id: int, db: Session = Depends(get_db), _=Depends(require_any_role)):
    tecnico = db.query(Tecnico).filter(Tecnico.id_tecnico == id).first()
    if not tecnico:
        raise HTTPException(status_code=404, detail="Técnico no encontrado")
    return tecnico

@router.post("/", response_model=TecnicoOut)
def crear_tecnico(data: TecnicoCreate, db: Session = Depends(get_db), _=Depends(require_admin)):
    tecnico = Tecnico(**data.model_dump())
    db.add(tecnico)
    db.commit()
    db.refresh(tecnico)
    return tecnico

@router.put("/{id}", response_model=TecnicoOut)
def actualizar_tecnico(id: int, data: TecnicoUpdate, db: Session = Depends(get_db), _=Depends(require_admin)):
    tecnico = db.query(Tecnico).filter(Tecnico.id_tecnico == id).first()
    if not tecnico:
        raise HTTPException(status_code=404, detail="Técnico no encontrado")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(tecnico, key, value)
    db.commit()
    db.refresh(tecnico)
    return tecnico

@router.delete("/{id}")
def eliminar_tecnico(id: int, db: Session = Depends(get_db), _=Depends(require_admin)):
    tecnico = db.query(Tecnico).filter(Tecnico.id_tecnico == id).first()
    if not tecnico:
        raise HTTPException(status_code=404, detail="Técnico no encontrado")
    db.delete(tecnico)
    db.commit()
    return {"message": "Técnico eliminado"}
