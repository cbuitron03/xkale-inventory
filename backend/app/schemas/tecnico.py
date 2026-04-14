from pydantic import BaseModel
from typing import Optional

class TecnicoBase(BaseModel):
    tecnico_nombre: Optional[str] = None
    tecnico_correo: Optional[str] = None

class TecnicoCreate(TecnicoBase):
    pass

class TecnicoUpdate(TecnicoBase):
    pass

class TecnicoOut(TecnicoBase):
    id_tecnico: int
    class Config:
        from_attributes = True
