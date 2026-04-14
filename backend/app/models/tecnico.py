from sqlalchemy import Column, Integer, Text
from app.database import Base

class Tecnico(Base):
    __tablename__ = "tecnico"

    id_tecnico      = Column(Integer, primary_key=True, index=True)
    tecnico_nombre  = Column(Text)
    tecnico_correo  = Column(Text)
