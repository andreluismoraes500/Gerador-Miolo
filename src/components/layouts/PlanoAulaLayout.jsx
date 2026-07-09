import Footer from "../Footer";
import Logo from "../Logo";
import Watermark from "../Watermark";
import Background from "../Background";
import EditableField from "../EditableField";

const ETAPAS = [
  { key: "abertura", label: "Abertura / Introdução" },
  { key: "desenvolvimento", label: "Desenvolvimento" },
  { key: "pratica", label: "Prática / Exercícios" },
  { key: "avaliacao", label: "Avaliação" },
  { key: "encerramento", label: "Encerramento" },
];

export default function PlanoAulaLayout({
  footerName,
  colorTheme = "classico",
  logo,
  footerType = "default",
  customColors = {},
  fontFamily = "sans-serif",
  watermarkSrc,
  watermarkOpacity,
  backgroundSrc,
  backgroundOpacity,
}) {
  const primaryColor = customColors.primary || "#b45309";
  const bgColor = customColors.background || "#ffffff";

  return (
    <div
      className="printable-page bg-white text-gray-900 flex flex-col justify-between relative"
      style={{ backgroundColor: bgColor, fontFamily }}
    >
      {backgroundSrc && <Background src={backgroundSrc} opacity={backgroundOpacity} />}
      {watermarkSrc && (
        <Watermark src={watermarkSrc} opacity={watermarkOpacity} />
      )}

      <div className="flex flex-col flex-1 p-8">
        {/* Cabeçalho */}
        <div className="flex items-center gap-4 mb-5 border-b border-gray-200 pb-4">
          <Logo src={logo} />
          <div className="flex-1">
            <h2
              className="text-2xl font-light tracking-[0.2em] uppercase"
              style={{ color: primaryColor }}
            >
              Plano de Aula
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Planejamento pedagógico da aula.
            </p>
          </div>
        </div>

        {/* Dados gerais */}
        <div className="grid grid-cols-5 gap-3 mb-4">
          {[
            { key: "planoaula-disciplina", label: "Disciplina" },
            { key: "planoaula-turma", label: "Turma" },
            { key: "planoaula-data", label: "Data" },
            { key: "planoaula-duracao", label: "Duração" },
            { key: "planoaula-professor", label: "Professor(a)" },
          ].map((item) => (
            <div key={item.key}>
              <span className="text-[9px] uppercase tracking-widest text-gray-400">
                {item.label}
              </span>
              <EditableField
                fieldKey={item.key}
                className="w-full min-h-6 border-b border-gray-300 text-xs"
              />
            </div>
          ))}
        </div>

        {/* Tema da aula */}
        <div className="mb-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
          <span className="text-xs uppercase tracking-widest text-gray-400">
            Tema / Título da aula
          </span>
          <EditableField
            fieldKey="planoaula-tema"
            className="w-full mt-1 text-base font-medium"
          />
        </div>

        {/* Objetivos e conteúdo */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-4 rounded-xl border border-gray-200">
            <h3
              className="text-xs font-semibold uppercase tracking-widest mb-2"
              style={{ color: primaryColor }}
            >
              Objetivos de aprendizagem
            </h3>
            <EditableField
              fieldKey="planoaula-objetivos"
              className="w-full min-h-16 text-sm"
              multiline
            />
          </div>

          <div className="p-4 rounded-xl border border-gray-200">
            <h3
              className="text-xs font-semibold uppercase tracking-widest mb-2"
              style={{ color: primaryColor }}
            >
              Conteúdo programático
            </h3>
            <EditableField
              fieldKey="planoaula-conteudo"
              className="w-full min-h-16 text-sm"
              multiline
            />
          </div>
        </div>

        {/* Etapas da aula */}
        <div className="mb-4 rounded-xl border border-gray-200 overflow-hidden">
          <div
            className="text-[10px] font-semibold uppercase tracking-widest text-white px-4 py-2"
            style={{ backgroundColor: primaryColor }}
          >
            Desenvolvimento da aula
          </div>
          {ETAPAS.map((etapa, i) => (
            <div
              key={etapa.key}
              className={`grid grid-cols-[26px_140px_1fr] items-start gap-2 px-3 py-2 border-t border-gray-100 ${
                i % 2 === 1 ? "bg-gray-50/60" : "bg-white"
              }`}
            >
              <span className="text-xs font-bold text-gray-300 pt-1">
                {i + 1}
              </span>
              <span className="text-[11px] text-gray-600 pt-1.5 font-medium">
                {etapa.label}
              </span>
              <EditableField
                fieldKey={`planoaula-etapa-${etapa.key}`}
                className="min-h-7 text-sm border-b border-gray-100"
              />
            </div>
          ))}
        </div>

        {/* Recursos e avaliação */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-gray-200">
            <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-2">
              Recursos didáticos
            </h3>
            <EditableField
              fieldKey="planoaula-recursos"
              className="w-full min-h-14 text-sm"
              multiline
            />
          </div>

          <div className="p-4 rounded-xl border border-gray-200">
            <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-2">
              Tarefa de casa / Observações
            </h3>
            <EditableField
              fieldKey="planoaula-observacoes"
              className="w-full min-h-14 text-sm"
              multiline
            />
          </div>
        </div>
      </div>

      <Footer
        name={footerName}
        type={footerType}
        colorTheme={colorTheme}
        customColors={customColors}
        fontFamily={fontFamily}
      />
    </div>
  );
}
