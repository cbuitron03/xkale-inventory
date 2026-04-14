from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import usuarios_router, tecnicos_router, laptops_router, tickets_router
from app.routers.auth import router as auth_router

app = FastAPI(
    title="Xkale Inventory API",
    description="Sistema de gestión de inventario IT - Xkale",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(usuarios_router)
app.include_router(tecnicos_router)
app.include_router(laptops_router)
app.include_router(tickets_router)

@app.get("/")
def root():
    return {"status": "ok", "message": "Xkale Inventory API corriendo"}
