# Los comportamientos observables y su clasificación por niveles están basados en:
#
# - American Psychiatric Association. (2013). Diagnostic and Statistical Manual
#   of Mental Disorders (5th ed.). DSM-5. https://doi.org/10.1176/appi.books.9780890425596
#
# - Rasim, R., Munir, M., Wihardi, Y., & Amali, L. N. (2025). Artificial
#   intelligence-based leveling system for determining severity level of autism
#   spectrum disorder. Scientific Journal of Informatics, 12(4).
#   https://journal.unnes.ac.id/journals/sji/article/view/14440/7398
#
# - Hasan, N., & Nene, M. J. (2022). ICT-based learning solutions for children
#   with ASD: A requirement engineering study. International Journal of Special
#   Education. https://internationalsped.com/index.php/ijse/article/view/699/71

import numpy as np
from sklearn.neural_network import MLPClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import cross_val_score

# ─────────────────────────────────────────────────────────────────────────────
# COMPORTAMIENTOS OBSERVABLES
#
# Cada ítem está mapeado a su criterio DSM-5 correspondiente:
#
# DSM-5 Criterio A: Déficits en comunicación e interacción social
#   A1 — Déficits en reciprocidad socioemocional
#   A2 — Déficits en conductas comunicativas no verbales
#   A3 — Déficits en desarrollo/mantenimiento de relaciones
#
# DSM-5 Criterio B: Patrones restrictivos y repetitivos de comportamiento
#   B1 — Movimientos, uso de objetos o habla estereotipados/repetitivos
#   B2 — Insistencia en la igualdad, rutinas inflexibles
#   B3 — Intereses muy restringidos y fijos de intensidad anormal
#   B4 — Hiper o hiporreactividad sensorial
#
# DSM-5 Niveles de severidad:
#   Nivel 3 → Tipo 1: "Requiere apoyo muy sustancial"
#   Nivel 2 → Tipo 2: "Requiere apoyo sustancial"
#   Nivel 1 → Tipo 3: "Requiere apoyo"
# ─────────────────────────────────────────────────────────────────────────────

COMPORTAMIENTOS = [
    # Criterio A1 — Reciprocidad socioemocional
    "Requiere apoyo constante para iniciar tareas",            # 0 → A1
    # Criterio A2 — Comunicación no verbal / verbal
    "Dificultad severa para comunicarse verbalmente",          # 1 → A2
    # Criterio B1 — Conductas repetitivas
    "Presenta conductas repetitivas frecuentes",               # 2 → B1
    # Criterio B4 — Reactividad sensorial
    "Se distrae con estímulos del entorno (ruido, luz)",       # 3 → B4
    # Criterio A2 — Comprensión de instrucciones
    "Dificultad para seguir instrucciones de más de 2 pasos",  # 4 → A2
    # Nivel de severidad — autonomía funcional
    "Puede trabajar de forma semi-independiente",              # 5 → Severidad
    # Criterio A2 — Comunicación funcional
    "Se comunica con frases cortas o palabras clave",          # 6 → A2
    # Criterio B2 — Rutinas inflexibles
    "Necesita rutinas muy estructuradas",                      # 7 → B2
    # Criterio B4 — Hipersensibilidad sensorial
    "Presenta hipersensibilidad sensorial (ruido/textura)",    # 8 → B4
    # Nivel de severidad — apoyos visuales
    "Puede seguir instrucciones escritas con apoyo visual",    # 9 → Severidad
    # Criterio A2 — Comunicación literal
    "Se comunica fluidamente pero de forma literal",           # 10 → A2
    # Criterio A3 — Comprensión social
    "Dificultad para interpretar contexto social",             # 11 → A3
]

# ─────────────────────────────────────────────────────────────────────────────
# DATOS DE ENTRENAMIENTO — 90 ejemplos
#
# Construidos siguiendo los descriptores conductuales del DSM-5 por nivel:
#
# TIPO 1 (Nivel 3 DSM-5): "Las deficiencias graves en habilidades de
#   comunicación social verbal y no verbal causan alteraciones graves del
#   funcionamiento." Inflexibilidad, dificultad extrema para cambiar
#   actividades, conductas repetitivas que interfieren marcadamente.
#
# TIPO 2 (Nivel 2 DSM-5): "Deficiencias marcadas en habilidades de
#   comunicación social verbal y no verbal. Aparentes incluso con apoyos.
#   Dificultad para cambiar entre actividades."
#
# TIPO 3 (Nivel 1 DSM-5): "Sin apoyos puede presentar deficiencias
#   notables en comunicación social. Dificultad para iniciar interacciones
#   sociales. Inflexibilidad que causa dificultades en uno o más contextos."
# ─────────────────────────────────────────────────────────────────────────────

