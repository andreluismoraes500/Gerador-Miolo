import { useAgendaConfig } from "../context/AgendaConfigContext";

export default function BackgroundWrapper({ children, className = "" }) {
  const { backgroundImage } = useAgendaConfig();
  const style = backgroundImage
    ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }
    : {};

  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}
