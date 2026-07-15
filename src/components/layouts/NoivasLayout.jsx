// src/components/layouts/NoivasLayout.jsx
//
// Planner de Noivas — conjunto de páginas para organizar o casamento do
// início ao fim, com identidade visual elegante (rosé + dourado, tipografia
// serifada/script) usando o mesmo FloralCorner (100% SVG) já usado em
// outros temas do app, então funciona em tela, impressão e PDF sem perda.
//
//   1. Capa                  → nomes do casal + data do grande dia
//   2. Contagem & Casal    → contagem regressiva + dados essenciais
//   3. Orçamento           → categorias de gasto, previsto x realizado
//   4. Checklist do Casamento → tarefas organizadas por prazo (12+ meses
//      antes até a semana do casamento)
//   5. Lista de Convidados → nome, lado, confirmação, mesa, observações
//   6. Fornecedores        → contato, valor combinado, sinal, status
//   7. Padrinhos & Madrinhas → cortejo + contatos
//   8. Cronograma do Grande Dia → linha do tempo hora a hora
//   9. Inspiração & Notas  → espaço livre para ideias, cores, referências

import Footer from "../Footer";
import Logo from "../Logo";
import Watermark from "../Watermark";
import Background from "../Background";
import EditableField from "../EditableField";
import FloralCorner from "../FloralCorner";

export const ROSE_GOLD_PALETTE = {
  petalDark: "#b76e79",
  petalMid: "#d9a5ad",
  petalLight: "#f3d9dc",
  petalHighlight: "#fdf3f0",
  leafDark: "#9a8c5c",
  leafMid: "#c3b781",
  leafLight: "#e8e1c2",
};

const FONTE_SCRIPT = "'Great Vibes', cursive";
const FONTE_TITULO = "'Cormorant Garamond', serif";

// ─────────────────────────────────────────────────────────────────────────
// Utilitários
// ─────────────────────────────────────────────────────────────────────────

function useVisual(customColors = {}) {
  return {
    primaryColor: customColors.primary || "#b76e79",
    secondaryColor: customColors.secondary || "#e8c7c2",
    bgColor: customColors.background || "#fffaf7",
  };
}

function PageShell({
  children,
  fontFamily,
  watermarkSrc,
  watermarkOpacity,
  backgroundSrc,
  backgroundOpacity,
  footerName,
  footerType,
  colorTheme,
  customColors = {},
  showCorners = true,
}) {
  const { bgColor } = useVisual(customColors);
  return (
    <div
      className="printable-page bg-white text-gray-900 flex flex-col justify-between box-border select-none border-0 shadow-none rounded-none relative overflow-hidden p-8 md:p-12 transition-all duration-300"
      style={{ backgroundColor: bgColor, fontFamily }}
    >
      {backgroundSrc && (
        <Background src={backgroundSrc} opacity={backgroundOpacity} />
      )}
      {watermarkSrc && (
        <Watermark src={watermarkSrc} opacity={watermarkOpacity} />
      )}
      {showCorners && (
        <>
          <FloralCorner
            position="top-left"
            size={140}
            palette={ROSE_GOLD_PALETTE}
          />
          <FloralCorner
            position="bottom-right"
            size={140}
            palette={ROSE_GOLD_PALETTE}
          />
        </>
      )}
      <div className="flex flex-col flex-1 min-h-0 relative z-10">
        {children}
      </div>
      <div className="relative z-10 mt-6 border-t border-[#b76e79]/10 pt-4">
        <Footer
          name={footerName}
          type={footerType}
          colorTheme={colorTheme}
          customColors={customColors}
          fontFamily={fontFamily}
        />
      </div>
    </div>
  );
}

