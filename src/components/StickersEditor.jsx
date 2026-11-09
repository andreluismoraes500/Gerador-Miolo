import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-hot-toast";
import { EMOJIS, WASHI, adicionar, atualizar, limparTudo, remover, repetirEmTodas, stickersDados, stickersUi } from "../lib/stickers";

function Visual({ s }) {
  if (s.tipo === "washi")
    return (
      <div
        style={{
          width: `${s.tam * 3}mm`,
          height: `${s.tam * 0.6}mm`,
          background: `repeating-linear-gradient(45deg, ${s.v}, ${s.v} 2mm, ${s.v}cc 2mm, ${s.v}cc 4mm)`,
          opacity: 0.88,
          boxShadow: "0 0.3mm 0.8mm rgba(0,0,0,.18)",
        }}
      />
    );
  if (s.tipo === "img") return <img src={s.v} alt="" draggable={false} style={{ width: `${s.tam}mm`, display: "block" }} />;
  return (
    <span style={{ fontSize: `${s.tam}mm`, lineHeight: 1, display: "block", fontFamily: "'Noto Color Emoji','Apple Color Emoji','Segoe UI Emoji',sans-serif" }}>
      {s.v}
    </span>
  );
}

// Camada de stickers de UMA página (fica dentro do .page-break).
function StickerLayer({ pagina }) {
  const { itens } = stickersDados.useStore();
  const { editando, armado, sel } = stickersUi.useStore();
  const ref = useRef(null);
  const meus = itens.filter((i) => i.pagina === pagina);

  const pct = (e) => {
    const r = ref.current.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 };
  };

  const clicarFundo = (e) => {
    if (!editando || e.target !== ref.current) return;
    if (armado) {
      const id = adicionar({ ...armado, pagina, ...pct(e) });
      stickersUi.set({ sel: id });
    } else stickersUi.set({ sel: null });
  };

  const arrastar = (item) => (e) => {
    if (!editando) return;
    e.stopPropagation();
    e.preventDefault();
    stickersUi.set({ sel: item.id, armado: null });
    const alvo = e.currentTarget;
    alvo.setPointerCapture(e.pointerId);
    const mover = (ev) => atualizar(item.id, pct(ev));
    const soltar = () => {
      alvo.removeEventListener("pointermove", mover);
      alvo.removeEventListener("pointerup", soltar);
    };
    alvo.addEventListener("pointermove", mover);
    alvo.addEventListener("pointerup", soltar);
  };

  return (
    <div
      ref={ref}
      onPointerDown={clicarFundo}
      style={{ position: "absolute", inset: 0, pointerEvents: editando ? "auto" : "none", cursor: editando && armado ? "crosshair" : "default" }}
    >
      {meus.map((s) => (
        <div
          key={s.id}
          onPointerDown={arrastar(s)}
          style={{
            position: "absolute",
            left: `${s.x}%`,
            top: `${s.y}%`,
            transform: `translate(-50%,-50%) rotate(${s.rot}deg)`,
            pointerEvents: editando ? "auto" : "none",
            cursor: editando ? "move" : "default",
            touchAction: "none",
            outline: editando && sel === s.id ? "0.4mm dashed #b8933d" : "none",
            outlineOffset: "1mm",
          }}
        >
          <Visual s={s} />
        </div>
      ))}
    </div>
  );
}

