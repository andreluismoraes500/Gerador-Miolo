import Footer from "../Footer";
import Logo from "../Logo";
import Watermark from "../Watermark";
import EditableField from "../EditableField";

const DIAS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

function HabitRow({ index }) {
  return (
    <div className="grid grid-cols-[140px_1fr_60px] gap-4 items-center">
      <EditableField
        fieldKey={`habito-nome-${index}`}
        className="text-sm font-medium text-gray-700 border-b border-gray-200 py-1"
        placeholder={` ${index + 1}`}
      />

      <div className="flex justify-between">
        {DIAS.map((dia) => (
          <div key={dia} className="flex flex-col items-center gap-1">
            <span className="text-[10px] text-gray-400 uppercase">{dia}</span>

            <div className="w-6 h-6 rounded-md border border-gray-300 bg-white" />
          </div>
        ))}
      </div>

      <EditableField
        fieldKey={`habito-meta-${index}`}
        className="text-xs text-center border-b border-gray-200 py-1"
        placeholder=""
      />
    </div>
  );
}

export default function HabitosLayout({
  footerName,
  colorTheme = "classico",
  logo,
  footerType = "default",
  customColors = {},
  fontFamily = "sans-serif",
  watermarkSrc,
  watermarkOpacity,
}) {
  const primaryColor = customColors.primary || "#4f46e5";
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

      <div className="flex-1 p-8">
        <div className="flex items-center gap-4 mb-6 border-b border-gray-200 pb-4">
          <Logo src={logo} />

          <div className="flex-1">
            <h2
              className="text-2xl font-light tracking-[0.2em] uppercase"
              style={{ color: primaryColor }}
            >
              Rastreador de Hábitos
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Pequenas ações diárias geram grandes resultados.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs uppercase tracking-widest text-gray-400">
              Mês
            </span>

            <EditableField
              fieldKey="habitos-mes"
              className="w-28 text-sm text-right border-b border-gray-200"
              placeholder=""
            />
          </div>
        </div>

        <div className="mb-6 p-4 rounded-xl bg-gray-50 border border-gray-200">
          <span className="text-xs uppercase tracking-widest text-gray-400">
            Objetivo principal
          </span>

          <EditableField
            fieldKey="habitos-objetivo"
            className="w-full mt-2 text-sm"
            placeholder=""
          />
        </div>

        <div className="mb-6 space-y-4">
          {[...Array(7)].map((_, index) => (
            <HabitRow key={index} index={index} />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="p-4 rounded-xl border border-gray-200">
            <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-3">
              Minha recompensa
            </h3>

            <EditableField
              fieldKey="habitos-recompensa"
              className="w-full min-h-17.5 text-sm"
              placeholder=""
            />
          </div>

          <div className="p-4 rounded-xl border border-gray-200">
            <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-3">
              Frase motivacional
            </h3>

            <EditableField
              fieldKey="habitos-motivacao"
              className="w-full min-h-17.5 text-sm italic"
              placeholder=""
            />
          </div>
        </div>

        <div className="mt-6 p-4 rounded-xl bg-gray-50 border border-gray-200">
          <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-4">
            Progresso semanal
          </h3>

          <div className="grid grid-cols-4 gap-4">
            {["Semana 1", "Semana 2", "Semana 3", "Semana 4"].map((semana) => (
              <div key={semana}>
                <p className="text-xs text-gray-500 mb-2">{semana}</p>

                <div className="h-3 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: "0%",
                      backgroundColor: primaryColor,
                    }}
                  />
                </div>
              </div>
            ))}
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
