// src/pages/TalonarioPage.jsx
//
// Gerador de Pedidos de Venda, Receituários e Receitas em formato de talão.
// Vive dentro do AppLayout (cabeçalho/nav/print.css compartilhados com o
// resto do app) — só a barra de abas abaixo é própria dela, com a cor de
// destaque de cada aba. A numeração automática e a marca d'água são
// geradas em lote na hora de imprimir.

import { Children, cloneElement, isValidElement, useRef } from "react";
import { baixarPdfLeveFolhas, comAviso } from "../lib/pdfDaTela";
import Faixa from "../components/ui/Faixa";
import { talCab, CAB_PADRAO } from "../lib/talCabecalho";
import BarraEditor, { useAbaMobile } from "../components/ui/BarraEditor";
import { FORMATOS, FORMATOS_TAL, DICAS_TAL, talImpressao } from "../lib/configImpressao";
import {
  MdReceiptLong,
  MdMedicalServices,
  MdRestaurantMenu,
  MdGridOn,
  MdPrint,
  MdBuild,
  MdReceipt,
  MdRoomService,
  MdLocalShipping,
  MdEventAvailable,
  MdCardGiftcard,
} from "react-icons/md";
import {
  useTalonarioBuilder,
  BINGO_LAYOUTS,
  generateBingoCard,
} from "../hooks/useTalonarioBuilder";
import {
  PedidoCard,
  ReceituarioCard,
  ReceitaCard,
  BingoCard,
  OrdemServicoCard,
  ReciboCard,
  ComandaCard,
  EntregaCard,
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
  EntregaPanel,
  ReservaPanel,
  ValePresentePanel,
  WatermarkPanel,
  ColorPanel,
  UploadBox,
} from "../components/talonario/TalonarioPanels";
import { usePdfReadySignal } from "../hooks/usePdfReadySignal";
import "../styles/talonario.css";

// Agrupa a lista de cartelas em blocos do tamanho escolhido (cartelas por
// folha), para renderizar uma <div className="tal-print-page"> por bloco.
import { PainelStickers, StickerPortaisTal } from "../components/StickersEditor";
import { stickersDados, stickersUi } from "../lib/stickers";
import ExtrasPanel from "../components/talonario/ExtrasPanel";
import BackgroundPanel from "../components/talonario/BackgroundPanel";

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

