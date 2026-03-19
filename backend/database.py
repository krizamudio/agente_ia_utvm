from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

DATABASE_URL = "sqlite:///./agente_tea.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()


class Alumno(Base):
    __tablename__ = "alumnos"

    id          = Column(Integer, primary_key=True, index=True)
    nombre      = Column(String, nullable=False)
    tipo_tea    = Column(String, nullable=False)   # "Tipo 1", "Tipo 2", "Tipo 3"
    confianza   = Column(Float)
    descripcion = Column(String)
    perfil      = Column(Text)                     # perfil completo para el prompt
    notas       = Column(Text, default="")         # notas adicionales del docente
    fecha       = Column(DateTime, default=datetime.utcnow)


class Planeacion(Base):
    __tablename__ = "planeaciones"

    id          = Column(Integer, primary_key=True, index=True)
    alumno_id   = Column(Integer, nullable=True)   # referencia al alumno
    alumno_nombre = Column(String, default="")
    materia     = Column(String)
    tema        = Column(String)
    espacio     = Column(String)
    tipo_tea    = Column(String)
    confianza   = Column(Float)
    planeacion  = Column(Text)
    fecha       = Column(DateTime, default=datetime.utcnow)


Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()