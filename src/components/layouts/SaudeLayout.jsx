import Footer from "../Footer";
import Logo from "../Logo";
import Watermark from "../Watermark";
import EditableField from "../EditableField";

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
  return (
    <div className="printable-page bg-white font-sans text-gray-900 flex flex-col justify-between box-border select-none border-0 shadow-none rounded-none relative">
      {watermarkSrc && (
        <Watermark src={watermarkSrc} opacity={watermarkOpacity} />
      )}
      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Logo src={logo} />
          <h2
            className={`text-xl font-light tracking-widest uppercase`}
            style={{ fontFamily, color: customColors.primary || "#4a5568" }}
          >
            Registro de Saúde
          </h2>
        </div>
        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Peso
              </label>
              <EditableField
                fieldKey="saude-peso"
                className="border-b border-dotted border-gray-300 w-full h-5 text-sm"
                placeholder="kg"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Pressão
              </label>
              <EditableField
                fieldKey="saude-pressao"
                className="border-b border-dotted border-gray-300 w-full h-5 text-sm"
                placeholder="mmHg"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Humor
            </label>
            <EditableField
              fieldKey="saude-humor"
              className="border-b border-dotted border-gray-300 w-full h-5 text-sm"
              placeholder="..."
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Sono (horas)
            </label>
            <EditableField
              fieldKey="saude-sono"
              className="border-b border-dotted border-gray-300 w-full h-5 text-sm"
              placeholder="horas"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Exercício
            </label>
            <EditableField
              fieldKey="saude-exercicio"
              className="border-b border-dotted border-gray-300 w-full h-5 text-sm"
              placeholder="..."
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
