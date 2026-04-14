from app.database import SessionLocal
from app.models.auth_user import AuthUser
from app.auth import hash_password

db = SessionLocal()

# Cambia estos valores
USERNAME = "admin"
PASSWORD = "xkale2024"
EMAIL    = "admin@xkale.com"

existing = db.query(AuthUser).filter(AuthUser.username == USERNAME).first()
if existing:
    print(f"⚠️  El usuario '{USERNAME}' ya existe")
else:
    user = AuthUser(
        username=USERNAME,
        email=EMAIL,
        hashed_password=hash_password(PASSWORD),
        rol="admin",
        activo=True
    )
    db.add(user)
    db.commit()
    print(f"✅ Admin creado: {USERNAME} / {PASSWORD}")

db.close()
