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
  const styleColor = customColors.primary || "#4a5568";

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
            style={{ fontFamily, color: styleColor }}
          >
            Diário de Gratidão
          </h2>
        </div>
        <div className="space-y-4 flex-1">
          <div>
            <p className="text-sm font-medium text-gray-600">
              Data: {new Date().toLocaleDateString("pt-BR")}
            </p>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              3 Coisas Boas Hoje
            </h3>
            {[1, 2, 3].map((i) => (
              <EditableField
                key={i}
                fieldKey={`gratidao-${i}`}
                className="border-b border-dotted border-gray-300 w-full h-6 mb-2 text-sm"
                placeholder={`#${i}`}
              />
            ))}
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Reflexão do Dia
            </h3>
            <EditableField
              fieldKey="gratidao-reflexao"
              className="border-b border-dotted border-gray-300 w-full h-6 text-sm"
              placeholder="..."
            />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Meta para Amanhã
            </h3>
            <EditableField
              fieldKey="gratidao-meta"
              className="border-b border-dotted border-gray-300 w-full h-6 text-sm"
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
