// src/components/Header.jsx

import { s, fadeIn } from "../estilos/theme";

export default function Header({ onHistorial, onVolver, vistaHistorial }) {
  return (
    <>
      <style>{fadeIn}</style>
      <div style={s.header}>
        <div style={s.headerInner}>
          <div>
            <div style={s.logoRow}>
              <span style={s.logoIcon}>🧩</span>
              <span style={s.logoText}>Agente TEA — UTVM</span>
            </div>
            <p style={s.headerSub}>Universidad Tecnológica del Valle del Mezquital</p>
          </div>
          {vistaHistorial ? (
            <button style={s.btnSecHeader} onClick={onVolver}>← Volver</button>
          ) : (
            <button style={s.btnSecHeader} onClick={onHistorial}>📚 Historial</button>
          )}
        </div>
      </div>
    </>
  );
}