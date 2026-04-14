from sqlalchemy import Column, Integer, Text, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Ticket(Base):
    __tablename__ = "ticket"

    id_ticket    = Column(Integer, primary_key=True, index=True)
    tec_id       = Column(Integer, ForeignKey("tecnico.id_tecnico"))
    lap_id       = Column(Integer, ForeignKey("laptop.id_laptop"))
    incidencia   = Column(Text)
    descripcion  = Column(Text)
    estado       = Column(Text)
    fecha_inicio = Column(Date)
    fecha_cierre = Column(Date)
    solucion     = Column(Text)

    tecnico = relationship("Tecnico")
    laptop  = relationship("Laptop", back_populates="tickets")
