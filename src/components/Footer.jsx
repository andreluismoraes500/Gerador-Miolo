import { getVersiculoAleatorio } from "../utils/versiculos";
import { TEMAS } from "../themes";

export default function Footer({
  name,
  type = "default",
  colorTheme = "classico",
}) {
  const tema = TEMAS[colorTheme] || TEMAS.classico;
  const displayName =
    name && name.trim() !== "" ? name : "Lucas Cassiano de Moraes";

  if (type === "biblical") {
    const versiculo = getVersiculoAleatorio();
    return (
      <div className="w-full mt-4 pt-2 border-t border-gray-300 flex flex-col items-center text-[9px] tracking-wide font-serif italic print:mt-2">
        <p className={`text-center max-w-[80%] ${tema.text}`}>{versiculo}</p>
        <p
          className={`text-[8px] uppercase tracking-widest font-sans mt-1 ${tema.accent || "text-gray-400"}`}
        >
          Desenho de Miolo por: {displayName}
        </p>
      </div>
    );
  }

  // Rodapé padrão
  return (
    <div className="w-full mt-4 pt-2 border-t border-gray-300 flex justify-between items-center text-[9px] tracking-widest uppercase font-mono print:mt-2">
      <p className="text-gray-400">
        Desenho de Miolo por:{" "}
        <span className={`font-semibold ${tema.text}`}>{displayName}</span>
      </p>
      <p className="print:hidden text-gray-400">
        Gerador de Agendas Profissional
      </p>
    </div>
  );
}