// Distribui os talões (cada um é uma página A4 .tal-print-page) nas folhas do formato escolhido.
function FolhasTal({ children }) {
  const { formato, copias = 1 } = talImpressao.useStore();
  // Vias com o MESMO número (carbono): 1,1,2,2…
  const itens = Children.toArray(children).flatMap((el) => (copias > 1 && isValidElement(el) ? Array.from({ length: copias }, (_, c) => cloneElement(el, { key: `${el.key}~${c}` })) : [el]));
  const f = FORMATOS.find((x) => x.id === formato && !x.livro) || FORMATOS[0];
  if (f.id === "a4") return itens;
  const [fw, fh] = f.folha;
  const cw = fw / f.cols;
  const ch = fh / f.rows;
  const z = Math.min(cw / 210, ch / 297);
  const k = f.cols * f.rows;
  const grupos = f.dup ? itens.map((el) => [el, el]) : chunk(itens, k);
  return (
    <>
      <style>{`@media print { @page { size: ${fw}mm ${fh}mm; margin: 0; } }`}</style>
      {grupos.map((g, gi) => (
        <div key={gi} className="tal-folha" style={{ width: `${fw}mm`, height: `${fh - 0.4}mm` }}>
          {g.map((el, i) => (
            <div key={i} className="tal-celula" style={{ left: `${(i % f.cols) * cw}mm`, top: `${Math.floor(i / f.cols) * ch}mm`, width: `${cw}mm`, height: `${ch}mm` }}>
              <div style={{ zoom: z, width: "210mm", height: "297mm" }}>{el}</div>
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

// Cabeçalho: posição do logo, alinhamento do texto, tamanho e deslocamento do logo (vale para todos os documentos).
function CabecalhoOpcoes() {
  const c = talCab.useStore();
  const grupo = (rotulo, chave, ops) => (
    <div>
      <div className="block text-[11.5px] font-semibold text-[#24344D] mb-1">{rotulo}</div>
      <div className="grid grid-cols-3 gap-1.5">
        {ops.map(([v, n]) => (
          <button key={v} type="button" onClick={() => talCab.set({ [chave]: v })}
            className={`px-2 py-2 rounded-lg border text-[11px] font-bold ${c[chave] === v ? "bg-[#24344D] text-white border-[#24344D]" : "bg-[#FBF8F1] text-[#24344D] border-[#D8CBA8]"}`}>{n}</button>
        ))}
      </div>
    </div>
  );
  return (
    <div className="bg-[#FFFEFB] pt-4 pb-2 mt-4 border-t border-[#eee] flex flex-col gap-3">
      <h3 className="text-[12px] font-bold text-[#24344D] uppercase tracking-wide">Cabeçalho (logo e texto)</h3>
      {grupo("Posição do logo", "logoPos", [["esq", "◧ Esquerda"], ["centro", "▣ Em cima"], ["dir", "◨ Direita"]])}
      {grupo("Alinhamento do texto", "textoAlin", [["esq", "≡ Esquerda"], ["centro", "☰ Centro"], ["dir", "≣ Direita"]])}
      <Faixa rotulo="Tamanho do logo" valor={c.logoTam} min={30} max={300} step={5} un="%" onChange={(v) => talCab.set({ logoTam: v })} />
      <Faixa rotulo="Mover o logo ← →" valor={c.logoX} min={-120} max={120} step={1} un="px" onChange={(v) => talCab.set({ logoX: v })} />
      <Faixa rotulo="Mover o logo ↑ ↓" valor={c.logoY} min={-60} max={60} step={1} un="px" onChange={(v) => talCab.set({ logoY: v })} />
      <button type="button" onClick={() => talCab.set(CAB_PADRAO)} className="self-start text-[11px] underline text-[#8B6A1F]">↺ Restaurar cabeçalho</button>
    </div>
  );
}

const TABS = [
  { id: "pedido", label: "Pedido de Venda", icon: MdReceiptLong },
  { id: "receituario", label: "Receituário", icon: MdMedicalServices },
  { id: "receita", label: "Receita Culinária", icon: MdRestaurantMenu },
  { id: "bingo", label: "Bingo", icon: MdGridOn },
  { id: "ordemServico", label: "Ordem de Serviço", icon: MdBuild },
  { id: "recibo", label: "Recibo de Pagamento", icon: MdReceipt },
  { id: "comanda", label: "Comandas", icon: MdRoomService },
  { id: "entrega", label: "Supermercado (caixas)", icon: MdLocalShipping },
  { id: "reserva", label: "Reserva / Agendamento", icon: MdEventAvailable },
  { id: "valePresente", label: "Vale-Presente", icon: MdCardGiftcard },
];

export default function TalonarioPage() {
  const t = useTalonarioBuilder();
  const abas = useAbaMobile();
  const adaptador = {
    nome: "Talonário",
    imgs: () => t.snapshot(),
    aplicarImgs: (sn) => t.restaurar(sn),
    vazio: () => true,
    ler: () => ({ cfg: {}, imgs: t.snapshot(), stk: [] }),
    aplicar: (pr) => t.restaurar(pr.imgs),
  };
  const accent = t.accents;

  const printBatchRef = useRef(null);
  const pdfLeve = async (prog) => {
    t.prepararLeve();
    try {
      for (let i = 0; i < 60 && !document.querySelector(".tal-lote .tal-print-page"); i += 1) await new Promise((r) => setTimeout(r, 100));
      if (!document.querySelector(".tal-lote .tal-print-page")) throw new Error("lote vazio");
      await new Promise((r) => setTimeout(r, 500));
      const a4 = !document.querySelector(".tal-lote .tal-folha");
      await baixarPdfLeveFolhas({ raiz: ".tal-lote", folhas: a4 ? ".tal-print-page" : ".tal-folha", nome: "talonario", mm: a4 ? { w: 210, h: 297 } : undefined, regras: /\.tal-|\.doc-card/, aoProgresso: prog });
    } finally { t.encerrarLeve(); }
  };
  const stItens = stickersDados.useStore().itens;
  const stEditando = stickersUi.useStore().editando;

  // Sinaliza (usado por outras integrações de impressão) que o lote
  // (.tal-print-page) terminou de ser montado no DOM.
  usePdfReadySignal(printBatchRef, {
    printing: false,
    ready: Boolean(t.printBatch),
    pageSelector: ".tal-print-page",
  });

  const cssVars = {
    "--tal-accent": accent.accent,
    "--tal-accent-dark": accent.dark,
    "--tal-accent-light": accent.light,
    "--tal-paper": "#fffdf9",
    "--tal-ink": "#1c2b2c",
    "--tal-ink-soft": "#5b6b6a",
    "--tal-stamp": "#b23b3b",
  };

  const fmtTal = talImpressao.useStore().formato;
  const copiasTal = talImpressao.useStore().copias || 1;
  const uploadKey = t.activeTab; // logos.pedido / receituario / receita

  return (
    <div style={cssVars} className="min-h-full">
      <StickerPortaisTal ativo={stEditando || stItens.length > 0} tab={t.activeTab} />
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
          <div className="flex gap-1 bg-[#F1EADB] border border-[#D8CBA8] p-1 rounded-xl overflow-x-auto max-w-full [&>button]:shrink-0">
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
      <div className="print:hidden max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[380px_1fr] pb-24">
        <BarraEditor tipo="talonario" abas={abas} onImprimir={t.handlePrint} onPdfLeve={comAviso(pdfLeve)} rotuloImprimir="Gerar e imprimir" adaptador={adaptador} />
        <div className={`bg-[#FFFEFB] border-r border-[#E4DDC9] px-5.5 pt-6 pb-8 ${abas.clsEditar}`}>
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

          {t.activeTab === "entrega" && (
            <>
              <EntregaPanel entrega={t.entrega} setField={t.setEntregaField} range={t.entregaRange} />
              <div className="mt-4">
                <UploadBox inputId="tal-logo-entrega" label="Enviar logo" hint="Aparece no cabeçalho do pedido" thumb={t.logos.entrega} onFile={(f) => t.handleLogoUpload("entrega", f)} />
                {t.logos.entrega && (
                  <button onClick={() => t.clearLogo("entrega")} className="text-[11.5px] underline mt-1" style={{ color: "var(--tal-stamp)" }}>remover logo</button>
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

          <BackgroundPanel
            activeTab={t.activeTab}
            background={t.background}
            onUpload={t.handleBackgroundUpload}
            onClear={t.clearBackground}
            setField={t.setBackgroundField}
          />
        <ExtrasPanel />
          <CabecalhoOpcoes />
          <PainelStickers talonario />

          <div className="bg-[#FFFEFB] pt-4 pb-1 mt-6 border-t border-[#eee]">
            <label className="block text-[11.5px] font-semibold text-[#24344D] mb-1">Impressão na folha</label>
            <select
              value={fmtTal}
              onChange={(e) => talImpressao.set({ formato: e.target.value })}
              className="w-full border border-[#D8CBA8] rounded-lg px-2.5 py-2 text-xs bg-[#FBF8F1] font-medium text-[#24344D] mb-1"
            >
              {FORMATOS_TAL.map((x) => (
                <option key={x.id} value={x.id}>{x.nome}</option>
              ))}
            </select>
            <p className="text-[11px] text-[#8B6A1F] mb-3">{DICAS_TAL[fmtTal]}</p>
            {t.activeTab !== "bingo" && (
              <>
                <label className="block text-[11.5px] font-semibold text-[#24344D] mb-1">Vias com o mesmo número (carbono)</label>
                <select
                  value={copiasTal}
                  onChange={(e) => talImpressao.set({ copias: Number(e.target.value) })}
                  className="w-full border border-[#D8CBA8] rounded-lg px-2.5 py-2 text-xs bg-[#FBF8F1] font-medium text-[#24344D] mb-1"
                >
                  <option value={1}>1 — cada número uma vez (1, 2, 3…)</option>
                  <option value={2}>2 vias — 1, 1, 2, 2, 3, 3…</option>
                  <option value={3}>3 vias — 1, 1, 1, 2, 2, 2…</option>
                  <option value={4}>4 vias — 1, 1, 1, 1, 2, 2, 2, 2…</option>
                </select>
                <p className="text-[11px] text-[#8B6A1F] mb-3">Para talões com papel carbono: as vias de cada número saem seguidas, com o mesmo número.</p>
              </>
            )}
            <p className="text-[11px] text-[#8a9694] text-center mt-2 leading-relaxed">
              Na janela de impressão, escolha <b>"Salvar como PDF"</b> para
              baixar o arquivo pronto.
            </p>
          </div>
        </div>

        {/* ---------- stage de pré-visualização ---------- */}
        <div className={`pre-fixa p-4 sm:p-9 flex flex-col items-center gap-5.5 bg-[#F3F0E7] ${abas.clsVer}`}>
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
              contato={t.ordemServico.contato}
              linhas={t.ordemServico.linhas}
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
          {t.activeTab === "entrega" && (
            <EntregaCard
              empresa={t.entrega.empresa} logo={t.logos.entrega} rotuloTel={t.entrega.rotuloTel} telefone={t.entrega.telefone}
              endereco={t.entrega.endereco} titulo={t.entrega.titulo} caixas={t.entrega.caixas} recebedor={t.entrega.recebedor}
              linhas={t.entrega.linhas} rodape={t.entrega.rodape} numero={t.entregaRange.start} digits={Number(t.entrega.digits)}
              prefix={t.entrega.prefix} numerar={t.entrega.numerar} watermarkStyle={t.watermarkStyle}
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
            {t.activeTab === "entrega" &&
              (t.entrega.numerar
                ? `Pré-visualização do 1º pedido do lote (Nº ${t.entrega.prefix || ""}${String(t.entregaRange.start).padStart(Number(t.entrega.digits) || 0, "0")}). Cada página impressa terá um número diferente, em sequência.`
                : "Pré-visualização do pedido sem numeração. Todos os exemplares sairão sem número.")}
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
        <div className="hidden print:block tal-lote" ref={printBatchRef}>
          <FolhasTal>
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
          {t.printBatch.tab === "entrega" &&
            t.printBatch.items.map((n) => (
              <div key={n} className="tal-print-page">
                <EntregaCard
              empresa={t.entrega.empresa} logo={t.logos.entrega} rotuloTel={t.entrega.rotuloTel} telefone={t.entrega.telefone}
              endereco={t.entrega.endereco} titulo={t.entrega.titulo} caixas={t.entrega.caixas} recebedor={t.entrega.recebedor}
              linhas={t.entrega.linhas} rodape={t.entrega.rodape} numero={n} digits={Number(t.entrega.digits)}
              prefix={t.entrega.prefix} numerar={t.entrega.numerar} watermarkStyle={t.watermarkStyle}
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
                  contato={t.ordemServico.contato}
              linhas={t.ordemServico.linhas}
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
          </FolhasTal>
        </div>
      )}
    </div>
  );
}
