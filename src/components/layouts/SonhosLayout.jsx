import Footer from "../Footer";
import Logo from "../Logo";
import Watermark from "../Watermark";
import EditableField from "../EditableField";

export default function SonhosLayout({
  footerName,
  colorTheme = "classico",
  logo,
  footerType = "default",
  customColors = {},
  fontFamily = "sans-serif",
  watermarkSrc,
  watermarkOpacity,
}) {
  const primaryColor = customColors.primary || "#7C3AED";
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

      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-20 -right-20 h-52 w-52 rounded-full opacity-10 blur-3xl"
          style={{ backgroundColor: primaryColor }}
        />
      </div>

      <div className="relative flex flex-col flex-1 p-8">
        <div className="flex items-center gap-4 mb-6 border-b border-gray-200 pb-4">
          <Logo src={logo} />

          <div className="flex-1">
            <h2
              className="text-2xl font-light tracking-[0.2em] uppercase"
              style={{ color: primaryColor }}
            >
              Diário de Sonhos
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Registre o que sua mente criou enquanto você dormia.
            </p>
          </div>

          <div className="w-32">
            <span className="text-xs uppercase tracking-widest text-gray-400">
              Data
            </span>

            <EditableField
              fieldKey="sonhos-data"
              className="w-full min-h-7 border-b border-gray-300 text-right text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="p-3 rounded-xl border border-gray-200">
            <span className="text-[10px] uppercase tracking-widest text-gray-400">
              Como acordei
            </span>
            <EditableField
              fieldKey="sonhos-humor"
              className="w-full min-h-6 text-sm border-b border-gray-200"
            />
          </div>
          <div className="p-3 rounded-xl border border-gray-200">
            <span className="text-[10px] uppercase tracking-widest text-gray-400">
              Foi um sonho recorrente?
            </span>
            <EditableField
              fieldKey="sonhos-recorrente"
              className="w-full min-h-6 text-sm border-b border-gray-200"
            />
          </div>
        </div>

        <div className="p-5 rounded-xl border border-gray-200 flex-1">
          <h3
            className="text-sm font-semibold uppercase tracking-[0.15em] mb-3"
            style={{ color: primaryColor }}
          >
            O que aconteceu no sonho
          </h3>

          <EditableField
            fieldKey="sonhos-descricao"
            className="w-full h-full min-h-40 text-sm leading-relaxed"
            multiline
          />
        </div>

        <div className="grid grid-cols-2 gap-6 mt-5">
          <div className="p-4 rounded-xl border border-gray-200">
            <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-3">
              Símbolos e palavras-chave
            </h3>

            <div className="flex flex-wrap gap-2">
              {[...Array(6)].map((_, i) => (
                <EditableField
                  key={i}
                  fieldKey={`sonhos-simbolo-${i}`}
                  className="min-w-16 min-h-6 px-2 rounded-full border border-dashed border-gray-300 text-xs text-center"
                />
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl border border-gray-200">
            <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-2">
              Possível significado / reflexão
            </h3>

            <EditableField
              fieldKey="sonhos-reflexao"
              className="w-full min-h-14 text-sm"
              multiline
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
