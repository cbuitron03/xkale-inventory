from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.ticket import Ticket
from app.schemas.ticket import TicketCreate, TicketUpdate, TicketOut
from app.auth import require_admin_or_tecnico, require_any_role
from typing import List

router = APIRouter(prefix="/tickets", tags=["Tickets"])

@router.get("/", response_model=List[TicketOut])
def listar_tickets(db: Session = Depends(get_db), _=Depends(require_any_role)):
    return db.query(Ticket).all()

@router.get("/{id}", response_model=TicketOut)
def obtener_ticket(id: int, db: Session = Depends(get_db), _=Depends(require_any_role)):
    ticket = db.query(Ticket).filter(Ticket.id_ticket == id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket no encontrado")
    return ticket

@router.post("/", response_model=TicketOut)
def crear_ticket(data: TicketCreate, db: Session = Depends(get_db), _=Depends(require_admin_or_tecnico)):
    ticket = Ticket(**data.model_dump())
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return ticket

@router.put("/{id}", response_model=TicketOut)
def actualizar_ticket(id: int, data: TicketUpdate, db: Session = Depends(get_db), _=Depends(require_admin_or_tecnico)):
    ticket = db.query(Ticket).filter(Ticket.id_ticket == id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket no encontrado")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(ticket, key, value)
    db.commit()
    db.refresh(ticket)
    return ticket

@router.delete("/{id}")
def eliminar_ticket(id: int, db: Session = Depends(get_db), _=Depends(require_admin_or_tecnico)):
    ticket = db.query(Ticket).filter(Ticket.id_ticket == id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket no encontrado")
    db.delete(ticket)
    db.commit()
    return {"message": "Ticket eliminado"}
