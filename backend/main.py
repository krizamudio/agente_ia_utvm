# main.py

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import datetime
from typing import Optional

from agent import generar_planeacion
from classifier import clasificar_perfil, COMPORTAMIENTOS
from database import get_db, Planeacion, Alumno, Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Agente TEA")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Modelos de entrada ────────────────────────────────────────────────────────

class SolicitudPlaneacion(BaseModel):
    materia:       str
    tema:          str
    espacio:       str
    perfil:        str
    tipo_tea:      str = ""
    confianza:     float = 0.0
    alumno_id:     Optional[int] = None
    alumno_nombre: str = ""

class SolicitudClasificacion(BaseModel):
    respuestas: list[int]

class SolicitudAlumno(BaseModel):
    nombre:      str
    tipo_tea:    str
    confianza:   float
    descripcion: str
    perfil:      str
    notas:       str = ""


# ── Endpoints generales ───────────────────────────────────────────────────────

@app.get("/")
def health():
    return {"status": "Agente TEA activo"}

@app.get("/comportamientos")
def obtener_comportamientos():
    return {"comportamientos": COMPORTAMIENTOS}

@app.post("/clasificar")
def clasificar(solicitud: SolicitudClasificacion):
    if len(solicitud.respuestas) != 12:
        return {"error": "Se requieren exactamente 12 respuestas"}
    return clasificar_perfil(solicitud.respuestas)


# ── Endpoints de alumnos ──────────────────────────────────────────────────────

@app.post("/alumnos")
def crear_alumno(solicitud: SolicitudAlumno, db: Session = Depends(get_db)):
    alumno = Alumno(
        nombre      = solicitud.nombre,
        tipo_tea    = solicitud.tipo_tea,
        confianza   = solicitud.confianza,
        descripcion = solicitud.descripcion,
        perfil      = solicitud.perfil,
        notas       = solicitud.notas,
        fecha       = datetime.utcnow(),
    )
    db.add(alumno)
    db.commit()
    db.refresh(alumno)
    return {"id": alumno.id, "nombre": alumno.nombre, "tipo_tea": alumno.tipo_tea}

@app.get("/alumnos")
def obtener_alumnos(db: Session = Depends(get_db)):
    alumnos = db.query(Alumno).order_by(Alumno.nombre).all()
    return [
        {
            "id":          a.id,
            "nombre":      a.nombre,
            "tipo_tea":    a.tipo_tea,
            "confianza":   a.confianza,
            "descripcion": a.descripcion,
            "perfil":      a.perfil,
            "notas":       a.notas,
            "fecha":       a.fecha.strftime("%d/%m/%Y"),
        }
        for a in alumnos
    ]

@app.delete("/alumnos/{id}")
def eliminar_alumno(id: int, db: Session = Depends(get_db)):
    alumno = db.query(Alumno).filter(Alumno.id == id).first()
    if not alumno:
        return {"error": "Alumno no encontrado"}
    db.delete(alumno)
    db.commit()
    return {"mensaje": "Alumno eliminado correctamente"}


# ── Endpoints de planeaciones ─────────────────────────────────────────────────

@app.post("/generar")
def generar(solicitud: SolicitudPlaneacion, db: Session = Depends(get_db)):
    resultado = generar_planeacion(
        solicitud.materia,
        solicitud.tema,
        solicitud.espacio,
        solicitud.perfil,
    )
    registro = Planeacion(
        alumno_id     = solicitud.alumno_id,
        alumno_nombre = solicitud.alumno_nombre,
        materia       = solicitud.materia,
        tema          = solicitud.tema,
        espacio       = solicitud.espacio,
        tipo_tea      = solicitud.tipo_tea,
        confianza     = solicitud.confianza,
        planeacion    = resultado,
        fecha         = datetime.utcnow(),
    )
    db.add(registro)
    db.commit()
    db.refresh(registro)
    return {"id": registro.id, "planeacion": resultado}

@app.get("/historial")
def obtener_historial(db: Session = Depends(get_db)):
    registros = db.query(Planeacion).order_by(Planeacion.fecha.desc()).all()
    return [
        {
            "id":            r.id,
            "alumno_nombre": r.alumno_nombre,
            "materia":       r.materia,
            "tema":          r.tema,
            "espacio":       r.espacio,
            "tipo_tea":      r.tipo_tea,
            "confianza":     r.confianza,
            "fecha":         r.fecha.strftime("%d/%m/%Y %H:%M"),
            "planeacion":    r.planeacion,
        }
        for r in registros
    ]

@app.delete("/historial/{id}")
def eliminar_planeacion(id: int, db: Session = Depends(get_db)):
    registro = db.query(Planeacion).filter(Planeacion.id == id).first()
    if not registro:
        return {"error": "Registro no encontrado"}
    db.delete(registro)
    db.commit()
    return {"mensaje": "Planeación eliminada correctamente"}