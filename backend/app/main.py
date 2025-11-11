import os
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from . import models
from .database import engine, SessionLocal
from .schemas import SignUpIn, LoginIn, UserOut

# Create DB tables
models.Base.metadata.create_all(bind=engine)


app = FastAPI(title='IntelliOS Backend')

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Use pbkdf2_sha256 to avoid platform bcrypt issues and the 72-byte limit
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")


@app.post('/api/auth/signup', status_code=201, response_model=UserOut)
def signup(payload: SignUpIn, db: Session = Depends(get_db)):
    email = payload.email.lower()
    existing = db.query(models.User).filter(models.User.email == email).first()
    if existing:
        raise HTTPException(status_code=409, detail='Email already registered')

    # hash using CryptContext (pbkdf2_sha256)
    pw_hash = pwd_context.hash(payload.password)
    user = models.User(name=payload.name, email=email, password_hash=pw_hash)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@app.post('/api/auth/login')
def login(payload: LoginIn, db: Session = Depends(get_db)):
    email = payload.email.lower()
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=401, detail='Invalid credentials')

    if not pwd_context.verify(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail='Invalid credentials')

    # No session/token implementation by design — return small user info
    return { 'id': user.id, 'email': user.email, 'name': user.name }
