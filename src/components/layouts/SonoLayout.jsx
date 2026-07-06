import Footer from "../Footer";
import Logo from "../Logo";
import Watermark from "../Watermark";
import EditableField from "../EditableField";

const DIAS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

function SleepBar({ dia, index, primaryColor }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-[10px] text-gray-400 uppercase">{dia}</span>

      <div className="w-8 h-24 rounded-full border border-gray-200 bg-gray-50 relative overflow-hidden">
        <div
          className="absolute bottom-0 left-0 right-0 rounded-full opacity-20"
          style={{ height: "0%", backgroundColor: primaryColor }}
        />
      </div>

      <EditableField
        fieldKey={`sono-horas-${index}`}
        className="w-8 text-center text-[10px] border-b border-dashed border-gray-300"
      />
    </div>
  );
}

function CheckItem({ fieldKey }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-4 h-4 rounded border border-gray-300 shrink-0" />
      <EditableField
        fieldKey={fieldKey}
        className="flex-1 min-h-6 border-b border-dotted border-gray-300 text-sm"
      />
    </div>
  );
}

export default function SonoLayout({
  footerName,
  colorTheme = "classico",
  logo,
  footerType = "default",
  customColors = {},
  fontFamily = "sans-serif",
  watermarkSrc,
  watermarkOpacity,
}) {
  const primaryColor = customColors.primary || "#6366F1";
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
              Sono &amp; Bem-estar Mental
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Acompanhe seu descanso e sua saúde emocional durante a semana.
            </p>
          </div>

          <div className="w-32">
            <span className="text-xs uppercase tracking-widest text-gray-400">
              Semana
            </span>

            <EditableField
              fieldKey="sono-semana"
              className="w-full min-h-7 border-b border-gray-300 text-right text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-[1fr_260px] gap-6 flex-1">
          <div className="flex flex-col gap-5">
            <div className="p-4 rounded-xl border border-gray-200">
              <h3
                className="text-sm font-semibold uppercase tracking-[0.15em] mb-4"
                style={{ color: primaryColor }}
              >
                Horas de sono por dia
              </h3>

              <div className="flex justify-between px-2">
                {DIAS.map((dia, index) => (
                  <SleepBar
                    key={dia}
                    dia={dia}
                    index={index}
                    primaryColor={primaryColor}
                  />
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-gray-200 flex-1">
              <h3
                className="text-sm font-semibold uppercase tracking-[0.15em] mb-4"
                style={{ color: primaryColor }}
              >
                Rotina de desligar a mente
              </h3>

              <div className="space-y-3">
                <CheckItem fieldKey="sono-rotina-1" />
                <CheckItem fieldKey="sono-rotina-2" />
                <CheckItem fieldKey="sono-rotina-3" />
                <CheckItem fieldKey="sono-rotina-4" />
                <CheckItem fieldKey="sono-rotina-5" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="p-4 rounded-xl border border-gray-200">
              <h3
                className="text-sm font-semibold uppercase tracking-[0.15em] mb-3"
                style={{ color: primaryColor }}
              >
                Qualidade do sono
              </h3>

              <div className="flex justify-between">
                {[1, 2, 3, 4, 5].map((n) => (
                  <div
                    key={n}
                    className="w-6 h-6 rounded-full border-2"
                    style={{ borderColor: primaryColor }}
                  />
                ))}
              </div>
              <p className="text-[10px] text-gray-400 mt-2">1 = péssima · 5 = ótima</p>
            </div>

            <div className="p-4 rounded-xl border border-gray-200">
              <h3
                className="text-sm font-semibold uppercase tracking-[0.15em] mb-3"
                style={{ color: primaryColor }}
              >
                Humor ao acordar
              </h3>

              <EditableField
                fieldKey="sono-humor-acordar"
                className="w-full min-h-9 border-b border-gray-300 text-sm"
              />
            </div>

            <div className="p-4 rounded-xl border border-gray-200 flex-1">
              <h3
                className="text-sm font-semibold uppercase tracking-[0.15em] mb-3"
                style={{ color: primaryColor }}
              >
                O que pesou na mente hoje
              </h3>

              <EditableField
                fieldKey="sono-pensamentos"
                className="w-full min-h-24 text-sm"
                multiline
              />
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-xl bg-gray-50 border border-gray-200">
          <h3
            className="text-xs uppercase tracking-widest text-gray-400 mb-2"
          >
            Uma coisa boa que aconteceu hoje
          </h3>

          <EditableField
            fieldKey="sono-coisa-boa"
            className="w-full min-h-8 text-sm"
          />
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
