// src/components/ResultadoPlaneacion.jsx

import ReactMarkdown from "react-markdown";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { C, coloresTipo, bordesTipo, s } from "../estilos/theme";

export default function ResultadoPlaneacion({
  perfil, alumnoNombre, form, planeacion,
  planeacionId, onHistorial, onReiniciar,
}) {
  const exportarPDF = async () => {
    const elemento = document.getElementById("planeacion-pdf");
    const canvas   = await html2canvas(elemento, { scale: 2, useCORS: true });
    const imgData  = canvas.toDataURL("image/png");
    const pdf      = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pdfW     = pdf.internal.pageSize.getWidth();
    const pdfH     = (canvas.height * pdfW) / canvas.width;

    if (pdfH > 297) {
      let position = 0;
      const pageH  = (297 * canvas.width) / pdfW;
      while (position < canvas.height) {
        const canvasPagina = document.createElement("canvas");
        canvasPagina.width  = canvas.width;
        canvasPagina.height = Math.min(pageH, canvas.height - position);
        const ctx = canvasPagina.getContext("2d");
        ctx.drawImage(canvas, 0, -position);
        pdf.addImage(canvasPagina.toDataURL("image/png"), "PNG", 0, 0, pdfW,
          (canvasPagina.height * pdfW) / canvas.width);
        position += pageH;
        if (position < canvas.height) pdf.addPage();
      }
    } else {
      pdf.addImage(imgData, "PNG", 0, 0, pdfW, pdfH);
    }

    const nombre = `planeacion_${alumnoNombre.replace(/ /g, "_")}_${form.tema.replace(/ /g, "_")}.pdf`;
    pdf.save(nombre);
  };

  return (
    <>
      <div id="planeacion-pdf" style={{ backgroundColor: C.blanco, padding: "32px 40px",
        maxWidth: "720px", margin: "0 auto", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

        {/* Encabezado del PDF */}
        <div style={{ borderBottom: `4px solid ${C.azul}`, paddingBottom: "16px", marginBottom: "24px" }}>
          <p style={{ margin: "0 0 4px", fontSize: "11px", color: C.grisMedio,
            textTransform: "uppercase", letterSpacing: "1.5px" }}>
            Universidad Tecnológica del Valle del Mezquital
          </p>
          <h2 style={{ margin: "0 0 12px", fontSize: "18px", color: C.azul, fontWeight: "700" }}>
            Planeación Didáctica Inclusiva — TEA
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 24px",
            backgroundColor: C.azulClaro, padding: "12px 16px", borderRadius: "8px" }}>
            {[
              ["Alumno",    alumnoNombre],
              ["Tipo TEA",  perfil.tipo],
              ["Materia",   form.materia],
              ["Tema",      form.tema],
              ["Espacio",   form.espacio],
              ["Confianza", `${perfil.confianza}%`],
            ].map(([clave, valor]) => (
              <div key={clave}>
                <span style={{ fontSize: "11px", color: C.grisMedio,
                  textTransform: "uppercase", letterSpacing: "0.8px" }}>{clave}</span>
                <p style={{ margin: "2px 0 0", fontSize: "13px", fontWeight: "600", color: C.texto }}>{valor}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contenido */}
        <div style={{ fontSize: "14px", lineHeight: "1.9", color: C.texto, padding: "0 4px" }}>
          <ReactMarkdown>{planeacion}</ReactMarkdown>
        </div>

        {/* Pie */}
        <div style={{ marginTop: "32px", paddingTop: "12px", borderTop: `2px solid ${C.azulBorde}`,
          fontSize: "11px", color: C.grisMedio, display: "flex", justifyContent: "space-between" }}>
          <span>Generado con Agente TEA · UTVM · 2026</span>
          <span>Planeación #{planeacionId} · {perfil.tipo} — {perfil.descripcion}</span>
        </div>
      </div>

      {/* Badge resumen */}
      <div style={{ ...s.perfilBadge, backgroundColor: coloresTipo[perfil.tipo],
        borderColor: bordesTipo[perfil.tipo], marginTop: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontWeight: "700", color: C.texto }}>
            👤 {alumnoNombre} · {perfil.tipo}
          </span>
          <span style={{ fontSize: "12px", color: C.grisMedio }}>#{planeacionId} guardada ✓</span>
        </div>
        <p style={{ fontSize: "13px", color: C.textoSuave, margin: "4px 0 0" }}>
          {form.materia}: {form.tema} · {form.espacio}
        </p>
      </div>

      {/* Botones */}
      <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
        <button style={s.btnSecundario}
          onClick={() => navigator.clipboard.writeText(planeacion)}>📋 Copiar</button>
        <button style={{ ...s.btnSecundario, color: C.azulMedio, borderColor: C.azulMedio }}
          onClick={exportarPDF}>📄 Exportar PDF</button>
        <button style={s.btnSecundario} onClick={onHistorial}>📚 Historial</button>
        <button style={{ ...s.btnPrimario, flex: 1 }} onClick={onReiniciar}>✨ Nueva planeación</button>
      </div>
    </>
  );
}