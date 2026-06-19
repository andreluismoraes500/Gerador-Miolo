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
            />
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
