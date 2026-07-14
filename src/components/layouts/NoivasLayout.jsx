// src/components/layouts/NoivasLayout.jsx
//
// Planner de Noivas — conjunto de páginas para organizar o casamento do
// início ao fim, com identidade visual elegante (rosé + dourado, tipografia
// serifada/script) usando o mesmo FloralCorner (100% SVG) já usado em
// outros temas do app, então funciona em tela, impressão e PDF sem perda.
//
//   1. Capa                → nomes do casal + data do grande dia
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
      className="printable-page bg-white text-gray-900 flex flex-col justify-between box-border select-none border-0 shadow-none rounded-none relative overflow-hidden"
      style={{ backgroundColor: bgColor, fontFamily }}
    >
      {backgroundSrc && <Background src={backgroundSrc} opacity={backgroundOpacity} />}
      {watermarkSrc && <Watermark src={watermarkSrc} opacity={watermarkOpacity} />}
      {showCorners && (
        <>
          <FloralCorner position="top-left" size={130} palette={ROSE_GOLD_PALETTE} />
          <FloralCorner position="bottom-right" size={130} palette={ROSE_GOLD_PALETTE} />
        </>
      )}
      <div className="flex flex-col flex-1 min-h-0 relative z-10">{children}</div>
      <div className="relative z-10">
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

function PageHeader({ logo, titulo, subtitulo, primaryColor, pageIndex, totalPaginas }) {
  return (
    <div className="text-center mb-4 shrink-0">
      {logo && <Logo src={logo} className="h-10 mx-auto mb-2" />}
      <h2
        className="text-2xl tracking-[0.15em] uppercase"
        style={{ color: primaryColor, fontFamily: FONTE_TITULO, fontWeight: 600 }}
      >
        {titulo}
      </h2>
      {subtitulo && (
        <p className="text-[11px] uppercase tracking-[0.3em] text-gray-400 mt-1">{subtitulo}</p>
      )}
      <div
        className="w-20 h-px mx-auto mt-3"
        style={{ backgroundColor: primaryColor, opacity: 0.5 }}
      />
      {totalPaginas > 1 && (
        <span className="block text-[10px] text-gray-400 mt-2">
          {pageIndex + 1} / {totalPaginas}
        </span>
      )}
    </div>
  );
}

function CampoLabel({ label, fieldKey, className = "", placeholder = "", ...rest }) {
  return (
    <div className={className}>
      <span className="text-[9px] uppercase tracking-widest text-gray-400">{label}</span>
      <EditableField
        fieldKey={fieldKey}
        className="w-full min-h-6 border-b border-gray-300 text-sm py-0.5"
        placeholder={placeholder}
        {...rest}
      />
    </div>
  );
}

