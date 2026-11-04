export default function ThemeWrapper({
  children,
  customColors = {},
  fontFamily = "sans-serif",
}) {
  const primary = customColors.primary || "#000000";
  const secondary = customColors.secondary || "#cbd5e1";
  const background = customColors.background || "#f8fafc";

  return (
    <div style={{ fontFamily, backgroundColor: background, color: primary }}>
      {children}
    </div>
  );
}
