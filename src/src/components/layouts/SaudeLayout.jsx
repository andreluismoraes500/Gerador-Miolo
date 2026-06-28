import Footer from "../Footer";
import Logo from "../Logo";
import Watermark from "../Watermark";
import EditableField from "../EditableField";

function HealthCard({ icon, title, fieldKey, placeholder, primaryColor }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl text-lg"
          style={{
            backgroundColor: `${primaryColor}15`,
          }}
        >
          {icon}
        </div>

        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      </div>

      <EditableField
        fieldKey={fieldKey}
        className="w-full border-b border-dashed border-gray-300 pb-2 text-sm outline-none transition focus:border-gray-500"
        placeholder={placeholder}
      />
    </div>
  );
}

export default function SaudeLayout({
  footerName,
  colorTheme = "classico",
  logo,
  footerType = "default",
  customColors = {},
  fontFamily = "sans-serif",
  watermarkSrc,
  watermarkOpacity,
}) {
  const primaryColor = customColors.primary || "#14B8A6";
  const bgColor = customColors.background || "#F8FAFC";
  const cardColor = customColors.card || "#FFFFFF";

  const today = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div
      className="printable-page relative flex flex-col overflow-hidden"
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
          className="absolute -top-24 -right-24 h-56 w-56 rounded-full opacity-10 blur-3xl"
          style={{ backgroundColor: primaryColor }}
        />

        <div
          className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full opacity-10 blur-3xl"
          style={{ backgroundColor: primaryColor }}
        />
      </div>

      <div className="relative flex flex-1 flex-col p-8 gap-6">
        <div className="flex items-center justify-between border-b border-gray-200 pb-5">
          <div className="flex items-center gap-4">
            <Logo src={logo} />

            <div>
              <h1
                className="text-2xl font-light uppercase tracking-[0.2em]"
                style={{ color: primaryColor }}
              >
                Registro de Saúde
              </h1>

              <p className="mt-1 text-sm text-gray-500"></p>
            </div>
          </div>

          <div
            className="rounded-full px-4 py-2 text-xs font-medium"
            style={{
              backgroundColor: `${primaryColor}15`,
              color: primaryColor,
            }}
          >
            ❤️ Cuide de você
          </div>
        </div>

        <main className="flex flex-1 flex-col gap-5">
          <div className="grid grid-cols-2 gap-4">
            <HealthCard
              icon="⚖️"
              title="Peso"
              fieldKey="saude-peso"
              placeholder=""
              primaryColor={primaryColor}
            />

            <HealthCard
              icon="🩺"
              title="Pressão"
              fieldKey="saude-pressao"
              placeholder=""
              primaryColor={primaryColor}
            />

            <HealthCard
              icon="😴"
              title="Sono"
              fieldKey="saude-sono"
              placeholder=""
              primaryColor={primaryColor}
            />

            <HealthCard
              icon="🏃"
              title="Exercício"
              fieldKey="saude-exercicio"
              placeholder=""
              primaryColor={primaryColor}
            />
          </div>

          <section
            className="flex flex-col flex-1 rounded-2xl border border-gray-100 p-5 shadow-sm"
            style={{ backgroundColor: cardColor }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl text-lg"
                style={{
                  backgroundColor: `${primaryColor}15`,
                }}
              >
                😊
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700">
                  Humor e Bem-estar
                </h3>

                <p className="text-xs text-gray-400">
                  Como você se sentiu hoje?
                </p>
              </div>
            </div>

            <EditableField
              fieldKey="saude-humor"
              className="flex-1 w-full rounded-xl border border-dashed border-gray-300 p-4 text-sm outline-none focus:border-gray-500"
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
