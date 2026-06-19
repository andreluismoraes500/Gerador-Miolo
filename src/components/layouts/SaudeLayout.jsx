import Footer from "../Footer";
import Logo from "../Logo";
import Watermark from "../Watermark";
import EditableField from "../EditableField";

const FIELD_CLASS =
  "border-b border-dotted border-gray-300 w-full h-6 text-sm outline-none focus:border-gray-500 transition";

function Field({ label, fieldKey, placeholder, type = "text" }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
        {label}
      </label>

      <EditableField
        fieldKey={fieldKey}
        type={type}
        className={FIELD_CLASS}
        placeholder={placeholder}
      />
    </div>
  );
}

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
  const primaryColor = customColors.primary || "#4a5568";
  const bgColor = customColors.background || "#ffffff";

  return (
    <div
      className="relative flex flex-col min-h-full bg-white text-gray-900 print:shadow-none print:border-0 select-none"
      style={{ backgroundColor: bgColor, fontFamily }}
    >
      {watermarkSrc && (
        <Watermark src={watermarkSrc} opacity={watermarkOpacity} />
      )}

      {/* HEADER */}
      <header className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
        <Logo src={logo} />

        <div className="flex flex-col">
          <h2
            className="text-lg font-medium tracking-widest uppercase"
            style={{ color: primaryColor }}
          >
            Registro de Saúde
          </h2>
          <span className="text-[11px] text-gray-400">
            Acompanhamento diário
          </span>
        </div>
      </header>

      {/* CONTENT */}
      <main className="flex-1 px-6 py-5 space-y-6">
        {/* GRID PRINCIPAL */}
        <div className="grid grid-cols-2 gap-5">
          <Field label="Peso" fieldKey="saude-peso" placeholder="kg" />
          <Field label="Pressão" fieldKey="saude-pressao" placeholder="" />
          <Field label="Sono (horas)" fieldKey="saude-sono" placeholder="" />
          <Field label="Exercício" fieldKey="saude-exercicio" placeholder="" />
        </div>

        {/* BLOCO DESTACADO */}
        <div className="p-4 border border-gray-100 rounded-md bg-gray-50/40">
          <Field
            label="Humor"
            fieldKey="saude-humor"
            placeholder="Como você se sentiu hoje?"
          />
        </div>
      </main>

      {/* FOOTER */}
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
