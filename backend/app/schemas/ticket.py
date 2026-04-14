from pydantic import BaseModel
from typing import Optional
from datetime import date

class TicketBase(BaseModel):
    tec_id:       Optional[int]  = None
    lap_id:       Optional[int]  = None
    incidencia:   Optional[str]  = None
    descripcion:  Optional[str]  = None
    estado:       Optional[str]  = None
    fecha_inicio: Optional[date] = None
    fecha_cierre: Optional[date] = None
    solucion:     Optional[str]  = None

class TicketCreate(TicketBase):
    pass

class TicketUpdate(TicketBase):
    pass

class TicketOut(TicketBase):
    id_ticket: int
    class Config:
        from_attributes = True
