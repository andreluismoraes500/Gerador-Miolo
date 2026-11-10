// Produtos desenhados em Konva (vetoriais) para compor mockups 2D.
import { Arc, Circle, Group, Image as KImage, Rect } from "react-konva";

export const PRODUTOS_2D = [
  { id: "agenda", nome: "Agenda wire-o", w: 300, h: 420 },
  { id: "caderno", nome: "Caderno espiral", w: 300, h: 400 },
  { id: "bloco", nome: "Bloco de notas", w: 260, h: 340 },
  { id: "cartao", nome: "Cartão", w: 320, h: 190 },
  { id: "quadro", nome: "Quadro", w: 300, h: 400 },
  { id: "caneca", nome: "Caneca", w: 300, h: 260 },
];

function crop(img, w, h) {
  if (!img) return undefined;
  const r = w / h, ir = img.width / img.height;
  return ir > r ? { x: (img.width - img.height * r) / 2, y: 0, width: img.height * r, height: img.height } : { x: 0, y: (img.height - img.width / r) / 2, width: img.width, height: img.width / r };
}
const Capa = ({ w, h, cor, img, raio = 8, x = 0, y = 0 }) => (
  <Group x={x} y={y} clipFunc={(c) => { const r = Math.min(raio, w / 2, h / 2); c.beginPath(); c.moveTo(r, 0); c.arcTo(w, 0, w, h, r); c.arcTo(w, h, 0, h, r); c.arcTo(0, h, 0, 0, r); c.arcTo(0, 0, w, 0, r); c.closePath(); }}>
    <Rect width={w} height={h} fill={cor} />
    {img && <KImage image={img} width={w} height={h} crop={crop(img, w, h)} />}
    <Rect width={w} height={h} fillLinearGradientStartPoint={{ x: 0, y: 0 }} fillLinearGradientEndPoint={{ x: w, y: h }} fillLinearGradientColorStops={[0, "rgba(255,255,255,0.22)", 0.45, "rgba(255,255,255,0)", 1, "rgba(0,0,0,0.16)"]} />
  </Group>
);

export default function ProdutoNode({ el, img }) {
  const { w, h, kind, cor = "#1e293b" } = el;
  if (kind === "agenda" || kind === "caderno") {
    const n = Math.max(8, Math.round(h / 22));
    return (
      <Group>
        <Rect x={w * 0.025} y={h * 0.012} width={w} height={h} fill="#e9e2d0" cornerRadius={8} shadowColor="#000" shadowBlur={18} shadowOpacity={0.28} shadowOffset={{ x: 6, y: 10 }} />
        <Rect x={w * 0.012} y={h * 0.006} width={w} height={h} fill="#f7f2e6" cornerRadius={8} />
        <Capa w={w} h={h} cor={cor} img={img} />
        <Rect width={w * 0.07} height={h} fillLinearGradientStartPoint={{ x: 0, y: 0 }} fillLinearGradientEndPoint={{ x: w * 0.07, y: 0 }} fillLinearGradientColorStops={[0, "rgba(0,0,0,0.35)", 1, "rgba(0,0,0,0)"]} />
        {Array.from({ length: n }).map((_, i) => {
          const y = ((i + 0.5) / n) * h;
          return kind === "agenda"
            ? <Rect key={i} x={-5} y={y - 2.5} width={w * 0.085} height={5} cornerRadius={3} fill="#cfd5dd" stroke="#8f98a3" strokeWidth={1} />
            : <Circle key={i} x={w * 0.03} y={y} radius={5} stroke="#9aa3ad" strokeWidth={3} />;
        })}
      </Group>
    );
  }
  if (kind === "bloco") {
    return (
      <Group>
        {[3, 2, 1].map((k) => <Rect key={k} x={k * 2} y={k * 2.5} width={w} height={h} fill={k % 2 ? "#f1ede2" : "#faf7ee"} stroke="#ded6c2" strokeWidth={1} cornerRadius={3} shadowColor="#000" shadowBlur={k === 3 ? 16 : 0} shadowOpacity={0.25} shadowOffset={{ x: 4, y: 8 }} />)}
        <Capa w={w} h={h} cor={cor} img={img} raio={3} />
        <Rect width={w} height={h * 0.05} fill="#c0392b" opacity={0.9} />
      </Group>
    );
  }
  if (kind === "cartao") {
    return (
      <Group>
        <Rect width={w} height={h} fill="#fff" cornerRadius={5} shadowColor="#000" shadowBlur={14} shadowOpacity={0.3} shadowOffset={{ x: 4, y: 8 }} />
        <Capa w={w} h={h} cor={cor} img={img} raio={5} />
      </Group>
    );
  }
  if (kind === "quadro") {
    const b = Math.max(10, w * 0.05), p = w * 0.09;
    return (
      <Group>
        <Rect width={w} height={h} fill={el.moldura || "#1b1d22"} shadowColor="#000" shadowBlur={22} shadowOpacity={0.35} shadowOffset={{ x: 6, y: 12 }} />
        <Rect x={b} y={b} width={w - 2 * b} height={h - 2 * b} fill="#f7f5f0" />
        <Capa w={w - 2 * (b + p)} h={h - 2 * (b + p)} x={b + p} y={b + p} cor={cor} img={img} raio={0} />
        <Rect x={b} y={b} width={w - 2 * b} height={6} fill="rgba(0,0,0,0.12)" />
      </Group>
    );
  }
  // caneca
  const cw = w * 0.76;
  return (
    <Group>
      <Rect x={5} y={h * 0.94} width={cw} height={h * 0.05} fill="rgba(0,0,0,0.25)" cornerRadius={20} blurRadius={0} />
      <Arc x={cw - 6} y={h * 0.5} innerRadius={h * 0.17} outerRadius={h * 0.31} angle={180} rotation={-90} fill="#f4f4f6" stroke="#d6d6dc" strokeWidth={2} />
      <Capa w={cw} h={h * 0.95} cor={cor === "#1e293b" ? "#ffffff" : cor} img={img} raio={18} />
      <Rect x={cw * 0.1} y={h * 0.05} width={cw * 0.1} height={h * 0.82} cornerRadius={20} fill="rgba(255,255,255,0.35)" />
    </Group>
  );
}
