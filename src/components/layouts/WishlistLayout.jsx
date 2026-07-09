import Footer from "../Footer";
import Logo from "../Logo";
import Watermark from "../Watermark";
import Background from "../Background";
import EditableField from "../EditableField";

function WishRow({ index, primaryColor }) {
  return (
    <div className="grid grid-cols-[1fr_90px_70px_1fr] gap-3 items-center py-2.5 border-b border-dotted border-gray-200 last:border-0">
      <EditableField
        fieldKey={`wishlist-item-${index}`}
        className="text-sm border-b border-gray-200"
      />
      <EditableField
        fieldKey={`wishlist-preco-${index}`}
        className="text-xs text-center border-b border-gray-200"
      />
      <div className="flex justify-center gap-1">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="w-2.5 h-2.5 rounded-full border"
            style={{ borderColor: primaryColor }}
          />
        ))}
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{ width: "0%", backgroundColor: primaryColor }}
          />
        </div>
        <span className="text-[10px] text-gray-400">guardado</span>
      </div>
    </div>
  );
}

export default function WishlistLayout({
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
  const primaryColor = customColors.primary || "#DB2777";
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
              Wishlist &amp; Metas de Compra
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              O que você quer conquistar e quanto falta para chegar lá.
            </p>
          </div>

          <div className="w-24">
            <span className="text-xs uppercase tracking-widest text-gray-400">
              Ano
            </span>

            <EditableField
              fieldKey="wishlist-ano"
              className="w-full min-h-7 border-b border-gray-300 text-right text-sm"
            />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-gray-200 flex-1">
          <div className="grid grid-cols-[1fr_90px_70px_1fr] gap-3 mb-1">
            <span className="text-[10px] uppercase text-gray-400">Item</span>
            <span className="text-[10px] uppercase text-gray-400 text-center">
              Preço
            </span>
            <span className="text-[10px] uppercase text-gray-400 text-center">
              Prioridade
            </span>
            <span className="text-[10px] uppercase text-gray-400">
              Progresso
            </span>
          </div>

          {[...Array(9)].map((_, index) => (
            <WishRow key={index} index={index} primaryColor={primaryColor} />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6 mt-6">
          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50">
            <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-2">
              Guardando dinheiro para
            </h3>

            <EditableField
              fieldKey="wishlist-destaque"
              className="w-full min-h-7 text-sm border-b border-gray-300"
            />
          </div>

          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50">
            <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-2">
              Quanto já economizei este mês
            </h3>

            <EditableField
              fieldKey="wishlist-economia-mes"
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
