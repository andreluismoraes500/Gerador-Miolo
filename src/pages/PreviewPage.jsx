// src/pages/PreviewPage.jsx
import { useNavigate, useOutletContext, useLocation } from "react-router-dom";
import { MdArrowBack, MdPrint } from "react-icons/md";
import { LadosImpressao, PartiturasOpcoes, HorarioOpcoes } from "../components/OpcoesImpressao";
import { PainelStickers, StickerPortais } from "../components/StickersEditor";
import { stickersDados, stickersUi } from "../lib/stickers";
import AgendaPreview from "../components/AgendaPreview";
import AgendaBuilderPreview from "../components/AgendaBuilderPreview";

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
    handlePrint,
  } = settings;
  const { builderMode, modules } = builder;

  // Lê o parâmetro 'printing' da URL
  const searchParams = new URLSearchParams(location.search);
  const forcePrint = searchParams.get("printing") === "true";
  const { editando } = stickersUi.useStore();
  const { itens: stickersItens } = stickersDados.useStore();
  const printing = forcePrint || printingFromSettings || editando;

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
              onClick={handlePrint}
              className="bg-[#8B2E3F] hover:bg-[#7A2837] text-[#FBF8F1] text-sm font-semibold py-2.5 px-5 rounded-xl flex items-center gap-2 transition-all shadow-[0_2px_0_0_#5E1F2B] hover:shadow-[0_1px_0_0_#5E1F2B] hover:translate-y-px active:translate-y-0.5 active:shadow-none"
            >
              <MdPrint className="w-4 h-4" />
              Baixar PDF (imprimir → salvar como PDF)
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full px-5 sm:px-6 flex flex-col gap-3 print:hidden">
        <PainelStickers />
        <div className="flex flex-col gap-1 max-w-2xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B6A1F]">Papel e lados da folha</span>
          <LadosImpressao />
        </div>
        {((builderMode && modules.some((m) => m.templateKey === "partituras")) || (!builderMode && template === "partituras")) && <PartiturasOpcoes />}
        {((builderMode && modules.some((m) => m.templateKey === "diarioHorario")) || (!builderMode && template === "diarioHorario")) && <HorarioOpcoes />}
      </div>

      <StickerPortais ativo={printing && (editando || stickersItens.length > 0)} />
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
