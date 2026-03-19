// src/App.js

import { useState, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

const API = "http://localhost:8000";
const espacios = ["Aula", "Laboratorio", "Taller"];

const COMPORTAMIENTOS = [
  "Requiere apoyo constante para iniciar tareas",
  "Dificultad severa para comunicarse verbalmente",
  "Presenta conductas repetitivas frecuentes",
  "Se distrae con estímulos del entorno (ruido, luz)",
  "Dificultad para seguir instrucciones de más de 2 pasos",
  "Puede trabajar de forma semi-independiente",
  "Se comunica con frases cortas o palabras clave",
  "Necesita rutinas muy estructuradas",
  "Presenta hipersensibilidad sensorial (ruido/textura)",
  "Puede seguir instrucciones escritas con apoyo visual",
  "Se comunica fluidamente pero de forma literal",
  "Dificultad para interpretar contexto social",
];

const coloresTipo = { "Tipo 1": "#fde8e8", "Tipo 2": "#fef9c3", "Tipo 3": "#e8f5e9" };
const bordesTipo  = { "Tipo 1": "#e53e3e", "Tipo 2": "#d69e2e", "Tipo 3": "#38a169" };
const PASOS       = ["Alumno", "Contexto", "Planeación"];

// ── Paleta institucional ──────────────────────────────────────────────────────
const C = {
  azul:        "#1a3a6b",
  azulMedio:   "#2b5299",
  azulClaro:   "#e8eef7",
  azulBorde:   "#c3d0e8",
  blanco:      "#ffffff",
  grisClaro:   "#f4f6fb",
  grisMedio:   "#6b7a99",
  grisBorde:   "#dde3f0",
  texto:       "#1a2233",
  textoSuave:  "#4a5568",
  acento:      "#c8a84b",   // dorado universitario
};

const fadeIn = `
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes progressGrow {
    from { width: 0%; }
  }
  * { box-sizing: border-box; }
  body { margin: 0; background: ${C.grisClaro}; font-family: 'Segoe UI', system-ui, sans-serif; }
  .fade-in { animation: fadeSlideIn 0.35s ease both; }
  input:focus, select:focus, textarea:focus {
    outline: none;
    border-color: ${C.azulMedio} !important;
    box-shadow: 0 0 0 3px rgba(43,82,153,0.15);
  }
  button:hover { filter: brightness(0.95); }
`;

export default function App() {
  const [vista, setVista]               = useState("app");
  const [modoAlumno, setModoAlumno]     = useState("seleccionar");
  const [paso, setPaso]                 = useState(1);
  const [alumnos, setAlumnos]           = useState([]);
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
  const [respuestas, setRespuestas]     = useState(Array(12).fill(0));
  const [perfil, setPerfil]             = useState(null);
  const [nombreAlumno, setNombreAlumno] = useState("");
  const [notasAlumno, setNotasAlumno]   = useState("");
  const [form, setForm]                 = useState({ materia: "", tema: "", espacio: "Aula" });
  const [planeacion, setPlaneacion]     = useState("");
  const [planeacionId, setPlaneacionId] = useState(null);
  const [historial, setHistorial]       = useState([]);
  const [detalle, setDetalle]           = useState(null);
  const [cargando, setCargando]         = useState(false);
  const [error, setError]               = useState("");

  useEffect(() => { cargarAlumnos(); }, []);
  useEffect(() => { if (vista === "historial") cargarHistorial(); }, [vista]);

  const cargarAlumnos = async () => {
    try { const r = await axios.get(`${API}/alumnos`); setAlumnos(r.data); } catch {}
  };
  const cargarHistorial = async () => {
    try { const r = await axios.get(`${API}/historial`); setHistorial(r.data); }
    catch { setError("Error al cargar el historial."); }
  };

  const toggleRespuesta = (i) => {
    const n = [...respuestas]; n[i] = n[i] === 1 ? 0 : 1; setRespuestas(n);
  };

  const handleSeleccionarAlumno = (alumno) => {
    setAlumnoSeleccionado(alumno);
    setPerfil({ tipo: alumno.tipo_tea, descripcion: alumno.descripcion, confianza: alumno.confianza, perfil: alumno.perfil });
    setPaso(2);
  };

  const handleClasificar = async () => {
    if (!nombreAlumno.trim()) { setError("Por favor ingresa el nombre del alumno."); return; }
    setCargando(true); setError("");
    try {
      const r = await axios.post(`${API}/clasificar`, { respuestas });
      setPerfil(r.data); setPaso(2);
    } catch { setError("Error al clasificar. ¿Está corriendo el backend?"); }
    finally { setCargando(false); }
  };

  const handleGenerar = async () => {
    if (!form.materia || !form.tema) { setError("Por favor completa materia y tema."); return; }
    setCargando(true); setError("");
    let alumnoId = alumnoSeleccionado?.id || null;
    let alumnoNombre = alumnoSeleccionado?.nombre || nombreAlumno;
    if (!alumnoSeleccionado && nombreAlumno) {
      try {
        const r = await axios.post(`${API}/alumnos`, {
          nombre: nombreAlumno, tipo_tea: perfil.tipo, confianza: perfil.confianza,
          descripcion: perfil.descripcion, perfil: perfil.perfil, notas: notasAlumno,
        });
        alumnoId = r.data.id; await cargarAlumnos();
      } catch {}
    }
    try {
      const r = await axios.post(`${API}/generar`, {
        ...form, perfil: perfil.perfil, tipo_tea: perfil.tipo,
        confianza: perfil.confianza, alumno_id: alumnoId, alumno_nombre: alumnoNombre,
      });
      setPlaneacion(r.data.planeacion); setPlaneacionId(r.data.id); setPaso(3);
    } catch { setError("Error al generar la planeación."); }
    finally { setCargando(false); }
  };

  const eliminarAlumno = async (id) => {
    await axios.delete(`${API}/alumnos/${id}`); await cargarAlumnos();
  };
  const eliminarRegistro = async (id) => {
    await axios.delete(`${API}/historial/${id}`);
    setHistorial(historial.filter(r => r.id !== id));
    if (detalle?.id === id) setDetalle(null);
  };

  const reiniciar = () => {
    setPaso(1); setModoAlumno("seleccionar"); setRespuestas(Array(12).fill(0));
    setPerfil(null); setAlumnoSeleccionado(null); setNombreAlumno(""); setNotasAlumno("");
    setPlaneacion(""); setPlaneacionId(null); setForm({ materia: "", tema: "", espacio: "Aula" }); setError("");
  };

  const progreso = ((paso - 1) / (PASOS.length - 1)) * 100;

  // ── Vista historial ────────────────────────────────────────────────────────
  if (vista === "historial") return (
    <div style={s.page}>
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
          <button style={s.btnSecHeader} onClick={() => { setVista("app"); setDetalle(null); }}>
            ← Volver
          </button>
        </div>
      </div>

      <div style={{ ...s.card, marginTop: "32px" }} className="fade-in">
        <h2 style={s.seccionTitulo}>📚 Historial de planeaciones</h2>
        {historial.length === 0 && (
          <div style={s.vacio}>
            <p style={{ fontSize: "40px", margin: "0 0 8px" }}>📋</p>
            <p style={{ color: C.grisMedio }}>No hay planeaciones guardadas aún.</p>
          </div>
        )}
        {historial.map(r => (
          <div key={r.id} className="fade-in"
            style={{ ...s.historialItem, borderColor: detalle?.id === r.id ? C.azulMedio : C.grisBorde,
              backgroundColor: detalle?.id === r.id ? C.azulClaro : C.blanco }}
            onClick={() => setDetalle(detalle?.id === r.id ? null : r)}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
              <div>
                {r.alumno_nombre && <span style={s.alumnoTag}>👤 {r.alumno_nombre}</span>}
                <span style={{ fontWeight: "600", fontSize: "14px", color: C.texto }}>{r.materia} — {r.tema}</span>
                <span style={{ ...s.tipoBadge, backgroundColor: coloresTipo[r.tipo_tea], borderColor: bordesTipo[r.tipo_tea] }}>
                  {r.tipo_tea}
                </span>
              </div>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <span style={{ fontSize: "12px", color: C.grisMedio }}>{r.fecha}</span>
                <button style={s.btnIcono} onClick={e => { e.stopPropagation(); eliminarRegistro(r.id); }}>🗑</button>
              </div>
            </div>
            {detalle?.id === r.id && (
              <div style={s.detalleBox} className="fade-in">
                <div style={s.markdownBox}><ReactMarkdown>{r.planeacion}</ReactMarkdown></div>
                <button style={s.btnSecundario} onClick={() => navigator.clipboard.writeText(r.planeacion)}>
                  📋 Copiar texto
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // ── App principal ──────────────────────────────────────────────────────────
  return (
    <div style={s.page}>
      <style>{fadeIn}</style>

      {/* Header institucional */}
      <div style={s.header}>
        <div style={s.headerInner}>
          <div>
            <div style={s.logoRow}>
              <span style={s.logoIcon}>🧩</span>
              <span style={s.logoText}>Agente TEA — UTVM</span>
            </div>
            <p style={s.headerSub}>Universidad Tecnológica del Valle del Mezquital</p>
          </div>
          <button style={s.btnSecHeader} onClick={() => setVista("historial")}>
            📚 Historial
          </button>
        </div>
      </div>

      <div style={s.card} className="fade-in">

        {/* Barra de progreso */}
        <div style={s.progressWrap}>
          {PASOS.map((label, i) => (
            <div key={i} style={s.progressStep}>
              <span style={{ ...s.progressLabel, color: paso === i + 1 ? C.azulMedio : paso > i + 1 ? C.acento : C.grisMedio,
                fontWeight: paso === i + 1 ? "700" : "400" }}>
                {paso > i + 1 ? "✓ " : ""}{label}
              </span>
            </div>
          ))}
        </div>
        <div style={s.progressBarBg}>
          <div style={{ ...s.progressBarFill, width: `${progreso}%` }} />
        </div>

        {/* ── PASO 1 ── */}
        {paso === 1 && (
          <div className="fade-in">
            <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
              {["seleccionar", "nuevo"].map((modo, i) => (
                <button key={modo}
                  style={{ ...s.tab, ...(modoAlumno === modo ? s.tabActivo : {}) }}
                  onClick={() => { setModoAlumno(modo); setError(""); }}
                >
                  {i === 0 ? "👤 Alumno registrado" : "➕ Nuevo alumno"}
                </button>
              ))}
            </div>

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
                      onChange={e => { const a = alumnos.find(a => a.id === parseInt(e.target.value)); if (a) handleSeleccionarAlumno(a); }}>
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
                        <span style={{ fontSize: "12px", color: C.grisMedio, marginLeft: "6px" }}>Registrado: {a.fecha}</span>
                      </div>
                      <button style={s.btnIcono} onClick={() => eliminarAlumno(a.id)}>🗑</button>
                    </div>
                  ))}
                </>
              )
            )}

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
                <div style={s.separador}>
                  <span style={s.separadorTexto}>Comportamientos observados</span>
                </div>
                {COMPORTAMIENTOS.map((c, i) => (
                  <div key={i} onClick={() => toggleRespuesta(i)}
                    style={{ ...s.checkItem, backgroundColor: respuestas[i] ? C.azulClaro : C.blanco,
                      borderColor: respuestas[i] ? C.azulMedio : C.grisBorde }}>
                    <div style={{ ...s.checkbox, backgroundColor: respuestas[i] ? C.azulMedio : C.blanco,
                      borderColor: respuestas[i] ? C.azulMedio : "#c0cce0" }}>
                      {respuestas[i] ? "✓" : ""}
                    </div>
                    <span style={{ fontSize: "14px", color: C.texto }}>{c}</span>
                  </div>
                ))}
              </>
            )}

            {error && <p style={s.error}>{error}</p>}

            {modoAlumno === "nuevo" && (
              <button style={cargando ? s.btnDesactivado : s.btnPrimario}
                onClick={handleClasificar} disabled={cargando}>
                {cargando ? "Clasificando perfil..." : "Clasificar y continuar →"}
              </button>
            )}
          </div>
        )}

        {/* ── PASO 2 ── */}
        {paso === 2 && perfil && (
          <div className="fade-in">
            <div style={{ ...s.perfilBadge, backgroundColor: coloresTipo[perfil.tipo], borderColor: bordesTipo[perfil.tipo] }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontWeight: "700", color: C.texto }}>
                    👤 {alumnoSeleccionado?.nombre || nombreAlumno}
                  </span>
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
              <button style={s.btnSecundario} onClick={reiniciar}>← Volver</button>
              <button style={{ ...(cargando ? s.btnDesactivado : s.btnPrimario), flex: 1 }}
                onClick={handleGenerar} disabled={cargando}>
                {cargando ? "Generando planeación con IA..." : "✨ Generar planeación"}
              </button>
            </div>
          </div>
        )}

        {/* ── PASO 3 ── */}
        {paso === 3 && (
          <div className="fade-in">
            <div style={{ ...s.perfilBadge, backgroundColor: coloresTipo[perfil.tipo], borderColor: bordesTipo[perfil.tipo] }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "700", color: C.texto }}>
                  👤 {alumnoSeleccionado?.nombre || nombreAlumno} · {perfil.tipo}
                </span>
                <span style={{ fontSize: "12px", color: C.grisMedio }}>#{planeacionId} guardada ✓</span>
              </div>
              <p style={{ fontSize: "13px", color: C.textoSuave, margin: "4px 0 0" }}>
                {form.materia}: {form.tema} · {form.espacio}
              </p>
            </div>

            <div style={s.markdownBox}>
              <ReactMarkdown>{planeacion}</ReactMarkdown>
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button style={s.btnSecundario} onClick={() => navigator.clipboard.writeText(planeacion)}>
                📋 Copiar
              </button>
              <button style={s.btnSecundario} onClick={() => setVista("historial")}>
                📚 Historial
              </button>
              <button style={{ ...s.btnPrimario, flex: 1 }} onClick={reiniciar}>
                ✨ Nueva planeación
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer institucional */}
      <div style={s.footer}>
        <p>Agente TEA · UTVM · Maestría en Inteligencia Artificial · 2026</p>
      </div>
    </div>
  );
}

