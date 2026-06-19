import Footer from "../Footer";
import Logo from "../Logo";
import Watermark from "../Watermark";
import EditableField from "../EditableField";

export default function GratidaoLayout({
  footerName,
  colorTheme = "classico",
  logo,
  footerType = "default",
  customColors = {},
  fontFamily = "sans-serif",
  watermarkSrc,
  watermarkOpacity,
}) {
  const primaryColor = customColors.primary || "#8B5CF6";
  const bgColor = customColors.background || "#FAFAF9";
  const cardColor = customColors.card || "#FFFFFF";

  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div
      className="printable-page relative flex flex-col justify-between overflow-hidden"
      style={{
        backgroundColor: bgColor,
        fontFamily,
      }}
    >
      {watermarkSrc && (
        <Watermark src={watermarkSrc} opacity={watermarkOpacity} />
      )}

      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-32 -right-32 h-64 w-64 rounded-full blur-3xl opacity-10"
          style={{ backgroundColor: primaryColor }}
        />

        <div
          className="absolute -bottom-24 -left-24 h-56 w-56 rounded-full blur-3xl opacity-10"
          style={{ backgroundColor: primaryColor }}
        />
      </div>

      <div className="relative flex flex-col flex-1 p-8 gap-6">
        <header className="flex items-center justify-between border-b border-gray-200 pb-4">
          <div className="flex items-center gap-4">
            <Logo src={logo} />

            <div>
              <h1
                className="text-2xl font-light tracking-[0.2em] uppercase"
                style={{ color: primaryColor }}
              >
                Diário de Gratidão
              </h1>

              <p className="text-sm text-gray-500 capitalize mt-1">{}</p>
            </div>
          </div>

          <div
            className="px-4 py-2 rounded-full text-xs font-medium"
            style={{
              backgroundColor: `${primaryColor}15`,
              color: primaryColor,
            }}
          >
            ✨ Cultive o positivo
          </div>
        </header>

        <main className="flex flex-col gap-5 flex-1 min-h-0">
          <section
            className="rounded-2xl p-5 shadow-sm border border-gray-100"
            style={{ backgroundColor: cardColor }}
          >
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">
              🌷 Coisas boas de hoje
            </h3>

            <div className="space-y-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <span
                    className="flex items-center justify-center w-7 h-7 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: `${primaryColor}15`,
                      color: primaryColor,
                    }}
                  >
                    {i}
                  </span>

                  <EditableField
                    fieldKey={`gratidao-${i}`}
                    className="flex-1 border-b border-dashed border-gray-300 h-8 text-sm"
                    placeholder=""
                  />
                </div>
              ))}
            </div>
          </section>

          <section
            className="flex flex-col flex-[1.5] rounded-2xl p-5 shadow-sm border border-gray-100"
            style={{ backgroundColor: cardColor }}
          >
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">
              💭 Reflexão do dia
            </h3>

            <EditableField
              fieldKey="gratidao-reflexao"
              className="flex-1 border border-dashed border-gray-300 rounded-lg p-4 text-sm w-full"
              placeholder=""
            />
          </section>

          <section
            className="flex flex-col flex-1 rounded-2xl p-5 shadow-sm border border-gray-100"
            style={{ backgroundColor: cardColor }}
          >
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">
              🎯 Intenção para amanhã
            </h3>

            <EditableField
              fieldKey="gratidao-meta"
              className="flex-1 border border-dashed border-gray-300 rounded-lg p-4 text-sm w-full"
              placeholder=""
            />
          </section>
        </main>
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
