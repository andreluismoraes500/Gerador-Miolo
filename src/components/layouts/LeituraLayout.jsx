import Footer from "../Footer";
import Logo from "../Logo";
import Watermark from "../Watermark";
import Background from "../Background";
import EditableField from "../EditableField";

function BookRow({ index, primaryColor }) {
  return (
    <div className="grid grid-cols-[1fr_110px_60px_70px] gap-3 items-center py-2 border-b border-dotted border-gray-200 last:border-0">
      <EditableField
        fieldKey={`leitura-titulo-${index}`}
        className="text-sm border-b border-gray-200"
      />
      <EditableField
        fieldKey={`leitura-genero-${index}`}
        className="text-xs text-center border-b border-gray-200"
      />
      <EditableField
        fieldKey={`leitura-paginas-${index}`}
        className="text-xs text-center border-b border-gray-200"
      />
      <div className="flex justify-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <div
            key={n}
            className="w-2.5 h-2.5 rounded-full border"
            style={{ borderColor: primaryColor }}
          />
        ))}
      </div>
    </div>
  );
}

export default function LeituraLayout({
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
  const primaryColor = customColors.primary || "#B45309";
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
              Controle de Leitura
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Acompanhe seus livros lidos, em andamento e desejados.
            </p>
          </div>

          <div className="w-24">
            <span className="text-xs uppercase tracking-widest text-gray-400">
              Ano
            </span>

            <EditableField
              fieldKey="leitura-ano"
              className="w-full min-h-7 border-b border-gray-300 text-right text-sm"
            />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-gray-200 mb-5 bg-gray-50">
          <h3
            className="text-sm font-semibold uppercase tracking-[0.15em] mb-3"
            style={{ color: primaryColor }}
          >
            Lendo agora
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <EditableField
              fieldKey="leitura-atual-titulo"
              className="text-sm border-b border-gray-300 min-h-7"
            />
            <EditableField
              fieldKey="leitura-atual-progresso"
              className="text-sm border-b border-gray-300 min-h-7"
            />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-gray-200 flex-1">
          <div className="grid grid-cols-[1fr_110px_60px_70px] gap-3 mb-1">
            <span className="text-[10px] uppercase text-gray-400">
              Título e autor
            </span>
            <span className="text-[10px] uppercase text-gray-400 text-center">
              Gênero
            </span>
            <span className="text-[10px] uppercase text-gray-400 text-center">
              Págs.
            </span>
            <span className="text-[10px] uppercase text-gray-400 text-center">
              Nota
            </span>
          </div>

          {[...Array(9)].map((_, index) => (
            <BookRow key={index} index={index} primaryColor={primaryColor} />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6 mt-6">
          <div className="p-4 rounded-xl border border-gray-200">
            <h3
              className="text-xs uppercase tracking-widest text-gray-400 mb-3"
            >
              Próximos da lista de desejos
            </h3>

            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-2 mb-2.5">
                <div className="w-3.5 h-3.5 rounded border border-gray-300 shrink-0" />
                <div className="flex-1 h-6 border-b border-dotted border-gray-300" />
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl border border-gray-200">
            <h3
              className="text-xs uppercase tracking-widest text-gray-400 mb-2"
            >
              Frase favorita do mês
            </h3>

            <EditableField
              fieldKey="leitura-frase-favorita"
              className="w-full min-h-14 text-sm italic"
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
