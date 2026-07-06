import Footer from "../Footer";
import Logo from "../Logo";
import Watermark from "../Watermark";
import EditableField from "../EditableField";

function ItineraryRow({ index }) {
  return (
    <div className="grid grid-cols-[70px_1fr] gap-3 items-start py-2 border-b border-dotted border-gray-200 last:border-0">
      <EditableField
        fieldKey={`viagem-dia-${index}`}
        className="text-xs text-gray-500 border-b border-dashed border-gray-300"
      />
      <EditableField
        fieldKey={`viagem-atividade-${index}`}
        className="text-sm min-h-6 border-b border-gray-200"
      />
    </div>
  );
}

function ChecklistItem({ fieldKey }) {
  return (
    <div className="flex items-center gap-2 mb-2.5">
      <div className="w-3.5 h-3.5 rounded border border-gray-300 shrink-0" />
      <EditableField
        fieldKey={fieldKey}
        className="flex-1 min-h-6 border-b border-dotted border-gray-300 text-sm"
      />
    </div>
  );
}

function BudgetRow({ index }) {
  return (
    <div className="grid grid-cols-[1fr_80px] gap-3 items-center py-1.5 border-b border-dotted border-gray-200 last:border-0">
      <EditableField
        fieldKey={`viagem-gasto-item-${index}`}
        className="text-xs border-b border-gray-200"
      />
      <EditableField
        fieldKey={`viagem-gasto-valor-${index}`}
        className="text-xs text-right border-b border-gray-200"
      />
    </div>
  );
}

export default function ViagemLayout({
  footerName,
  colorTheme = "classico",
  logo,
  footerType = "default",
  customColors = {},
  fontFamily = "sans-serif",
  watermarkSrc,
  watermarkOpacity,
}) {
  const primaryColor = customColors.primary || "#0D9488";
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

      <div className="flex flex-col flex-1 p-8">
        <div className="flex items-center gap-4 mb-6 border-b border-gray-200 pb-4">
          <Logo src={logo} />

          <div className="flex-1">
            <h2
              className="text-2xl font-light tracking-[0.2em] uppercase"
              style={{ color: primaryColor }}
            >
              Planner de Viagem
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Roteiro, mala e orçamento em um só lugar.
            </p>
          </div>

          <div className="w-36">
            <span className="text-xs uppercase tracking-widest text-gray-400">
              Destino
            </span>

            <EditableField
              fieldKey="viagem-destino"
              className="w-full min-h-7 border-b border-gray-300 text-right text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-3 rounded-xl border border-gray-200">
            <span className="text-[10px] uppercase tracking-widest text-gray-400">
              Data de ida
            </span>
            <EditableField
              fieldKey="viagem-data-ida"
              className="w-full min-h-6 text-sm border-b border-gray-200"
            />
          </div>
          <div className="p-3 rounded-xl border border-gray-200">
            <span className="text-[10px] uppercase tracking-widest text-gray-400">
              Data de volta
            </span>
            <EditableField
              fieldKey="viagem-data-volta"
              className="w-full min-h-6 text-sm border-b border-gray-200"
            />
          </div>
          <div className="p-3 rounded-xl border border-gray-200">
            <span className="text-[10px] uppercase tracking-widest text-gray-400">
              Hospedagem
            </span>
            <EditableField
              fieldKey="viagem-hospedagem"
              className="w-full min-h-6 text-sm border-b border-gray-200"
            />
          </div>
        </div>

        <div className="grid grid-cols-[1fr_240px] gap-6 flex-1">
          <div className="p-4 rounded-xl border border-gray-200">
            <h3
              className="text-sm font-semibold uppercase tracking-[0.15em] mb-3"
              style={{ color: primaryColor }}
            >
              Roteiro dia a dia
            </h3>

            {[...Array(6)].map((_, index) => (
              <ItineraryRow key={index} index={index} />
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <div className="p-4 rounded-xl border border-gray-200">
              <h3
                className="text-sm font-semibold uppercase tracking-[0.15em] mb-3"
                style={{ color: primaryColor }}
              >
                Checklist da mala
              </h3>

              <ChecklistItem fieldKey="viagem-mala-1" />
              <ChecklistItem fieldKey="viagem-mala-2" />
              <ChecklistItem fieldKey="viagem-mala-3" />
              <ChecklistItem fieldKey="viagem-mala-4" />
              <ChecklistItem fieldKey="viagem-mala-5" />
            </div>

            <div className="p-4 rounded-xl border border-gray-200 flex-1">
              <h3
                className="text-sm font-semibold uppercase tracking-[0.15em] mb-3"
                style={{ color: primaryColor }}
              >
                Orçamento
              </h3>

              {[...Array(5)].map((_, index) => (
                <BudgetRow key={index} index={index} />
              ))}
            </div>
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
