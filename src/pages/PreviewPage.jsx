// src/pages/PreviewPage.jsx
import { useNavigate, useOutletContext, useLocation } from "react-router-dom";
import { MdArrowBack, MdPrint } from "react-icons/md";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import AgendaPreview from "../components/AgendaPreview";
import AgendaBuilderPreview from "../components/AgendaBuilderPreview";
import { captureAgendaState } from "../utils/agendaStateSnapshot";

export default function PreviewPage() {
  const { settings, builder } = useOutletContext();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    template,
    customName,
    footerName,
    selectedDate,
    printing: printingFromSettings,
    businessProfile,
    businessProfileId,
    footerType,
    handlePrint,
  } = settings;
  const { builderMode, modules } = builder;

  // Lê o parâmetro 'printing' da URL
  const searchParams = new URLSearchParams(location.search);
  const forcePrint = searchParams.get("printing") === "true";
  const [printing, setPrinting] = useState(forcePrint || printingFromSettings);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setPrinting(params.get("printing") === "true" || printingFromSettings);
  }, [location.search, printingFromSettings]);

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function gerarPDFViaBackend() {
    const toastId = toast.loading("Entrando na fila...");
    try {
      // Tira uma "foto" de tudo que está no localStorage (template, combo
      // da Montagem Completa, logo, cores, marca d'água, rodapé etc.) e
      // manda para o backend. É isso que garante que o PDF gerado pelo
      // servidor saia IDÊNTICO ao que você está vendo aqui na tela — sem
      // isso o Puppeteer abre uma aba em branco, sem nenhuma das suas
      // personalizações.
      const state = captureAgendaState();

      const enqueueRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          template,
          selectedDate,
          customName,
          footerType,
          businessProfileId,
          builderMode,
          state,
        }),
      });

      if (!enqueueRes.ok) {
        let errorMsg = "Erro ao enfileirar a geração do PDF";
        try {
          const errorData = await enqueueRes.json();
          errorMsg = errorData.error || errorMsg;
        } catch (_) {
          errorMsg = enqueueRes.statusText || errorMsg;
        }
        toast.error(errorMsg, { id: toastId });
        return;
      }

      const { jobId } = await enqueueRes.json();

      // Faz polling do status até o worker terminar de processar este job
      // (a fila é FIFO: se houver gente na sua frente, o toast mostra a
      // posição). Timeout generoso porque templates grandes (montagem
      // completa, combos com centenas de páginas) podem demorar.
      const startedAt = Date.now();
      const TIMEOUT_MS = 6 * 60 * 1000; // 6 minutos
      let lastStatus = null;

      // eslint-disable-next-line no-constant-condition
      while (true) {
        if (Date.now() - startedAt > TIMEOUT_MS) {
          toast.error("Demorou demais para gerar o PDF. Tente novamente.", {
            id: toastId,
          });
          return;
        }

        const statusRes = await fetch(`/api/status/${jobId}`);
        if (!statusRes.ok) {
          toast.error("Não foi possível consultar o status do PDF.", {
            id: toastId,
          });
          return;
        }
        const statusData = await statusRes.json();
        lastStatus = statusData.status;

        if (lastStatus === "waiting" || lastStatus === "delayed") {
          toast.loading(
            statusData.position
              ? `Na fila — posição ${statusData.position}...`
              : "Na fila...",
            { id: toastId },
          );
        } else if (lastStatus === "active") {
          toast.loading("Gerando seu PDF...", { id: toastId });
        } else if (lastStatus === "completed") {
          break;
        } else if (lastStatus === "failed") {
          toast.error(statusData.error || "Falha ao gerar o PDF", {
            id: toastId,
          });
          return;
        }

        await sleep(1500);
      }

      const resultRes = await fetch(`/api/result/${jobId}`);
      if (!resultRes.ok) {
        let errorMsg = "Erro ao baixar o PDF gerado";
        try {
          const errorData = await resultRes.json();
          errorMsg = errorData.error || errorMsg;
        } catch (_) {
          errorMsg = resultRes.statusText || errorMsg;
        }
        toast.error(errorMsg, { id: toastId });
        return;
      }

      const blob = await resultRes.blob();
      const url = URL.createObjectURL(blob);
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

            <button
              onClick={gerarPDFViaBackend}
              className="bg-[#2F6B45] hover:bg-[#275A3B] text-[#FBF8F1] text-sm font-semibold py-2.5 px-5 rounded-xl flex items-center gap-2 transition-all shadow-[0_2px_0_0_#1B4D2F] hover:shadow-[0_1px_0_0_#1B4D2F] hover:translate-y-px active:translate-y-0.5 active:shadow-none"
            >
              <MdPrint className="w-4 h-4" />
              Baixar PDF
            </button>

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
