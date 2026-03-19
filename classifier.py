# classifier.py

import numpy as np
from sklearn.neural_network import MLPClassifier
from sklearn.preprocessing import StandardScaler

# ─────────────────────────────────────────────
# COMPORTAMIENTOS OBSERVABLES (las 12 preguntas
# del checklist que verá el docente)
# ─────────────────────────────────────────────
COMPORTAMIENTOS = [
    "Requiere apoyo constante para iniciar tareas",           # 0
    "Dificultad severa para comunicarse verbalmente",         # 1
    "Presenta conductas repetitivas frecuentes",              # 2
    "Se distrae con estímulos del entorno (ruido, luz)",      # 3
    "Dificultad para seguir instrucciones de más de 2 pasos", # 4
    "Puede trabajar de forma semi-independiente",             # 5
    "Se comunica con frases cortas o palabras clave",         # 6
    "Necesita rutinas muy estructuradas",                     # 7
    "Presenta hipersensibilidad sensorial (ruido/textura)",   # 8
    "Puede seguir instrucciones escritas con apoyo visual",   # 9
    "Se comunica fluidamente pero de forma literal",          # 10
    "Dificultad para interpretar contexto social",            # 11
]

# ─────────────────────────────────────────────
# DATOS DE ENTRENAMIENTO
# Cada fila: 12 valores binarios (0/1) + etiqueta
# Etiquetas: 0=Tipo1, 1=Tipo2, 2=Tipo3
#
# Tipo 1: Requiere apoyo muy sustancial
# Tipo 2: Requiere apoyo sustancial
# Tipo 3: Requiere apoyo
# ─────────────────────────────────────────────
X_train = np.array([
    # Tipo 1 - apoyo muy sustancial
    [1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0],
    [1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 0],
    [1, 1, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1],
    [1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0],

    # Tipo 2 - apoyo sustancial
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1],
    [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1],

    # Tipo 3 - apoyo leve
    [0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1],
    [0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1],
    [0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1],
    [0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1],
])

y_train = np.array([0, 0, 0, 0, 0,   # Tipo 1
                    1, 1, 1, 1, 1,   # Tipo 2
                    2, 2, 2, 2, 2])  # Tipo 3

ETIQUETAS = {
    0: {
        "tipo": "Tipo 1",
        "descripcion": "Requiere apoyo muy sustancial",
        "perfil": (
            "Estudiante con necesidad de apoyo muy sustancial. "
            "Requiere instrucciones ultrasimplificadas, una tarea a la vez, "
            "apoyos visuales constantes (pictogramas), rutinas muy estructuradas "
            "y acompañamiento cercano del docente en cada paso."
        ),
    },
    1: {
        "tipo": "Tipo 2",
        "descripcion": "Requiere apoyo sustancial",
        "perfil": (
            "Estudiante con necesidad de apoyo sustancial. "
            "Responde bien a instrucciones escritas paso a paso, "
            "apoyos visuales, rutinas predecibles y trabajo semi-guiado. "
            "Puede comunicarse pero prefiere lenguaje directo y sin ambigüedad."
        ),
    },
    2: {
        "tipo": "Tipo 3",
        "descripcion": "Requiere apoyo",
        "perfil": (
            "Estudiante con necesidad de apoyo leve. "
            "Se comunica fluidamente pero interpreta el lenguaje de forma literal. "
            "Necesita instrucciones claras y anticipación de cambios. "
            "Puede trabajar de forma independiente con estructura mínima."
        ),
    },
}

# ─────────────────────────────────────────────
# ENTRENAR LA RED NEURONAL
# ─────────────────────────────────────────────
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X_train)

modelo = MLPClassifier(
    hidden_layer_sizes=(16, 8),  # 2 capas ocultas
    activation="relu",
    max_iter=1000,
    random_state=42,
)
modelo.fit(X_scaled, y_train)


def clasificar_perfil(respuestas: list[int]) -> dict:
    """
    Recibe lista de 12 valores binarios (0 o 1)
    Devuelve tipo DSM-5, descripción y perfil para el prompt
    """
    entrada = np.array(respuestas).reshape(1, -1)
    entrada_scaled = scaler.transform(entrada)
    prediccion = modelo.predict(entrada_scaled)[0]
    probabilidades = modelo.predict_proba(entrada_scaled)[0]

    resultado = ETIQUETAS[prediccion].copy()
    resultado["confianza"] = round(float(max(probabilidades)) * 100, 1)
    return resultado