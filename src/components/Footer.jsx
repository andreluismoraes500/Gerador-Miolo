import { getVersiculoAleatorio } from "../utils/versiculos";

export default function Footer({ name, type = "default" }) {
  const displayName =
    name && name.trim() !== "" ? name : "Lucas Cassiano de Moraes";

  if (type === "biblical") {
    const versiculo = getVersiculoAleatorio();
    return (
      <div className="w-full mt-4 pt-2 border-t border-gray-300 flex flex-col items-center text-[9px] text-gray-500 tracking-wide font-serif italic print:mt-2">
        <p className="text-center max-w-[80%]">{versiculo}</p>
        <p className="text-[8px] text-gray-400 uppercase tracking-widest font-sans mt-1">
          {displayName}
        </p>
      </div>
    );
  }

  // Rodapé padrão
  return (
    <div className="w-full mt-4 pt-2 border-t border-gray-300 flex justify-between items-center text-[9px] text-gray-400 tracking-widest uppercase font-mono print:mt-2">
      <p>
        Desenho de Miolo por:{" "}
        <span className="font-semibold text-gray-600">{displayName}</span>
      </p>
      <p className="print:hidden">Gerador de Agendas Profissional</p>
    </div>
  );
}
