// Acessórios 3D (geometria procedural) e acabamentos localizados da capa.
import * as THREE from "three";
import { METAIS3D } from "./opcoes";

const std = (color, rough = 0.6, metal = 0) => new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal });
function malha(geo, mat, { x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0 } = {}) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  m.rotation.set(rx, ry, rz);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

const FAB = {
  caneta() {
    const g = new THREE.Group();
    const corpo = std("#1e3a8a", 0.25, 0.2);
    g.add(malha(new THREE.CylinderGeometry(0.045, 0.045, 1.15, 24), corpo, { y: 0.045, rz: Math.PI / 2 }));
    g.add(malha(new THREE.CylinderGeometry(0.047, 0.047, 0.05, 24), std("#c9a24b", 0.25, 1), { x: -0.45, y: 0.045, rz: Math.PI / 2 }));
    g.add(malha(new THREE.ConeGeometry(0.045, 0.2, 24), std("#2a2a2e", 0.4), { x: 0.675, y: 0.045, rz: -Math.PI / 2 }));
    g.add(malha(new THREE.BoxGeometry(0.5, 0.012, 0.03), std("#c9a24b", 0.25, 1), { x: -0.25, y: 0.1, z: 0 }));
    return g;
  },
  lapis() {
    const g = new THREE.Group();
    g.add(malha(new THREE.CylinderGeometry(0.04, 0.04, 1.2, 6), std("#f2b705", 0.5), { y: 0.04, rz: Math.PI / 2 }));
    g.add(malha(new THREE.CylinderGeometry(0.042, 0.042, 0.08, 6), std("#b6bcc4", 0.3, 1), { x: -0.62, y: 0.04, rz: Math.PI / 2 }));
    g.add(malha(new THREE.CylinderGeometry(0.04, 0.04, 0.1, 18), std("#e58a8a", 0.8), { x: -0.71, y: 0.04, rz: Math.PI / 2 }));
    g.add(malha(new THREE.ConeGeometry(0.04, 0.18, 6), std("#f1d7a8", 0.8), { x: 0.69, y: 0.04, rz: -Math.PI / 2 }));
    g.add(malha(new THREE.ConeGeometry(0.014, 0.06, 6), std("#333", 0.5), { x: 0.8, y: 0.04, rz: -Math.PI / 2 }));
    return g;
  },
  xicara() {
    const g = new THREE.Group();
    const perfil = [[0, 0], [0.26, 0], [0.3, 0.03], [0.4, 0.4], [0.38, 0.42], [0, 0.42]].map(([x, y]) => new THREE.Vector2(x, y));
    const porc = new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.18, side: THREE.DoubleSide });
    g.add(malha(new THREE.LatheGeometry(perfil, 40), porc));
    g.add(malha(new THREE.CircleGeometry(0.36, 40), std("#5b3a22", 0.35), { y: 0.36, rx: -Math.PI / 2 }));
    g.add(malha(new THREE.TorusGeometry(0.15, 0.035, 12, 28, Math.PI * 1.25), porc, { x: 0.4, y: 0.22, rz: -Math.PI * 0.62 }));
    g.add(malha(new THREE.CylinderGeometry(0.55, 0.55, 0.025, 48), porc, { y: -0.0, }).translateY(0.0));
    return g;
  },
  livro() {
    const g = new THREE.Group();
    const cores = ["#7b2d3a", "#3f6e8c"];
    [0, 1].forEach((i) => {
      const w = 1.5 - i * 0.15, d = 2.1 - i * 0.2;
      const b = new THREE.Group();
      b.add(malha(new THREE.BoxGeometry(w, 0.26, d), std(cores[i], 0.7), { y: 0.13 }));
      b.add(malha(new THREE.BoxGeometry(w - 0.06, 0.2, d - 0.04), std("#efe6cf", 0.95), { x: 0.04, y: 0.13 }));
      b.position.set(i * 0.05, i * 0.26, 0);
      b.rotation.y = i * 0.25;
      g.add(b);
    });
    return g;
  },
  flor() {
    const g = new THREE.Group();
    g.add(malha(new THREE.CylinderGeometry(0.012, 0.012, 1.2, 8), std("#4a8a55", 0.7), { x: -0.2, y: 0.02, rz: Math.PI / 2 }));
    const cab = new THREE.Group();
    const pet = std("#f48fb1", 0.55);
    for (let i = 0; i < 7; i++) {
      const p = malha(new THREE.SphereGeometry(0.1, 16, 12), pet);
      p.scale.set(1.5, 0.35, 0.8);
      p.position.set(Math.cos((i / 7) * 6.283) * 0.14, 0, Math.sin((i / 7) * 6.283) * 0.14);
      p.rotation.y = -(i / 7) * 6.283;
      cab.add(p);
    }
    cab.add(malha(new THREE.SphereGeometry(0.07, 16, 12), std("#f6c453", 0.5)));
    cab.position.set(0.42, 0.05, 0);
    g.add(cab);
    return g;
  },
  oculos() {
    const g = new THREE.Group();
    const arm = std("#2a2a2e", 0.35);
    const lente = new THREE.MeshPhysicalMaterial({ color: "#cfe8f2", transparent: true, opacity: 0.35, roughness: 0.05, clearcoat: 1 });
    [-0.34, 0.34].forEach((x) => {
      g.add(malha(new THREE.TorusGeometry(0.24, 0.03, 12, 40), arm, { x, y: 0.26, rx: Math.PI / 2 - 0.9 }));
      g.add(malha(new THREE.CircleGeometry(0.235, 36), lente, { x, y: 0.26, rx: -Math.PI / 2 + 0.9 }));
    });
    g.add(malha(new THREE.CylinderGeometry(0.02, 0.02, 0.2, 8), arm, { y: 0.34, z: -0.1, rz: Math.PI / 2 }));
    [-0.58, 0.58].forEach((x) => g.add(malha(new THREE.BoxGeometry(0.03, 0.03, 0.6), arm, { x, y: 0.15, z: 0.28, rx: 0.1 })));
    return g;
  },
  clipe() {
    const pts = [[-0.1, 0.2], [-0.1, -0.15], [0.02, -0.25], [0.12, -0.15], [0.12, 0.3], [0.0, 0.4], [-0.06, 0.3], [-0.06, -0.08]].map(([x, z]) => new THREE.Vector3(x, 0.012, z));
    const g = new THREE.Group();
    g.add(malha(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.2), 60, 0.012, 8), std("#c9ced6", 0.25, 1)));
    return g;
  },
  folha() {
    const g = new THREE.Group();
    [[0, 0, 0.3, "#5aa469"], [0.35, 0.2, -0.5, "#3f7d4c"], [-0.2, 0.35, 1.1, "#6fb27c"]].forEach(([x, z, r, c]) => {
      const f = malha(new THREE.SphereGeometry(0.22, 18, 12), std(c, 0.6), { x, y: 0.02, z, ry: r });
      f.scale.set(0.6, 0.06, 1.6);
      g.add(f);
    });
    return g;
  },
};

