from sqlalchemy import Column, Integer, Text, Boolean, DateTime
from sqlalchemy.sql import func
from app.database import Base

class AuthUser(Base):
    __tablename__ = "auth_user"

    id_auth          = Column(Integer, primary_key=True, index=True)
    username         = Column(Text, unique=True, nullable=False)
    email            = Column(Text)
    hashed_password  = Column(Text, nullable=False)
    rol              = Column(Text, nullable=False, default="inventario")
    activo           = Column(Boolean, default=True)
    created_at       = Column(DateTime, server_default=func.now())
