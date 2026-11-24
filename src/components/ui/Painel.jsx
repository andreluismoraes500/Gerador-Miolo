// Painel recolhível (acordeão). O estado aberto/fechado de cada painel fica lembrado no navegador.
import { useState } from "react";
import { MdExpandMore } from "react-icons/md";

const chave = (id) => `painel-aberto:${id}`;
const ler = (id, padrao) => {
  try { const v = localStorage.getItem(chave(id)); return v === null ? padrao : v === "1"; } catch { return padrao; }
};

export default function Painel({ titulo, children, cls = "", aberto = true, id, fixo = false, dica }) {
  const k = `${typeof window !== "undefined" ? window.location.pathname : ""}:${id || (typeof titulo === "string" ? titulo : "")}`;
  const [open, setOpen] = useState(() => (k ? ler(k, aberto) : aberto));
  const alternar = () => {
    const n = !open;
    setOpen(n);
    try { if (k) localStorage.setItem(chave(k), n ? "1" : "0"); } catch { /* sem storage */ }
  };
  if (fixo) {
    return (
      <section className={`bg-[#FBF8F1] border-2 border-[#24344D] rounded-2xl px-4 py-4 flex flex-col gap-3 ${cls}`}>
        <div>
          <h2 className="font-bold text-lg text-[#24344D]">{titulo}</h2>
          {dica && <p className="text-xs text-[#6B6458] mt-0.5">{dica}</p>}
        </div>
        {children}
      </section>
    );
  }
  return (
    <section className={`bg-[#FBF8F1] border border-[#D8CBA8] rounded-2xl ${cls}`}>
      <button type="button" onClick={alternar} aria-expanded={open} className="w-full flex items-center justify-between gap-2 px-4 py-3 text-left">
        <h2 className="font-bold text-[#24344D]">{titulo}</h2>
        <MdExpandMore className={`w-5 h-5 shrink-0 text-[#8B6A1F] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-4 pb-4 flex flex-col gap-3">{children}</div>}
    </section>
  );
}
