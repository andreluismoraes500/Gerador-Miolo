import Footer from "../Footer";
import Logo from "../Logo";
import Watermark from "../Watermark";
import EditableField from "../EditableField";

const DIAS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

function GradeRow({ index }) {
  return (
    <div className="grid grid-cols-8 gap-2 items-center py-1.5 border-b border-gray-100 last:border-0">
      <EditableField
        fieldKey={`estudos-horario-${index}`}
        className="text-xs text-gray-500 border-b border-dashed border-gray-300"
      />
      {DIAS.map((dia) => (
        <EditableField
          key={dia}
          fieldKey={`estudos-grade-${index}-${dia}`}
          className="text-xs text-center min-h-6 border-b border-dashed border-gray-200"
        />
      ))}
    </div>
  );
}

function ExamRow({ index, primaryColor }) {
  return (
    <div className="grid grid-cols-[1fr_90px_70px] gap-3 items-center py-2 border-b border-dotted border-gray-200 last:border-0">
      <EditableField
        fieldKey={`estudos-prova-materia-${index}`}
        className="text-sm border-b border-gray-200"
      />
      <EditableField
        fieldKey={`estudos-prova-data-${index}`}
        className="text-xs text-center border-b border-gray-200"
      />
      <div className="flex justify-center">
        <div
          className="w-4 h-4 rounded border-2"
          style={{ borderColor: primaryColor }}
        />
      </div>
    </div>
  );
}

export default function EstudosLayout({
  footerName,
  colorTheme = "classico",
  logo,
  footerType = "default",
  customColors = {},
  fontFamily = "sans-serif",
  watermarkSrc,
  watermarkOpacity,
}) {
  const primaryColor = customColors.primary || "#2563EB";
  const bgColor = customColors.background || "#ffffff";

  return (
    <div
      className="printable-page bg-white text-gray-900 flex flex-col justify-between relative"
      style={{
        backgroundColor: bgColor,
        fontFamily,
      }}
    >
      {watermarkSrc && (
        <Watermark src={watermarkSrc} opacity={watermarkOpacity} />
      )}

      <div className="flex flex-col flex-1 p-8">
        <div className="flex items-center gap-4 mb-6 border-b border-gray-200 pb-4">
          <Logo src={logo} />

          <div className="flex-1">
            <h2
              className="text-2xl font-light tracking-[0.2em] uppercase"
              style={{ color: primaryColor }}
            >
              Planner de Estudos
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Organize sua grade semanal e as próximas avaliações.
            </p>
          </div>

          <div className="w-32">
            <span className="text-xs uppercase tracking-widest text-gray-400">
              Semana
            </span>

            <EditableField
              fieldKey="estudos-semana"
              className="w-full min-h-7 border-b border-gray-300 text-right text-sm"
            />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-gray-200 mb-6">
          <h3
            className="text-sm font-semibold uppercase tracking-[0.15em] mb-3"
            style={{ color: primaryColor }}
          >
            Grade de matérias
          </h3>

          <div className="grid grid-cols-8 gap-2 mb-1">
            <span className="text-[10px] uppercase text-gray-400">Hora</span>
            {DIAS.map((dia) => (
              <span
                key={dia}
                className="text-[10px] uppercase text-gray-400 text-center"
              >
                {dia}
              </span>
            ))}
          </div>

          {[...Array(6)].map((_, index) => (
            <GradeRow key={index} index={index} />
          ))}
        </div>

        <div className="grid grid-cols-[1fr_280px] gap-6 flex-1">
          <div className="p-4 rounded-xl border border-gray-200">
            <h3
              className="text-sm font-semibold uppercase tracking-[0.15em] mb-3"
              style={{ color: primaryColor }}
            >
              Cronograma de provas e trabalhos
            </h3>

            {[...Array(5)].map((_, index) => (
              <ExamRow key={index} index={index} primaryColor={primaryColor} />
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50">
              <h3
                className="text-xs uppercase tracking-widest text-gray-400 mb-2"
              >
                Meta de estudo da semana
              </h3>

              <EditableField
                fieldKey="estudos-meta"
                className="w-full min-h-14 text-sm"
                multiline
              />
            </div>

            <div className="p-4 rounded-xl border border-gray-200 flex-1">
              <h3
                className="text-xs uppercase tracking-widest text-gray-400 mb-3"
              >
                Revisar depois
              </h3>

              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-2 mb-2.5">
                  <div className="w-3.5 h-3.5 rounded border border-gray-300 shrink-0" />
                  <div className="flex-1 h-6 border-b border-dotted border-gray-300" />
                </div>
              ))}
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
