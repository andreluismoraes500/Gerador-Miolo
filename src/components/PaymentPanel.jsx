import { useState } from "react";
import { MdQrCodeScanner, MdOutlineCheckCircle } from "react-icons/md";

export default function PaymentPanel({
  paid,
  customName,
  onPayment,
  onNameChange,
}) {
  const [showPayment, setShowPayment] = useState(false);

  const handleFakePayment = () => {
    if (!customName.trim()) {
      alert("Por favor, preencha o nome do rodapé para prosseguir.");
      return;
    }
    alert("Alteração de rodapé personalizada aplicada com sucesso!");
    onPayment(true);
    setShowPayment(false);
  };

  if (paid) {
    return (
      <div className="text-center mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center justify-center gap-2 print:hidden">
        <MdOutlineCheckCircle className="w-4 h-4 text-emerald-600" />
        <p className="text-emerald-800 text-xs font-medium">
          Nome alterado para: <strong>"{customName}"</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 w-full max-w-2xl mx-auto bg-white p-5 rounded-xl border border-gray-200 print:hidden">
      <p className="text-xs text-gray-600 mb-3 leading-relaxed">
        Nos ajude a melhorar a cada dia mais com geradores de agendas
        automatizados
      </p>

      {!showPayment ? (
        <button
          onClick={() => setShowPayment(true)}
          className="bg-black hover:bg-gray-900 text-white font-medium text-xs py-2 px-4 rounded-md transition flex items-center gap-2"
        >
          <MdQrCodeScanner className="w-3.5 h-3.5" />
          Customizar Nome
        </button>
      ) : (
        <div className="mt-4 border border-gray-100 p-4 rounded-lg bg-gray-50 space-y-3">
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
              Nome/Marca do Rodapé:
            </label>
            <input
              type="text"
              value={customName}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Ex: Gráfica Express ou Nome do Cliente"
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs bg-white text-gray-900 focus:outline-none"
            />
          </div>
          <button
            onClick={handleFakePayment}
            className="w-full bg-emerald-600 text-white font-medium text-xs py-2 rounded-md hover:bg-emerald-700 transition"
          >
            Rodapé Personalizado!
          </button>
        </div>
      )}
    </div>
  );
}
