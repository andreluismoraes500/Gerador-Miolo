export function getCustomStyles(customColors = {}, tema = {}) {
  const primary = customColors.primary || tema.text || "#4a5568";
  const secondary = customColors.secondary || tema.border || "#cbd5e1";
  const background = customColors.background || tema.bgLight || "#f8fafc";

  return {
    primary,
    secondary,
    background,
    // Estilos inline
    style: {
      color: primary,
      borderColor: secondary,
      backgroundColor: background,
    },
    // Classes condicionais (para usar com Tailwind)
    classes: {
      border: `border-[${secondary}]`,
      text: `text-[${primary}]`,
      bg: `bg-[${background}]`,
    },
  };
}
