// Folha só pautada: linhas horizontais regulares e mais nada (opcionalmente
// margem vertical, linha de nome/data e número da página).
import { PageShell } from "./NotebookShared";
import { pautadoCfg, pautadoImg } from "../../lib/configPautado";

export function PautadoPage({ pageIndex = 0, totalPaginas = 1, ...rest }) {
  const c = pautadoCfg.useStore();
  const img = pautadoImg.useStore().src;
  const e = Math.max(3, Number(c.espac) || 8);
  const linhas = Math.ceil(300 / e);
  const borda = c.estilo === "pontilhada" ? "dotted" : c.estilo === "tracejada" ? "dashed" : "solid";
  const esp = `${Math.max(0.1, Number(c.espessura) || 0.25)}mm`;
  return (
    <PageShell {...rest} {...(img ? { backgroundSrc: img, backgroundOpacity: c.imgOpac } : {})}>
      <div
        className="flex flex-col flex-1 min-h-0"
        style={img && c.painel ? { margin: `${c.moldura}mm`, padding: "4mm", background: `rgba(255,255,255,${c.painelOpac})`, borderRadius: `${c.painelRaio}mm` } : undefined}
      >
      {c.cabecalho && (
        <div className="flex gap-6 shrink-0 text-[10px] text-gray-500 pb-3" style={{ fontFamily: rest.fontFamily }}>
          <div className="flex-1 flex items-end gap-1">Nome:<span className="flex-1" style={{ borderBottom: `0.25mm solid ${c.cor}` }} /></div>
          <div className="w-40 flex items-end gap-1">Data:<span className="flex-1" style={{ borderBottom: `0.25mm solid ${c.cor}` }} /></div>
        </div>
      )}
      <div className="relative flex-1 min-h-0 overflow-hidden">
        <div style={{ height: `${Number(c.inicio) || 0}mm` }} />
        {Array.from({ length: linhas }).map((_, i) => (
          <div key={i} style={{ height: `${e}mm`, boxSizing: "border-box", borderBottom: `${esp} ${borda} ${c.cor}` }} />
        ))}
        {c.margemLinha && <div className="absolute top-0 bottom-0" style={{ left: `${c.margemX}mm`, borderLeft: `0.3mm solid #e08a8a` }} />}
      </div>
      {c.numerar && <div className="shrink-0 text-right text-[9px] text-gray-400 pt-1">{pageIndex + 1}</div>}
      </div>
    </PageShell>
  );
}
