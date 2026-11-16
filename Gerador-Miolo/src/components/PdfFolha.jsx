// Uma folha do PDF (210x297mm) com fundo colorido/imagem, marca d'água e a página.
export default function PdfFolha({ p, cfg, bgImg, marcaImg, ajuste, girar }) {
  const deitada = p.larg > p.alt && girar;
  const temFundo = !!cfg.bgCor || !!bgImg;
  return (
    <div className={`pdf-pagina ${ajuste === "preencher" ? "preencher" : ""}`}>
      {cfg.bgCor && <div style={{ position: "absolute", inset: 0, background: cfg.bgCor, opacity: cfg.bgOp / 100 }} />}
      {bgImg && <img src={bgImg} alt="" className="pdf-bg" style={{ opacity: cfg.bgOp / 100 }} />}
      <img src={p.url} alt="" className={deitada ? "girar" : ""} style={{ mixBlendMode: temFundo ? "multiply" : "normal", position: deitada ? "absolute" : "relative" }} />
      {cfg.marcaTipo === "texto" && cfg.marcaTexto && (
        <div className="pdf-marca" style={{ color: cfg.marcaCor, opacity: cfg.marcaOp / 100, fontSize: `${cfg.marcaTam}mm`, transform: `translate(-50%,-50%) rotate(${cfg.marcaGiro}deg)` }}>
          {cfg.marcaTexto}
        </div>
      )}
      {cfg.marcaTipo === "imagem" && marcaImg && (
        <img src={marcaImg} alt="" className="pdf-marca" style={{ opacity: cfg.marcaOp / 100, width: `${cfg.marcaTam * 2.5}mm`, maxWidth: "none", transform: `translate(-50%,-50%) rotate(${cfg.marcaGiro}deg)` }} />
      )}
    </div>
  );
}
