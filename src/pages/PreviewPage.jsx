// src/pages/PreviewPage.jsx
//
// Etapa final do fluxo: mostra o resultado (modo único ou montagem),
// permite personalizar o nome do rodapé e disparar a impressão/PDF.

import { useNavigate, useOutletContext } from "react-router-dom";
import { MdArrowBack, MdPrint } from "react-icons/md";
import toast from "react-hot-toast"; // <-- ADICIONE ESTA LINHA
import AgendaPreview from "../components/AgendaPreview";
import AgendaBuilderPreview from "../components/AgendaBuilderPreview";

export default function PreviewPage() {
  const { settings, builder } = useOutletContext();
  const navigate = useNavigate();
  const {
    template,
    customName,
    footerName,
    selectedDate,
    printing,
    businessProfile,
    businessProfileId,
    colorTheme,
    footerType,
    handlePrint, // método antigo (window.print)
  } = settings;
  const { builderMode, modules } = builder;

  // Função para gerar PDF via backend
  async function gerarPDFViaBackend() {
    const toastId = toast.loading("Gerando PDF...");
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          template,
          selectedDate,
          colorTheme,
          customName,
          footerType,
          businessProfileId,
        }),
      });

      if (!response.ok) {
        let errorMsg = "Erro ao gerar PDF";
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || errorMsg;
        } catch (_) {
          errorMsg = response.statusText || errorMsg;
        }
        toast.error(errorMsg, { id: toastId });
        return;
      }

      // Converte a resposta em Blob
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      // Cria um link temporário e dispara o download
      const a = document.createElement("a");
      a.href = url;
      a.download = `agenda-${template}-${selectedDate}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("PDF baixado com sucesso!", { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error("Erro de conexão com o servidor.", { id: toastId });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="max-w-6xl mx-auto w-full px-5 sm:px-6 pt-8 flex flex-col gap-5 print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1
              className="text-2xl sm:text-3xl font-semibold text-[#24344D] tracking-tight"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Sua agenda está pronta
            </h1>
            <p className="text-sm text-[#6B6458] mt-1">
              Confira o resultado abaixo. Se quiser ajustar algo, volte às
              etapas anteriores — nada se perde.
            </p>
            {customName && (
              <p className="text-xs text-[#2F6B45] mt-1 flex items-center gap-1">
                <span>✓</span>
                Rodapé personalizado: <strong>{customName}</strong>
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/config")}
              className="text-[#6B6458] hover:text-[#24344D] font-medium text-sm py-2.5 px-4 rounded-xl flex items-center gap-2 transition-all hover:bg-[#EFE4C8]"
            >
              <MdArrowBack className="w-4 h-4" />
              Configurações
            </button>

            {/* Botão para gerar PDF via backend (recomendado) */}
            <button
              onClick={gerarPDFViaBackend}
              className="bg-[#2F6B45] hover:bg-[#275A3B] text-[#FBF8F1] text-sm font-semibold py-2.5 px-5 rounded-xl flex items-center gap-2 transition-all shadow-[0_2px_0_0_#1B4D2F] hover:shadow-[0_1px_0_0_#1B4D2F] hover:translate-y-px active:translate-y-0.5 active:shadow-none"
            >
              <MdPrint className="w-4 h-4" />
              Baixar PDF (backend)
            </button>

            {/* Botão antigo (impressão via navegador) - mantido como fallback */}
            <button
              onClick={handlePrint}
              className="bg-[#8B2E3F] hover:bg-[#7A2837] text-[#FBF8F1] text-sm font-semibold py-2.5 px-5 rounded-xl flex items-center gap-2 transition-all shadow-[0_2px_0_0_#5E1F2B] hover:shadow-[0_1px_0_0_#5E1F2B] hover:translate-y-px active:translate-y-0.5 active:shadow-none"
            >
              <MdPrint className="w-4 h-4" />
              Imprimir (navegador)
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full px-5 sm:px-6 pb-12 flex justify-center print:p-0 print:max-w-none">
        {builderMode ? (
          <AgendaBuilderPreview
            modules={modules}
            customName={footerName}
            selectedDate={selectedDate}
            printing={printing}
            businessProfile={businessProfile}
            businessProfileId={businessProfileId}
          />
        ) : (
          <AgendaPreview
            template={template}
            customName={footerName}
            paid={false}
            selectedDate={selectedDate}
            printing={printing}
            businessProfile={businessProfile}
            businessProfileId={businessProfileId}
          />
        )}
      </div>
    </div>
  );
}
