import Footer from "../Footer";
import Logo from "../Logo";
import Watermark from "../Watermark";
import Background from "../Background";
import EditableField from "../EditableField";

const TOTAL_ALUNOS = 40;
const TOTAL_DIAS = 21;
const DAY_COL = "15px";
const NUM_COL = "22px";
const TOTAL_COL = "34px";

function gridCols() {
  return `${NUM_COL} 1fr repeat(${TOTAL_DIAS}, ${DAY_COL}) ${TOTAL_COL}`;
}

export default function ListaChamadaLayout({
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
        <div className="flex items-center gap-4 mb-4 border-b border-gray-200 pb-4">
          <Logo src={logo} />

          <div className="flex-1">
            <h2
              className="text-2xl font-light tracking-[0.2em] uppercase"
              style={{ color: primaryColor }}
            >
              Lista de Chamada
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Controle de frequência mensal da turma.
            </p>
          </div>
        </div>

        {/* Dados da turma */}
        <div className="grid grid-cols-5 gap-3 mb-4">
          {[
            { key: "chamada-escola", label: "Escola" },
            { key: "chamada-turma", label: "Turma" },
            { key: "chamada-disciplina", label: "Disciplina" },
            { key: "chamada-professor", label: "Professor(a)" },
            { key: "chamada-mes", label: "Mês / Ano" },
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

        {/* Tabela de chamada */}
        <div className="flex-1 border border-gray-200 rounded-lg overflow-hidden">
          {/* Cabeçalho da tabela */}
          <div
            className="grid items-center text-[7px] font-semibold uppercase text-white py-1.5"
            style={{
              gridTemplateColumns: gridCols(),
              backgroundColor: primaryColor,
            }}
          >
            <span className="text-center">Nº</span>
            <span className="pl-2 text-[8px] tracking-wide">Nome do Aluno</span>
            {[...Array(TOTAL_DIAS)].map((_, i) => (
              <span key={i} className="text-center">
                {i + 1}
              </span>
            ))}
            <span className="text-center leading-tight">Faltas</span>
          </div>

          {/* Linhas dos alunos */}
          {[...Array(TOTAL_ALUNOS)].map((_, row) => (
            <div
              key={row}
              className={`grid items-center border-t border-gray-100 ${
                row % 2 === 1 ? "bg-gray-50/60" : "bg-white"
              }`}
              style={{ gridTemplateColumns: gridCols() }}
            >
              <span className="text-center text-[8px] text-gray-400">
                {row + 1}
              </span>

              <EditableField
                fieldKey={`chamada-aluno-${row}`}
                className="min-h-5.5 pl-2 text-[9px] border-l border-gray-100"
              />

              {[...Array(TOTAL_DIAS)].map((_, day) => (
                <EditableField
                  key={day}
                  fieldKey={`chamada-marca-${row}-${day}`}
                  className="min-h-5.5 text-[7px] text-center border-l border-gray-100"
                />
              ))}

              <EditableField
                fieldKey={`chamada-total-${row}`}
                className="min-h-5.5 text-[8px] text-center border-l border-gray-100"
              />
            </div>
          ))}
        </div>

        {/* Legenda */}
        <div className="mt-3 flex items-center gap-5 text-[9px] text-gray-500">
          <span>
            <strong style={{ color: primaryColor }}>P</strong> = Presente
          </span>
          <span>
            <strong style={{ color: primaryColor }}>F</strong> = Falta
          </span>
          <span>
            <strong style={{ color: primaryColor }}>FJ</strong> = Falta
            Justificada
          </span>
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
