import Footer from "../Footer";
import Logo from "../Logo";
import Watermark from "../Watermark";
import EditableField from "../EditableField";

export default function FinancasLayout({
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
            Planejamento Financeiro
          </h2>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b pb-1">
              Receitas
            </h3>
            {[1, 2, 3, 4].map((i) => (
              <EditableField
                key={i}
                fieldKey={`financas-receita-${i}`}
                className="border-b border-dotted border-gray-300 w-full h-5 mb-2 text-sm"
                placeholder={`Fonte ${i}`}
              />
            ))}
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b pb-1">
              Despesas Fixas
            </h3>
            {[1, 2, 3, 4].map((i) => (
              <EditableField
                key={i}
                fieldKey={`financas-despesa-${i}`}
                className="border-b border-dotted border-gray-300 w-full h-5 mb-2 text-sm"
                placeholder={`Despesa ${i}`}
              />
            ))}
          </div>
          <div className="col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b pb-1">
              Despesas Variáveis
            </h3>
            {[1, 2, 3].map((i) => (
              <EditableField
                key={i}
                fieldKey={`financas-variavel-${i}`}
                className="border-b border-dotted border-gray-300 w-full h-5 mb-2 text-sm"
                placeholder={`Variável ${i}`}
              />
            ))}
          </div>
          <div className="col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b pb-1">
              Saldo
            </h3>
            <EditableField
              fieldKey="financas-saldo"
              className="border-b border-dotted border-gray-300 w-full h-5 text-sm"
              placeholder="Saldo final"
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
