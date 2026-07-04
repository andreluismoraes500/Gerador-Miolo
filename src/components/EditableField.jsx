import { useAgendaData } from "../context/AgendaDataContext";

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
      className={`outline-none border-gray-300 min-h-[1.2em] ${className}`}
      onInput={handleInput}
      {...props}
    >
      {value || placeholder}
    </div>
  );
}
