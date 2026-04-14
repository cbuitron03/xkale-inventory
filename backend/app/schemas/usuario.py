from pydantic import BaseModel
from typing import Optional

class UsuarioBase(BaseModel):
    nombre:   Optional[str] = None
    apellido: Optional[str] = None
    correo:   Optional[str] = None

class UsuarioCreate(UsuarioBase):
    pass

class UsuarioUpdate(UsuarioBase):
    pass

class UsuarioOut(UsuarioBase):
    id_usuario: int
    class Config:
        from_attributes = True
