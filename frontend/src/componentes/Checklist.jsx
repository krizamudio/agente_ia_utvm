// src/components/Checklist.jsx

import { C, COMPORTAMIENTOS, s } from "../estilos/theme";

export default function Checklist({ respuestas, onToggle }) {
  return (
    <>
      <div style={s.separador}>
        <span style={s.separadorTexto}>Comportamientos observados</span>
      </div>
      {COMPORTAMIENTOS.map((c, i) => (
        <div key={i} onClick={() => onToggle(i)}
          style={{ ...s.checkItem,
            backgroundColor: respuestas[i] ? C.azulClaro : C.blanco,
            borderColor: respuestas[i] ? C.azulMedio : C.grisBorde }}>
          <div style={{ ...s.checkbox,
            backgroundColor: respuestas[i] ? C.azulMedio : C.blanco,
            borderColor: respuestas[i] ? C.azulMedio : "#c0cce0" }}>
            {respuestas[i] ? "✓" : ""}
          </div>
          <span style={{ fontSize: "14px", color: C.texto }}>{c}</span>
        </div>
      ))}
    </>
  );
}