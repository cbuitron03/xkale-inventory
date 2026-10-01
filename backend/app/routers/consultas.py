from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from app.database import get_db
from app.models.laptop import Laptop
from app.models.usuario import Usuario
from app.models.tecnico import Tecnico
from app.models.ticket import Ticket
from app.auth import require_any_role
from pydantic import BaseModel
from typing import List, Optional
from datetime import date

router = APIRouter(prefix="/consultas", tags=["Consultas Avanzadas"])

# ── Schemas ───────────────────────────────────────────────
class TicketResumen(BaseModel):
    id_ticket:    int
    incidencia:   Optional[str]
    estado:       Optional[str]
    fecha_inicio: Optional[date]
    fecha_cierre: Optional[date]
    solucion:     Optional[str]
    class Config:
        from_attributes = True

class UsuarioResumen(BaseModel):
    id_usuario: int
    nombre:     Optional[str]
    apellido:   Optional[str]
    correo:     Optional[str]
    class Config:
        from_attributes = True

class LaptopResumen(BaseModel):
    id_laptop: int
    serial:    Optional[str]
    marca:     Optional[str]
    modelo:    Optional[str]
    hostname:  Optional[str]
    class Config:
        from_attributes = True

class TecnicoResumen(BaseModel):
    id_tecnico:     int
    tecnico_nombre: Optional[str]
    tecnico_correo: Optional[str]
    class Config:
        from_attributes = True

class LaptopDetalle(BaseModel):
    id_laptop:    int
    serial:       Optional[str]
    marca:        Optional[str]
    modelo:       Optional[str]
    cpu:          Optional[str]
    gpu:          Optional[str]
    ram:          Optional[str]
    disco:        Optional[str]
    pantalla:     Optional[str]
    no_factura:   Optional[str]
    fecha_compra: Optional[date]
    hostname:     Optional[str]
    garantia_hasta:   Optional[date] = None
    garantia_vigente: Optional[bool] = None
    activa:           bool = True
    usuario:      Optional[UsuarioResumen]
    tickets:      List[TicketResumen] = []
    class Config:
        from_attributes = True

class TicketDetalle(BaseModel):
    id_ticket:    int
    incidencia:   Optional[str]
    descripcion:  Optional[str]
    estado:       Optional[str]
    fecha_inicio: Optional[date]
    fecha_cierre: Optional[date]
    solucion:     Optional[str]
    tecnico:      Optional[TecnicoResumen]
    laptop:       Optional[LaptopResumen]
    class Config:
        from_attributes = True

class UsuarioConLaptops(BaseModel):
    id_usuario: int
    nombre:     Optional[str]
    apellido:   Optional[str]
    correo:     Optional[str]
    laptops:    List[LaptopResumen] = []
    class Config:
        from_attributes = True

# ── 1. Laptop detalle por hostname ────────────────────────
@router.get("/laptops/hostname/{hostname}/detalle", response_model=LaptopDetalle)
def laptop_detalle_por_hostname(hostname: str, db: Session = Depends(get_db), _=Depends(require_any_role)):
    laptop = (
        db.query(Laptop)
        .options(joinedload(Laptop.usuario), joinedload(Laptop.tickets))
        .filter(Laptop.hostname.ilike(f"%{hostname}%"))
        .first()
    )
    if not laptop:
        raise HTTPException(status_code=404, detail="Laptop no encontrada")
    return laptop

# ── 2. Tickets de una laptop por hostname ─────────────────
@router.get("/tickets/hostname/{hostname}/detalle", response_model=List[TicketDetalle])
def tickets_detalle_por_hostname(hostname: str, db: Session = Depends(get_db), _=Depends(require_any_role)):
    laptop = db.query(Laptop).filter(Laptop.hostname.ilike(f"%{hostname}%")).first()
    if not laptop:
        raise HTTPException(status_code=404, detail="Laptop no encontrada")
    tickets = (
        db.query(Ticket)
        .options(joinedload(Ticket.tecnico), joinedload(Ticket.laptop))
        .filter(Ticket.lap_id == laptop.id_laptop)
        .all()
    )
    return tickets

# ── 3. Usuario con laptops por correo ─────────────────────
@router.get("/usuarios/correo/{correo}/laptops", response_model=UsuarioConLaptops)
def usuario_laptops_por_correo(correo: str, db: Session = Depends(get_db), _=Depends(require_any_role)):
    usuario = db.query(Usuario).filter(Usuario.correo == correo).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    laptops = db.query(Laptop).filter(Laptop.usu_id_laptop == usuario.id_usuario).all()
    return {
        "id_usuario": usuario.id_usuario,
        "nombre":     usuario.nombre,
        "apellido":   usuario.apellido,
        "correo":     usuario.correo,
        "laptops":    laptops,
    }

# ── 4. Buscar usuario por correo ──────────────────────────
@router.get("/usuarios/correo/{correo}", response_model=UsuarioResumen)
def usuario_por_correo(correo: str, db: Session = Depends(get_db), _=Depends(require_any_role)):
    usuario = db.query(Usuario).filter(Usuario.correo == correo).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return usuario

# ── 5. Laptops por marca ──────────────────────────────────
@router.get("/laptops/marca/{marca}", response_model=List[LaptopDetalle])
def laptops_por_marca(marca: str, db: Session = Depends(get_db), _=Depends(require_any_role)):
    laptops = (
        db.query(Laptop)
        .options(joinedload(Laptop.usuario), joinedload(Laptop.tickets))
        .filter(Laptop.marca.ilike(f"%{marca}%"))
        .all()
    )
    if not laptops:
        raise HTTPException(status_code=404, detail="No se encontraron laptops con esa marca")
    return laptops

# ── 6. Tickets por correo del técnico ─────────────────────
@router.get("/tickets/tecnico/{correo}", response_model=List[TicketDetalle])
def tickets_por_correo_tecnico(correo: str, db: Session = Depends(get_db), _=Depends(require_any_role)):
    tecnico = db.query(Tecnico).filter(Tecnico.tecnico_correo == correo).first()
    if not tecnico:
        raise HTTPException(status_code=404, detail="Técnico no encontrado")
    tickets = (
        db.query(Ticket)
        .options(joinedload(Ticket.tecnico), joinedload(Ticket.laptop))
        .filter(Ticket.tec_id == tecnico.id_tecnico)
        .all()
    )
    return tickets
