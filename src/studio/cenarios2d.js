// Cenários 2D desenhados em canvas (fotografia de mesa / fundos).
export const CENARIOS_2D = [
  { id: "madeira", nome: "Mesa de madeira", a: "#b98a5a", b: "#8a5f37" },
  { id: "branca", nome: "Mesa branca", a: "#ffffff", b: "#e9ebee" },
  { id: "marmore", nome: "Mármore", a: "#f4f4f2", b: "#d5d7da" },
  { id: "bege", nome: "Fundo bege", a: "#efe3d0", b: "#d9c4a3" },
  { id: "minimal", nome: "Minimalista", a: "#f7f7f5", b: "#e6e6e2" },
  { id: "floral", nome: "Floral", a: "#fcebee", b: "#f3c4cf" },
  { id: "profissional", nome: "Profissional", a: "#2b3445", b: "#151a24" },
  { id: "escritorio", nome: "Escritório", a: "#6a5240", b: "#35271c" },
  { id: "papelaria", nome: "Papelaria", a: "#fdf6ee", b: "#ecd9c6" },
];

function rnd(seed) { let s = seed; return () => ((s = (s * 16807) % 2147483647) / 2147483647); }

export function desenharCenario(id, w, h) {
  const cv = document.createElement("canvas");
  cv.width = w; cv.height = h;
  const g = cv.getContext("2d");
  const c = CENARIOS_2D.find((x) => x.id === id) || CENARIOS_2D[0];
  const gr = g.createRadialGradient(w * 0.5, h * 0.38, 20, w * 0.5, h * 0.5, Math.max(w, h) * 0.75);
  gr.addColorStop(0, c.a); gr.addColorStop(1, c.b);
  g.fillStyle = gr; g.fillRect(0, 0, w, h);
  const R = rnd(7);
  if (id === "madeira" || id === "escritorio") {
    for (let i = 0; i < 90; i++) {
      const y = (i / 90) * h + R() * 12;
      g.strokeStyle = `rgba(50,28,10,${0.06 + R() * 0.16})`; g.lineWidth = 1 + R() * 3;
      g.beginPath(); g.moveTo(0, y);
      for (let x = 0; x <= w; x += w / 8) g.lineTo(x, y + (R() - 0.5) * 10);
      g.stroke();
    }
    g.fillStyle = "rgba(0,0,0,0.22)";
    for (let x = w / 4; x < w; x += w / 4) g.fillRect(x, 0, 3, h);
  } else if (id === "marmore") {
    for (let i = 0; i < 22; i++) {
      g.strokeStyle = `rgba(110,115,125,${0.06 + R() * 0.16})`; g.lineWidth = 0.8 + R() * 2.6;
      g.beginPath(); let x = R() * w, y = 0; g.moveTo(x, y);
      while (y < h) { x += (R() - 0.5) * 120; y += 40 + R() * 50; g.lineTo(x, y); }
      g.stroke();
    }
  } else if (id === "floral") {
    for (let i = 0; i < 46; i++) {
      const x = R() * w, y = R() * h, r = 18 + R() * 34;
      g.fillStyle = ["#f4b6c4", "#f8cfd8", "#e9a0b4", "#fbe0b8"][i % 4];
      for (let p = 0; p < 6; p++) { g.beginPath(); g.ellipse(x + Math.cos(p * 1.047) * r * 0.7, y + Math.sin(p * 1.047) * r * 0.7, r * 0.55, r * 0.35, p * 1.047, 0, 7); g.fill(); }
      g.fillStyle = "#f3c969"; g.beginPath(); g.arc(x, y, r * 0.25, 0, 7); g.fill();
    }
  } else if (id === "papelaria") {
    g.strokeStyle = "rgba(190,150,120,0.25)";
    for (let i = 0; i <= w; i += 40) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, h); g.stroke(); }
    for (let i = 0; i <= h; i += 40) { g.beginPath(); g.moveTo(0, i); g.lineTo(w, i); g.stroke(); }
  } else if (id === "profissional") {
    g.fillStyle = "rgba(255,255,255,0.03)";
    for (let i = 0; i < h; i += 6) g.fillRect(0, i, w, 1);
  }
  const v = g.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.45, w / 2, h / 2, Math.max(w, h) * 0.8);
  v.addColorStop(0, "rgba(0,0,0,0)"); v.addColorStop(1, "rgba(0,0,0,0.18)");
  g.fillStyle = v; g.fillRect(0, 0, w, h);
  return cv;
}
