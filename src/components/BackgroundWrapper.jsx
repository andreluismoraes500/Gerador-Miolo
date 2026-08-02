import { useAgendaConfig } from "../context/AgendaConfigContext";

export default function BackgroundWrapper({ children, className = "" }) {
  const { backgroundImage, backgroundOpacity } = useAgendaConfig();

  // Se não houver imagem de fundo, retorna apenas os children
  if (!backgroundImage) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={`relative ${className}`}>
      {/* Overlay de fundo aplicado APENAS à área da página */}
      <div
        className="absolute inset-0 pointer-events-none rounded-[inherit]"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: backgroundOpacity || 0.12,
        }}
      />
      {/* Conteúdo por cima */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}