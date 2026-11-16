// Imagem que preenche o pai (100% × 100%): "inteira" (cabe sem cortar) ou "preencher" (corta o excesso).
import { AJ_PADRAO } from "../lib/imagemAjuste";

export default function ImgAjustada({ src, modo = AJ_PADRAO.modo, zoom = 1, x = 0, y = 0, op = 100, bg = "" }) {
  const pos = `${50 + x / 2}% ${50 + y / 2}%`;
  return (
    <div style={{ width: "100%", height: "100%", overflow: "hidden", background: bg || (modo === "inteira" ? "#fff" : "transparent") }}>
      <img src={src} alt="" style={{ width: "100%", height: "100%", display: "block", objectFit: modo === "inteira" ? "contain" : "cover", objectPosition: pos, transform: `scale(${zoom})`, transformOrigin: pos, opacity: op / 100 }} />
    </div>
  );
}
