// src/pages/TalonarioPage.jsx
//
// Gerador de Pedidos de Venda, Receituários e Receitas em formato de talão.
// Vive dentro do AppLayout (cabeçalho/nav/print.css compartilhados com o
// resto do app) — só a barra de abas abaixo é própria dela, com a cor de
// destaque de cada aba. A numeração automática e a marca d'água são
// geradas em lote na hora de imprimir.

import {
  MdReceiptLong,
  MdMedicalServices,
  MdRestaurantMenu,
  MdPrint,
} from "react-icons/md";
import { useTalonarioBuilder, TAL_ACCENTS } from "../hooks/useTalonarioBuilder";
import {
  PedidoCard,
  ReceituarioCard,
  ReceitaCard,
} from "../components/talonario/TalonarioCards";
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
                        ? TAL_ACCENTS[id].accent
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

          <p className="text-[12.5px] text-[#8a9694] text-center max-w-160">
            {t.activeTab === "pedido" &&
              `Pré-visualização do 1º pedido do lote (Nº ${t.pedido.prefix || ""}${String(t.pedidoRange.start).padStart(Number(t.pedido.digits) || 0, "0")}). Cada página impressa terá um número diferente, em sequência.`}
            {t.activeTab === "receituario" &&
              (t.receituario.numerar
                ? "Pré-visualização da 1ª via numerada do lote."
                : "Pré-visualização da via de receituário.")}
            {t.activeTab === "receita" &&
              "Pré-visualização do talão de receita — pautas para preencher à mão."}
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
        </div>
      )}
    </div>
  );
}