function PageHeader({
  logo,
  titulo,
  subtitulo,
  primaryColor,
  pageIndex,
  totalPaginas,
}) {
  return (
    <div className="text-center mb-6 shrink-0 relative">
      {logo && <Logo src={logo} className="h-12 mx-auto mb-3 drop-shadow-sm" />}
      <h2
        className="text-2xl md:text-3xl tracking-[0.2em] uppercase leading-tight"
        style={{
          color: primaryColor,
          fontFamily: FONTE_TITULO,
          fontWeight: 600,
          textShadow: "0.5px 0.5px 1px rgba(183, 110, 121, 0.05)",
        }}
      >
        {titulo}
      </h2>
      {subtitulo && (
        <p className="text-[10px] uppercase tracking-[0.35em] text-gray-400 mt-2 font-light">
          {subtitulo}
        </p>
      )}
      <div className="flex items-center justify-center gap-2 mt-4">
        <div
          className="w-8 h-px opacity-30"
          style={{ backgroundColor: primaryColor }}
        />
        <div
          className="w-1.5 h-1.5 rotate-45 opacity-60"
          style={{ backgroundColor: primaryColor }}
        />
        <div
          className="w-8 h-px opacity-30"
          style={{ backgroundColor: primaryColor }}
        />
      </div>
      {totalPaginas > 1 && (
        <span className="block text-[9px] uppercase tracking-widest text-gray-400 mt-3 font-semibold">
          {pageIndex + 1} de {totalPaginas}
        </span>
      )}
    </div>
  );
}

function CampoLabel({
  label,
  fieldKey,
  className = "",
  placeholder = "",
  ...rest
}) {
  return (
    <div className={`flex flex-col ${className}`}>
      <span className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-semibold mb-1">
        {label}
      </span>
      <EditableField
        fieldKey={fieldKey}
        className="w-full min-h-8 border-b border-gray-200 text-sm py-1 focus:border-[#b76e79] transition-all bg-transparent focus:bg-[#fdf3f0]/30 outline-none placeholder-gray-300"
        placeholder={placeholder}
        {...rest}
      />
    </div>
  );
}

