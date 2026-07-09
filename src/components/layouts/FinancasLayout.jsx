import Footer from "../Footer";
import Logo from "../Logo";
import Watermark from "../Watermark";
import Background from "../Background";
import EditableField from "../EditableField";

function FinancialLine({ fieldKey }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <EditableField
          fieldKey={`${fieldKey}-descricao`}
          className="w-full min-h-7 border-b border-gray-300 text-sm"
        />
      </div>

      <div className="w-24">
        <EditableField
          fieldKey={`${fieldKey}-valor`}
          className="w-full min-h-7 border-b border-gray-300 text-right text-sm"
        />
      </div>
    </div>
  );
}

export default function FinancasLayout({
  footerName,
  colorTheme = "classico",
  logo,
  footerType = "default",
  customColors = {},
  fontFamily = "sans-serif",
  watermarkSrc,
  watermarkOpacity,
  backgroundSrc,
  backgroundOpacity,
}) {
  const primaryColor = customColors.primary || "#16a34a";
  const bgColor = customColors.background || "#ffffff";

  return (
    <div
      className="printable-page bg-white text-gray-900 flex flex-col justify-between relative"
      style={{
        backgroundColor: bgColor,
        fontFamily,
      }}
    >
      {backgroundSrc && <Background src={backgroundSrc} opacity={backgroundOpacity} />}
      {watermarkSrc && (
        <Watermark src={watermarkSrc} opacity={watermarkOpacity} />
      )}

      <div className="flex flex-col flex-1 p-8">
        <div className="flex items-center gap-4 mb-6 border-b border-gray-200 pb-4">
          <Logo src={logo} />

          <div className="flex-1">
            <h2
              className="text-2xl font-light tracking-[0.2em] uppercase"
              style={{ color: primaryColor }}
            >
              Planejamento Financeiro
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Organize suas finanças e alcance seus objetivos.
            </p>
          </div>

          <div className="w-32">
            <span className="text-xs uppercase tracking-widest text-gray-400">
              Mês
            </span>

            <EditableField
              fieldKey="financas-mes"
              className="w-full min-h-7 border-b border-gray-300 text-right text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { title: "Receitas", key: "resumo-receitas" },
            { title: "Despesas", key: "resumo-despesas" },
            { title: "Saldo", key: "resumo-saldo" },
          ].map((item) => (
            <div
              key={item.key}
              className="p-4 rounded-xl border border-gray-200 bg-gray-50"
            >
              <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-3">
                {item.title}
              </h3>

              <EditableField
                fieldKey={item.key}
                className="w-full min-h-8 text-lg font-medium border-b border-gray-300"
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6 flex-1">
          <div className="p-4 rounded-xl border border-gray-200">
            <h3
              className="text-sm font-semibold uppercase tracking-widest mb-4"
              style={{ color: primaryColor }}
            >
              Receitas
            </h3>

            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <FinancialLine key={i} fieldKey={`financas-receita-${i}`} />
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl border border-gray-200">
            <h3
              className="text-sm font-semibold uppercase tracking-widest mb-4"
              style={{ color: primaryColor }}
            >
              Despesas Fixas
            </h3>

            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <FinancialLine key={i} fieldKey={`financas-fixa-${i}`} />
              ))}
            </div>
          </div>

          <div className="col-span-2 p-4 rounded-xl border border-gray-200">
            <h3
              className="text-sm font-semibold uppercase tracking-widest mb-4"
              style={{ color: primaryColor }}
            >
              Despesas Variáveis
            </h3>

            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <FinancialLine key={i} fieldKey={`financas-variavel-${i}`} />
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl border border-gray-200">
            <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-3">
              Meta financeira do mês
            </h3>

            <EditableField
              fieldKey="financas-meta"
              className="w-full min-h-20 border-b border-gray-300 text-sm"
              multiline
            />
          </div>

          <div className="p-4 rounded-xl border border-gray-200">
            <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-3">
              Observações
            </h3>

            <EditableField
              fieldKey="financas-observacoes"
              className="w-full min-h-20 border-b border-gray-300 text-sm"
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
