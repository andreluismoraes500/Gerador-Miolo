// src/pages/TalonarioPage.jsx
//
// Gerador de Pedidos de Venda, Receituários e Receitas em formato de talão.
// Vive dentro do AppLayout (cabeçalho/nav/print.css compartilhados com o
// resto do app) — só a barra de abas abaixo é própria dela, com a cor de
// destaque de cada aba. A numeração automática e a marca d'água são
// geradas em lote na hora de imprimir.

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  MdReceiptLong,
  MdMedicalServices,
  MdRestaurantMenu,
  MdGridOn,
  MdPrint,
  MdBuild,
  MdReceipt,
  MdRoomService,
  MdEventAvailable,
  MdCardGiftcard,
  MdCloudDownload,
} from "react-icons/md";
import {
  useTalonarioBuilder,
  BINGO_LAYOUTS,
} from "../hooks/useTalonarioBuilder";
import {
  PedidoCard,
  ReceituarioCard,
  ReceitaCard,
  BingoCard,
  OrdemServicoCard,
  ReciboCard,
  ComandaCard,
  ReservaCard,
  ValePresenteCard,
} from "../components/talonario/TalonarioCards";
import {
  PedidoPanel,
  ReceituarioPanel,
  ReceitaPanel,
  BingoPanel,
  OrdemServicoPanel,
  ReciboPanel,
  ComandaPanel,
  ReservaPanel,
  ValePresentePanel,
  WatermarkPanel,
  ColorPanel,
  UploadBox,
} from "../components/talonario/TalonarioPanels";
import { usePdfReadySignal } from "../hooks/usePdfReadySignal";
import { captureTalonarioState } from "../utils/talonarioStateSnapshot";
import "../styles/talonario.css";

// Agrupa a lista de cartelas em blocos do tamanho escolhido (cartelas por
// folha), para renderizar uma <div className="tal-print-page"> por bloco.
function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

const TABS = [
  { id: "pedido", label: "Pedido de Venda", icon: MdReceiptLong },
  { id: "receituario", label: "Receituário", icon: MdMedicalServices },
  { id: "receita", label: "Receita Culinária", icon: MdRestaurantMenu },
  { id: "bingo", label: "Bingo", icon: MdGridOn },
  { id: "ordemServico", label: "Ordem de Serviço", icon: MdBuild },
  { id: "recibo", label: "Recibo de Pagamento", icon: MdReceipt },
  { id: "comanda", label: "Comandas", icon: MdRoomService },
  { id: "reserva", label: "Reserva / Agendamento", icon: MdEventAvailable },
  { id: "valePresente", label: "Vale-Presente", icon: MdCardGiftcard },
];

