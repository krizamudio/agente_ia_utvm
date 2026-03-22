// src/components/AlumnoSelector.jsx

import { C, coloresTipo, bordesTipo, s } from "../estilos/theme";
import Checklist from "./Checklist";

export default function AlumnoSelector({
  modoAlumno, setModoAlumno, alumnos, respuestas, onToggle,
  nombreAlumno, setNombreAlumno, notasAlumno, setNotasAlumno,
  onClasificar, onSeleccionar, onEliminar, cargando, error,
}) {
  return (
    <>
      {/* Tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        {["seleccionar", "nuevo"].map((modo, i) => (
          <button key={modo}
            style={{ ...s.tab, ...(modoAlumno === modo ? s.tabActivo : {}) }}
            onClick={() => setModoAlumno(modo)}>
            {i === 0 ? "👤 Alumno registrado" : "➕ Nuevo alumno"}
          </button>
        ))}
      </div>

      {/* Alumno existente */}
      {modoAlumno === "seleccionar" && (
        alumnos.length === 0 ? (
          <div style={s.vacio}>
            <p style={{ fontSize: "40px", margin: "0 0 8px" }}>👤</p>
            <p style={{ color: C.grisMedio, marginBottom: "16px" }}>No hay alumnos registrados.</p>
            <button style={{ ...s.btnPrimario, width: "auto", padding: "10px 28px" }}
              onClick={() => setModoAlumno("nuevo")}>
              Registrar primer alumno
            </button>
          </div>
        ) : (
          <>
            <div style={s.campo}>
              <label style={s.label}>Selecciona un alumno</label>
              <select style={s.input} defaultValue=""
                onChange={e => { const a = alumnos.find(a => a.id === parseInt(e.target.value)); if (a) onSeleccionar(a); }}>
                <option value="" disabled>-- Selecciona un alumno --</option>
                {alumnos.map(a => <option key={a.id} value={a.id}>{a.nombre} — {a.tipo_tea}</option>)}
              </select>
            </div>
            <p style={{ fontSize: "12px", color: C.grisMedio, marginBottom: "8px" }}>Alumnos registrados:</p>
            {alumnos.map(a => (
              <div key={a.id} style={{ ...s.alumnoCard, borderLeft: `4px solid ${bordesTipo[a.tipo_tea]}` }}>
                <div>
                  <span style={{ fontWeight: "700", color: C.texto }}>{a.nombre}</span>
                  <span style={{ ...s.tipoBadge, backgroundColor: coloresTipo[a.tipo_tea], borderColor: bordesTipo[a.tipo_tea] }}>
                    {a.tipo_tea}
                  </span>
                  <span style={{ fontSize: "12px", color: C.grisMedio, marginLeft: "6px" }}>
                    Registrado: {a.fecha}
                  </span>
                </div>
                <button style={s.btnIcono} onClick={() => onEliminar(a.id)}>🗑</button>
              </div>
            ))}
          </>
        )
      )}

      {/* Alumno nuevo */}
      {modoAlumno === "nuevo" && (
        <>
          <div style={s.campo}>
            <label style={s.label}>Nombre del alumno</label>
            <input style={s.input} placeholder="Ej: Juan Pérez"
              value={nombreAlumno} onChange={e => setNombreAlumno(e.target.value)} />
          </div>
          <div style={s.campo}>
            <label style={s.label}>Notas adicionales <span style={{ fontWeight: 400, color: C.grisMedio }}>(opcional)</span></label>
            <textarea style={{ ...s.input, height: "70px", resize: "vertical" }}
              placeholder="Ej: Necesita sentarse cerca del docente..."
              value={notasAlumno} onChange={e => setNotasAlumno(e.target.value)} />
          </div>
          <Checklist respuestas={respuestas} onToggle={onToggle} />
          {error && <p style={s.error}>{error}</p>}
          <button style={cargando ? s.btnDesactivado : s.btnPrimario}
            onClick={onClasificar} disabled={cargando}>
            {cargando ? "Clasificando perfil..." : "Clasificar y continuar →"}
          </button>
        </>
      )}
    </>
  );
}