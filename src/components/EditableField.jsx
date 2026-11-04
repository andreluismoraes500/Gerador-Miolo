import { useAgendaData } from "../context/AgendaDataContext";

// IMPORTANTE: este campo é "contentEditable" dentro de layouts de página
// fixa (A4, 210x297mm) — se o texto digitado pelo usuário for grande
// demais, sem limite de altura ele empurra a linha/tabela pra baixo e o
// navegador acaba imprimindo uma 2ª página só com a sobra. `overflow-hidden`
// garante que o campo nunca cresce além do espaço reservado pra ele; o
// texto extra fica escondido em vez de estourar a página.
export default function EditableField({
  fieldKey,
  className,
  placeholder = "",
  ...props
}) {
  const { getField, setField } = useAgendaData();
  const value = getField(fieldKey);

  const handleInput = (e) => {
    setField(fieldKey, e.target.innerText);
  };

  return (
    <div
      contentEditable
      suppressContentEditableWarning
      className={`outline-none border-gray-300 min-h-[1.2em] overflow-hidden ${className}`}
      onInput={handleInput}
      {...props}
    >
      {value || placeholder}
    </div>
  );
}
