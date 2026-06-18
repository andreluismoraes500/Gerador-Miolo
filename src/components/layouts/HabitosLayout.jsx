import Footer from "../Footer";
import Logo from "../Logo";
import Watermark from "../Watermark";

const DIAS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

export default function HabitosLayout({
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
            Rastreador de Hábitos
          </h2>
        </div>
        <div className="flex-1 space-y-4">
          {["Hábito 1", "Hábito 2", "Hábito 3", "Hábito 4", "Hábito 5"].map(
            (habito, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-xs font-medium w-20 text-gray-600">
                  {habito}
                </span>
                <div className="flex gap-1">
                  {DIAS.map((dia) => (
                    <div key={dia} className="flex flex-col items-center">
                      <span className="text-[8px] text-gray-400">{dia}</span>
                      <div className="w-4 h-4 border border-gray-300 rounded-sm bg-white"></div>
                    </div>
                  ))}
                </div>
              </div>
            ),
          )}
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
