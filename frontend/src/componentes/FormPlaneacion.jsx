// src/components/FormPlaneacion.jsx

import { C, coloresTipo, bordesTipo, espacios, s } from "../estilos/theme";

export default function FormPlaneacion({
  perfil, alumnoNombre, form, setForm,
  onGenerar, onVolver, cargando, error,
}) {
  return (
    <>
      <div style={{ ...s.perfilBadge, backgroundColor: coloresTipo[perfil.tipo], borderColor: bordesTipo[perfil.tipo] }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={{ fontWeight: "700", color: C.texto }}>👤 {alumnoNombre}</span>
            <span style={{ ...s.tipoBadge, backgroundColor: "white", borderColor: bordesTipo[perfil.tipo] }}>
              {perfil.tipo}
            </span>
          </div>
          <span style={{ fontSize: "12px", color: C.grisMedio }}>Confianza: {perfil.confianza}%</span>
        </div>
        <p style={{ fontSize: "13px", color: C.textoSuave, margin: "6px 0 0" }}>{perfil.descripcion}</p>
      </div>

      <div style={s.campo}>
        <label style={s.label}>Materia</label>
        <input style={s.input} placeholder="Ej: Programación, Redes, Electrónica"
          value={form.materia} onChange={e => setForm({ ...form, materia: e.target.value })} />
      </div>
      <div style={s.campo}>
        <label style={s.label}>Tema específico</label>
        <input style={s.input} placeholder="Ej: Ciclo For en Java, Modelo OSI"
          value={form.tema} onChange={e => setForm({ ...form, tema: e.target.value })} />
      </div>
      <div style={s.campo}>
        <label style={s.label}>Espacio de clase</label>
        <select style={s.input} value={form.espacio}
          onChange={e => setForm({ ...form, espacio: e.target.value })}>
          {espacios.map(e => <option key={e}>{e}</option>)}
        </select>
      </div>

      {error && <p style={s.error}>{error}</p>}
      <div style={{ display: "flex", gap: "10px" }}>
        <button style={s.btnSecundario} onClick={onVolver}>← Volver</button>
        <button style={{ ...(cargando ? s.btnDesactivado : s.btnPrimario), flex: 1 }}
          onClick={onGenerar} disabled={cargando}>
          {cargando ? "Generando planeación con IA..." : "✨ Generar planeación"}
        </button>
      </div>
    </>
  );
}