export function construirAcessorios(lista, w, h) {
  const grupo = new THREE.Group();
  const dx = w / 2 + 1.05, dz = h / 2 + 0.95;
  const slots = [
    [dx, -h * 0.28, 0.5], [dx + 0.1, h * 0.22, -0.3], [-dx, h * 0.3, 0.8], [-dx, -h * 0.22, 0],
    [0, dz, 0.1], [w * 0.38, dz, 0.3], [-w * 0.38, dz, 1.5], [dx, dz, 2],
  ];
  lista.slice(0, slots.length).forEach((id, i) => {
    const mk = FAB[id];
    if (!mk) return;
    const o = mk();
    const [x, z, r] = slots[i];
    o.position.set(x, 0.002, z);
    o.rotation.y = r;
    grupo.add(o);
  });
  return grupo;
}

// Verniz localizado / hot stamping: moldura + texto aplicados sobre a capa.
export function acabamentoCapa(o, W, H, rotY) {
  if (!o.acab || o.acab === "nenhum") return null;
  const gira90 = Math.abs(Math.abs(rotY) - Math.PI / 2) < 0.01;
  const pw = (gira90 ? H : W) * 0.62, ph = (gira90 ? W : H) * 0.62;
  const cv = document.createElement("canvas");
  cv.width = 768;
  cv.height = Math.round((768 * ph) / pw);
  const g = cv.getContext("2d");
  g.fillStyle = "#000";
  g.fillRect(0, 0, cv.width, cv.height);
  g.strokeStyle = g.fillStyle = "#fff";
  g.lineWidth = 7;
  const m = 26;
  g.strokeRect(m, m, cv.width - 2 * m, cv.height - 2 * m);
  g.lineWidth = 2.5;
  g.strokeRect(m + 14, m + 14, cv.width - 2 * m - 28, cv.height - 2 * m - 28);
  const texto = (o.acabTexto || "Minha Agenda").slice(0, 28);
  g.textAlign = "center";
  g.textBaseline = "middle";
  let fs = 110;
  g.font = `700 ${fs}px "DM Serif Display", Georgia, serif`;
  while (g.measureText(texto).width > cv.width - 130 && fs > 30) { fs -= 6; g.font = `700 ${fs}px "DM Serif Display", Georgia, serif`; }
  g.fillText(texto, cv.width / 2, cv.height / 2);
  g.fillRect(cv.width * 0.3, cv.height / 2 + fs * 0.75, cv.width * 0.4, 4);
  const mapa = new THREE.CanvasTexture(cv);
  mapa.anisotropy = 8;
  const cor = METAIS3D[o.metal]?.color || "#d4a63c";
  const mat = o.acab === "hot"
    ? new THREE.MeshStandardMaterial({ color: ["#23262c", "#f2f4f7"].includes(cor) ? "#d4a63c" : cor, metalness: 1, roughness: 0.2, alphaMap: mapa, alphaTest: 0.5, transparent: false, polygonOffset: true, polygonOffsetFactor: -2 })
    : new THREE.MeshPhysicalMaterial({ color: "#ffffff", roughness: 0.03, clearcoat: 1, clearcoatRoughness: 0.02, envMapIntensity: 2.4, alphaMap: mapa, transparent: true, opacity: 0.42, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 });
  const plano = new THREE.Mesh(new THREE.PlaneGeometry(pw, ph), mat);
  plano.rotation.x = -Math.PI / 2;
  plano.userData.textura = mapa;
  return { malha: plano, rotY };
}
