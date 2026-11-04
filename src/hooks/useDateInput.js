// src/hooks/useDateInput.js

import { useCallback } from "react";

function formatLocalDate(year, month, day) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

const MONTH_BASED_TEMPLATES = ["mensalCompleto", "plannerMensal"];
const YEAR_BASED_TEMPLATES = ["anualCompleto", "calendarios", "capa"]; // <-- adicione "capa"

export function useDateInput(template, selectedDate, setSelectedDate, forceYearOnly = false) {
  const [currentYear, currentMonth] = selectedDate.split("-").map(Number);

  const isYearBased = forceYearOnly || YEAR_BASED_TEMPLATES.includes(template);

  const inputType = isYearBased
    ? "number"
    : MONTH_BASED_TEMPLATES.includes(template)
      ? "month"
      : "date";

  const inputValue = isYearBased
    ? currentYear
    : MONTH_BASED_TEMPLATES.includes(template)
      ? `${currentYear}-${String(currentMonth).padStart(2, "0")}`
      : selectedDate;

  const handleDateChange = useCallback(
    (value) => {
      if (isYearBased) {
        const year = parseInt(value, 10);
        if (!isNaN(year)) setSelectedDate(formatLocalDate(year, 0, 1));
      } else if (MONTH_BASED_TEMPLATES.includes(template)) {
        const [year, month] = value.split("-");
        setSelectedDate(
          formatLocalDate(parseInt(year, 10), parseInt(month, 10) - 1, 1),
        );
      } else {
        setSelectedDate(value);
      }
    },
    [template, setSelectedDate, isYearBased],
  );

  return { inputType, inputValue, handleDateChange };
}
