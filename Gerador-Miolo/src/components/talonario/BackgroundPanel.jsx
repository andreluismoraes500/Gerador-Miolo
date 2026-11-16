// src/components/talonario/BackgroundPanel.jsx
//
// Painel "Fundo" do Talonário: imagem de fundo por aba, com opacidade e
// ajuste (cobrir / repetir). Usa as mesmas variáveis CSS --tal-* do restante.

import { SectionTitle, Label, UploadBox } from "./TalonarioPanels";

export default function BackgroundPanel({
  activeTab,
  background, // { src, opacity, fit } da aba ativa
  onUpload,
  onClear,
  setField,
}) {
  const id = `tal-bg-${activeTab}`;
  return (
    <div>
      <SectionTitle>Imagem de fundo</SectionTitle>
      <UploadBox
        inputId={id}
        label={background.src ? "Trocar fundo" : "Enviar imagem de fundo"}
        hint="Cobre todo o talão, atrás do conteúdo"
        thumb={background.src}
        onFile={onUpload}
      />
      {background.src && (
        <>
          <button
            onClick={onClear}
            className="text-[11.5px] underline mt-1"
            style={{ color: "var(--tal-stamp)" }}
          >
            remover fundo
          </button>
          <Label>Opacidade</Label>
          <div className="flex items-center gap-2.5">
            <input
              type="range"
              min={5}
              max={60}
              value={background.opacity}
              onChange={(e) => setField("opacity", Number(e.target.value))}
              className="flex-1 accent-(--tal-accent)"
            />
            <span className="text-xs text-(--tal-ink-soft) w-9 text-right">
              {background.opacity}%
            </span>
          </div>
          <Label>Ajuste</Label>
          <div className="flex bg-[#f0f2f1] rounded-lg p-1 gap-1">
            {[
              ["cover", "Cobrir"],
              ["contain", "Centralizar"],
              ["repeat", "Repetir"],
            ].map(([v, l]) => (
              <button
                key={v}
                onClick={() => setField("fit", v)}
                className="flex-1 rounded-md py-1.5 text-[12.5px] font-semibold"
                style={
                  background.fit === v
                    ? {
                        background: "#fff",
                        color: "var(--tal-accent-dark)",
                        boxShadow: "0 1px 4px #0002",
                      }
                    : { color: "var(--tal-ink-soft)" }
                }
              >
                {l}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
