import Footer from "../Footer";
import Logo from "../Logo";
import Watermark from "../Watermark";
import EditableField from "../EditableField";

function MoodScale({ title, fieldKey }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs text-gray-600">{title}</span>

      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((item) => (
          <EditableField
            key={`${fieldKey}-${item}`}
            fieldKey={`${fieldKey}-${item}`}
            className="w-5 h-5 rounded-full border border-gray-400 text-center text-[10px] flex items-center justify-center"
            placeholder=""
          />
        ))}
      </div>
    </div>
  );
}

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
<<<<<<< HEAD
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
=======
  const primaryColor = customColors.primary || "#4f46e5";
  const bgColor = customColors.background || "#ffffff";

  return (
    <div
      className="printable-page bg-white text-gray-900 flex flex-col justify-between relative"
>>>>>>> 03bff7f2c9f060697668c5dce9ad7d6eac2e9ca8
      style={{
        backgroundColor: bgColor,
        fontFamily,
      }}
    >
      {watermarkSrc && (
        <Watermark src={watermarkSrc} opacity={watermarkOpacity} />
      )}

<<<<<<< HEAD
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

              <p className="text-sm text-gray-500 capitalize mt-1">{today}</p>
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

        <main className="flex flex-col gap-5 flex-1">
          <section
            className="rounded-2xl p-5 shadow-sm border border-gray-100"
            style={{ backgroundColor: cardColor }}
          >
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">
              🌷 3 coisas boas de hoje
            </h3>

            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
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
                    placeholder="Escreva algo especial..."
                  />
                </div>
              ))}
            </div>
          </section>

          <section
            className="rounded-2xl p-5 shadow-sm border border-gray-100"
            style={{ backgroundColor: cardColor }}
          >
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">
              💭 Reflexão do dia
            </h3>

            <EditableField
              fieldKey="gratidao-reflexao"
              className="border border-dashed border-gray-300 rounded-lg p-3 min-h-24 text-sm w-full"
              placeholder="Como você se sentiu hoje?"
            />
          </section>

          <section
            className="rounded-2xl p-5 shadow-sm border border-gray-100"
            style={{ backgroundColor: cardColor }}
          >
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">
              🎯 Intenção para amanhã
            </h3>

            <EditableField
              fieldKey="gratidao-meta"
              className="border border-dashed border-gray-300 rounded-lg p-3 min-h-16 text-sm w-full"
              placeholder="Qual será seu próximo passo?"
=======
      <div className="flex-1 p-8">
        <div className="flex items-center gap-4 mb-6 border-b pb-4">
          <Logo src={logo} />

          <div>
            <h2
              className="text-2xl font-light tracking-[0.25em] uppercase"
              style={{ color: primaryColor }}
            >
              Diário de Gratidão
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Cultive pequenos momentos de felicidade todos os dias.
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="w-2/3">
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">
              Como estou me sentindo hoje?
            </p>

            <EditableField
              fieldKey="gratidao-sentimento"
              className="w-full h-8 text-sm"
              placeholder=""
            />
          </div>

          <div className="text-sm text-gray-500"></div>
        </div>

        <div className="mb-6">
          <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-3">
            Minha intenção para hoje
          </h3>

          <EditableField
            fieldKey="gratidao-intencao"
            className="w-full h-8 text-sm"
            placeholder=""
          />
        </div>

        <div className="mb-6">
          <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-3">
            Sou grato(a) por...
          </h3>

          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <EditableField
                key={i}
                fieldKey={`gratidao-item-${i}`}
                className="w-full h-8 text-sm"
                placeholder={`${i}. `}
              />
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-3">
            Melhor momento do dia
          </h3>

          <EditableField
            fieldKey="gratidao-melhor-momento"
            className="w-full min-h-15 text-sm"
            placeholder=""
          />
        </div>

        <div className="mb-6 p-4 rounded-xl bg-gray-50 border border-gray-200">
          <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-4">
            Check-in emocional
          </h3>

          <div className="space-y-4">
            <MoodScale title="Energia" fieldKey="gratidao-energia" />

            <MoodScale title="Humor" fieldKey="gratidao-humor" />

            <MoodScale title="Calma" fieldKey="gratidao-calma" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-3">
              O que aprendi hoje?
            </h3>

            <EditableField
              fieldKey="gratidao-aprendizado"
              className="w-full min-h-15 text-sm"
              placeholder=""
            />
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-3">
              Meu foco para amanhã
            </h3>

            <EditableField
              fieldKey="gratidao-amanha"
              className="w-full min-h-15 text-sm"
              placeholder=""
>>>>>>> 03bff7f2c9f060697668c5dce9ad7d6eac2e9ca8
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
