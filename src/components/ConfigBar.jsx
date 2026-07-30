// Adicione esta seção na ConfigBar, na parte onde ficam as cores

{
  /* Cores dos dias do calendário */
}
<div className="flex items-center gap-3 border-l border-[#D8CBA8] pl-4">
  <Label icon={MdColorLens}>Dias:</Label>
  <div className="flex items-center gap-2">
    {[
      {
        value: domingoColor,
        onChange: setDomingoColor,
        title: "Domingo",
      },
      {
        value: sabadoColor,
        onChange: setSabadoColor,
        title: "Sábado",
      },
      {
        value: diaNormalColor,
        onChange: setDiaNormalColor,
        title: "Dia normal",
      },
      {
        value: feriadoColor,
        onChange: setFeriadoColor,
        title: "Feriado",
      },
      {
        value: comemorativaColor,
        onChange: setComemorativaColor,
        title: "Comemorativa",
      },
    ].map(({ value, onChange, title }) => (
      <input
        key={title}
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-6 h-6 p-0 border-2 border-[#D8CBA8] rounded-full cursor-pointer hover:border-[#B8933D] transition shadow-sm"
        title={title}
      />
    ))}
  </div>
</div>;
