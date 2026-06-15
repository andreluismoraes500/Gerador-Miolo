export default function Footer({ name }) {
  const displayName =
    name && name.trim() !== "" ? name : "Lucas Cassiano de Moraes";

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
