import Footer from "../Footer";
import Logo from "../Logo";
import Watermark from "../Watermark";
import EditableField from "../EditableField";

const CATEGORIAS = [
  "Hortifruti",
  "Mercearia",
  "Carnes e frios",
  "Limpeza",
  "Higiene",
  "Outros",
];

function ShoppingItem({ fieldKey }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <div className="w-3.5 h-3.5 rounded border border-gray-300 shrink-0" />
      <EditableField
        fieldKey={fieldKey}
        className="flex-1 min-h-6 border-b border-dotted border-gray-300 text-sm"
      />
    </div>
  );
}

function CategoryCard({ nome, primaryColor, index }) {
  return (
    <div className="p-4 rounded-xl border border-gray-200">
      <h3
        className="text-xs font-semibold uppercase tracking-[0.15em] mb-3"
        style={{ color: primaryColor }}
      >
        {nome}
      </h3>

      {[...Array(5)].map((_, i) => (
        <ShoppingItem key={i} fieldKey={`compras-${index}-${i}`} />
      ))}
    </div>
  );
}

export default function ComprasLayout({
  footerName,
  colorTheme = "classico",
  logo,
  footerType = "default",
  customColors = {},
  fontFamily = "sans-serif",
  watermarkSrc,
  watermarkOpacity,
}) {
  const primaryColor = customColors.primary || "#16A34A";
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
              Lista de Compras
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Organize as compras da casa por categoria.
            </p>
          </div>

          <div className="w-32">
            <span className="text-xs uppercase tracking-widest text-gray-400">
              Data
            </span>

            <EditableField
              fieldKey="compras-data"
              className="w-full min-h-7 border-b border-gray-300 text-right text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 flex-1">
          {CATEGORIAS.map((categoria, index) => (
            <CategoryCard
              key={categoria}
              nome={categoria}
              index={index}
              primaryColor={primaryColor}
            />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6 mt-6">
          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50">
            <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-2">
              Orçamento estimado
            </h3>

            <EditableField
              fieldKey="compras-orcamento"
              className="w-full min-h-7 text-sm border-b border-gray-300"
            />
          </div>

          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50">
            <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-2">
              Onde comprar
            </h3>

            <EditableField
              fieldKey="compras-mercado"
              className="w-full min-h-7 text-sm border-b border-gray-300"
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
