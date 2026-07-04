// src/components/PaymentPanel.jsx
import { useState } from "react";
import React from "react";
import {
  MdQrCodeScanner,
  MdOutlineCheckCircle,
  MdDelete,
} from "react-icons/md";

export default function PaymentPanel({
  paid,
  customName,
  onPayment,
  onNameChange,
  onClearName,
}) {
  const [showPayment, setShowPayment] = useState(false);
  const [tempName, setTempName] = useState(customName); // ← Adicionado para evitar perda durante digitação

  // Sincroniza quando o nome mudar de fora
  React.useEffect(() => {
    setTempName(customName);
  }, [customName]);

  const handleFakePayment = () => {
    const trimmed = tempName.trim();
    if (!trimmed) {
      alert("Por favor, preencha o nome do rodapé.");
      return;
    }
    onNameChange(trimmed);
    onPayment(true);
    setShowPayment(false);
  };

  const handleClear = () => {
    onClearName();
    setTempName("");
    setShowPayment(false);
  };

  if (paid && customName.trim() !== "") {
    return (
      <div className="mx-auto mb-6 mt-2 w-full max-w-2xl text-center p-4 bg-[#EFF5EF] rounded-lg border border-[#BFDBC5] flex items-center justify-between print:hidden shadow-sm">
        <div className="flex items-center gap-2">
          <MdOutlineCheckCircle className="w-4 h-4 text-[#2F6B45]" />
          <p className="text-[#25502F] text-xs font-medium">
            Rodapé: <strong>"{customName}"</strong>
          </p>
        </div>
        <button
          onClick={handleClear}
          className="text-[#8B2E3F] hover:text-[#6E2432] text-xs flex items-center gap-1 hover:bg-[#8B2E3F]/10 px-2 py-1 rounded transition"
        >
          <MdDelete className="w-4 h-4" />
          Limpar
        </button>
      </div>
    );
  }

  return (
    <div className="mb-8 mt-2 w-full max-w-2xl mx-auto bg-[#FBF8F1] p-5 rounded-xl border border-[#D8CBA8] shadow-[2px_2px_0_0_#D8CBA8] print:hidden">
      <div className="flex items-start gap-3 mb-1">
        <div className="shrink-0 w-8 h-8 rounded-full bg-[#8B2E3F] flex items-center justify-center shadow-sm">
          <MdQrCodeScanner className="w-4 h-4 text-[#FBF8F1]" />
        </div>
        <p className="text-xs text-[#6B6458] leading-relaxed pt-1.5">
          Personalize o nome que aparece no rodapé da agenda
        </p>
      </div>

      {!showPayment ? (
        <button
          onClick={() => {
            setTempName(customName);
            setShowPayment(true);
          }}
          className="mt-3 ml-11 bg-[#24344D] hover:bg-[#1B2740] text-[#F6F1E7] font-medium text-xs py-2 px-4 rounded-md transition flex items-center gap-2"
        >
          Customizar Nome do Rodapé
        </button>
      ) : (
        <div className="mt-4 border border-[#D8CBA8] p-4 rounded-lg bg-[#F1EADB] space-y-3">
          <div>
            <label className="block text-[10px] font-bold text-[#8B6A1F] uppercase tracking-wider mb-1">
              Nome / Marca no Rodapé:
            </label>
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              placeholder="Ex: Studio Bella, Ana Silva Mendes, Gráfica Express"
              className="w-full border border-[#D8CBA8] rounded px-3 py-2.5 text-sm bg-[#FBF8F1] focus:outline-none focus:ring-2 focus:ring-[#B8933D]/40 focus:border-[#B8933D]"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleFakePayment}
              className="flex-1 bg-[#2F6B45] text-white font-medium text-xs py-2.5 rounded-md hover:bg-[#275A3B] transition"
            >
              Aplicar Nome
            </button>
            <button
              onClick={() => {
                setShowPayment(false);
                setTempName(customName);
              }}
              className="px-5 bg-[#E5DBC2] text-[#6B6458] font-medium text-xs py-2.5 rounded-md hover:bg-[#DACDA9] transition"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
