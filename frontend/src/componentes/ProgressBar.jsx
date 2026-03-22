// src/components/ProgressBar.jsx

import { C, PASOS, s } from "../estilos/theme";

export default function ProgressBar({ paso }) {
  const progreso = ((paso - 1) / (PASOS.length - 1)) * 100;
  return (
    <>
      <div style={s.progressWrap}>
        {PASOS.map((label, i) => (
          <div key={i} style={s.progressStep}>
            <span style={{ ...s.progressLabel,
              color: paso === i + 1 ? C.azulMedio : paso > i + 1 ? C.acento : C.grisMedio,
              fontWeight: paso === i + 1 ? "700" : "400" }}>
              {paso > i + 1 ? "✓ " : ""}{label}
            </span>
          </div>
        ))}
      </div>
      <div style={s.progressBarBg}>
        <div style={{ ...s.progressBarFill, width: `${progreso}%` }} />
      </div>
    </>
  );
}