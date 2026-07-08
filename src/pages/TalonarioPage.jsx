// src/pages/TalonarioPage.jsx
//
// Gerador de Pedidos de Venda, Receituários e Receitas culinárias em
// formato de talão. Cada aba tem sua própria cor de destaque; a numeração
// automática e a marca d'água são geradas em lote na hora de imprimir.

import { MdReceiptLong, MdMedicalServices, MdRestaurantMenu, MdPrint } from "react-icons/md";
import { useTalonarioBuilder, TAL_ACCENTS } from "../hooks/useTalonarioBuilder";
import { PedidoCard, ReceituarioCard, ReceitaCard } from "../components/talonario/TalonarioCards";
import {
  PedidoPanel,
  ReceituarioPanel,
  ReceitaPanel,
  WatermarkPanel,
  UploadBox,
} from "../components/talonario/TalonarioPanels";
import "../styles/talonario.css";

const TABS = [
  { id: "pedido", label: "Pedido de Venda", icon: MdReceiptLong },
  { id: "receituario", label: "Receituário", icon: MdMedicalServices },
  { id: "receita", label: "Receita Culinária", icon: MdRestaurantMenu },
];

export default function TalonarioPage() {
  const t = useTalonarioBuilder();
  const accent = TAL_ACCENTS[t.activeTab];

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
    <div style={cssVars} className="min-h-full bg-[#eef1ef]">
      {/* ---------- topo com abas ---------- */}
      <div
        className="print:hidden text-white px-7 py-4.5 flex items-center justify-between flex-wrap gap-3.5"
        style={{ background: "linear-gradient(135deg, #24344D 0%, #1a2740 100%)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10.5 h-10.5 rounded-xl flex items-center justify-center font-extrabold text-xl shadow-[0_3px_10px_rgba(0,0,0,0.25)]"
            style={{ background: "conic-gradient(from 220deg, #0f7a72, #0f6e94, #c9822c, #0f7a72)", fontFamily: "'Cormorant Garamond', serif" }}
          >
            T
          </div>
          <div>
            <h1 className="text-[21px] font-bold m-0" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Talonário
            </h1>
            <p className="m-0 mt-0.5 text-xs text-[#c9d6d5]">Gerador de pedidos, receituários e receitas</p>
          </div>
        </div>
        <div className="flex gap-1.5 bg-black/20 p-1 rounded-xl">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => t.setActiveTab(id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-[13.5px] font-semibold transition-all ${
                t.activeTab === id ? "bg-white text-[#1c2b2c] shadow-md" : "text-[#dfe9e8] hover:bg-white/10"
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ background: TAL_ACCENTS[id].accent }} />
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ---------- corpo: sidebar + stage ---------- */}
      <div className="print:hidden grid grid-cols-1 md:grid-cols-[380px_1fr]">
        <div className="bg-white border-r border-[#e4e4e0] px-5.5 pt-6 pb-4 max-h-[calc(100vh-78px)] overflow-y-auto">
          {t.activeTab === "pedido" && (
            <>
              <PedidoPanel pedido={t.pedido} setField={t.setPedidoField} toggleCampo={t.togglePedidoCampo} range={t.pedidoRange} />
              <div className="mt-4">
                <UploadBox
                  inputId="tal-logo-pedido"
                  label="Enviar logo"
                  hint="PNG ou JPG, fundo transparente fica melhor"
                  thumb={t.logos.pedido}
                  onFile={(f) => t.handleLogoUpload("pedido", f)}
                />
                {t.logos.pedido && (
                  <button onClick={() => t.clearLogo("pedido")} className="text-[11.5px] underline mt-1" style={{ color: "var(--tal-stamp)" }}>
                    remover logo
                  </button>
                )}
              </div>
            </>
          )}

          {t.activeTab === "receituario" && (
            <>
              <ReceituarioPanel receituario={t.receituario} setField={t.setReceituarioField} range={t.receituarioRange} />
              <div className="mt-4">
                <UploadBox
                  inputId="tal-logo-receituario"
                  label="Enviar logo"
                  hint="Aparece no cabeçalho da via"
                  thumb={t.logos.receituario}
                  onFile={(f) => t.handleLogoUpload("receituario", f)}
                />
                {t.logos.receituario && (
                  <button onClick={() => t.clearLogo("receituario")} className="text-[11.5px] underline mt-1" style={{ color: "var(--tal-stamp)" }}>
                    remover logo
                  </button>
                )}
              </div>
            </>
          )}

          {t.activeTab === "receita" && (
            <>
              <ReceitaPanel
                receita={t.receita}
                setField={t.setReceitaField}
                ingredientes={t.ingredientes}
                addIngrediente={t.addIngrediente}
                updateIngrediente={t.updateIngrediente}
                removeIngrediente={t.removeIngrediente}
                passos={t.passos}
                addPasso={t.addPasso}
                updatePasso={t.updatePasso}
                removePasso={t.removePasso}
              />
              <div className="mt-2">
                <UploadBox
                  inputId="tal-foto-receita"
                  label="Enviar foto"
                  hint="Aparece no topo do cartão"
                  thumb={t.foto}
                  onFile={t.handleFotoUpload}
                />
                <div className="mt-2">
                  <UploadBox
                    inputId="tal-logo-receita"
                    label="Enviar logo"
                    hint="Selo no canto do cartão"
                    thumb={t.logos.receita}
                    onFile={(f) => t.handleLogoUpload("receita", f)}
                  />
                </div>
              </div>
            </>
          )}

          <WatermarkPanel
            watermark={t.watermark}
            setField={t.setWatermarkField}
            activeTab={t.activeTab}
            hasLogo={!!t.logos[uploadKey]}
          />

          <div className="sticky bottom-0 bg-white pt-4 pb-1 mt-6 border-t border-[#eee]">
            <button
              onClick={t.handlePrint}
              className="w-full text-white font-bold text-[15px] rounded-xl py-3.5 flex items-center justify-center gap-2 transition-transform hover:-translate-y-px active:translate-y-0"
              style={{ background: "var(--tal-accent)", fontFamily: "'Cormorant Garamond', serif", boxShadow: "0 4px 14px var(--tal-accent-light)" }}
            >
              <MdPrint /> Gerar e imprimir
            </button>
            <p className="text-[11px] text-[#8a9694] text-center mt-2 leading-relaxed">
              Na janela de impressão, escolha <b>"Salvar como PDF"</b> para baixar o arquivo pronto.
            </p>
          </div>
        </div>

        {/* ---------- stage de pré-visualização ---------- */}
        <div className="p-9 flex flex-col items-center gap-5.5">
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
              foto={t.foto}
              ingredientes={t.ingredientes}
              passos={t.passos}
              watermarkStyle={t.watermarkStyle}
            />
          )}

          <p className="text-[12.5px] text-[#8a9694] text-center max-w-[640px]">
            {t.activeTab === "pedido" &&
              `Pré-visualização do 1º pedido do lote (Nº ${t.pedido.prefix || ""}${String(t.pedidoRange.start).padStart(Number(t.pedido.digits) || 0, "0")}). Cada página impressa terá um número diferente, em sequência.`}
            {t.activeTab === "receituario" &&
              (t.receituario.numerar ? "Pré-visualização da 1ª via numerada do lote." : "Pré-visualização da via de receituário.")}
            {t.activeTab === "receita" && "Pré-visualização do cartão de receita."}
          </p>
        </div>
      </div>

      {/* ---------- lote de impressão (só aparece no @media print) ---------- */}
      {t.printBatch && (
        <div className="hidden print:block">
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
                  watermarkStyle={t.watermarkStyle}
                />
              </div>
            ))}
          {t.printBatch.tab === "receituario" &&
            t.printBatch.items.map((n, i) => (
              <div key={i} className="tal-print-page">
                <ReceituarioCard {...t.receituario} logo={t.logos.receituario} numero={n} watermarkStyle={t.watermarkStyle} />
              </div>
            ))}
          {t.printBatch.tab === "receita" && (
            <div className="tal-print-page">
              <ReceitaCard
                {...t.receita}
                logo={t.logos.receita}
                foto={t.foto}
                ingredientes={t.ingredientes}
                passos={t.passos}
                watermarkStyle={t.watermarkStyle}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
