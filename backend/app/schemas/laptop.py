from pydantic import BaseModel
from typing import Optional
from datetime import date

class LaptopBase(BaseModel):
    usu_id_laptop: Optional[int]  = None
    serial:        Optional[str]  = None
    marca:         Optional[str]  = None
    modelo:        Optional[str]  = None
    cpu:           Optional[str]  = None
    gpu:           Optional[str]  = None
    ram:           Optional[str]  = None
    disco:         Optional[str]  = None
    pantalla:      Optional[str]  = None
    no_factura:    Optional[str]  = None
    fecha_compra:  Optional[date] = None
    hostname:      Optional[str]  = None

class LaptopCreate(LaptopBase):
    pass

class LaptopUpdate(LaptopBase):
    pass

class LaptopOut(LaptopBase):
    id_laptop: int
    class Config:
        from_attributes = True
