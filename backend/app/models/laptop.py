from sqlalchemy import Column, Integer, Text, Date, ForeignKey
from sqlalchemy.orm import relationship
from datetime import date
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
    garantia_hasta = Column(Date)

    usuario  = relationship("Usuario")
    tickets  = relationship("Ticket", back_populates="laptop")

    @property
    def garantia_vigente(self):
        # Se calcula en cada lectura: al pasar la fecha queda expirada sin intervención
        if self.garantia_hasta is None:
            return None
        return self.garantia_hasta >= date.today()
