// src/styles/theme.js

export const C = {
  azul: "#1a3a6b",
  azulMedio: "#2b5299",
  azulClaro: "#e8eef7",
  azulBorde: "#c3d0e8",
  blanco: "#ffffff",
  grisClaro: "#f4f6fb",
  grisMedio: "#6b7a99",
  grisBorde: "#dde3f0",
  texto: "#1a2233",
  textoSuave: "#4a5568",
  acento: "#c8a84b",
};

export const coloresTipo = {
  "Tipo 1": "#fde8e8",
  "Tipo 2": "#fef9c3",
  "Tipo 3": "#e8f5e9",
};
export const bordesTipo = {
  "Tipo 1": "#e53e3e",
  "Tipo 2": "#d69e2e",
  "Tipo 3": "#38a169",
};

export const COMPORTAMIENTOS = [
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

export const PASOS = ["Alumno", "Contexto", "Planeación"];
export const espacios = ["Aula", "Laboratorio", "Taller"];

export const fadeIn = `
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes progressGrow { from { width: 0%; } }
  * { box-sizing: border-box; }
  body { margin: 0; background: #f4f6fb; font-family: 'Segoe UI', system-ui, sans-serif; }
  .fade-in { animation: fadeSlideIn 0.35s ease both; }
  input:focus, select:focus, textarea:focus {
    outline: none;
    border-color: #2b5299 !important;
    box-shadow: 0 0 0 3px rgba(43,82,153,0.15);
  }
  button:hover { filter: brightness(0.95); }
`;

export const s = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f4f6fb",
    paddingBottom: "48px",
  },
  header: { backgroundColor: "#1a3a6b", borderBottom: "4px solid #c8a84b" },
  headerInner: {
    maxWidth: "700px",
    margin: "0 auto",
    padding: "20px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "2px",
  },
  logoIcon: { fontSize: "24px" },
  logoText: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: "0.3px",
  },
  headerSub: {
    margin: 0,
    fontSize: "12px",
    color: "rgba(255,255,255,0.65)",
    letterSpacing: "0.5px",
  },
  btnSecHeader: {
    padding: "8px 18px",
    backgroundColor: "rgba(255,255,255,0.12)",
    color: "#ffffff",
    border: "1px solid rgba(255,255,255,0.25)",
    borderRadius: "8px",
    fontSize: "13px",
    cursor: "pointer",
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "36px",
    maxWidth: "700px",
    margin: "32px auto 0",
    boxShadow: "0 4px 32px rgba(26,58,107,0.10)",
    border: "1px solid #c3d0e8",
  },
  progressWrap: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
  },
  progressStep: { flex: 1, textAlign: "center" },
  progressLabel: { fontSize: "13px", transition: "color 0.3s" },
  progressBarBg: {
    height: "6px",
    backgroundColor: "#e8eef7",
    borderRadius: "99px",
    marginBottom: "32px",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: "99px",
    transition: "width 0.5s cubic-bezier(.4,0,.2,1)",
    backgroundImage: "linear-gradient(90deg, #2b5299, #c8a84b)",
  },
  tab: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #dde3f0",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    backgroundColor: "#f4f6fb",
    color: "#4a5568",
  },
  tabActivo: {
    backgroundColor: "#2b5299",
    color: "#ffffff",
    border: "1px solid #2b5299",
  },
  campo: { marginBottom: "20px" },
  label: {
    display: "block",
    fontWeight: "600",
    marginBottom: "6px",
    color: "#1a2233",
    fontSize: "14px",
  },
  input: {
    width: "100%",
    padding: "11px 14px",
    borderRadius: "8px",
    border: "1px solid #dde3f0",
    fontSize: "14px",
    color: "#1a2233",
    backgroundColor: "#ffffff",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  btnPrimario: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#2b5299",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    marginTop: "8px",
    letterSpacing: "0.2px",
  },
  btnDesactivado: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#a0aec0",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "not-allowed",
    marginTop: "8px",
  },
  btnSecundario: {
    padding: "11px 18px",
    backgroundColor: "#ffffff",
    border: "1px solid #dde3f0",
    borderRadius: "8px",
    fontSize: "14px",
    cursor: "pointer",
    marginTop: "8px",
    color: "#4a5568",
    fontWeight: "600",
  },
  btnIcono: {
    padding: "6px 10px",
    backgroundColor: "#ffffff",
    border: "1px solid #dde3f0",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
  },
  checkItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "11px 14px",
    borderRadius: "8px",
    border: "1px solid",
    marginBottom: "8px",
    cursor: "pointer",
    transition: "background-color 0.15s, border-color 0.15s",
  },
  checkbox: {
    width: "20px",
    height: "20px",
    borderRadius: "4px",
    border: "2px solid",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    color: "#ffffff",
    flexShrink: 0,
    transition: "background-color 0.15s",
  },
  tipoBadge: {
    marginLeft: "8px",
    fontSize: "11px",
    padding: "2px 8px",
    borderRadius: "12px",
    border: "1px solid",
    fontWeight: "600",
  },
  alumnoTag: {
    fontWeight: "700",
    color: "#2b5299",
    marginRight: "10px",
    fontSize: "13px",
  },
  alumnoCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 14px",
    borderRadius: "8px",
    backgroundColor: "#f4f6fb",
    border: "1px solid #dde3f0",
    marginBottom: "8px",
  },
  perfilBadge: {
    padding: "12px 16px",
    borderRadius: "8px",
    border: "1px solid",
    marginBottom: "24px",
  },
  separador: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    margin: "20px 0 16px",
  },
  separadorTexto: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#2b5299",
    whiteSpace: "nowrap",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
  },
  markdownBox: {
    fontSize: "14px",
    lineHeight: "1.8",
    color: "#1a2233",
    backgroundColor: "#f4f6fb",
    padding: "20px",
    borderRadius: "8px",
    border: "1px solid #dde3f0",
  },
  historialItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    padding: "14px 16px",
    borderRadius: "8px",
    border: "1px solid",
    marginBottom: "10px",
    cursor: "pointer",
    transition: "background-color 0.15s, border-color 0.15s",
  },
  detalleBox: {
    marginTop: "14px",
    borderTop: "1px solid #dde3f0",
    paddingTop: "14px",
    width: "100%",
  },
  seccionTitulo: {
    fontSize: "18px",
    color: "#1a3a6b",
    marginBottom: "20px",
    fontWeight: "700",
  },
  vacio: { textAlign: "center", padding: "40px 0", color: "#6b7a99" },
  footer: {
    textAlign: "center",
    padding: "24px",
    fontSize: "12px",
    color: "#6b7a99",
    letterSpacing: "0.3px",
  },
  error: {
    color: "#e53e3e",
    fontSize: "13px",
    marginBottom: "10px",
    fontWeight: "600",
  },
};
