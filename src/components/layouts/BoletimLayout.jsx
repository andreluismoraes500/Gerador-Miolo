import Footer from "../Footer";
import Logo from "../Logo";
import Watermark from "../Watermark";
import Background from "../Background";
import EditableField from "../EditableField";

const DISCIPLINAS_PADRAO = ["", "", "", "", "", "", "", "", "", ""];

function LinhaBoletim({ index, placeholder }) {
  return (
    <div className="grid grid-cols-[1.8fr_0.7fr_0.7fr_0.7fr_0.7fr_0.8fr_0.8fr_1fr] items-center border-b border-gray-100 text-[11px] hover:bg-gray-50 transition-colors">
      <EditableField
        fieldKey={`boletim-disciplina-${index}`}
        className="min-h-8 pl-3 py-2 border-r border-gray-100 text-gray-700"
        placeholder={placeholder}
      />
      {["1", "2", "3", "4"].map((bim) => (
        <EditableField
          key={bim}
          fieldKey={`boletim-nota-${index}-${bim}`}
          className="min-h-8 py-2 text-center border-r border-gray-100 text-gray-700"
        />
      ))}
      <EditableField
        fieldKey={`boletim-media-${index}`}
        className="min-h-8 py-2 text-center font-semibold border-r border-gray-100 text-gray-800"
      />
      <EditableField
        fieldKey={`boletim-frequencia-${index}`}
        className="min-h-8 py-2 text-center border-r border-gray-100 text-gray-700"
      />
      <EditableField
        fieldKey={`boletim-situacao-${index}`}
        className="min-h-8 py-2 text-center font-medium text-gray-800"
        placeholder=""
      />
    </div>
  );
}

export default function BoletimLayout({
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
      className="printable-page bg-white text-gray-900 flex flex-col justify-between relative shadow-sm"
      style={{ backgroundColor: bgColor, fontFamily }}
    >
      {backgroundSrc && <Background src={backgroundSrc} opacity={backgroundOpacity} />}
      {watermarkSrc && (
        <Watermark src={watermarkSrc} opacity={watermarkOpacity} />
      )}

      <div className="flex flex-col flex-1 px-10 py-10">
        {/* Cabeçalho */}
        <div className="flex items-center gap-5 mb-8 pb-6 border-b border-gray-200">
          <Logo src={logo} />
          <div className="flex-1">
            <h2
              className="text-3xl font-light tracking-[0.25em] uppercase"
              style={{ color: primaryColor }}
            >
              Boletim Escolar
            </h2>
            <p className="text-sm text-gray-500 mt-1.5 font-light">
              Registro de desempenho e frequência do aluno.
            </p>
          </div>
        </div>

        {/* Dados do aluno */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <span className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">
              Escola
            </span>
            <EditableField
              fieldKey="boletim-escola"
              className="w-full min-h-7 mt-1 text-sm font-medium text-gray-800"
            />
          </div>
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <span className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">
              Ano Letivo
            </span>
            <EditableField
              fieldKey="boletim-ano-letivo"
              className="w-full min-h-7 mt-1 text-sm font-medium text-gray-800"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <span className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">
              Aluno(a)
            </span>
            <EditableField
              fieldKey="boletim-aluno"
              className="w-full min-h-7 mt-1 text-sm font-medium text-gray-800"
            />
          </div>
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <span className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">
              Turma
            </span>
            <EditableField
              fieldKey="boletim-turma"
              className="w-full min-h-7 mt-1 text-sm font-medium text-gray-800"
            />
          </div>
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <span className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">
              Professor(a)
            </span>
            <EditableField
              fieldKey="boletim-professor"
              className="w-full min-h-7 mt-1 text-sm font-medium text-gray-800"
            />
          </div>
        </div>

        {/* Tabela de notas */}
        <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm mb-8">
          <div
            className="grid grid-cols-[1.8fr_0.7fr_0.7fr_0.7fr_0.7fr_0.8fr_0.8fr_1fr] items-center text-[10px] font-semibold uppercase tracking-wider text-white py-3"
            style={{ backgroundColor: primaryColor }}
          >
            <span className="pl-3">Disciplina</span>
            <span className="text-center">1º Bim</span>
            <span className="text-center">2º Bim</span>
            <span className="text-center">3º Bim</span>
            <span className="text-center">4º Bim</span>
            <span className="text-center">Média</span>
            <span className="text-center">Freq. %</span>
            <span className="text-center">Situação</span>
          </div>

          {DISCIPLINAS_PADRAO.map((nome, index) => (
            <LinhaBoletim key={index} index={index} placeholder={nome} />
          ))}
        </div>

        {/* Observações e assinaturas */}
        <div className="grid grid-cols-2 gap-6">
          <div className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm">
            <h3 className="text-[11px] uppercase tracking-widest text-gray-500 font-semibold mb-4">
              Observações do professor
            </h3>
            <EditableField
              fieldKey="boletim-observacoes"
              className="w-full min-h-24 text-sm text-gray-700 leading-relaxed"
              multiline
            />
          </div>

          <div className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-[11px] uppercase tracking-widest text-gray-500 font-semibold mb-4">
                Situação final
              </h3>
              <EditableField
                fieldKey="boletim-situacao-final"
                className="w-full min-h-9 text-sm font-semibold text-gray-800 border-b border-gray-300"
                placeholder="Aprovado(a) / Reprovado(a)"
              />
            </div>

            <div className="grid grid-cols-2 gap-6 mt-8">
              <div className="text-center">
                <EditableField
                  fieldKey="boletim-assinatura-professor"
                  className="min-h-9 border-b border-gray-400 text-xs text-gray-700 font-medium"
                />
                <span className="text-[9px] text-gray-400 uppercase tracking-widest mt-1.5 block">
                  Professor(a)
                </span>
              </div>
              <div className="text-center">
                <EditableField
                  fieldKey="boletim-assinatura-coordenacao"
                  className="min-h-9 border-b border-gray-400 text-xs text-gray-700 font-medium"
                />
                <span className="text-[9px] text-gray-400 uppercase tracking-widest mt-1.5 block">
                  Coordenação
                </span>
              </div>
            </div>
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
