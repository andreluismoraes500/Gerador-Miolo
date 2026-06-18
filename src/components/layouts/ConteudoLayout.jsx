import Footer from "../Footer";
import Logo from "../Logo";
import Watermark from "../Watermark";
import EditableField from "../EditableField";

export default function ConteudoLayout({
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
            Planner de Conteúdo
          </h2>
        </div>
        <div className="flex-1 space-y-2">
          {[
            "Segunda",
            "Terça",
            "Quarta",
            "Quinta",
            "Sexta",
            "Sábado",
            "Domingo",
          ].map((dia, idx) => (
            <div
              key={idx}
              className="grid grid-cols-5 gap-1 items-center border-b border-gray-100 pb-1"
            >
              <span className="text-xs font-bold text-gray-500">{dia}</span>
              <EditableField
                fieldKey={`conteudo-${dia}-tema`}
                className="border-b border-dotted border-gray-300 text-sm col-span-1"
                placeholder="Tema"
              />
              <EditableField
                fieldKey={`conteudo-${dia}-hashtag`}
                className="border-b border-dotted border-gray-300 text-sm col-span-1"
                placeholder="Hashtags"
              />
              <EditableField
                fieldKey={`conteudo-${dia}-midia`}
                className="border-b border-dotted border-gray-300 text-sm col-span-1"
                placeholder="Mídia"
              />
              <EditableField
                fieldKey={`conteudo-${dia}-obs`}
                className="border-b border-dotted border-gray-300 text-sm col-span-1"
                placeholder="Obs"
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