function Checkbox({ primaryColor, checked = false }) {
  return (
    <div
      className="w-4 h-4 rounded-full border shrink-0 flex items-center justify-center transition-all duration-300 cursor-pointer shadow-sm"
      style={{
        borderColor: `${primaryColor}aa`,
        backgroundColor: checked ? `${primaryColor}22` : "transparent",
      }}
    >
      <div
        className={`w-2 h-2 rounded-full transition-all duration-300 ${checked ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}
        style={{ backgroundColor: primaryColor }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// 1. CAPA
// ─────────────────────────────────────────────────────────────────────────

export function NoivasCapaPage(rest) {
  const { primaryColor } = useVisual(rest.customColors);

  return (
    <PageShell {...rest} showCorners={true}>
      <div className="flex-1 flex flex-col items-center justify-center text-center px-8 relative">
        {rest.logo && (
          <Logo src={rest.logo} className="h-16 mb-8 mx-auto drop-shadow-sm" />
        )}

        <p className="text-[10px] uppercase tracking-[0.5em] text-gray-400 mb-6 font-semibold">
          Planner de Casamento
        </p>

        {/* Nomes do casal */}
        <div className="flex items-center justify-center gap-4 mb-6 flex-wrap leading-none py-4">
          <EditableField
            fieldKey="noivas-capa-noiva"
            className="min-h-16 text-center text-4xl md:text-6xl px-3 inline-block font-normal hover:scale-[1.02] transition-transform duration-300"
            style={{ color: primaryColor, fontFamily: FONTE_SCRIPT }}
            placeholder="Noivo"
          />
          <span
            className="text-4xl md:text-5xl opacity-40 font-light"
            style={{ color: primaryColor, fontFamily: FONTE_SCRIPT }}
          >
            &amp;
          </span>
          <EditableField
            fieldKey="noivas-capa-noivo"
            className="min-h-16 text-center text-4xl md:text-6xl px-3 inline-block font-normal hover:scale-[1.02] transition-transform duration-300"
            style={{ color: primaryColor, fontFamily: FONTE_SCRIPT }}
            placeholder="Noiva"
          />
        </div>

        <div className="flex items-center justify-center gap-2 my-6 w-full">
          <div
            className="w-12 h-px"
            style={{ backgroundColor: primaryColor, opacity: 0.3 }}
          />
          <div
            className="w-2 h-2 rotate-45"
            style={{ backgroundColor: primaryColor, opacity: 0.4 }}
          />
          <div
            className="w-12 h-px"
            style={{ backgroundColor: primaryColor, opacity: 0.3 }}
          />
        </div>

        {/* Data */}
        <div className="w-72 mx-auto">
          <span className="text-[9px] uppercase tracking-[0.25em] text-gray-400 font-semibold">
            Data do grande dia
          </span>
          <EditableField
            fieldKey="noivas-capa-data"
            className="w-full min-h-10 border-b text-center text-xl py-1 mt-1 tracking-widest bg-transparent placeholder-gray-300"
            style={{
              borderColor: `${primaryColor}55`,
              fontFamily: FONTE_TITULO,
              color: "#4a4a4a",
            }}
            placeholder=""
          />
        </div>

        <p className="text-xs text-gray-400 mt-12 max-w-sm mx-auto leading-relaxed italic font-light px-4">
          "O amor não se vê com os olhos, mas com o coração." — cada detalhe
          deste planner é um passo a mais rumo ao seu grande dia.
        </p>
      </div>
    </PageShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// 2. CONTAGEM & DADOS DO CASAL
// ─────────────────────────────────────────────────────────────────────────

export function NoivasContagemPage(rest) {
  const { primaryColor } = useVisual(rest.customColors);

  return (
    <PageShell {...rest}>
      <PageHeader
        logo={rest.logo}
        titulo="Nosso Grande Dia"
        subtitulo="Contagem regressiva & dados essenciais"
        primaryColor={primaryColor}
      />

      <div className="grid grid-cols-4 gap-4 mb-8 shrink-0">
        {[
          { label: "Meses", key: "noivas-cd-meses", placeholder: "" },
          { label: "Semanas", key: "noivas-cd-semanas", placeholder: "" },
          { label: "Dias", key: "noivas-cd-dias", placeholder: "" },
          {
            label: "Convidados",
            key: "noivas-cd-convidados",
            placeholder: "",
          },
        ].map((item) => (
          <div
            key={item.key}
            className="rounded-2xl py-5 px-2 text-center bg-white shadow-[0_4px_20px_rgba(183,110,121,0.03)] hover:shadow-[0_8px_25px_rgba(183,110,121,0.06)] transition-all duration-300"
            style={{ border: `1px solid ${primaryColor}22` }}
          >
            <EditableField
              fieldKey={item.key}
              className="min-h-10 text-center text-3xl font-light tracking-tight bg-transparent placeholder-gray-300"
              style={{ color: primaryColor, fontFamily: FONTE_TITULO }}
              placeholder={item.placeholder}
            />
            <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 mt-2 font-semibold">
              {item.label}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 bg-white p-6 rounded-2xl border border-[#b76e79]/10 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
        <CampoLabel
          label="Local da cerimônia"
          fieldKey="noivas-local-cerimonia"
          placeholder="."
        />
        <CampoLabel
          label="Local da recepção"
          fieldKey="noivas-local-recepcao"
          placeholder=""
        />
        <CampoLabel
          label="Horário da cerimônia"
          fieldKey="noivas-horario-cerimonia"
          placeholder=""
        />
        <CampoLabel
          label="Estilo / tema"
          fieldKey="noivas-tema"
          placeholder=""
        />
        <CampoLabel
          label="Paleta de cores"
          fieldKey="noivas-paleta-cores"
          placeholder=""
        />
        <CampoLabel
          label="Orçamento total previsto"
          fieldKey="noivas-orcamento-total"
          placeholder=""
        />
        <CampoLabel
          label="Celebrante / cerimonialista"
          fieldKey="noivas-celebrante"
          placeholder=""
        />
        <CampoLabel
          label="Assessoria / wedding planner"
          fieldKey="noivas-assessoria"
          placeholder=""
        />
      </div>

      <div className="mt-8 flex-1 min-h-0 flex flex-col">
        <span className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-semibold mb-2">
          Nossa visão para este dia
        </span>
        <div className="flex-1 rounded-2xl border border-[#b76e79]/10 bg-white p-4 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
          <EditableField
            fieldKey="noivas-visao"
            className="w-full h-full min-h-24 text-sm py-1 italic text-gray-600 leading-relaxed bg-transparent placeholder-gray-300"
            multiline
            placeholder=""
          />
        </div>
      </div>
    </PageShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// 3. ORÇAMENTO
// ─────────────────────────────────────────────────────────────────────────

const CATEGORIAS_ORCAMENTO = [
  "Espaço / Recepção",
  "Buffet & Bebidas",
  "Fotografia & Vídeo",
  "Vestido & Traje",
  "Decoração & Flores",
  "Música / Banda / DJ",
  "Convites & Papelaria",
  "Beleza (cabelo/make)",
  "Lembrancinhas",
  "Bolo & Doces",
  "Cerimonial / Assessoria",
  "Lua de mel",
  "Imprevistos",
];

export function NoivasOrcamentoPage({
  pageIndex = 0,
  totalPaginas = 1,
  ...rest
}) {
  const { primaryColor } = useVisual(rest.customColors);

  return (
    <PageShell {...rest}>
      <PageHeader
        logo={rest.logo}
        titulo="Orçamento do Casamento"
        subtitulo="Previsto x Realizado"
        primaryColor={primaryColor}
        pageIndex={pageIndex}
        totalPaginas={totalPaginas}
      />

      <div
        className="flex-1 min-h-0 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.03)] bg-white border"
        style={{ borderColor: `${primaryColor}22` }}
      >
        <div
          className="grid text-[9px] uppercase tracking-wider font-semibold text-white py-3 px-4 items-center"
          style={{
            gridTemplateColumns: "1.8fr 1fr 1fr 0.6fr 1.2fr",
            backgroundColor: primaryColor,
          }}
        >
          <span>Categoria</span>
          <span className="text-right">Previsto</span>
          <span className="text-right">Realizado</span>
          <span className="text-center">Pago</span>
          <span className="pl-4">Fornecedor</span>
        </div>

        <div className="divide-y divide-gray-100 overflow-y-auto h-[calc(100%-80px)]">
          {CATEGORIAS_ORCAMENTO.map((cat, i) => (
            <div
              key={cat}
              className={`grid items-center px-4 transition-colors duration-150 ${i % 2 === 1 ? "bg-[#fdf3f0]/20" : "bg-white"}`}
              style={{
                gridTemplateColumns: "1.8fr 1fr 1fr 0.6fr 1.2fr",
                minHeight: "9mm",
              }}
            >
              <span className="text-[11px] font-medium text-gray-700 py-2">
                {cat}
              </span>
              <EditableField
                fieldKey={`noivas-orc-previsto-${i}`}
                className="min-h-6 text-right text-[11px] border-l border-gray-50 pl-2 pr-1 font-mono text-gray-600 bg-transparent placeholder-gray-300"
                placeholder=""
              />
              <EditableField
                fieldKey={`noivas-orc-realizado-${i}`}
                className="min-h-6 text-right text-[11px] border-l border-gray-50 pl-2 pr-1 font-mono text-gray-600 bg-transparent placeholder-gray-300"
                placeholder=""
              />
              <div className="flex justify-center border-l border-gray-50">
                <Checkbox primaryColor={primaryColor} />
              </div>
              <EditableField
                fieldKey={`noivas-orc-fornecedor-${i}`}
                className="min-h-6 text-[11px] border-l border-gray-50 pl-4 bg-transparent text-gray-600 placeholder-gray-300"
                placeholder=""
              />
            </div>
          ))}
        </div>

        <div
          className="grid items-center px-4 font-semibold border-t"
          style={{
            gridTemplateColumns: "1.8fr 1fr 1fr 0.6fr 1.2fr",
            backgroundColor: `${primaryColor}08`,
            borderColor: `${primaryColor}22`,
            minHeight: "11mm",
          }}
        >
          <span
            className="text-[10px] uppercase tracking-wider"
            style={{ color: primaryColor }}
          >
            Total Geral
          </span>
          <EditableField
            fieldKey="noivas-orc-total-previsto"
            className="min-h-6 text-right text-xs font-semibold font-mono border-l border-gray-200 pl-2 pr-1 bg-transparent placeholder-gray-300"
            style={{ color: primaryColor }}
            placeholder=""
          />
          <EditableField
            fieldKey="noivas-orc-total-realizado"
            className="min-h-6 text-right text-xs font-semibold font-mono border-l border-gray-200 pl-2 pr-1 bg-transparent placeholder-gray-300"
            style={{ color: primaryColor }}
            placeholder=""
          />
          <span />
          <span />
        </div>
      </div>
    </PageShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// 4. CHECKLIST DO CASAMENTO
// ─────────────────────────────────────────────────────────────────────────

export const CHECKLIST_NOIVAS = [
  {
    prazo: "12+ meses antes",
    itens: [
      "Definir orçamento total e como será dividido",
      "Escolher a data do casamento",
      "Reservar local da cerimônia e recepção",
      "Contratar assessoria / cerimonial",
      "Montar a lista de convidados (rascunho)",
      "Escolher o estilo e a paleta de cores",
    ],
  },
  {
    prazo: "6 a 9 meses antes",
    itens: [
      "Contratar fotografia e vídeo",
      "Provar e escolher buffet",
      "Escolher e provar o vestido",
      "Contratar música (banda/DJ)",
      "Definir decoração e florista",
      "Enviar save the date",
    ],
  },
  {
    prazo: "3 a 5 meses antes",
    itens: [
      "Encomendar convites oficiais",
      "Escolher trajes dos padrinhos e madrinhas",
      "Agendar prova de cabelo e maquiagem",
      "Definir cardápio final com o buffet",
      "Organizar lua de mel",
      "Confirmar fornecedores contratados",
    ],
  },
  {
    prazo: "1 mês antes",
    itens: [
      "Confirmar presença dos convidados (RSVP)",
      "Fazer prova final do vestido/traje",
      "Definir plano de assentos (mesas)",
      "Acertar pagamentos pendentes",
      "Preparar roteiro da cerimônia com o celebrante",
      "Revisar cronograma do grande dia com a assessoria",
    ],
  },
  {
    prazo: "Semana do casamento",
    itens: [
      "Confirmar horários com todos os fornecedores",
      "Preparar kit de emergência",
      "Entregar itens de decoração/lembrancinhas",
      "Separar alianças e documentos",
      "Descansar e aproveitar cada momento!",
    ],
  },
];

export function NoivasChecklistPage({
  grupo,
  pageIndex = 0,
  totalPaginas = 1,
  ...rest
}) {
  const { primaryColor } = useVisual(rest.customColors);

  return (
    <PageShell {...rest}>
      <PageHeader
        logo={rest.logo}
        titulo="Checklist do Casamento"
        subtitulo={grupo.prazo}
        primaryColor={primaryColor}
        pageIndex={pageIndex}
        totalPaginas={totalPaginas}
      />

      <div className="flex-1 flex flex-col gap-3 min-h-0 pt-2 bg-white p-6 rounded-2xl border border-[#b76e79]/10 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
        {grupo.itens.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-4 pb-3 border-b border-gray-100 last:border-b-0 hover:bg-[#fdf3f0]/10 p-1.5 rounded-lg transition-colors duration-150"
          >
            <Checkbox primaryColor={primaryColor} />
            <span className="text-sm text-gray-700 flex-1 font-light leading-relaxed">
              {item}
            </span>
            <EditableField
              fieldKey={`noivas-checklist-${grupo.prazo}-${i}`.replace(
                /\s+/g,
                "-",
              )}
              className="w-28 min-h-6 border-b border-gray-200 text-[10px] text-right font-mono pr-2 bg-transparent focus:border-[#b76e79] placeholder-gray-300"
              placeholder=""
            />
          </div>
        ))}
      </div>
    </PageShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// 5. LISTA DE CONVIDADOS
// ─────────────────────────────────────────────────────────────────────────

export function NoivasConvidadosPage({
  linhas = 24,
  pageIndex = 0,
  totalPaginas = 1,
  ...rest
}) {
  const { primaryColor } = useVisual(rest.customColors);
  const offset = pageIndex * linhas;

  return (
    <PageShell {...rest}>
      <PageHeader
        logo={rest.logo}
        titulo="Lista de Convidados"
        subtitulo="Confirmação, mesa e observações"
        primaryColor={primaryColor}
        pageIndex={pageIndex}
        totalPaginas={totalPaginas}
      />

      <div
        className="flex-1 min-h-0 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.03)] bg-white border"
        style={{ borderColor: `${primaryColor}22` }}
      >
        <div
          className="grid text-[9px] uppercase tracking-wider font-semibold text-white py-3 px-4 items-center"
          style={{
            gridTemplateColumns: "0.5fr 2fr 1fr 1fr 0.7fr 1.8fr",
            backgroundColor: primaryColor,
          }}
        >
          <span className="text-center">Nº</span>
          <span>Nome</span>
          <span className="text-center">Lado</span>
          <span className="text-center">RSVP</span>
          <span className="text-center">Mesa</span>
          <span className="pl-4">Observações</span>
        </div>

        <div className="divide-y divide-gray-100 overflow-y-auto h-[calc(100%-40px)]">
          {Array.from({ length: linhas }).map((_, i) => (
            <div
              key={i}
              className={`grid items-center px-4 transition-colors duration-150 ${i % 2 === 1 ? "bg-[#fdf3f0]/20" : "bg-white"}`}
              style={{
                gridTemplateColumns: "0.5fr 2fr 1fr 1fr 0.7fr 1.8fr",
                minHeight: "8.5mm",
              }}
            >
              <span className="text-[9px] font-mono text-gray-400 text-center">
                {offset + i + 1}
              </span>
              <EditableField
                fieldKey={`noivas-convidado-nome-${offset + i}`}
                className="min-h-6 text-[11px] border-l border-gray-100 pl-3 bg-transparent text-gray-700 font-medium placeholder-gray-300"
                placeholder=""
              />
              <EditableField
                fieldKey={`noivas-convidado-lado-${offset + i}`}
                className="min-h-6 text-[11px] text-center border-l border-gray-100 bg-transparent text-gray-600 placeholder-gray-300"
                placeholder=""
              />
              <EditableField
                fieldKey={`noivas-convidado-rsvp-${offset + i}`}
                className="min-h-6 text-[11px] text-center border-l border-gray-100 bg-transparent text-gray-600 placeholder-gray-300"
                placeholder=""
              />
              <EditableField
                fieldKey={`noivas-convidado-mesa-${offset + i}`}
                className="min-h-6 text-[11px] text-center border-l border-gray-100 bg-transparent text-gray-600 font-mono placeholder-gray-300"
                placeholder=""
              />
              <EditableField
                fieldKey={`noivas-convidado-obs-${offset + i}`}
                className="min-h-6 text-[11px] border-l border-gray-100 pl-4 bg-transparent text-gray-500 italic placeholder-gray-300"
                placeholder=""
              />
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// 6. FORNECEDORES
// ─────────────────────────────────────────────────────────────────────────

export function NoivasFornecedoresPage({ linhas = 18, ...rest }) {
  const { primaryColor } = useVisual(rest.customColors);

  return (
    <PageShell {...rest}>
      <PageHeader
        logo={rest.logo}
        titulo="Fornecedores"
        subtitulo="Contatos, valores e status de pagamento"
        primaryColor={primaryColor}
      />

      <div
        className="flex-1 min-h-0 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.03)] bg-white border"
        style={{ borderColor: `${primaryColor}22` }}
      >
        <div
          className="grid text-[9px] uppercase tracking-wider font-semibold text-white py-3 px-4 items-center"
          style={{
            gridTemplateColumns: "1.2fr 1.5fr 1.2fr 1fr 0.8fr",
            backgroundColor: primaryColor,
          }}
        >
          <span>Categoria</span>
          <span>Nome / Empresa</span>
          <span>Contato</span>
          <span className="text-right">Valor</span>
          <span className="text-center">Sinal pago</span>
        </div>

        <div className="divide-y divide-gray-100 overflow-y-auto h-[calc(100%-40px)]">
          {Array.from({ length: linhas }).map((_, i) => (
            <div
              key={i}
              className={`grid items-center px-4 transition-colors duration-150 ${i % 2 === 1 ? "bg-[#fdf3f0]/20" : "bg-white"}`}
              style={{
                gridTemplateColumns: "1.2fr 1.5fr 1.2fr 1fr 0.8fr",
                minHeight: "9.5mm",
              }}
            >
              <EditableField
                fieldKey={`noivas-fornecedor-categoria-${i}`}
                className="min-h-6 text-[11px] font-medium text-gray-700 bg-transparent placeholder-gray-300"
                placeholder=""
              />
              <EditableField
                fieldKey={`noivas-fornecedor-nome-${i}`}
                className="min-h-6 text-[11px] border-l border-gray-100 pl-3 bg-transparent text-gray-600 placeholder-gray-300"
                placeholder=""
              />
              <EditableField
                fieldKey={`noivas-fornecedor-contato-${i}`}
                className="min-h-6 text-[11px] border-l border-gray-100 pl-3 bg-transparent text-gray-500 font-mono placeholder-gray-300"
                placeholder=""
              />
              <EditableField
                fieldKey={`noivas-fornecedor-valor-${i}`}
                className="min-h-6 text-[11px] text-right border-l border-gray-100 pl-3 pr-1 bg-transparent font-mono text-gray-600 placeholder-gray-300"
                placeholder=""
              />
              <div className="flex justify-center border-l border-gray-100">
                <Checkbox primaryColor={primaryColor} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// 7. PADRINHOS & MADRINHAS
// ─────────────────────────────────────────────────────────────────────────

export function NoivasPadrinhosPage({ linhas = 18, ...rest }) {
  const { primaryColor } = useVisual(rest.customColors);

  return (
    <PageShell {...rest}>
      <PageHeader
        logo={rest.logo}
        titulo="Padrinhos & Madrinhas"
        subtitulo="Cortejo e contatos"
        primaryColor={primaryColor}
      />

      <div
        className="flex-1 min-h-0 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.03)] bg-white border"
        style={{ borderColor: `${primaryColor}22` }}
      >
        <div
          className="grid text-[9px] uppercase tracking-wider font-semibold text-white py-3 px-4 items-center"
          style={{
            gridTemplateColumns: "1.5fr 1fr 1.2fr 1.5fr",
            backgroundColor: primaryColor,
          }}
        >
          <span>Nome</span>
          <span>Papel</span>
          <span>Contato</span>
          <span className="pl-4">Traje / Observações</span>
        </div>

        <div className="divide-y divide-gray-100 overflow-y-auto h-[calc(100%-40px)]">
          {Array.from({ length: linhas }).map((_, i) => (
            <div
              key={i}
              className={`grid items-center px-4 transition-colors duration-150 ${i % 2 === 1 ? "bg-[#fdf3f0]/20" : "bg-white"}`}
              style={{
                gridTemplateColumns: "1.5fr 1fr 1.2fr 1.5fr",
                minHeight: "9.5mm",
              }}
            >
              <EditableField
                fieldKey={`noivas-padrinho-nome-${i}`}
                className="min-h-6 text-[11px] font-medium text-gray-700 bg-transparent placeholder-gray-300"
                placeholder=""
              />
              <EditableField
                fieldKey={`noivas-padrinho-papel-${i}`}
                className="min-h-6 text-[11px] border-l border-gray-100 pl-3 bg-transparent text-gray-500 italic placeholder-gray-300"
                placeholder=""
              />
              <EditableField
                fieldKey={`noivas-padrinho-contato-${i}`}
                className="min-h-6 text-[11px] border-l border-gray-100 pl-3 bg-transparent text-gray-500 font-mono placeholder-gray-300"
                placeholder=""
              />
              <EditableField
                fieldKey={`noivas-padrinho-obs-${i}`}
                className="min-h-6 text-[11px] border-l border-gray-100 pl-4 bg-transparent text-gray-600 placeholder-gray-300"
                placeholder=""
              />
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// 8. CRONOGRAMA DO GRANDE DIA
// ─────────────────────────────────────────────────────────────────────────

const HORARIOS_CRONOGRAMA = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
  "23:00",
];

export function NoivasCronogramaPage(rest) {
  const { primaryColor } = useVisual(rest.customColors);

  return (
    <PageShell {...rest}>
      <PageHeader
        logo={rest.logo}
        titulo="Cronograma do Grande Dia"
        subtitulo="Hora a hora"
        primaryColor={primaryColor}
      />

      <div className="flex-1 flex flex-col gap-2 min-h-0 bg-white p-6 rounded-2xl border border-[#b76e79]/10 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-y-auto">
        {HORARIOS_CRONOGRAMA.map((hora) => (
          <div
            key={hora}
            className="flex items-center gap-4 border-b border-gray-100 pb-2 last:border-0 hover:bg-[#fdf3f0]/10 p-1 rounded-lg transition-colors duration-150"
          >
            <span
              className="w-16 text-sm font-semibold shrink-0 tracking-wide"
              style={{ color: primaryColor, fontFamily: FONTE_TITULO }}
            >
              {hora}
            </span>
            <div className="w-px h-5 bg-gray-200" />
            <EditableField
              fieldKey={`noivas-cronograma-${hora}`}
              className="flex-1 min-h-6 text-sm text-gray-600 bg-transparent focus:border-[#b76e79] placeholder-gray-300"
              placeholder=""
            />
          </div>
        ))}
      </div>
    </PageShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// 9. INSPIRAÇÃO & NOTAS
// ─────────────────────────────────────────────────────────────────────────

export function NoivasInspiracaoPage(rest) {
  const { primaryColor } = useVisual(rest.customColors);

  return (
    <PageShell {...rest}>
      <PageHeader
        logo={rest.logo}
        titulo="Inspiração & Notas"
        subtitulo="Ideias, cores, referências e recados"
        primaryColor={primaryColor}
      />

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5 min-h-0">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-2xl p-5 flex flex-col bg-white hover:shadow-[0_8px_30px_rgba(183,110,121,0.05)] transition-all duration-300"
            style={{ border: `1.5px dashed ${primaryColor}33` }}
          >
            <EditableField
              fieldKey={`noivas-inspiracao-titulo-${i}`}
              className="text-xs font-semibold uppercase tracking-widest mb-3 border-b border-gray-100 pb-1 focus:border-[#b76e79] bg-transparent placeholder-gray-300"
              style={{ color: primaryColor }}
              placeholder={`Bloco de Notas ${i + 1}`}
            />
            <EditableField
              fieldKey={`noivas-inspiracao-texto-${i}`}
              className="flex-1 min-h-24 text-sm text-gray-500 italic leading-relaxed bg-transparent placeholder-gray-300"
              multiline
              placeholder=""
            />
          </div>
        ))}
      </div>
    </PageShell>
  );
}