function Checkbox({ primaryColor }) {
  return (
    <div
      className="w-4 h-4 rounded-full border-2 shrink-0"
      style={{ borderColor: primaryColor }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────
// 1. CAPA
// ─────────────────────────────────────────────────────────────────────────

export function NoivasCapaPage(rest) {
  const { primaryColor } = useVisual(rest.customColors);

  return (
    <PageShell {...rest}>
      <div className="flex-1 flex flex-col items-center justify-center text-center px-10 relative">
        {rest.logo && <Logo src={rest.logo} className="h-14 mb-8 mx-auto" />}

        <p className="text-xs uppercase tracking-[0.4em] text-gray-400 mb-4">
          Planner de Casamento
        </p>

        <div className="flex items-center justify-center gap-4 mb-3">
          <EditableField
            fieldKey="noivas-nome-1"
            className="min-h-14 text-center text-5xl px-2"
            style={{ color: primaryColor, fontFamily: FONTE_SCRIPT }}
            placeholder="Noiva"
          />
          <span
            className="text-3xl"
            style={{ color: primaryColor, fontFamily: FONTE_SCRIPT }}
          >
            &amp;
          </span>
          <EditableField
            fieldKey="noivas-nome-2"
            className="min-h-14 text-center text-5xl px-2"
            style={{ color: primaryColor, fontFamily: FONTE_SCRIPT }}
            placeholder="Noivo"
          />
        </div>

        <div
          className="w-40 h-px mx-auto my-5"
          style={{ backgroundColor: primaryColor, opacity: 0.5 }}
        />

        <div className="w-64 mx-auto">
          <span className="text-[10px] uppercase tracking-widest text-gray-400">
            Data do grande dia
          </span>
          <EditableField
            fieldKey="noivas-data-casamento"
            className="w-full min-h-8 border-b text-center text-lg py-1"
            style={{ borderColor: primaryColor, fontFamily: FONTE_TITULO }}
            placeholder="00 / 00 / 0000"
          />
        </div>

        <p className="text-xs text-gray-500 mt-10 max-w-xs mx-auto leading-relaxed italic">
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

      <div className="grid grid-cols-4 gap-3 mb-6 shrink-0">
        {[
          { label: "Meses", key: "noivas-cd-meses" },
          { label: "Semanas", key: "noivas-cd-semanas" },
          { label: "Dias", key: "noivas-cd-dias" },
          { label: "Convidados", key: "noivas-cd-convidados" },
        ].map((item) => (
          <div
            key={item.key}
            className="rounded-2xl py-4 text-center"
            style={{ border: `1.5px solid ${primaryColor}55` }}
          >
            <EditableField
              fieldKey={item.key}
              className="min-h-9 text-center text-2xl font-semibold"
              style={{ color: primaryColor, fontFamily: FONTE_TITULO }}
              placeholder="—"
            />
            <p className="text-[9px] uppercase tracking-widest text-gray-400 mt-1">
              {item.label}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
        <CampoLabel label="Local da cerimônia" fieldKey="noivas-local-cerimonia" />
        <CampoLabel label="Local da recepção" fieldKey="noivas-local-recepcao" />
        <CampoLabel label="Horário da cerimônia" fieldKey="noivas-horario-cerimonia" />
        <CampoLabel label="Estilo / tema" fieldKey="noivas-tema" />
        <CampoLabel label="Paleta de cores" fieldKey="noivas-paleta-cores" />
        <CampoLabel label="Orçamento total previsto" fieldKey="noivas-orcamento-total" />
        <CampoLabel label="Celebrante / cerimonialista" fieldKey="noivas-celebrante" />
        <CampoLabel label="Assessoria / wedding planner" fieldKey="noivas-assessoria" />
      </div>

      <div className="mt-6 flex-1 min-h-0">
        <span className="text-[9px] uppercase tracking-widest text-gray-400">
          Nossa visão para este dia
        </span>
        <EditableField
          fieldKey="noivas-visao"
          className="w-full min-h-24 border-b border-gray-300 text-sm py-2 italic"
          multiline
          placeholder="Como queremos nos sentir e o que não pode faltar..."
        />
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

export function NoivasOrcamentoPage({ pageIndex = 0, totalPaginas = 1, ...rest }) {
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

      <div className="flex-1 min-h-0 rounded-xl overflow-hidden" style={{ border: `1px solid ${primaryColor}44` }}>
        <div
          className="grid text-[9px] uppercase font-semibold text-white py-2 px-2"
          style={{ gridTemplateColumns: "1.6fr 0.9fr 0.9fr 0.7fr 1fr", backgroundColor: primaryColor }}
        >
          <span>Categoria</span>
          <span className="text-right">Previsto</span>
          <span className="text-right">Realizado</span>
          <span className="text-center">Pago</span>
          <span className="pl-2">Fornecedor</span>
        </div>

        {CATEGORIAS_ORCAMENTO.map((cat, i) => (
          <div
            key={cat}
            className={`grid items-center px-2 ${i % 2 === 1 ? "bg-[#fdf3f0]" : "bg-white"}`}
            style={{ gridTemplateColumns: "1.6fr 0.9fr 0.9fr 0.7fr 1fr", minHeight: "8mm" }}
          >
            <span className="text-[10px] text-gray-700 py-1">{cat}</span>
            <EditableField
              fieldKey={`noivas-orc-previsto-${i}`}
              className="min-h-6 text-right text-[10px] border-l border-gray-200 pl-1"
            />
            <EditableField
              fieldKey={`noivas-orc-realizado-${i}`}
              className="min-h-6 text-right text-[10px] border-l border-gray-200 pl-1"
            />
            <div className="flex justify-center border-l border-gray-200">
              <Checkbox primaryColor={primaryColor} />
            </div>
            <EditableField
              fieldKey={`noivas-orc-fornecedor-${i}`}
              className="min-h-6 text-[10px] border-l border-gray-200 pl-1"
            />
          </div>
        ))}

        <div
          className="grid items-center px-2 font-semibold"
          style={{ gridTemplateColumns: "1.6fr 0.9fr 0.9fr 0.7fr 1fr", backgroundColor: `${primaryColor}22`, minHeight: "9mm" }}
        >
          <span className="text-[10px]" style={{ color: primaryColor }}>
            Total
          </span>
          <EditableField
            fieldKey="noivas-orc-total-previsto"
            className="min-h-6 text-right text-[10px] border-l border-gray-200 pl-1"
          />
          <EditableField
            fieldKey="noivas-orc-total-realizado"
            className="min-h-6 text-right text-[10px] border-l border-gray-200 pl-1"
          />
          <span />
          <span />
        </div>
      </div>
    </PageShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// 4. CHECKLIST DO CASAMENTO — organizado por prazo
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

export function NoivasChecklistPage({ grupo, pageIndex = 0, totalPaginas = 1, ...rest }) {
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

      <div className="flex-1 flex flex-col gap-3 min-h-0 pt-2">
        {grupo.itens.map((item, i) => (
          <div key={i} className="flex items-center gap-3 pb-2 border-b border-gray-200">
            <Checkbox primaryColor={primaryColor} />
            <span className="text-sm text-gray-700 flex-1">{item}</span>
            <EditableField
              fieldKey={`noivas-checklist-${grupo.prazo}-${i}`.replace(/\s+/g, "-")}
              className="w-24 min-h-6 border-b border-gray-200 text-[10px] text-right"
              placeholder="notas"
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

export function NoivasConvidadosPage({ linhas = 18, pageIndex = 0, totalPaginas = 1, ...rest }) {
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

      <div className="flex-1 min-h-0 rounded-xl overflow-hidden" style={{ border: `1px solid ${primaryColor}44` }}>
        <div
          className="grid text-[9px] uppercase font-semibold text-white py-2 px-2"
          style={{ gridTemplateColumns: "0.4fr 1.6fr 0.7fr 0.7fr 0.5fr 1fr", backgroundColor: primaryColor }}
        >
          <span className="text-center">Nº</span>
          <span>Nome</span>
          <span className="text-center">Lado</span>
          <span className="text-center">RSVP</span>
          <span className="text-center">Mesa</span>
          <span className="pl-2">Observações</span>
        </div>

        {Array.from({ length: linhas }).map((_, i) => (
          <div
            key={i}
            className={`grid items-center px-2 ${i % 2 === 1 ? "bg-[#fdf3f0]" : "bg-white"}`}
            style={{ gridTemplateColumns: "0.4fr 1.6fr 0.7fr 0.7fr 0.5fr 1fr", minHeight: "7.5mm" }}
          >
            <span className="text-[9px] text-gray-400 text-center">{offset + i + 1}</span>
            <EditableField
              fieldKey={`noivas-convidado-nome-${offset + i}`}
              className="min-h-6 text-[10px] border-l border-gray-200 pl-1"
            />
            <EditableField
              fieldKey={`noivas-convidado-lado-${offset + i}`}
              className="min-h-6 text-[10px] text-center border-l border-gray-200"
            />
            <EditableField
              fieldKey={`noivas-convidado-rsvp-${offset + i}`}
              className="min-h-6 text-[10px] text-center border-l border-gray-200"
              placeholder="—"
            />
            <EditableField
              fieldKey={`noivas-convidado-mesa-${offset + i}`}
              className="min-h-6 text-[10px] text-center border-l border-gray-200"
            />
            <EditableField
              fieldKey={`noivas-convidado-obs-${offset + i}`}
              className="min-h-6 text-[10px] border-l border-gray-200 pl-1"
            />
          </div>
        ))}
      </div>
    </PageShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// 6. FORNECEDORES
// ─────────────────────────────────────────────────────────────────────────

export function NoivasFornecedoresPage({ linhas = 12, ...rest }) {
  const { primaryColor } = useVisual(rest.customColors);

  return (
    <PageShell {...rest}>
      <PageHeader
        logo={rest.logo}
        titulo="Fornecedores"
        subtitulo="Contatos, valores e status de pagamento"
        primaryColor={primaryColor}
      />

      <div className="flex-1 min-h-0 rounded-xl overflow-hidden" style={{ border: `1px solid ${primaryColor}44` }}>
        <div
          className="grid text-[9px] uppercase font-semibold text-white py-2 px-2"
          style={{ gridTemplateColumns: "1fr 1.1fr 1fr 0.8fr 0.6fr", backgroundColor: primaryColor }}
        >
          <span>Categoria</span>
          <span>Nome / Empresa</span>
          <span>Contato</span>
          <span className="text-right">Valor</span>
          <span className="text-center">Sinal pago</span>
        </div>

        {Array.from({ length: linhas }).map((_, i) => (
          <div
            key={i}
            className={`grid items-center px-2 ${i % 2 === 1 ? "bg-[#fdf3f0]" : "bg-white"}`}
            style={{ gridTemplateColumns: "1fr 1.1fr 1fr 0.8fr 0.6fr", minHeight: "8mm" }}
          >
            <EditableField
              fieldKey={`noivas-fornecedor-categoria-${i}`}
              className="min-h-6 text-[10px] pl-1"
            />
            <EditableField
              fieldKey={`noivas-fornecedor-nome-${i}`}
              className="min-h-6 text-[10px] border-l border-gray-200 pl-1"
            />
            <EditableField
              fieldKey={`noivas-fornecedor-contato-${i}`}
              className="min-h-6 text-[10px] border-l border-gray-200 pl-1"
            />
            <EditableField
              fieldKey={`noivas-fornecedor-valor-${i}`}
              className="min-h-6 text-[10px] text-right border-l border-gray-200 pl-1"
            />
            <div className="flex justify-center border-l border-gray-200">
              <Checkbox primaryColor={primaryColor} />
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// 7. PADRINHOS & MADRINHAS
// ─────────────────────────────────────────────────────────────────────────

export function NoivasPadrinhosPage({ linhas = 12, ...rest }) {
  const { primaryColor } = useVisual(rest.customColors);

  return (
    <PageShell {...rest}>
      <PageHeader
        logo={rest.logo}
        titulo="Padrinhos & Madrinhas"
        subtitulo="Cortejo e contatos"
        primaryColor={primaryColor}
      />

      <div className="flex-1 min-h-0 rounded-xl overflow-hidden" style={{ border: `1px solid ${primaryColor}44` }}>
        <div
          className="grid text-[9px] uppercase font-semibold text-white py-2 px-2"
          style={{ gridTemplateColumns: "1.3fr 0.9fr 1fr 1fr", backgroundColor: primaryColor }}
        >
          <span>Nome</span>
          <span>Papel</span>
          <span>Contato</span>
          <span className="pl-2">Traje / Observações</span>
        </div>

        {Array.from({ length: linhas }).map((_, i) => (
          <div
            key={i}
            className={`grid items-center px-2 ${i % 2 === 1 ? "bg-[#fdf3f0]" : "bg-white"}`}
            style={{ gridTemplateColumns: "1.3fr 0.9fr 1fr 1fr", minHeight: "8mm" }}
          >
            <EditableField
              fieldKey={`noivas-padrinho-nome-${i}`}
              className="min-h-6 text-[10px] pl-1"
            />
            <EditableField
              fieldKey={`noivas-padrinho-papel-${i}`}
              className="min-h-6 text-[10px] border-l border-gray-200 pl-1"
              placeholder="madrinha/padrinho"
            />
            <EditableField
              fieldKey={`noivas-padrinho-contato-${i}`}
              className="min-h-6 text-[10px] border-l border-gray-200 pl-1"
            />
            <EditableField
              fieldKey={`noivas-padrinho-obs-${i}`}
              className="min-h-6 text-[10px] border-l border-gray-200 pl-1"
            />
          </div>
        ))}
      </div>
    </PageShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// 8. CRONOGRAMA DO GRANDE DIA
// ─────────────────────────────────────────────────────────────────────────

const HORARIOS_CRONOGRAMA = [
  "08:00", "09:00", "10:00", "11:00", "12:00", "13:00",
  "14:00", "15:00", "16:00", "17:00", "18:00", "19:00",
  "20:00", "21:00", "22:00", "23:00",
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

      <div className="flex-1 flex flex-col gap-1.5 min-h-0">
        {HORARIOS_CRONOGRAMA.map((hora) => (
          <div key={hora} className="flex items-center gap-3 border-b border-gray-200 pb-1.5">
            <span
              className="w-14 text-xs font-semibold shrink-0"
              style={{ color: primaryColor, fontFamily: FONTE_TITULO }}
            >
              {hora}
            </span>
            <EditableField
              fieldKey={`noivas-cronograma-${hora}`}
              className="flex-1 min-h-6 text-sm"
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

      <div className="flex-1 grid grid-cols-2 gap-4 min-h-0">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-2xl p-3 flex flex-col"
            style={{ border: `1.5px dashed ${primaryColor}55` }}
          >
            <EditableField
              fieldKey={`noivas-inspiracao-titulo-${i}`}
              className="text-xs font-semibold uppercase tracking-widest mb-2"
              style={{ color: primaryColor }}
              placeholder="Título da ideia"
            />
            <EditableField
              fieldKey={`noivas-inspiracao-texto-${i}`}
              className="flex-1 min-h-24 text-sm text-gray-600"
              multiline
              placeholder="Anote aqui..."
            />
          </div>
        ))}
      </div>
    </PageShell>
  );
}
