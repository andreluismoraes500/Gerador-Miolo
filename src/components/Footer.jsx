import { useMemo } from "react";
import { TEMAS } from "../themes";
import { BUSINESS_PROFILES } from "../config/businessProfiles";
import { getVersiculoAleatorio } from "../utils/versiculos";

export default function Footer({
  name,
  type = "default",
  colorTheme = "classico",
  customColors = {},
  fontFamily = "sans-serif",
}) {
  const temaBase = TEMAS[colorTheme] || TEMAS.classico;
  const perfil = BUSINESS_PROFILES[colorTheme] || BUSINESS_PROFILES.default;

  const displayName =
    name && name.trim() !== "" ? name : "Lucas Cassiano de Moraes";

  const versiculo = useMemo(() => getVersiculoAleatorio(), []);

  const styleColor = customColors.primary || temaBase.text;

  if (type === "biblical") {
    return (
      <div className="w-full mt-4 pt-2 border-t border-gray-300 flex flex-col items-center text-[9px] tracking-wide font-serif italic print:mt-2">
        <p className={`text-center max-w-[80%]`} style={{ color: styleColor }}>
          {versiculo}
        </p>
        <p
          className={`text-[8px] uppercase tracking-widest font-sans mt-1`}
          style={{
            color: customColors.primary || temaBase.accent || "#9ca3af",
          }}
        >
          Desenho de Miolo por: {displayName}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full mt-4 pt-2 border-t border-gray-300 flex justify-between items-center text-[9px] tracking-widest uppercase font-mono print:mt-2">
      <p className="text-gray-400">
        Desenho de Miolo por:{" "}
        <span className={`font-semibold`} style={{ color: styleColor }}>
          {displayName}
        </span>
      </p>
      <p className="print:hidden text-gray-400">{perfil.slogan}</p>
    </div>
  );
}
