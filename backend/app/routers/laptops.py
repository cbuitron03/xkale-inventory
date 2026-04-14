from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.laptop import Laptop
from app.schemas.laptop import LaptopCreate, LaptopUpdate, LaptopOut
from app.auth import require_admin, require_any_role
from typing import List

router = APIRouter(prefix="/laptops", tags=["Laptops"])

@router.get("/", response_model=List[LaptopOut])
def listar_laptops(db: Session = Depends(get_db), _=Depends(require_any_role)):
    return db.query(Laptop).all()

@router.get("/{id}", response_model=LaptopOut)
def obtener_laptop(id: int, db: Session = Depends(get_db), _=Depends(require_any_role)):
    laptop = db.query(Laptop).filter(Laptop.id_laptop == id).first()
    if not laptop:
        raise HTTPException(status_code=404, detail="Laptop no encontrada")
    return laptop

@router.post("/", response_model=LaptopOut)
def crear_laptop(data: LaptopCreate, db: Session = Depends(get_db), _=Depends(require_any_role)):
    laptop = Laptop(**data.model_dump())
    db.add(laptop)
    db.commit()
    db.refresh(laptop)
    return laptop

@router.put("/{id}", response_model=LaptopOut)
def actualizar_laptop(id: int, data: LaptopUpdate, db: Session = Depends(get_db), _=Depends(require_any_role)):
    laptop = db.query(Laptop).filter(Laptop.id_laptop == id).first()
    if not laptop:
        raise HTTPException(status_code=404, detail="Laptop no encontrada")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(laptop, key, value)
    db.commit()
    db.refresh(laptop)
    return laptop

@router.delete("/{id}")
def eliminar_laptop(id: int, db: Session = Depends(get_db), _=Depends(require_admin)):
    laptop = db.query(Laptop).filter(Laptop.id_laptop == id).first()
    if not laptop:
        raise HTTPException(status_code=404, detail="Laptop no encontrada")
    db.delete(laptop)
    db.commit()
    return {"message": "Laptop eliminada"}