// ── Estilos ────────────────────────────────────────────────────────────────────
const s = {
  page: { minHeight: "100vh", backgroundColor: C.grisClaro, paddingBottom: "48px" },

  // Header
  header: { backgroundColor: C.azul, borderBottom: `4px solid ${C.acento}`, padding: "0" },
  headerInner: { maxWidth: "700px", margin: "0 auto", padding: "20px 24px",
    display: "flex", justifyContent: "space-between", alignItems: "center" },
  logoRow: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "2px" },
  logoIcon: { fontSize: "24px" },
  logoText: { fontSize: "20px", fontWeight: "700", color: C.blanco, letterSpacing: "0.3px" },
  headerSub: { margin: 0, fontSize: "12px", color: "rgba(255,255,255,0.65)", letterSpacing: "0.5px" },
  btnSecHeader: { padding: "8px 18px", backgroundColor: "rgba(255,255,255,0.12)",
    color: C.blanco, border: "1px solid rgba(255,255,255,0.25)", borderRadius: "8px",
    fontSize: "13px", cursor: "pointer", fontWeight: "600" },

  // Card
  card: { backgroundColor: C.blanco, borderRadius: "12px", padding: "36px",
    maxWidth: "700px", margin: "32px auto 0", boxShadow: "0 4px 32px rgba(26,58,107,0.10)",
    border: `1px solid ${C.azulBorde}` },

  // Progress
  progressWrap: { display: "flex", justifyContent: "space-between", marginBottom: "8px" },
  progressStep: { flex: 1, textAlign: "center" },
  progressLabel: { fontSize: "13px", transition: "color 0.3s" },
  progressBarBg: { height: "6px", backgroundColor: C.azulClaro, borderRadius: "99px",
    marginBottom: "32px", overflow: "hidden" },
  progressBarFill: { height: "100%", backgroundColor: C.azulMedio, borderRadius: "99px",
    transition: "width 0.5s cubic-bezier(.4,0,.2,1)", backgroundImage: `linear-gradient(90deg, ${C.azulMedio}, ${C.acento})` },

  // Tabs
  tab: { flex: 1, padding: "10px", borderRadius: "8px", border: `1px solid ${C.grisBorde}`,
    cursor: "pointer", fontSize: "14px", fontWeight: "600", backgroundColor: C.grisClaro, color: C.textoSuave },
  tabActivo: { backgroundColor: C.azulMedio, color: C.blanco, border: `1px solid ${C.azulMedio}` },

  // Form
  campo: { marginBottom: "20px" },
  label: { display: "block", fontWeight: "600", marginBottom: "6px", color: C.texto, fontSize: "14px" },
  input: { width: "100%", padding: "11px 14px", borderRadius: "8px",
    border: `1px solid ${C.grisBorde}`, fontSize: "14px", color: C.texto,
    backgroundColor: C.blanco, transition: "border-color 0.2s, box-shadow 0.2s" },

  // Botones
  btnPrimario: { width: "100%", padding: "14px", backgroundColor: C.azulMedio,
    color: C.blanco, border: "none", borderRadius: "8px", fontSize: "15px",
    fontWeight: "700", cursor: "pointer", marginTop: "8px", letterSpacing: "0.2px" },
  btnDesactivado: { width: "100%", padding: "14px", backgroundColor: "#a0aec0",
    color: C.blanco, border: "none", borderRadius: "8px", fontSize: "15px",
    fontWeight: "700", cursor: "not-allowed", marginTop: "8px" },
  btnSecundario: { padding: "11px 18px", backgroundColor: C.blanco,
    border: `1px solid ${C.grisBorde}`, borderRadius: "8px", fontSize: "14px",
    cursor: "pointer", marginTop: "8px", color: C.textoSuave, fontWeight: "600" },
  btnIcono: { padding: "6px 10px", backgroundColor: C.blanco, border: `1px solid ${C.grisBorde}`,
    borderRadius: "6px", cursor: "pointer", fontSize: "13px" },

  // Checklist
  checkItem: { display: "flex", alignItems: "center", gap: "12px", padding: "11px 14px",
    borderRadius: "8px", border: "1px solid", marginBottom: "8px", cursor: "pointer",
    transition: "background-color 0.15s, border-color 0.15s" },
  checkbox: { width: "20px", height: "20px", borderRadius: "4px", border: "2px solid",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "12px", color: C.blanco, flexShrink: 0, transition: "background-color 0.15s" },

  // Badges y cards
  tipoBadge: { marginLeft: "8px", fontSize: "11px", padding: "2px 8px", borderRadius: "12px",
    border: "1px solid", fontWeight: "600" },
  alumnoTag: { fontWeight: "700", color: C.azulMedio, marginRight: "10px", fontSize: "13px" },
  alumnoCard: { display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "10px 14px", borderRadius: "8px", backgroundColor: C.grisClaro,
    border: `1px solid ${C.grisBorde}`, marginBottom: "8px" },
  perfilBadge: { padding: "12px 16px", borderRadius: "8px", border: "1px solid",
    marginBottom: "24px" },

  // Separador
  separador: { display: "flex", alignItems: "center", gap: "12px", margin: "20px 0 16px" },
  separadorTexto: { fontSize: "13px", fontWeight: "700", color: C.azulMedio,
    whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: "0.8px" },

  // Resultado
  markdownBox: { fontSize: "14px", lineHeight: "1.8", color: C.texto,
    backgroundColor: C.grisClaro, padding: "20px", borderRadius: "8px",
    border: `1px solid ${C.grisBorde}` },

  // Historial
  historialItem: { display: "flex", flexDirection: "column", alignItems: "flex-start",
    padding: "14px 16px", borderRadius: "8px", border: "1px solid",
    marginBottom: "10px", cursor: "pointer", transition: "background-color 0.15s, border-color 0.15s" },
  detalleBox: { marginTop: "14px", borderTop: `1px solid ${C.grisBorde}`,
    paddingTop: "14px", width: "100%" },
  seccionTitulo: { fontSize: "18px", color: C.azul, marginBottom: "20px", fontWeight: "700" },
  vacio: { textAlign: "center", padding: "40px 0", color: C.grisMedio },

  // Footer
  footer: { textAlign: "center", padding: "24px", fontSize: "12px",
    color: C.grisMedio, letterSpacing: "0.3px" },

  error: { color: "#e53e3e", fontSize: "13px", marginBottom: "10px", fontWeight: "600" },
};