export default function TalonarioPage() {
  const t = useTalonarioBuilder();
  const accent = t.accents;

  const printBatchRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  // ============================================================
  // Modo backend (Puppeteer): quando esta aba é aberta pela fila de
  // geração de PDF (?printing=true&stateKey=...), hydrateFromServer() já
  // rodou ANTES do React montar e populou window.__TALONARIO_HYDRATE__
  // (ver src/hooks/useTalonarioBuilder.js) — então activeTab e todos os
  // campos já nascem com os valores que o usuário tinha na tela dele.
  // Só falta disparar a geração do lote de impressão, uma vez.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("printing") !== "true" || !params.get("stateKey")) return;
    t.handlePrint();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isHeadless =
    typeof window !== "undefined" && window.__PDF_HEADLESS__ === true;

  // Sinaliza para o Puppeteer que o lote (.tal-print-page) terminou de
  // ser montado no DOM — mesma lógica usada nas agendas, só que
  // observando as páginas do talão em vez de .page-break.
  usePdfReadySignal(printBatchRef, {
    printing: isHeadless,
    ready: Boolean(t.printBatch),
    pageSelector: ".tal-print-page",
  });

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Backoff progressivo — mesma estratégia do PreviewPage.jsx.
  const POLL_INTERVALS_MS = [1000, 1000, 2000, 2000, 3000, 5000];
  function pollDelay(attempt) {
    return POLL_INTERVALS_MS[Math.min(attempt, POLL_INTERVALS_MS.length - 1)];
  }

  async function gerarTalonarioPDFViaBackend() {
    if (downloading) return;
    setDownloading(true);
    const toastId = toast.loading("Entrando na fila...");
    try {
      const state = captureTalonarioState(t);
      const tabLabel =
        TABS.find((tb) => tb.id === t.activeTab)?.label || t.activeTab;

      const enqueueRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "talonario",
          template: t.activeTab, // reaproveita o mesmo campo para nome do arquivo
          selectedDate: new Date().toISOString().slice(0, 10),
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

      const startedAt = Date.now();
      const TIMEOUT_MS = 6 * 60 * 1000;
      let attempt = 0;

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

        if (statusData.status === "waiting" || statusData.status === "delayed") {
          toast.loading(
            statusData.position
              ? `Na fila — posição ${statusData.position}...`
              : "Na fila...",
            { id: toastId },
          );
        } else if (statusData.status === "active") {
          toast.loading("Gerando seu PDF...", { id: toastId });
        } else if (statusData.status === "completed") {
          break;
        } else if (statusData.status === "failed") {
          toast.error(statusData.error || "Falha ao gerar o PDF", {
            id: toastId,
          });
          return;
        }

        await sleep(pollDelay(attempt));
        attempt += 1;
      }

      const resultRes = await fetch(`/api/result/${jobId}`);
      if (!resultRes.ok) {
        let errorMsg = "Erro ao buscar o link de download do PDF";
        try {
          const errorData = await resultRes.json();
          errorMsg = errorData.error || errorMsg;
        } catch (_) {
          errorMsg = resultRes.statusText || errorMsg;
        }
        toast.error(errorMsg, { id: toastId });
        return;
      }

      const { downloadUrl } = await resultRes.json();
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `talao-${tabLabel.toLowerCase().replace(/\s+/g, "-")}-${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      toast.success("PDF baixado com sucesso!", { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error("Erro de conexão com o servidor.", { id: toastId });
    } finally {
      setDownloading(false);
    }
  }

  const cssVars = {
    "--tal-accent": accent.accent,
    "--tal-accent-dark": accent.dark,
    "--tal-accent-light": accent.light,
    "--tal-paper": "#fffdf9",
    "--tal-ink": "#1c2b2c",
    "--tal-ink-soft": "#5b6b6a",
    "--tal-stamp": "#b23b3b",
  };

  const uploadKey = t.activeTab; // logos.pedido / receituario / receita

  return (
    <div style={cssVars} className="min-h-full">
      {/* ---------- barra de abas (própria do Talonário, no tom do app) ---------- */}
      <div className="print:hidden border-b border-[#D8CBA8] bg-[#FBF8F1]/70">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 py-4 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1
              className="text-lg font-semibold text-[#24344D] leading-tight"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Talonário
            </h1>
            <p className="text-[11.5px] text-[#8a8272]">
              Pedidos, receituários e receitas em formato de talão
            </p>
          </div>
          <div className="flex gap-1 bg-[#F1EADB] border border-[#D8CBA8] p-1 rounded-xl">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => t.setActiveTab(id)}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  t.activeTab === id
                    ? "bg-[#24344D] text-[#F6F1E7] shadow-sm"
                    : "text-[#6B6458] hover:bg-[#EFE4C8] hover:text-[#24344D]"
                }`}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{
                    background:
                      id === t.activeTab
                        ? t.accentColors[id].accent
                        : "currentColor",
                  }}
                />
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ---------- corpo: sidebar + stage ---------- */}
      <div className="print:hidden max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[380px_1fr]">
        <div className="bg-[#FFFEFB] border-r border-[#E4DDC9] px-5.5 pt-6 pb-8">
          {t.activeTab === "pedido" && (
            <>
              <PedidoPanel
                pedido={t.pedido}
                setField={t.setPedidoField}
                toggleCampo={t.togglePedidoCampo}
                range={t.pedidoRange}
              />
              <div className="mt-4">
                <UploadBox
                  inputId="tal-logo-pedido"
                  label="Enviar logo"
                  hint="PNG ou JPG, fundo transparente fica melhor"
                  thumb={t.logos.pedido}
                  onFile={(f) => t.handleLogoUpload("pedido", f)}
                />
                {t.logos.pedido && (
                  <button
                    onClick={() => t.clearLogo("pedido")}
                    className="text-[11.5px] underline mt-1"
                    style={{ color: "var(--tal-stamp)" }}
                  >
                    remover logo
                  </button>
                )}
              </div>
            </>
          )}

          {t.activeTab === "receituario" && (
            <>
              <ReceituarioPanel
                receituario={t.receituario}
                setField={t.setReceituarioField}
                range={t.receituarioRange}
              />
              <div className="mt-4">
                <UploadBox
                  inputId="tal-logo-receituario"
                  label="Enviar logo"
                  hint="Aparece no cabeçalho da via"
                  thumb={t.logos.receituario}
                  onFile={(f) => t.handleLogoUpload("receituario", f)}
                />
                {t.logos.receituario && (
                  <button
                    onClick={() => t.clearLogo("receituario")}
                    className="text-[11.5px] underline mt-1"
                    style={{ color: "var(--tal-stamp)" }}
                  >
                    remover logo
                  </button>
                )}
              </div>
            </>
          )}

          {t.activeTab === "receita" && (
            <>
              <ReceitaPanel receita={t.receita} setField={t.setReceitaField} />
              <div className="mt-2">
                <UploadBox
                  inputId="tal-logo-receita"
                  label="Enviar logo"
                  hint="Selo no canto do cartão"
                  thumb={t.logos.receita}
                  onFile={(f) => t.handleLogoUpload("receita", f)}
                />
                {t.logos.receita && (
                  <button
                    onClick={() => t.clearLogo("receita")}
                    className="text-[11.5px] underline mt-1"
                    style={{ color: "var(--tal-stamp)" }}
                  >
                    remover logo
                  </button>
                )}
              </div>
            </>
          )}

          {t.activeTab === "ordemServico" && (
            <>
              <OrdemServicoPanel
                ordemServico={t.ordemServico}
                setField={t.setOrdemServicoField}
                range={t.ordemServicoRange}
              />
              <div className="mt-4">
                <UploadBox
                  inputId="tal-logo-os"
                  label="Enviar logo"
                  hint="Aparece no cabeçalho da ordem de serviço"
                  thumb={t.logos.ordemServico}
                  onFile={(f) => t.handleLogoUpload("ordemServico", f)}
                />
                {t.logos.ordemServico && (
                  <button
                    onClick={() => t.clearLogo("ordemServico")}
                    className="text-[11.5px] underline mt-1"
                    style={{ color: "var(--tal-stamp)" }}
                  >
                    remover logo
                  </button>
                )}
              </div>
            </>
          )}

          {t.activeTab === "recibo" && (
            <>
              <ReciboPanel
                recibo={t.recibo}
                setField={t.setReciboField}
                range={t.reciboRange}
              />
              <div className="mt-4">
                <UploadBox
                  inputId="tal-logo-recibo"
                  label="Enviar logo"
                  hint="Aparece no cabeçalho do recibo"
                  thumb={t.logos.recibo}
                  onFile={(f) => t.handleLogoUpload("recibo", f)}
                />
                {t.logos.recibo && (
                  <button
                    onClick={() => t.clearLogo("recibo")}
                    className="text-[11.5px] underline mt-1"
                    style={{ color: "var(--tal-stamp)" }}
                  >
                    remover logo
                  </button>
                )}
              </div>
            </>
          )}

          {t.activeTab === "comanda" && (
            <>
              <ComandaPanel
                comanda={t.comanda}
                setField={t.setComandaField}
                range={t.comandaRange}
              />
              <div className="mt-4">
                <UploadBox
                  inputId="tal-logo-comanda"
                  label="Enviar logo"
                  hint="Aparece no cabeçalho da comanda"
                  thumb={t.logos.comanda}
                  onFile={(f) => t.handleLogoUpload("comanda", f)}
                />
                {t.logos.comanda && (
                  <button
                    onClick={() => t.clearLogo("comanda")}
                    className="text-[11.5px] underline mt-1"
                    style={{ color: "var(--tal-stamp)" }}
                  >
                    remover logo
                  </button>
                )}
              </div>
            </>
          )}

          {t.activeTab === "reserva" && (
            <>
              <ReservaPanel
                reserva={t.reserva}
                setField={t.setReservaField}
                range={t.reservaRange}
              />
              <div className="mt-4">
                <UploadBox
                  inputId="tal-logo-reserva"
                  label="Enviar logo"
                  hint="Aparece no cabeçalho da ficha"
                  thumb={t.logos.reserva}
                  onFile={(f) => t.handleLogoUpload("reserva", f)}
                />
                {t.logos.reserva && (
                  <button
                    onClick={() => t.clearLogo("reserva")}
                    className="text-[11.5px] underline mt-1"
                    style={{ color: "var(--tal-stamp)" }}
                  >
                    remover logo
                  </button>
                )}
              </div>
            </>
          )}

          {t.activeTab === "valePresente" && (
            <>
              <ValePresentePanel
                valePresente={t.valePresente}
                setField={t.setValePresenteField}
                range={t.valePresenteRange}
              />
              <div className="mt-4">
                <UploadBox
                  inputId="tal-logo-vale"
                  label="Enviar logo"
                  hint="Aparece no vale-presente"
                  thumb={t.logos.valePresente}
                  onFile={(f) => t.handleLogoUpload("valePresente", f)}
                />
                {t.logos.valePresente && (
                  <button
                    onClick={() => t.clearLogo("valePresente")}
                    className="text-[11.5px] underline mt-1"
                    style={{ color: "var(--tal-stamp)" }}
                  >
                    remover logo
                  </button>
                )}
              </div>
            </>
          )}

          {t.activeTab === "bingo" && (
            <>
              <BingoPanel
                bingo={t.bingo}
                setField={t.setBingoField}
                qty={t.bingoQty}
                onRegenerate={t.regenerateBingo}
              />
              <div className="mt-4">
                <UploadBox
                  inputId="tal-logo-bingo"
                  label="Enviar logo"
                  hint="Aparece no cabeçalho de cada cartela"
                  thumb={t.logos.bingo}
                  onFile={(f) => t.handleLogoUpload("bingo", f)}
                />
                {t.logos.bingo && (
                  <button
                    onClick={() => t.clearLogo("bingo")}
                    className="text-[11.5px] underline mt-1"
                    style={{ color: "var(--tal-stamp)" }}
                  >
                    remover logo
                  </button>
                )}
              </div>
            </>
          )}

          <ColorPanel
            activeTab={t.activeTab}
            tabLabel={TABS.find((tb) => tb.id === t.activeTab)?.label}
            color={t.accents.accent}
            onChange={(hex) => t.setAccentColor(t.activeTab, hex)}
            onReset={() => t.resetAccentColor(t.activeTab)}
          />

          <WatermarkPanel
            watermark={t.watermark}
            setField={t.setWatermarkField}
            activeTab={t.activeTab}
            hasLogo={!!t.logos[uploadKey]}
          />

          <div className="bg-[#FFFEFB] pt-4 pb-1 mt-6 border-t border-[#eee]">
            <button
              onClick={t.handlePrint}
              className="w-full text-white font-bold text-[15px] rounded-xl py-3.5 flex items-center justify-center gap-2 transition-transform hover:-translate-y-px active:translate-y-0"
              style={{
                background: "var(--tal-accent)",
                fontFamily: "'Cormorant Garamond', serif",
                boxShadow: "0 4px 14px var(--tal-accent-light)",
              }}
            >
              <MdPrint /> Gerar e imprimir
            </button>
            <p className="text-[11px] text-[#8a9694] text-center mt-2 leading-relaxed">
              Na janela de impressão, escolha <b>"Salvar como PDF"</b> para
              baixar o arquivo pronto.
            </p>

            <button
              onClick={gerarTalonarioPDFViaBackend}
              disabled={downloading}
              className="w-full font-semibold text-[13.5px] rounded-xl py-2.5 mt-2.5 flex items-center justify-center gap-2 border transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                borderColor: "var(--tal-accent)",
                color: "var(--tal-accent-dark)",
                background: "var(--tal-accent-light)",
              }}
            >
              <MdCloudDownload />
              {downloading ? "Gerando..." : "Baixar PDF"}
            </button>
            <p className="text-[11px] text-[#8a9694] text-center mt-2 leading-relaxed">
              Gera o PDF no servidor e baixa direto — útil em celulares ou
              quando a impressão do navegador não funciona bem.
            </p>
          </div>
        </div>

        {/* ---------- stage de pré-visualização ---------- */}
        <div className="p-9 flex flex-col items-center gap-5.5 bg-[#F3F0E7]">
          {t.activeTab === "pedido" && (
            <PedidoCard
              empresa={t.pedido.empresa}
              slogan={t.pedido.slogan}
              logo={t.logos.pedido}
              campos={t.pedido.campos}
              linhas={t.pedido.linhas}
              rodape={t.pedido.rodape}
              numero={t.pedidoRange.start}
              digits={Number(t.pedido.digits)}
              prefix={t.pedido.prefix}
              numerar={t.pedido.numerar}
              watermarkStyle={t.watermarkStyle}
            />
          )}
          {t.activeTab === "receituario" && (
            <ReceituarioCard
              {...t.receituario}
              logo={t.logos.receituario}
              numero={t.receituario.numerar ? t.receituarioRange.start : null}
              watermarkStyle={t.watermarkStyle}
            />
          )}
          {t.activeTab === "receita" && (
            <ReceitaCard
              {...t.receita}
              logo={t.logos.receita}
              watermarkStyle={t.watermarkStyle}
            />
          )}
          {t.activeTab === "ordemServico" && (
            <OrdemServicoCard
              empresa={t.ordemServico.empresa}
              slogan={t.ordemServico.slogan}
              logo={t.logos.ordemServico}
              prazo={t.ordemServico.prazo}
              garantia={t.ordemServico.garantia}
              rodape={t.ordemServico.rodape}
              numero={t.ordemServicoRange.start}
              digits={Number(t.ordemServico.digits)}
              prefix={t.ordemServico.prefix}
              numerar={t.ordemServico.numerar}
              watermarkStyle={t.watermarkStyle}
            />
          )}
          {t.activeTab === "recibo" && (
            <ReciboCard
              empresa={t.recibo.empresa}
              slogan={t.recibo.slogan}
              logo={t.logos.recibo}
              referenteA={t.recibo.referenteA}
              rodape={t.recibo.rodape}
              numero={t.reciboRange.start}
              digits={Number(t.recibo.digits)}
              prefix={t.recibo.prefix}
              numerar={t.recibo.numerar}
              watermarkStyle={t.watermarkStyle}
            />
          )}
          {t.activeTab === "comanda" && (
            <ComandaCard
              empresa={t.comanda.empresa}
              logo={t.logos.comanda}
              linhas={t.comanda.linhas}
              rodape={t.comanda.rodape}
              numero={t.comandaRange.start}
              digits={Number(t.comanda.digits)}
              prefix={t.comanda.prefix}
              numerar={t.comanda.numerar}
              watermarkStyle={t.watermarkStyle}
            />
          )}
          {t.activeTab === "reserva" && (
            <ReservaCard
              empresa={t.reserva.empresa}
              slogan={t.reserva.slogan}
              logo={t.logos.reserva}
              politica={t.reserva.politica}
              rodape={t.reserva.rodape}
              numero={t.reservaRange.start}
              digits={Number(t.reserva.digits)}
              prefix={t.reserva.prefix}
              numerar={t.reserva.numerar}
              watermarkStyle={t.watermarkStyle}
            />
          )}
          {t.activeTab === "valePresente" && (
            <ValePresenteCard
              empresa={t.valePresente.empresa}
              slogan={t.valePresente.slogan}
              logo={t.logos.valePresente}
              validade={t.valePresente.validade}
              mensagemPadrao={t.valePresente.mensagemPadrao}
              numero={t.valePresenteRange.start}
              digits={Number(t.valePresente.digits)}
              prefix={t.valePresente.prefix}
              numerar={t.valePresente.numerar}
              watermarkStyle={t.watermarkStyle}
            />
          )}
          {t.activeTab === "bingo" && t.bingoCards[0] && (
            <div className="w-full max-w-100 aspect-3/4">
              <BingoCard
                titulo={t.bingo.titulo}
                subtitulo={t.bingo.subtitulo}
                numero={1}
                total={t.bingoCards.length}
                logo={t.logos.bingo}
                columns={t.bingoCards[0]}
                watermarkStyle={t.watermarkStyle}
                porPagina={1}
                numerar={t.bingo.numerar}
              />
            </div>
          )}

          <p className="text-[12.5px] text-[#8a9694] text-center max-w-160">
            {t.activeTab === "pedido" &&
              (t.pedido.numerar
                ? `Pré-visualização do 1º pedido do lote (Nº ${t.pedido.prefix || ""}${String(t.pedidoRange.start).padStart(Number(t.pedido.digits) || 0, "0")}). Cada página impressa terá um número diferente, em sequência.`
                : "Pré-visualização do pedido sem numeração. Todos os exemplares sairão sem número.")}
            {t.activeTab === "receituario" &&
              (t.receituario.numerar
                ? "Pré-visualização da 1ª via numerada do lote."
                : "Pré-visualização da via de receituário sem numeração.")}
            {t.activeTab === "receita" &&
              "Pré-visualização do talão de receita — pautas para preencher à mão."}
            {t.activeTab === "recibo" &&
              (t.recibo.numerar
                ? `Pré-visualização do 1º recibo do lote (Nº ${t.recibo.prefix || ""}${String(t.reciboRange.start).padStart(Number(t.recibo.digits) || 0, "0")}). Cada página impressa terá um número diferente, em sequência.`
                : "Pré-visualização do recibo sem numeração. Todos os exemplares sairão sem número.")}
            {t.activeTab === "comanda" &&
              (t.comanda.numerar
                ? `Pré-visualização da 1ª comanda do lote (Nº ${t.comanda.prefix || ""}${String(t.comandaRange.start).padStart(Number(t.comanda.digits) || 0, "0")}). Cada página impressa terá um número diferente, em sequência.`
                : "Pré-visualização da comanda sem numeração. Todos os exemplares sairão sem número.")}
            {t.activeTab === "reserva" &&
              (t.reserva.numerar
                ? `Pré-visualização da 1ª ficha do lote (Nº ${t.reserva.prefix || ""}${String(t.reservaRange.start).padStart(Number(t.reserva.digits) || 0, "0")}). Cada página impressa terá um número diferente, em sequência.`
                : "Pré-visualização da ficha de reserva sem numeração. Todos os exemplares sairão sem número.")}
            {t.activeTab === "valePresente" &&
              (t.valePresente.numerar
                ? `Pré-visualização do 1º vale-presente do lote (Código ${t.valePresente.prefix || ""}${String(t.valePresenteRange.start).padStart(Number(t.valePresente.digits) || 0, "0")}). Cada página impressa terá um código diferente, em sequência.`
                : "Pré-visualização do vale-presente sem numeração. Todos os exemplares sairão sem código.")}
            {t.activeTab === "ordemServico" &&
              (t.ordemServico.numerar
                ? `Pré-visualização da 1ª ordem de serviço do lote (Nº ${t.ordemServico.prefix || ""}${String(t.ordemServicoRange.start).padStart(Number(t.ordemServico.digits) || 0, "0")}). Cada página impressa terá um número diferente, em sequência.`
                : "Pré-visualização da ordem de serviço sem numeração. Todos os exemplares sairão sem número.")}
            {t.activeTab === "bingo" &&
              (t.bingo.numerar
                ? `Pré-visualização da cartela 1 de ${t.bingoCards.length}. Na impressão, ${t.bingo.porPagina} cartela${t.bingo.porPagina > 1 ? "s" : ""} ${t.bingo.porPagina > 1 ? "saem lado a lado em cada" : "sai por"} folha, cada uma com números diferentes.`
                : `Pré-visualização da cartela 1 de ${t.bingoCards.length} (sem numeração). Na impressão, ${t.bingo.porPagina} cartela${t.bingo.porPagina > 1 ? "s" : ""} ${t.bingo.porPagina > 1 ? "saem lado a lado em cada" : "sai por"} folha.`)}
          </p>
        </div>
      </div>

      {/* ---------- lote de impressão (só aparece no @media print) ---------- */}
      {t.printBatch && (
        <div className="hidden print:block" ref={printBatchRef}>
          {t.printBatch.tab === "pedido" &&
            t.printBatch.items.map((n) => (
              <div key={n} className="tal-print-page">
                <PedidoCard
                  empresa={t.pedido.empresa}
                  slogan={t.pedido.slogan}
                  logo={t.logos.pedido}
                  campos={t.pedido.campos}
                  linhas={t.pedido.linhas}
                  rodape={t.pedido.rodape}
                  numero={n}
                  digits={Number(t.pedido.digits)}
                  prefix={t.pedido.prefix}
                  numerar={t.pedido.numerar}
                  watermarkStyle={t.watermarkStyle}
                />
              </div>
            ))}
          {t.printBatch.tab === "receituario" &&
            t.printBatch.items.map((n, i) => (
              <div key={i} className="tal-print-page">
                <ReceituarioCard
                  {...t.receituario}
                  logo={t.logos.receituario}
                  numero={n}
                  watermarkStyle={t.watermarkStyle}
                />
              </div>
            ))}
          {t.printBatch.tab === "receita" && (
            <div className="tal-print-page">
              <ReceitaCard
                {...t.receita}
                logo={t.logos.receita}
                watermarkStyle={t.watermarkStyle}
              />
            </div>
          )}
          {t.printBatch.tab === "recibo" &&
            t.printBatch.items.map((n) => (
              <div key={n} className="tal-print-page">
                <ReciboCard
                  empresa={t.recibo.empresa}
                  slogan={t.recibo.slogan}
                  logo={t.logos.recibo}
                  referenteA={t.recibo.referenteA}
                  rodape={t.recibo.rodape}
                  numero={n}
                  digits={Number(t.recibo.digits)}
                  prefix={t.recibo.prefix}
                  numerar={t.recibo.numerar}
                  watermarkStyle={t.watermarkStyle}
                />
              </div>
            ))}
          {t.printBatch.tab === "comanda" &&
            t.printBatch.items.map((n) => (
              <div key={n} className="tal-print-page">
                <ComandaCard
                  empresa={t.comanda.empresa}
                  logo={t.logos.comanda}
                  linhas={t.comanda.linhas}
                  rodape={t.comanda.rodape}
                  numero={n}
                  digits={Number(t.comanda.digits)}
                  prefix={t.comanda.prefix}
                  numerar={t.comanda.numerar}
                  watermarkStyle={t.watermarkStyle}
                />
              </div>
            ))}
          {t.printBatch.tab === "reserva" &&
            t.printBatch.items.map((n) => (
              <div key={n} className="tal-print-page">
                <ReservaCard
                  empresa={t.reserva.empresa}
                  slogan={t.reserva.slogan}
                  logo={t.logos.reserva}
                  politica={t.reserva.politica}
                  rodape={t.reserva.rodape}
                  numero={n}
                  digits={Number(t.reserva.digits)}
                  prefix={t.reserva.prefix}
                  numerar={t.reserva.numerar}
                  watermarkStyle={t.watermarkStyle}
                />
              </div>
            ))}
          {t.printBatch.tab === "valePresente" &&
            t.printBatch.items.map((n) => (
              <div key={n} className="tal-print-page">
                <ValePresenteCard
                  empresa={t.valePresente.empresa}
                  slogan={t.valePresente.slogan}
                  logo={t.logos.valePresente}
                  validade={t.valePresente.validade}
                  mensagemPadrao={t.valePresente.mensagemPadrao}
                  numero={n}
                  digits={Number(t.valePresente.digits)}
                  prefix={t.valePresente.prefix}
                  numerar={t.valePresente.numerar}
                  watermarkStyle={t.watermarkStyle}
                />
              </div>
            ))}
          {t.printBatch.tab === "ordemServico" &&
            t.printBatch.items.map((n) => (
              <div key={n} className="tal-print-page">
                <OrdemServicoCard
                  empresa={t.ordemServico.empresa}
                  slogan={t.ordemServico.slogan}
                  logo={t.logos.ordemServico}
                  prazo={t.ordemServico.prazo}
                  garantia={t.ordemServico.garantia}
                  rodape={t.ordemServico.rodape}
                  numero={n}
                  digits={Number(t.ordemServico.digits)}
                  prefix={t.ordemServico.prefix}
                  numerar={t.ordemServico.numerar}
                  watermarkStyle={t.watermarkStyle}
                />
              </div>
            ))}
          {t.printBatch.tab === "bingo" &&
            (() => {
              const porPagina = t.bingo.porPagina;
              const layout = BINGO_LAYOUTS[porPagina] || BINGO_LAYOUTS[4];
              const items = t.bingo.numerar
                ? t.printBatch.items
                : t.printBatch.items.map(() =>
                    generateBingoCard(t.bingo.freeSpace),
                  );
              return chunk(items, porPagina).map((grupo, gi) => (
                <div key={gi} className="tal-print-page tal-print-page-bingo">
                  <div
                    className="tal-bingo-grid"
                    style={{
                      gridTemplateColumns: `repeat(${layout.cols}, 1fr)`,
                      gridTemplateRows: `repeat(${layout.rows}, 1fr)`,
                    }}
                  >
                    {grupo.map((columns, i) => (
                      <BingoCard
                        key={gi * porPagina + i}
                        titulo={t.bingo.titulo}
                        subtitulo={t.bingo.subtitulo}
                        numero={t.bingo.numerar ? gi * porPagina + i + 1 : null}
                        total={t.bingo.numerar ? t.printBatch.items.length : 0}
                        logo={t.logos.bingo}
                        columns={columns}
                        watermarkStyle={t.watermarkStyle}
                        porPagina={porPagina}
                        numerar={t.bingo.numerar}
                      />
                    ))}
                  </div>
                </div>
              ));
            })()}
        </div>
      )}
    </div>
  );
}