// Injeta uma camada de stickers em cada página do .print-container.
export function StickerPortais({ ativo }) {
  const [hosts, setHosts] = useState([]);
  useEffect(() => {
    if (!ativo) return undefined;
    const varre = () => {
      const cont = document.querySelector(".print-container");
      if (!cont) {
        setHosts((h) => (h.length ? [] : h));
        return;
      }
      if (cont.querySelector(":scope > .folha")) return; // impressão em andamento: páginas reorganizadas
      const pgs = [...cont.children].filter((el) => el.classList.contains("page-break"));
      const hs = pgs.map((pg, i) => {
        let h = [...pg.children].find((c) => c.classList?.contains("sticker-host"));
        if (!h) {
          h = document.createElement("div");
          h.className = "sticker-host";
          pg.appendChild(h);
        }
        h.dataset.pagina = String(i + 1);
        return h;
      });
      setHosts((prev) => (prev.length === hs.length && prev.every((x, i) => x === hs[i]) ? prev : hs));
    };
    varre();
    const mo = new MutationObserver(varre);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, [ativo]);

  useEffect(() => {
    document.body.classList.toggle("sticker-editando", !!ativo && stickersUi.get().editando);
    return () => document.body.classList.remove("sticker-editando");
  });

  return hosts.map((h, i) => createPortal(<StickerLayer pagina={h.parentElement?.dataset.stkey ?? i} />, h, `st-${i}`));
}

// Talonário: cada .doc-card (prévia e vias impressas) recebe a camada de
// stickers da aba ativa — o mesmo desenho se repete em todas as vias.
export function StickerPortaisTal({ ativo, tab }) {
  const [hosts, setHosts] = useState([]);
  useEffect(() => {
    if (!ativo) return undefined;
    const varre = () => {
      const hs = [...document.querySelectorAll(".doc-card")].map((card) => {
        let h = [...card.children].find((c) => c.classList?.contains("sticker-host"));
        if (!h) {
          h = document.createElement("div");
          h.className = "sticker-host";
          card.appendChild(h);
        }
        return h;
      });
      setHosts((prev) => (prev.length === hs.length && prev.every((x, i) => x === hs[i]) ? prev : hs));
    };
    varre();
    const mo = new MutationObserver(varre);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, [ativo]);
  return hosts.map((h, i) => createPortal(<StickerLayer pagina={`tal-${tab}`} />, h, `st-${i}`));
}

export function PainelStickers({ talonario = false, prefixo = "" }) {
  const { itens } = stickersDados.useStore();
  const { editando, armado, sel } = stickersUi.useStore();
  const arquivo = useRef(null);
  const atual = itens.find((i) => i.id === sel);

  useEffect(() => {
    if (!editando) return undefined;
    const tecla = (e) => {
      if ((e.key === "Delete" || e.key === "Backspace") && stickersUi.get().sel && !/INPUT|TEXTAREA/.test(document.activeElement?.tagName)) {
        remover(stickersUi.get().sel);
      }
    };
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, [editando]);

  const armar = (a) => stickersUi.set({ armado: a, sel: null });
  const enviar = (e) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    const r = new FileReader();
    r.onload = () => armar({ tipo: "img", v: r.result, tam: 30 });
    r.onerror = () => toast.error("Não foi possível ler a imagem.");
    r.readAsDataURL(f);
  };

  if (!editando) {
    return (
      <button
        type="button"
        onClick={() => stickersUi.set({ editando: true })}
        className="self-start bg-[#FBF8F1] border border-[#D8CBA8] hover:border-[#B8933D] text-[#24344D] text-sm font-semibold py-2 px-4 rounded-xl flex items-center gap-2 transition"
      >
        🎨 Stickers {itens.length > 0 && <span className="text-[10px] bg-[#EFE4C8] border border-[#DEC98B] rounded-full px-2 py-0.5">{itens.length}</span>}
      </button>
    );
  }

  const total = () => document.querySelectorAll(".print-container > .page-break").length;

  return (
    <div className="bg-[#FBF8F1] border border-[#D8CBA8] rounded-xl p-4 flex flex-col gap-3 sticky top-16 z-30 shadow-md max-h-[42vh] overflow-auto">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-[#24344D]">🎨 Stickers — escolha um e clique {talonario ? "no talão" : "na página"}</h3>
          <p className="text-[11px] text-[#8B6A1F]">{talonario ? "Valem para todas as vias desta aba. " : ""}Arraste para mover. Selecione para ajustar tamanho e giro. Delete remove.</p>
        </div>
        <button type="button" onClick={() => stickersUi.set({ editando: false, armado: null, sel: null })} className="bg-[#24344D] text-[#F6F1E7] text-xs font-semibold py-2 px-4 rounded-lg">
          Concluir
        </button>
      </div>

      <div className="flex flex-wrap gap-1 max-h-24 overflow-auto">
        {EMOJIS.map((em) => (
          <button
            key={em}
            type="button"
            onClick={() => armar({ tipo: "emoji", v: em, tam: 14 })}
            className={`w-8 h-8 text-xl rounded-md border ${armado?.v === em ? "border-[#B8933D] bg-[#FBF4E0]" : "border-transparent hover:bg-white"}`}
          >
            {em}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B6A1F]">Fitas</span>
        {WASHI.map((c) => (
          <button
            key={c}
            type="button"
            aria-label="Fita washi"
            onClick={() => armar({ tipo: "washi", v: c, tam: 12 })}
            className={`w-9 h-4 rounded-sm border ${armado?.v === c ? "border-[#24344D]" : "border-black/10"}`}
            style={{ background: `repeating-linear-gradient(45deg, ${c}, ${c} 4px, ${c}cc 4px, ${c}cc 8px)` }}
          />
        ))}
        <button type="button" onClick={() => arquivo.current?.click()} className="text-xs border border-[#D8CBA8] bg-white rounded-lg px-3 py-1.5 hover:border-[#B8933D]">
          🖼️ Enviar imagem
        </button>
        <input ref={arquivo} type="file" accept="image/*" className="hidden" onChange={enviar} />
        {armado && (
          <button type="button" onClick={() => stickersUi.set({ armado: null })} className="text-xs text-[#8B2E3F] underline">
            parar de colocar
          </button>
        )}
      </div>

      {atual && (
        <div className="flex flex-wrap items-center gap-4 border-t border-[#D8CBA8]/70 pt-3 text-xs text-[#24344D]">
          <label className="flex items-center gap-2">
            Tamanho
            <input type="range" min="5" max="90" value={atual.tam} onChange={(e) => atualizar(atual.id, { tam: Number(e.target.value) })} />
          </label>
          <label className="flex items-center gap-2">
            Giro
            <input type="range" min="-180" max="180" value={atual.rot} onChange={(e) => atualizar(atual.id, { rot: Number(e.target.value) })} />
          </label>
          <button type="button" className="border border-[#D8CBA8] rounded-lg px-2.5 py-1 bg-white" onClick={() => stickersUi.set({ sel: adicionar({ ...atual, id: undefined, x: Math.min(95, atual.x + 4), y: Math.min(95, atual.y + 4) }) })}>
            Duplicar
          </button>
          {!talonario && <button type="button" className="border border-[#D8CBA8] rounded-lg px-2.5 py-1 bg-white" onClick={() => { repetirEmTodas(atual.id, prefixo ? [...document.querySelectorAll(".print-container > .page-break")].map((el) => el.dataset.stkey) : total()); toast.success("Repetido em todas as páginas"); }}>
            Repetir em todas as páginas
          </button>}
          <button type="button" className="border border-[#8B2E3F]/40 text-[#8B2E3F] rounded-lg px-2.5 py-1 bg-white" onClick={() => remover(atual.id)}>
            Excluir
          </button>
        </div>
      )}

      {itens.length > 0 && (
        <button type="button" onClick={() => { if (window.confirm("Remover todos os stickers?")) limparTudo(); }} className="self-start text-[11px] text-[#8B2E3F] underline">
          Remover todos os stickers ({itens.length})
        </button>
      )}
    </div>
  );
}
