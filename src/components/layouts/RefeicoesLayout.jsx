import Footer from "../Footer";
import Logo from "../Logo";
import Watermark from "../Watermark";
import EditableField from "../EditableField";

export default function RefeicoesLayout({
  footerName,
  colorTheme = "classico",
  logo,
  footerType = "default",
  customColors = {},
  fontFamily = "sans-serif",
  watermarkSrc,
  watermarkOpacity,
}) {
  const refeicoes = ["Café da Manhã", "Almoço", "Lanche", "Jantar"];
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
            Agenda de Refeições
          </h2>
        </div>
        <div className="flex-1 space-y-4">
          {refeicoes.map((ref, idx) => (
            <div key={idx}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                {ref}
              </h3>
              <EditableField
                fieldKey={`refeicao-${ref}`}
                className="border-b border-dotted border-gray-300 w-full h-6 text-sm"
                placeholder="O que comer?"
              />
            </div>
          ))}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Receita Rápida
            </h3>
            <EditableField
              fieldKey="refeicao-receita"
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
