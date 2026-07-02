import Footer from "../Footer";
import Logo from "../Logo";
import Watermark from "../Watermark";
import EditableField from "../EditableField";

const DIAS = [
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
  "Domingo",
];

const COLUNAS = ["Tema", "Plataforma", "Formato", "Objetivo"];

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
  const primaryColor = customColors.primary || "#7c3aed";
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
              Planner de Conteúdo
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Organize sua estratégia e mantenha consistência nas publicações.
            </p>
          </div>

          <div className="w-40">
            <span className="text-xs uppercase tracking-widest text-gray-400">
              Semana de
            </span>

            <EditableField
              fieldKey="conteudo-periodo"
              className="w-full min-h-[28px] border-b border-gray-300 text-sm text-right"
            />
          </div>
        </div>

        <div className="grid grid-cols-[120px_repeat(4,1fr)] gap-3 mb-3">
          <div />

          {COLUNAS.map((coluna) => (
            <div
              key={coluna}
              className="text-xs uppercase tracking-widest text-gray-400 font-medium"
            >
              {coluna}
            </div>
          ))}
        </div>

        <div className="space-y-3 flex-1">
          {DIAS.map((dia) => (
            <div
              key={dia}
              className="grid grid-cols-[120px_repeat(4,1fr)] gap-3 items-start"
            >
              <div
                className="text-sm font-medium pt-2"
                style={{ color: primaryColor }}
              >
                {dia}
              </div>

              <EditableField
                fieldKey={`conteudo-${dia}-tema`}
                className="min-h-[36px] border-b border-gray-300 text-sm"
              />

              <EditableField
                fieldKey={`conteudo-${dia}-plataforma`}
                className="min-h-[36px] border-b border-gray-300 text-sm"
              />

              <EditableField
                fieldKey={`conteudo-${dia}-formato`}
                className="min-h-[36px] border-b border-gray-300 text-sm"
              />

              <EditableField
                fieldKey={`conteudo-${dia}-objetivo`}
                className="min-h-[36px] border-b border-gray-300 text-sm"
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6 mt-8">
          <div className="p-4 rounded-xl border border-gray-200">
            <h3
              className="text-sm font-semibold uppercase tracking-[0.2em] mb-4"
              style={{ color: primaryColor }}
            >
              Banco de ideias
            </h3>

            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-8 border-b border-dotted border-gray-300"
              />
            ))}
          </div>

          <div className="p-4 rounded-xl border border-gray-200">
            <h3
              className="text-sm font-semibold uppercase tracking-[0.2em] mb-4"
              style={{ color: primaryColor }}
            >
              Métricas para acompanhar
            </h3>

            {[
              "Alcance",
              "Curtidas",
              "Comentários",
              "Compartilhamentos",
              "Cliques",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 mb-3">
                <div className="w-4 h-4 rounded border border-gray-300" />

                <span className="text-sm text-gray-600">{item}</span>
              </div>
            ))}
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
