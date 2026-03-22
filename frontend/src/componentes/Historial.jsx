// src/components/Historial.jsx

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import { C, coloresTipo, bordesTipo, s } from "../estilos/theme";

const API = "http://localhost:8000";

export default function Historial({ onVolver }) {
  const [historial, setHistorial]   = useState([]);
  const [detalle, setDetalle]       = useState(null);
  const [cargado, setCargado]       = useState(false);
  const [error, setError]           = useState("");

  if (!cargado) {
    axios.get(`${API}/historial`)
      .then(r => { setHistorial(r.data); setCargado(true); })
      .catch(() => { setError("Error al cargar el historial."); setCargado(true); });
  }

  const eliminar = async (id) => {
    await axios.delete(`${API}/historial/${id}`);
    setHistorial(h => h.filter(r => r.id !== id));
    if (detalle?.id === id) setDetalle(null);
  };

  return (
    <div style={s.card} className="fade-in">
      <h2 style={s.seccionTitulo}>📚 Historial de planeaciones</h2>
      {error && <p style={s.error}>{error}</p>}
      {historial.length === 0 && cargado && (
        <div style={s.vacio}>
          <p style={{ fontSize: "40px", margin: "0 0 8px" }}>📋</p>
          <p style={{ color: C.grisMedio }}>No hay planeaciones guardadas aún.</p>
        </div>
      )}
      {historial.map(r => (
        <div key={r.id} className="fade-in"
          style={{ ...s.historialItem,
            borderColor: detalle?.id === r.id ? C.azulMedio : C.grisBorde,
            backgroundColor: detalle?.id === r.id ? C.azulClaro : C.blanco }}
          onClick={() => setDetalle(detalle?.id === r.id ? null : r)}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            <div>
              {r.alumno_nombre && <span style={s.alumnoTag}>👤 {r.alumno_nombre}</span>}
              <span style={{ fontWeight: "600", fontSize: "14px", color: C.texto }}>
                {r.materia} — {r.tema}
              </span>
              <span style={{ ...s.tipoBadge, backgroundColor: coloresTipo[r.tipo_tea], borderColor: bordesTipo[r.tipo_tea] }}>
                {r.tipo_tea}
              </span>
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <span style={{ fontSize: "12px", color: C.grisMedio }}>{r.fecha}</span>
              <button style={s.btnIcono}
                onClick={e => { e.stopPropagation(); eliminar(r.id); }}>🗑</button>
            </div>
          </div>
          {detalle?.id === r.id && (
            <div style={s.detalleBox} className="fade-in">
              <div style={s.markdownBox}><ReactMarkdown>{r.planeacion}</ReactMarkdown></div>
              <button style={{ ...s.btnSecundario, marginTop: "10px" }}
                onClick={() => navigator.clipboard.writeText(r.planeacion)}>📋 Copiar</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}