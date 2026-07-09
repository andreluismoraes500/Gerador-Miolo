import Footer from "../Footer";
import Logo from "../Logo";
import Watermark from "../Watermark";
import Background from "../Background";
import EditableField from "../EditableField";

const REFEICOES = [
  "Café da Manhã",
  "Lanche da Manhã",
  "Almoço",
  "Lanche da Tarde",
  "Jantar",
  "Ceia",
];

function WaterTracker({ primaryColor }) {
  return (
    <div className="flex gap-2">
      {[...Array(8)].map((_, index) => (
        <div
          key={index}
          className="w-6 h-6 rounded-full border-2"
          style={{ borderColor: primaryColor }}
        />
      ))}
    </div>
  );
}

export default function RefeicoesLayout({
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
  const primaryColor = customColors.primary || "#16a34a";
  const bgColor = customColors.background || "#ffffff";

  return (
    <div
      className="printable-page bg-white text-gray-900 flex flex-col justify-between relative"
      style={{
        backgroundColor: bgColor,
        fontFamily,
      }}
    >
      {backgroundSrc && <Background src={backgroundSrc} opacity={backgroundOpacity} />}
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
              Planejamento Alimentar
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Organize suas refeições e mantenha hábitos saudáveis.
            </p>
          </div>

          <div className="w-32">
            <span className="text-xs uppercase tracking-widest text-gray-400">
              Data
            </span>

            <EditableField
              fieldKey="refeicoes-data"
              className="w-full min-h-7 border-b border-gray-300 text-right text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-[1fr_260px] gap-6 flex-1">
          <div className="space-y-4">
            {REFEICOES.map((refeicao) => (
              <div
                key={refeicao}
                className="p-4 rounded-xl border border-gray-200"
              >
                <h3
                  className="text-sm font-semibold uppercase tracking-[0.15em] mb-3"
                  style={{ color: primaryColor }}
                >
                  {refeicao}
                </h3>

                <EditableField
                  fieldKey={`refeicao-${refeicao}`}
                  className="w-full min-h-9 border-b border-gray-300 text-sm"
                />
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-gray-200">
              <h3
                className="text-sm font-semibold uppercase tracking-[0.15em] mb-4"
                style={{ color: primaryColor }}
              >
                Hidratação
              </h3>

              <WaterTracker primaryColor={primaryColor} />

              <p className="text-xs text-gray-400 mt-3">
                Meta diária de 8 copos.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-gray-200">
              <h3
                className="text-sm font-semibold uppercase tracking-[0.15em] mb-4"
                style={{ color: primaryColor }}
              >
                Meta nutricional
              </h3>

              <EditableField
                fieldKey="refeicoes-meta"
                className="w-full min-h-17.5 border-b border-gray-300 text-sm"
                multiline
              />
            </div>

            <div className="p-4 rounded-xl border border-gray-200">
              <h3
                className="text-sm font-semibold uppercase tracking-[0.15em] mb-4"
                style={{ color: primaryColor }}
              >
                Lista de compras
              </h3>

              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 mb-3">
                  <div className="w-4 h-4 rounded border border-gray-300" />

                  <div className="flex-1 h-6 border-b border-dotted border-gray-300" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-xl border border-gray-200">
          <h3
            className="text-sm font-semibold uppercase tracking-[0.15em] mb-4"
            style={{ color: primaryColor }}
          >
            Observações
          </h3>

          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-8 border-b border-dotted border-gray-300"
            />
          ))}
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
