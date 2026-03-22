// src/App.js

import { useState, useEffect } from "react";
import axios from "axios";

import Header               from "./componentes/Header";
import ProgressBar          from "./componentes/ProgressBar";
import AlumnoSelector       from "./componentes/AlumnoSelector";
import FormPlaneacion       from "./componentes/FormPlaneacion";
import ResultadoPlaneacion  from "./componentes/ResultadoPlaneacion";
import Historial            from "./componentes/Historial";
import { s, fadeIn }        from "./estilos/theme";

const API = "http://localhost:8000";

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
  const [cargando, setCargando]         = useState(false);
  const [error, setError]               = useState("");

  useEffect(() => { cargarAlumnos(); }, []);

  const cargarAlumnos = async () => {
    try { const r = await axios.get(`${API}/alumnos`); setAlumnos(r.data); } catch {}
  };

  const toggleRespuesta = (i) => {
    const n = [...respuestas]; n[i] = n[i] === 1 ? 0 : 1; setRespuestas(n);
  };

  const handleSeleccionarAlumno = (alumno) => {
    setAlumnoSeleccionado(alumno);
    setPerfil({ tipo: alumno.tipo_tea, descripcion: alumno.descripcion,
      confianza: alumno.confianza, perfil: alumno.perfil });
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
    let alumnoId     = alumnoSeleccionado?.id || null;
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

  const reiniciar = () => {
    setPaso(1); setModoAlumno("seleccionar"); setRespuestas(Array(12).fill(0));
    setPerfil(null); setAlumnoSeleccionado(null); setNombreAlumno(""); setNotasAlumno("");
    setPlaneacion(""); setPlaneacionId(null);
    setForm({ materia: "", tema: "", espacio: "Aula" }); setError("");
  };

  // ── Vista historial ──────────────────────────────────────────────────────
  if (vista === "historial") return (
    <div style={s.page}>
      <style>{fadeIn}</style>
      <Header vistaHistorial onVolver={() => setVista("app")} />
      <Historial onVolver={() => setVista("app")} />
      <div style={s.footer}>
        <p>Agente TEA · UTVM · Maestría en Inteligencia Artificial · 2026</p>
      </div>
    </div>
  );

  // ── App principal ────────────────────────────────────────────────────────
  return (
    <div style={s.page}>
      <style>{fadeIn}</style>
      <Header onHistorial={() => setVista("historial")} />
      <div style={s.card} className="fade-in">
        <ProgressBar paso={paso} />

        {paso === 1 && (
          <div className="fade-in">
            <AlumnoSelector
              modoAlumno={modoAlumno} setModoAlumno={setModoAlumno}
              alumnos={alumnos} respuestas={respuestas} onToggle={toggleRespuesta}
              nombreAlumno={nombreAlumno} setNombreAlumno={setNombreAlumno}
              notasAlumno={notasAlumno} setNotasAlumno={setNotasAlumno}
              onClasificar={handleClasificar} onSeleccionar={handleSeleccionarAlumno}
              onEliminar={eliminarAlumno} cargando={cargando} error={error}
            />
          </div>
        )}

        {paso === 2 && perfil && (
          <div className="fade-in">
            <FormPlaneacion
              perfil={perfil}
              alumnoNombre={alumnoSeleccionado?.nombre || nombreAlumno}
              form={form} setForm={setForm}
              onGenerar={handleGenerar} onVolver={reiniciar}
              cargando={cargando} error={error}
            />
          </div>
        )}

        {paso === 3 && (
          <div className="fade-in">
            <ResultadoPlaneacion
              perfil={perfil}
              alumnoNombre={alumnoSeleccionado?.nombre || nombreAlumno}
              form={form} planeacion={planeacion} planeacionId={planeacionId}
              onHistorial={() => setVista("historial")} onReiniciar={reiniciar}
            />
          </div>
        )}
      </div>

      <div style={s.footer}>
        <p>Agente TEA · UTVM · Maestría en Inteligencia Artificial · 2026</p>
      </div>
    </div>
  );
}