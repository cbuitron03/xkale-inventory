from sqlalchemy import Column, Integer, Text, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Laptop(Base):
    __tablename__ = "laptop"

    id_laptop    = Column(Integer, primary_key=True, index=True)
    usu_id_laptop= Column(Integer, ForeignKey("usuario.id_usuario"))
    serial       = Column(Text)
    marca        = Column(Text)
    modelo       = Column(Text)
    cpu          = Column(Text)
    gpu          = Column(Text)
    ram          = Column(Text)
    disco        = Column(Text)
    pantalla     = Column(Text)
    no_factura   = Column(Text)
    fecha_compra = Column(Date)
    hostname     = Column(Text)

    usuario  = relationship("Usuario")
    tickets  = relationship("Ticket", back_populates="laptop")
