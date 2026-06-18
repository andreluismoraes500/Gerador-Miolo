import Footer from "../Footer";
import Logo from "../Logo";
import Watermark from "../Watermark";
import EditableField from "../EditableField";

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
  const primaryColor = customColors.primary || "#4a5568";
  const bgColor = customColors.background || "#ffffff";
  const trimestres = [
    "1º Trimestre",
    "2º Trimestre",
    "3º Trimestre",
    "4º Trimestre",
  ];

  return (
    <div
      className="printable-page bg-white font-sans text-gray-900 flex flex-col justify-between box-border select-none border-0 shadow-none rounded-none relative"
      style={{ backgroundColor: bgColor, fontFamily }}
    >
      {watermarkSrc && (
        <Watermark src={watermarkSrc} opacity={watermarkOpacity} />
      )}
      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Logo src={logo} />
          <h2
            className="text-xl font-light tracking-widest uppercase"
            style={{ fontFamily, color: primaryColor }}
          >
            Mapa de Metas Anuais
          </h2>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-4">
          {trimestres.map((tri, idx) => (
            <div key={idx}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b pb-1">
                {tri}
              </h3>
              <EditableField
                fieldKey={`meta-${tri}-1`}
                className="border-b border-dotted border-gray-300 w-full h-5 mb-2 text-sm"
                placeholder="Meta 1"
              />
              <EditableField
                fieldKey={`meta-${tri}-2`}
                className="border-b border-dotted border-gray-300 w-full h-5 mb-2 text-sm"
                placeholder="Meta 2"
              />
              <EditableField
                fieldKey={`meta-${tri}-3`}
                className="border-b border-dotted border-gray-300 w-full h-5 text-sm"
                placeholder="Meta 3"
              />
            </div>
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
