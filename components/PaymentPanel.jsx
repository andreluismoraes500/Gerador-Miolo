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
      <div className="text-center mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center justify-between print:hidden">
        <div className="flex items-center gap-2">
          <MdOutlineCheckCircle className="w-4 h-4 text-emerald-600" />
          <p className="text-emerald-800 text-xs font-medium">
            Rodapé: <strong>"{customName}"</strong>
          </p>
        </div>
        <button
          onClick={handleClear}
          className="text-red-500 hover:text-red-600 text-xs flex items-center gap-1 hover:bg-red-50 px-2 py-1 rounded transition"
        >
          <MdDelete className="w-4 h-4" />
          Limpar
        </button>
      </div>
    );
  }

  return (
    <div className="mt-8 w-full max-w-2xl mx-auto bg-white p-5 rounded-xl border border-gray-200 print:hidden">
      <p className="text-xs text-gray-600 mb-3 leading-relaxed">
        Personalize o nome que aparece no rodapé da agenda
      </p>

      {!showPayment ? (
        <button
          onClick={() => {
            setTempName(customName);
            setShowPayment(true);
          }}
          className="bg-black hover:bg-gray-900 text-white font-medium text-xs py-2 px-4 rounded-md transition flex items-center gap-2"
        >
          <MdQrCodeScanner className="w-3.5 h-3.5" />
          Customizar Nome do Rodapé
        </button>
      ) : (
        <div className="mt-4 border border-gray-100 p-4 rounded-lg bg-gray-50 space-y-3">
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
              Nome / Marca no Rodapé:
            </label>
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              placeholder="Ex: Studio Bella, Ana Silva Mendes, Gráfica Express"
              className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-gray-500"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleFakePayment}
              className="flex-1 bg-emerald-600 text-white font-medium text-xs py-2.5 rounded-md hover:bg-emerald-700 transition"
            >
              Aplicar Nome
            </button>
            <button
              onClick={() => {
                setShowPayment(false);
                setTempName(customName);
              }}
              className="px-5 bg-gray-200 text-gray-700 font-medium text-xs py-2.5 rounded-md hover:bg-gray-300 transition"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
