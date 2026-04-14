from sqlalchemy import Column, Integer, Text
from app.database import Base

class Usuario(Base):
    __tablename__ = "usuario"

    id_usuario = Column(Integer, primary_key=True, index=True)
    nombre     = Column(Text)
    apellido   = Column(Text)
    correo     = Column(Text)
