import Footer from "../Footer";
import Logo from "../Logo";
import Watermark from "../Watermark";
import EditableField from "../EditableField";

const TRIMESTRES = [
  "1º Trimestre",
  "2º Trimestre",
  "3º Trimestre",
  "4º Trimestre",
];

function GoalCard({ titulo, index, primaryColor }) {
  return (
    <div className="p-4 rounded-xl border border-gray-200 bg-white">
      <h3
        className="text-sm font-semibold uppercase tracking-[0.2em] mb-4"
        style={{ color: primaryColor }}
      >
        {titulo}
      </h3>

      <div className="space-y-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="flex items-center gap-3">
            <div
              className="w-5 h-5 rounded-full border-2 shrink-0"
              style={{ borderColor: primaryColor }}
            />

            <EditableField
              fieldKey={`meta-${index}-${item}`}
              className="flex-1 min-h-7 border-b border-gray-300 text-sm"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MetasLayout({
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

      <div className="flex flex-col flex-1 p-8">
        <div className="flex items-center gap-4 mb-6 border-b border-gray-200 pb-4">
          <Logo src={logo} />

          <div className="flex-1">
            <h2
              className="text-2xl font-light tracking-[0.2em] uppercase"
              style={{ color: primaryColor }}
            >
              Mapa de Metas Anuais
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Defina objetivos claros e acompanhe sua evolução ao longo do ano.
            </p>
          </div>

          <div className="w-24">
            <span className="text-xs uppercase tracking-widest text-gray-400">
              Ano
            </span>

            <EditableField
              fieldKey="metas-ano"
              className="w-full min-h-7 border-b border-gray-300 text-right text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-[1fr_280px] gap-6 mb-6">
          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50">
            <h3
              className="text-sm font-semibold uppercase tracking-[0.2em] mb-4"
              style={{ color: primaryColor }}
            >
              Meu grande objetivo do ano
            </h3>

            <EditableField
              fieldKey="metas-objetivo-principal"
              className="w-full min-h-17.5 border-b border-gray-300 text-sm"
              multiline
            />
          </div>

          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50">
            <h3
              className="text-sm font-semibold uppercase tracking-[0.2em] mb-4"
              style={{ color: primaryColor }}
            >
              Indicadores de sucesso
            </h3>

            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-8 border-b border-dotted border-gray-300 mb-2"
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5 flex-1">
          {TRIMESTRES.map((trimestre, index) => (
            <GoalCard
              key={trimestre}
              titulo={trimestre}
              index={index}
              primaryColor={primaryColor}
            />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6 mt-6">
          <div className="p-4 rounded-xl border border-gray-200">
            <h3
              className="text-sm font-semibold uppercase tracking-[0.2em] mb-4"
              style={{ color: primaryColor }}
            >
              Recompensas e celebrações
            </h3>

            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-8 border-b border-dotted border-gray-300"
              />
            ))}
          </div>

          <div className="p-4 rounded-xl border border-gray-200">
            <h3
              className="text-sm font-semibold uppercase tracking-[0.2em] mb-4"
              style={{ color: primaryColor }}
            >
              Reflexão anual
            </h3>

            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-8 border-b border-dotted border-gray-300"
              />
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
