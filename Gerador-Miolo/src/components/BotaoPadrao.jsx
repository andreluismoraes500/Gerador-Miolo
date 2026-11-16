// Botão "voltar ao padrão" das medidas, igual em todas as páginas.
import { MdRestartAlt } from "react-icons/md";

export default function BotaoPadrao({ onClick, texto = "Restaurar medidas padrão" }) {
  return (
    <button type="button" onClick={onClick} className="self-start inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#D8CBA8] bg-white text-xs font-semibold text-[#24344D] hover:bg-[#F6F1E7]">
      <MdRestartAlt size={16} /> {texto}
    </button>
  );
}
