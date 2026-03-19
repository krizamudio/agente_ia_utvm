# main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agent import generar_planeacion

from classifier import clasificar_perfil, COMPORTAMIENTOS

app = FastAPI(title="Agente TEA")

# Permite conexión desde React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Nuevo modelo de entrada
class SolicitudClasificacion(BaseModel):
    respuestas: list[int]  # Lista de 12 valores: 0 o 1

class SolicitudPlaneacion(BaseModel):
    materia: str
    tema: str
    espacio: str       # "Aula", "Laboratorio" o "Taller"
    perfil: str        # Descripción libre del perfil sensorial

@app.post("/generar")
def generar(solicitud: SolicitudPlaneacion):
    resultado = generar_planeacion(
        solicitud.materia,
        solicitud.tema,
        solicitud.espacio,
        solicitud.perfil
    )
    return {"planeacion": resultado}

@app.get("/")
def health():
    return {"status": "Agente TEA activo"}

# Nuevo endpoint
@app.post("/clasificar")
def clasificar(solicitud: SolicitudClasificacion):
    if len(solicitud.respuestas) != 12:
        return {"error": "Se requieren exactamente 12 respuestas"}
    resultado = clasificar_perfil(solicitud.respuestas)
    return resultado

# Endpoint para obtener el checklist
@app.get("/comportamientos")
def obtener_comportamientos():
    return {"comportamientos": COMPORTAMIENTOS}