X_train = np.array([

    # ── TIPO 1 — Nivel 3 DSM-5 (30 ejemplos) ────────────────────────────────
    # Cols 0,1,4,7 = casi siempre 1 | Cols 5,9,10 = siempre 0
    [1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1],
    [1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1],
    [1, 1, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0],
    [1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1],
    [1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0],
    [1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1],
    [1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0],
    [1, 1, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1],
    [1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1],
    [1, 1, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0],
    [1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0],
    [1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1],
    [1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0],
    [1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1],
    [1, 1, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 0],
    [1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1],
    [1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1],
    [1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0],
    [1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1],
    [1, 1, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0],
    [1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 0, 1],
    [1, 1, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0],
    [1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1],
    [1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0],
    [1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1],

    # ── TIPO 2 — Nivel 2 DSM-5 (30 ejemplos) ────────────────────────────────
    # Cols 0,4,7 = mixto | Col 5 = siempre 1 | Cols 1,10 = 0 | Col 9 = 1
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 1],
    [0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
    [0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0],
    [1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 1],
    [0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0],
    [0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 1],
    [0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0],
    [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
    [0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0],
    [0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0],
    [0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
    [0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0],
    [1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1],
    [0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],

    # ── TIPO 3 — Nivel 1 DSM-5 (30 ejemplos) ────────────────────────────────
    # Cols 5,9,10,11 = siempre 1 | Cols 0,1,4,7 = casi siempre 0
    [0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 1],
    [0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 1],
    [0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1],
    [0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1],
    [0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 1],
    [0, 0, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1],
    [0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1],
    [0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1],
    [0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1],
    [0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1],
    [0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1],
    [0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1],
    [0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1],
    [0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1],
    [0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1],
    [0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1],
    [0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1],
    [0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1],
    [0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1],
    [0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1],
    [0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1],
    [0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1],
])

y_train = np.array(
    [0] * 30 +  # Tipo 1 — Nivel 3 DSM-5
    [1] * 30 +  # Tipo 2 — Nivel 2 DSM-5
    [2] * 30    # Tipo 3 — Nivel 1 DSM-5
)

ETIQUETAS = {
    0: {
        "tipo": "Tipo 1",
        "descripcion": "Requiere apoyo muy sustancial (Nivel 3 DSM-5)",
        "perfil": (
            "Estudiante con necesidad de apoyo muy sustancial (Nivel 3 DSM-5). "
            "Presenta deficiencias graves en comunicación verbal y no verbal que "
            "causan alteraciones severas en el funcionamiento. Requiere instrucciones "
            "ultrasimplificadas, una tarea a la vez, apoyos visuales constantes "
            "(pictogramas), rutinas muy estructuradas y acompañamiento cercano "
            "del docente en cada paso de la actividad."
        ),
    },
    1: {
        "tipo": "Tipo 2",
        "descripcion": "Requiere apoyo sustancial (Nivel 2 DSM-5)",
        "perfil": (
            "Estudiante con necesidad de apoyo sustancial (Nivel 2 DSM-5). "
            "Presenta deficiencias marcadas en comunicación social, aparentes "
            "incluso con apoyos en su lugar. Responde bien a instrucciones escritas "
            "paso a paso, apoyos visuales y rutinas predecibles. Puede trabajar "
            "de forma semi-guiada y se comunica con frases cortas y lenguaje directo."
        ),
    },
    2: {
        "tipo": "Tipo 3",
        "descripcion": "Requiere apoyo (Nivel 1 DSM-5)",
        "perfil": (
            "Estudiante con necesidad de apoyo leve (Nivel 1 DSM-5). "
            "Sin apoyos presenta deficiencias notables en comunicación social. "
            "Se comunica fluidamente pero interpreta el lenguaje de forma literal. "
            "Puede trabajar de forma independiente con estructura mínima, "
            "necesita instrucciones claras y anticipación de cambios en la rutina."
        ),
    },
}

# ─────────────────────────────────────────────────────────────────────────────
# ENTRENAR LA RED NEURONAL
# ─────────────────────────────────────────────────────────────────────────────
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X_train)

modelo = MLPClassifier(
    hidden_layer_sizes=(64, 32, 16),
    activation="relu",
    max_iter=3000,
    random_state=42,
    early_stopping=False,
    learning_rate_init=0.001,
    solver="adam",
)
modelo.fit(X_scaled, y_train)

scores = cross_val_score(modelo, X_scaled, y_train, cv=5)
print(f"[Clasificador TEA] Precisión promedio (5-fold): {scores.mean():.2%} ± {scores.std():.2%}")
print(f"[Clasificador TEA] Referencia: DSM-5 (APA, 2013) | Rasim et al. (2025)")


def clasificar_perfil(respuestas: list[int]) -> dict:
    entrada = np.array(respuestas).reshape(1, -1)
    entrada_scaled = scaler.transform(entrada)
    prediccion = modelo.predict(entrada_scaled)[0]
    probabilidades = modelo.predict_proba(entrada_scaled)[0]

    resultado = ETIQUETAS[prediccion].copy()
    resultado["confianza"] = round(float(max(probabilidades)) * 100, 1)
    return resultado