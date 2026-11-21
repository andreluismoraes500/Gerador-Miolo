// Controles de enquadramento de uma imagem (modo, zoom, fundo, posição) + restaurar.
import { AJ_PADRAO } from "../lib/imagemAjuste";
import Faixa from "./ui/Faixa";

const ent = "w-full rounded-lg border border-[#D8CBA8] bg-white px-2 py-1.5 text-sm";
const lin = "grid grid-cols-[64px_1fr] items-center gap-1";

export default function ControlesImagem({ a, mudar, bgAuto = "", comOpacidade = false, zoomMin = 0.2 }) {
  return (
    <div className="flex flex-col gap-2 text-xs text-[#24344D]">
      <select className={ent} value={a.modo} onChange={(e) => mudar({ modo: e.target.value })}>
        <option value="inteira">Automático — cabe inteira (recomendado)</option>
        <option value="preencher">Preencher (corta o excesso)</option>
      </select>
      {comOpacidade && <Faixa rotulo="Opac." valor={a.op} min={5} max={100} un="%" onChange={(v) => mudar({ op: v })} />}
      <Faixa rotulo="Zoom" valor={a.zoom} min={zoomMin} max={3} step={0.02} un="×" onChange={(v) => mudar({ zoom: v })} />
      <label className={lin}>Fundo<span className="flex gap-2 items-center"><input type="color" className="h-7 w-12" value={/^#/.test(a.bg || "") ? a.bg : "#ffffff"} onChange={(e) => mudar({ bg: e.target.value })} /><button type="button" className="underline" onClick={() => mudar({ bg: bgAuto || "" })}>cor da imagem</button></span></label>
      <Faixa rotulo="Horiz." valor={a.x} min={-100} max={100} onChange={(v) => mudar({ x: v })} />
      <Faixa rotulo="Vert." valor={a.y} min={-100} max={100} onChange={(v) => mudar({ y: v })} />
      <button type="button" className="self-start underline font-semibold" onClick={() => mudar({ ...AJ_PADRAO, bg: bgAuto || "" })}>↺ Restaurar enquadramento</button>
    </div>
  );
}
