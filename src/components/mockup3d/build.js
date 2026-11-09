// src/components/mockup3d/build.js
//
// Construtores 3D (three.js) dos produtos do Mockup: cadernos/agendas com
// vários tipos de encadernação e blocos colados. Unidade: 1 = 10 cm.
// O objeto fica deitado sobre a mesa (y = 0), capa para cima, lombada à esquerda.

import * as THREE from "three";

import { TAMANHOS, FORMATOS_BLOCO, MATERIAIS, METAIS3D, PAPELAO3D } from "./opcoes";
export { TAMANHOS, FORMATOS_BLOCO, MATERIAIS, METAIS3D, PAPELAO3D };

// ---------------------------------------------------------------- texturas

export function canvasTex(w, h, draw, srgb = true) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c.getContext("2d"), w, h);
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

export function girarCanvas(src, deg) {
  const r = ((deg % 360) + 360) % 360;
  if (!r) return src;
  const w0 = src.naturalWidth || src.width;
  const h0 = src.naturalHeight || src.height;
  const troca = r === 90 || r === 270;
  const c = document.createElement("canvas");
  c.width = troca ? h0 : w0;
  c.height = troca ? w0 : h0;
  const x = c.getContext("2d");
  x.translate(c.width / 2, c.height / 2);
  x.rotate((deg * Math.PI) / 180);
  x.drawImage(src, -w0 / 2, -h0 / 2);
  return c;
}

export function texturaPautado(ctx3, { tipo = "pautado", cor = "#7f90ad", margem = true, giro = 0 } = {}) {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 724;
  const g = c.getContext("2d");
  g.fillStyle = "#fffdf8";
  g.fillRect(0, 0, c.width, c.height);
  g.strokeStyle = cor;
  g.fillStyle = cor;
  g.lineWidth = 2.2;
  const linha = (y, x0 = 36, x1 = c.width - 36) => {
    g.beginPath();
    g.moveTo(x0, y);
    g.lineTo(x1, y);
    g.stroke();
  };
  if (tipo === "pautado") {
    for (let y = 110; y < c.height - 40; y += 30) linha(y);
    if (margem) {
      g.strokeStyle = "#e8a5a5";
      g.beginPath();
      g.moveTo(64, 40);
      g.lineTo(64, c.height - 40);
      g.stroke();
    }
  } else if (tipo === "pontilhado") {
    for (let y = 70; y < c.height - 40; y += 28)
      for (let x = 44; x < c.width - 30; x += 28) {
        g.beginPath();
        g.arc(x, y, 2.6, 0, Math.PI * 2);
        g.fill();
      }
  } else if (tipo === "quadriculado") {
    g.lineWidth = 1.6;
    for (let y = 58; y < c.height - 30; y += 26) linha(y, 30, c.width - 30);
    for (let x = 30; x <= c.width - 30; x += 26) {
      g.beginPath();
      g.moveTo(x, 58);
      g.lineTo(x, 58 + Math.floor((c.height - 90) / 26) * 26);
      g.stroke();
    }
  } else if (tipo === "semanal") {
    const dias = ["SEG", "TER", "QUA", "QUI", "SEX", "SÁB", "DOM"];
    const alt = (c.height - 110) / 7;
    g.font = "bold 15px sans-serif";
    dias.forEach((d, i) => {
      const y = 70 + i * alt;
      g.fillText(d, 36, y + 20);
      linha(y);
      for (let k = 1; k <= 2; k += 1) linha(y + (alt / 3) * k, 90, c.width - 36);
    });
    linha(70 + 7 * alt);
  } else if (tipo === "partitura") {
    for (let sis = 0; sis < 9; sis += 1) {
      const y0 = 70 + sis * 70;
      for (let l = 0; l < 5; l += 1) linha(y0 + l * 9, 36, c.width - 36);
      g.beginPath();
      g.moveTo(36, y0);
      g.lineTo(36, y0 + 36);
      g.stroke();
    }
  }
  const t = new THREE.CanvasTexture(girarCanvas(c, giro));
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return ctx3.track(t);
}

export function texturaBordaPaginas(ctx3) {
  return ctx3.track(
    canvasTex(8, 256, (g, w, h) => {
      for (let y = 0; y < h; y++) {
        const v = y % 2 ? 250 : 238;
        g.fillStyle = `rgb(${v},${v - 3},${v - 12})`;
        g.fillRect(0, y, w, 1);
      }
    }),
  );
}

function texturaGutter(ctx3) {
  return ctx3.track(
    canvasTex(256, 4, (g, w) => {
      const gr = g.createLinearGradient(0, 0, w, 0);
      gr.addColorStop(0, "rgba(0,0,0,0)");
      gr.addColorStop(0.5, "rgba(0,0,0,0.38)");
      gr.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = gr;
      g.fillRect(0, 0, w, 4);
    }, false),
  );
}

// textura "grão" para couro / linho (usada como bumpMap)
function texturaGrao(ctx3, tipo) {
  return ctx3.track(
    canvasTex(
      256,
      256,
      (g, w, h) => {
        g.fillStyle = "#808080";
        g.fillRect(0, 0, w, h);
        if (tipo === "couro") {
          for (let i = 0; i < 9000; i++) {
            const v = 90 + Math.random() * 90;
            g.fillStyle = `rgb(${v},${v},${v})`;
            g.beginPath();
            g.arc(Math.random() * w, Math.random() * h, 1 + Math.random() * 2.2, 0, 7);
            g.fill();
          }
        } else {
          for (let y = 0; y < h; y += 2) {
            g.fillStyle = `rgba(${y % 4 ? 60 : 200},${y % 4 ? 60 : 200},${y % 4 ? 60 : 200},0.5)`;
            g.fillRect(0, y, w, 1);
          }
          for (let x = 0; x < w; x += 2) {
            g.fillStyle = `rgba(${x % 4 ? 70 : 190},${x % 4 ? 70 : 190},${x % 4 ? 70 : 190},0.4)`;
            g.fillRect(x, 0, 1, h);
          }
        }
      },
      false,
    ),
  );
}

// ajuste = { zoom, x, y, modo } — posição da imagem dentro da área (x,y em -1..1).
export const AJUSTE_PADRAO = { zoom: 1, x: 0, y: 0, modo: "cobrir" };

export function carregarTextura(ctx3, src, aspect, giro = 0, ajuste = null) {
  if (!src) return null;
  const branco = document.createElement("canvas");
  branco.width = branco.height = 2;
  branco.getContext("2d").fillStyle = "#fff";
  branco.getContext("2d").fillRect(0, 0, 2, 2);
  const t = new THREE.CanvasTexture(branco);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  const im = new Image();
  im.onload = () => {
    const fonte = girarCanvas(im, giro);
    const fw = fonte.naturalWidth || fonte.width;
    const fh = fonte.naturalHeight || fonte.height;
    if (ajuste && aspect && fw) {
      const aj = { ...AJUSTE_PADRAO, ...ajuste };
      const w = aspect >= 1 ? 2048 : Math.round(2048 * aspect);
      const h = Math.round(w / aspect);
      const cv = document.createElement("canvas");
      cv.width = w;
      cv.height = h;
      const c2 = cv.getContext("2d");
      c2.fillStyle = "#fff";
      c2.fillRect(0, 0, w, h);
      const base = aj.modo === "caber" ? Math.min(w / fw, h / fh) : Math.max(w / fw, h / fh);
      const sc = base * aj.zoom;
      const dw = fw * sc;
      const dh = fh * sc;
      const dx = (w - dw) / 2 + aj.x * (Math.abs(w - dw) / 2);
      const dy = (h - dh) / 2 + aj.y * (Math.abs(h - dh) / 2);
      c2.imageSmoothingQuality = "high";
      c2.drawImage(fonte, dx, dy, dw, dh);
      t.image = cv;
    } else {
      t.image = fonte;
      if (aspect && fw) {
        const ia = fw / fh; // "object-fit: cover"
        if (ia > aspect) {
          t.repeat.x = aspect / ia;
          t.offset.x = (1 - t.repeat.x) / 2;
        } else {
          t.repeat.y = ia / aspect;
          t.offset.y = (1 - t.repeat.y) / 2;
        }
      }
    }
    t.dispose(); // o tamanho mudou: força realocar a textura na GPU
    t.needsUpdate = true;
  };
  im.src = src;
  return ctx3.track(t);
}

// ---------------------------------------------------------------- materiais

export function matPapel(map) {
  return new THREE.MeshStandardMaterial({ color: "#fffdf8", roughness: 0.92, map: map || null });
}

export function matCapa(ctx3, { cor, mat, map }) {
  const m = MATERIAIS[mat] || MATERIAIS.carton;
  const base = {
    color: map ? "#ffffff" : cor,
    map: map || null,
    roughness: m.rough,
    clearcoat: m.clear,
    clearcoatRoughness: 0.18,
  };
  const p = new THREE.MeshPhysicalMaterial(base);
  if (m.bump) {
    const g = texturaGrao(ctx3, mat);
    g.wrapS = g.wrapT = THREE.RepeatWrapping;
    g.repeat.set(mat === "couro" ? 5 : 8, mat === "couro" ? 7 : 11);
    p.bumpMap = g;
    p.bumpScale = mat === "couro" ? 1.6 : 0.8;
  }
  return p;
}

export function matMetal(metal) {
  const c = METAIS3D[metal]?.color || (/^#[0-9a-f]{6}$/i.test(metal || "") ? metal : METAIS3D.prata.color);
  return new THREE.MeshStandardMaterial({ color: c, metalness: 1, roughness: 0.28 });
}

export function matCor(cor, rough = 0.7) {
  return new THREE.MeshStandardMaterial({ color: cor, roughness: rough });
}

const MAT_FURO = new THREE.MeshBasicMaterial({ color: "#14161a" });

// ---------------------------------------------------------------- helpers

export function caixa(w, h, d, mats, { sombra = true } = {}) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mats);
  m.castShadow = sombra;
  m.receiveShadow = true;
  return m;
}

// Face order da BoxGeometry: +x, -x, +y, -y, +z, -z
export function mats6({ topo, lados, base }) {
  return [lados, lados, topo, base || lados, lados, lados];
}

// Formas de furação (vistas de cima; origem = centro do furo).
// cogumelo: cabeça redonda + haste aberta para a borda (-x), como na agenda de discos.
const GEO_FURO = {};
function geoFuro(forma, haste = 0.09) {
  const key = `${forma}|${Math.round(haste * 1000)}`;
  if (GEO_FURO[key]) return GEO_FURO[key];
  const sh = new THREE.Shape();
  if (forma === "quadrado") {
    const h = 0.0115;
    sh.moveTo(-h, -h); sh.lineTo(h, -h); sh.lineTo(h, h); sh.lineTo(-h, h); sh.closePath();
  } else if (forma === "oblongo") {
    const w = 0.009, l = 0.019;
    sh.moveTo(-w, -l + w);
    sh.absarc(0, -l + w, w, Math.PI, 0, false);
    sh.lineTo(w, l - w);
    sh.absarc(0, l - w, w, 0, Math.PI, false);
    sh.closePath();
  } else if (forma === "cogumelo") {
    const R = 0.05, hs = 0.02, cx = 0;
    const dx = Math.sqrt(R * R - hs * hs);
    const a0 = Math.atan2(-hs, -dx);
    const a1 = Math.atan2(hs, -dx);
    sh.moveTo(-haste, -hs);
    sh.lineTo(cx - dx, -hs);
    sh.absarc(cx, 0, R, a0, a1, false);
    sh.lineTo(-haste, hs);
    sh.closePath();
  } else {
    sh.absarc(0, 0, 0.012, 0, Math.PI * 2, false);
  }
  const geo = new THREE.ShapeGeometry(sh, 20);
  geo.rotateX(-Math.PI / 2);
  GEO_FURO[key] = geo;
  return geo;
}

// forma padrão: wire-o quadrado, espiral redondo, discos cogumelo.
export function formaFuro(forma, tipo) {
  if (forma && forma !== "auto") return forma;
  if (tipo === "wireo") return "quadrado";
  if (tipo === "discos") return "cogumelo";
  return "redondo";
}

export function furo(x, y, z, forma = "redondo", esc = 1, haste = 0.09) {
  const m = new THREE.Mesh(geoFuro(forma, haste / esc), MAT_FURO);
  m.position.set(x, y, z);
  if (esc !== 1) m.scale.setScalar(esc);
  return m;
}

export function tubo(curva, seg, raio, mat) {
  const m = new THREE.Mesh(new THREE.TubeGeometry(curva, seg, raio, 8, false), mat);
  m.castShadow = true;
  return m;
}

export function elipseCurva(cx, cy, a, b, passoGrau = 8) {
  const pts = [];
  for (let d = 0; d <= 360; d += passoGrau) {
    const r = (d * Math.PI) / 180;
    pts.push(new THREE.Vector3(cx + a * Math.cos(r), cy + b * Math.sin(r), 0));
  }
  return new THREE.CatmullRomCurve3(pts, true);
}


// Placa plana (capa/miolo) com os cantos do lado da borda externa arredondados.
// UV: tampas mapeadas em planta (x,z); laterais em (x+z, y).
export function placa(W, H, T, { raio = 0, matCap, matLado }) {
  const r = Math.min(raio, W / 2.5, H / 2.5);
  const s = new THREE.Shape();
  s.moveTo(-W / 2, -H / 2);
  if (r > 0) {
    s.lineTo(W / 2 - r, -H / 2);
    s.quadraticCurveTo(W / 2, -H / 2, W / 2, -H / 2 + r);
    s.lineTo(W / 2, H / 2 - r);
    s.quadraticCurveTo(W / 2, H / 2, W / 2 - r, H / 2);
  } else {
    s.lineTo(W / 2, -H / 2);
    s.lineTo(W / 2, H / 2);
  }
  s.lineTo(-W / 2, H / 2);
  s.closePath();
  const geo = new THREE.ExtrudeGeometry(s, { depth: T, bevelEnabled: false, curveSegments: 10 });
  geo.rotateX(-Math.PI / 2);
  geo.translate(0, -T / 2, 0);
  const pos = geo.attributes.position;
  const nor = geo.attributes.normal;
  const uv = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    if (Math.abs(nor.getY(i)) > 0.5) {
      uv[i * 2] = (x + W / 2) / W;
      uv[i * 2 + 1] = (H / 2 - z) / H;
    } else {
      uv[i * 2] = (x + z) * 0.7;
      uv[i * 2 + 1] = (y + T / 2) / T;
    }
  }
  geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  const m = new THREE.Mesh(geo, [matCap, matLado]);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

// Dimensões do modelo conforme a disposição da encadernação.
// O modelo é sempre construído com a lombada à esquerda (-x) e depois girado.
function orientar(o) {
  const b = TAMANHOS[o.tamanho] || TAMANHOS.a5;
  const disp = o.disp || "esquerda";
  if (disp === "topo") return { W: b.h, H: b.w, rotY: -Math.PI / 2, giro: -90 };
  if (disp === "direita") return { W: b.w, H: b.h, rotY: Math.PI, giro: 180 };
  return { W: b.w, H: b.h, rotY: 0, giro: 0 };
}

function finalizar(g, { rotY, W, H, T }) {
  const out = new THREE.Group();
  out.add(g);
  out.rotation.y = rotY;
  const gira90 = Math.abs(Math.abs(rotY) - Math.PI / 2) < 0.01;
  out.userData.w = gira90 ? H : W;
  out.userData.h = gira90 ? W : H;
  out.userData.t = T;
  return out;
}

// Anéis enrolados (wire-o = argolas fechadas; espiral = hélice contínua).
// n = quantidade (null = automático pelo tamanho).
function aneisEnrolados(g, { tipo, metalMat, H, n, cx, cy, a, b, furosX, yFuro, forma, bordaX = null }) {
  const fe = forma === "cogumelo" ? 0.6 : 1;
  const mk = (fx, z) => furo(fx, yFuro, z, forma, fe, bordaX === null ? 0.07 * fe : Math.max(0.01, fx - bordaX));
  if (tipo === "wireo") {
    const margem = 0.17;
    const total = H - margem * 2;
    // wire-o "de verdade" é duplo: cada passo tem dois anéis lado a lado.
    const k = Math.max(2, n || Math.floor(total / 0.12) + 1);
    const geo = new THREE.TubeGeometry(elipseCurva(cx, cy, a, b), 56, 0.0075, 8, true);
    for (let i = 0; i < k; i++) {
      const z = -total / 2 + (i * total) / (k - 1);
      [-0.0165, 0.0165].forEach((dz) => {
        const r = new THREE.Mesh(geo, metalMat);
        r.position.z = z + dz;
        r.castShadow = true;
        g.add(r);
        furosX.forEach((fx) => g.add(mk(fx, z + dz)));
      });
    }
  } else {
    const turns = Math.max(3, n || Math.floor((H - 0.3) / 0.09));
    const pitch = (H - 0.3) / turns;
    const total = turns * pitch;
    const N = turns * 28;
    const pts = [];
    for (let i = 0; i <= N; i++) {
      const t = i / 28;
      const ang = t * Math.PI * 2;
      pts.push(new THREE.Vector3(cx + a * Math.cos(ang), cy + b * Math.sin(ang), -total / 2 + t * pitch));
    }
    g.add(tubo(new THREE.CatmullRomCurve3(pts), N * 2, 0.0095, metalMat));
    for (let i = 0; i < turns; i++) {
      furosX.forEach((fx) => g.add(mk(fx, -total / 2 + i * pitch)));
    }
  }
}

// Agenda infinita: discos de plástico/metal em furos de cogumelo.
function zsDiscos(H, n) {
  const total = H - 0.5;
  const k = Math.max(3, n || Math.floor(total / 0.13) + 1);
  const sp = total / (k - 1);
  return { zs: Array.from({ length: k }, (_, i) => -total / 2 + i * sp), r: Math.min(0.045, sp * 0.46) };
}

function disco(metalMat, r, hAlto, yBase) {
  const g = new THREE.Group();
  const rim = Math.max(0.005, r * 0.14);
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.58, r * 0.58, hAlto, 20), metalMat);
  hub.position.y = yBase + hAlto / 2;
  const topo = new THREE.Mesh(new THREE.CylinderGeometry(r, r, rim, 28), metalMat);
  topo.position.y = yBase + hAlto + rim / 2;
  const base = topo.clone();
  base.position.y = yBase - rim / 2;
  [hub, topo, base].forEach((m) => { m.castShadow = true; g.add(m); });
  return g;
}

function zsArgolas(H, n) {
  const k = Math.max(2, Math.min(8, n || 3));
  const sp = (H * 0.64) / (k - 1);
  return Array.from({ length: k }, (_, i) => -H * 0.32 + i * sp);
}

export function caneta(cor, metalMat) {
  const g = new THREE.Group();
  const corpo = new THREE.Mesh(
    new THREE.CylinderGeometry(0.024, 0.024, 1.05, 24).rotateX(Math.PI / 2),
    new THREE.MeshPhysicalMaterial({ color: cor, roughness: 0.3, clearcoat: 0.8 }),
  );
  const ponta = new THREE.Mesh(new THREE.ConeGeometry(0.024, 0.2, 24).rotateX(Math.PI / 2), metalMat);
  ponta.position.z = 0.625;
  const fundo = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.05, 24).rotateX(Math.PI / 2), metalMat);
  fundo.position.z = -0.54;
  const clipe = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.012, 0.42), metalMat);
  clipe.position.set(0, 0.03, -0.3);
  [corpo, ponta, fundo, clipe].forEach((m) => {
    m.castShadow = true;
    g.add(m);
  });
  return g;
}

// ---------------------------------------------------------------- caderno FECHADO

export function construirFechado(ctx3, o) {
  const { tipo, metal, mat, corCapa, capaSrc } = o;
  const { W, H, rotY, giro } = orientar(o);
  const duro = tipo === "argolas" || tipo === "brochura" || tipo === "costura";
  const c = duro ? 0.026 : 0.012;
  const T = o.Tov ?? (tipo === "grampo" ? 0.07 : 0.2);
  const g = new THREE.Group();

  const mapCapa = carregarTextura(ctx3, capaSrc, W / H, giro, o.ajuste);
  const capa = matCapa(ctx3, { cor: corCapa, mat, map: mapCapa });
  const capaCor = matCapa(ctx3, { cor: corCapa, mat, map: null });
  // lados/lombada acompanham a cor predominante da arte da capa
  if (capaSrc) {
    const im = new Image();
    im.onload = () => {
      const cv = document.createElement("canvas");
      cv.width = cv.height = 1;
      const x = cv.getContext("2d");
      x.drawImage(im, im.width * 0.04, im.height * 0.04, 6, 6, 0, 0, 1, 1);
      const [r, gg, bb] = x.getImageData(0, 0, 1, 1).data;
      capaCor.color.setRGB(r / 255, gg / 255, bb / 255, THREE.SRGBColorSpace);
    };
    im.src = capaSrc;
  }
  const bordaPag = new THREE.MeshStandardMaterial({ map: texturaBordaPaginas(ctx3), roughness: 0.95 });
  const pagTopo = matPapel();

  const over = duro ? 0.025 : 0.005;
  const rad = o.cantos ? 0.11 : 0;

  let back;
  let front;
  if (rad) {
    back = placa(W, H, c, { raio: rad, matCap: capaCor, matLado: capaCor });
    front = placa(W, H, c, { raio: rad, matCap: capa, matLado: capaCor });
  } else {
    back = caixa(W, c, H, mats6({ topo: capaCor, lados: capaCor }));
    front = caixa(W, c, H, mats6({ topo: capa, lados: capaCor, base: capaCor }));
  }
  back.position.y = c / 2;
  front.position.y = c + T + c / 2;
  g.add(back, front);

  const pw = W - (duro ? over * 2 : 0.04);
  const ph = H - over * 2;
  const pages = rad
    ? placa(pw, ph, T, { raio: rad * 0.8, matCap: pagTopo, matLado: bordaPag })
    : caixa(pw, T, ph, mats6({ topo: pagTopo, lados: bordaPag }));
  pages.position.set(duro ? 0.005 : 0.0, c + T / 2, 0);
  g.add(pages);

  const yTop = c + T + c;
  const yMid = yTop / 2;
  const metalMat = matMetal(metal);

  if (tipo === "wireo" || tipo === "espiral") {
    const bR = yMid + 0.032;
    const a = tipo === "wireo" ? 0.062 : 0.052;
    const xc = -W / 2 + 0.008;
    const s = Math.sqrt(Math.max(0.05, 1 - Math.pow((yTop - yMid) / bR, 2)));
    aneisEnrolados(g, {
      tipo, metalMat, H, n: o.aneis,
      cx: xc, cy: yMid, a, b: bR,
      furosX: [xc + a * s], yFuro: yTop + 0.0007,
      forma: formaFuro(o.furo, tipo), bordaX: -W / 2,
    });
  }

  if (tipo === "discos") {
    const { zs, r } = zsDiscos(H, o.aneis);
    const forma = formaFuro(o.furo, tipo);
    const esc = r / 0.045;
    const dx = -W / 2 + 0.07 * esc;
    for (const z of zs) {
      g.add(furo(dx, yTop + 0.0007, z, forma, esc, 0.07 * esc));
      const d = disco(metalMat, r * 0.82, yTop, 0);
      d.position.set(dx - 0.012 * esc, 0, z);
      g.add(d);
    }
  }

  if (tipo === "argolas") {
    const sp = caixa(0.07, T + c * 2 + 0.006, H + 0.004, matCor(corCapa, 0.6));
    sp.position.set(-W / 2 + 0.035, yMid + 0.003, 0);
    g.add(sp);
    for (const z of zsArgolas(H, o.aneis)) {
      const riv = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.008, 20), metalMat);
      riv.position.set(-W / 2 + 0.035, yTop + 0.009, z);
      riv.castShadow = true;
      g.add(riv);
    }
    const sulco = caixa(0.006, 0.002, H - 0.02, matCor("#000000", 1), { sombra: false });
    sulco.material.transparent = true;
    sulco.material.opacity = 0.35;
    sulco.position.set(-W / 2 + 0.085, yTop + 0.001, 0);
    g.add(sulco);
  }

  if (tipo === "brochura" || tipo === "costura") {
    const r = (T + c * 2) / 2;
    const geo = new THREE.CylinderGeometry(r, r, H, 28, 1, false, Math.PI, Math.PI);
    const lomb = new THREE.Mesh(geo, matCor(corCapa, 0.6));
    lomb.rotation.x = Math.PI / 2;
    lomb.position.set(-W / 2, yMid, 0);
    lomb.castShadow = true;
    g.add(lomb);
    const vinco = caixa(0.008, 0.0015, H - 0.01, matCor("#000", 1), { sombra: false });
    vinco.material.transparent = true;
    vinco.material.opacity = 0.32;
    vinco.position.set(-W / 2 + 0.09, yTop + 0.001, 0);
    g.add(vinco);
    if (tipo === "costura") {
      const fio = matMetal(metal);
      fio.metalness = 0;
      fio.roughness = 0.9;
      for (let z = -H / 2 + 0.2; z < H / 2 - 0.15; z += 0.28) {
        const s2 = caixa(0.05, 0.003, 0.012, fio, { sombra: false });
        s2.position.set(-W / 2 + 0.03, yTop + 0.0015, z);
        g.add(s2);
      }
    }
  }

  if (tipo === "grampo") {
    for (const z of [-H * 0.26, H * 0.26]) {
      const crown = caixa(0.014, 0.02, 0.06, metalMat);
      crown.position.set(-W / 2 - 0.004, yMid, z);
      g.add(crown);
      const pr = caixa(0.03, 0.003, 0.058, metalMat, { sombra: false });
      pr.position.set(-W / 2 + 0.02, yTop + 0.0015, z);
      g.add(pr);
    }
  }

  // ---------- extras ----------
  if (o.elastico) {
    const mE = matCor(o.corElastico || "#111111", 0.6);
    const L = (o.elasticoLarg || 6) / 100;
    const ex = W / 2 - (o.elasticoPos ?? 22) / 100;
    const topo = caixa(L, 0.004, H + 0.008, mE, { sombra: false });
    topo.position.set(ex, yTop + 0.002, 0);
    const baixo = caixa(L, 0.004, H + 0.008, mE, { sombra: false });
    baixo.position.set(ex, -0.0005, 0);
    g.add(topo, baixo);
    for (const sz of [-1, 1]) {
      const ponta = caixa(L, yTop + 0.008, 0.004, mE, { sombra: false });
      ponta.position.set(ex, yTop / 2, sz * (H / 2 + 0.002));
      g.add(ponta);
    }
    const mpl = caixa(L + 0.008, 0.002, 0.07, metalMat, { sombra: false });
    mpl.position.set(ex, yTop + 0.005, -H * 0.18);
    g.add(mpl);
    if (o.passante) {
      // passante: tirinha que prende o elástico na capa
      const mP = matCor(o.corPassante || o.corElastico || "#111111", 0.55);
      const pz = H * 0.2;
      const lp = L + 0.03;
      const cima = caixa(lp, 0.006, 0.09, mP, { sombra: true });
      cima.position.set(ex, yTop + 0.007, pz);
      g.add(cima);
      for (const sx of [-1, 1]) {
        const lado = caixa(0.008, 0.012, 0.09, mP, { sombra: false });
        lado.position.set(ex + sx * (lp / 2 - 0.004), yTop + 0.002, pz);
        g.add(lado);
      }
    }
  }

  if (o.fita) {
    const mF = matCor(o.corFita || "#b3262e", 0.45);
    const comp = 0.34;
    const queda = Math.atan2(c + 0.006 - 0.002, comp);
    const fita = caixa(0.026, 0.003, comp, mF, { sombra: false });
    fita.position.set(W * 0.08, (c + 0.006 + 0.002) / 2, H / 2 + comp / 2 - 0.06);
    fita.rotation.x = queda;
    g.add(fita);
  }

  if (o.caneta) {
    const zr = -H / 2 + 0.42;
    const cxp = W / 2 + 0.004;
    const anel = new THREE.Mesh(new THREE.TorusGeometry(0.036, 0.0075, 10, 28), matCor(corCapa, 0.5));
    anel.position.set(cxp, yMid, zr);
    anel.castShadow = true;
    g.add(anel);
    const ancora = caixa(0.09, 0.004, 0.04, matCor(corCapa, 0.5), { sombra: false });
    ancora.position.set(W / 2 - 0.04, yTop + 0.002, zr);
    g.add(ancora);
    const cn = caneta("#1b2430", metalMat);
    cn.position.set(cxp, yMid, zr + 0.18);
    g.add(cn);
  }

  return finalizar(g, { rotY, W, H, T: T + c * 2 });
}

// ---------------------------------------------------------------- caderno ABERTO

export function construirAberto(ctx3, o) {
  const { tipo, metal, mat, corCapa, miolosrc } = o;
  const { W, H, rotY, giro } = orientar(o);
  const duro = tipo === "argolas" || tipo === "brochura" || tipo === "costura";
  const c = duro ? 0.026 : 0.012;
  const T = tipo === "grampo" ? 0.07 : 0.2;
  const tl = T / 2;
  const g = new THREE.Group();
  const pw = W - 0.03;
  const ph = H - (duro ? 0.05 : 0.02);

  const capaCor = matCapa(ctx3, { cor: corCapa, mat, map: null });
  const bordaPag = new THREE.MeshStandardMaterial({ map: texturaBordaPaginas(ctx3), roughness: 0.95 });
  const mapMiolo = carregarTextura(ctx3, miolosrc, pw / ph, giro);
  const matDir = matPapel(mapMiolo || texturaPautado(ctx3, { giro, tipo: o.mioloTipo }));
  const matEsq = matPapel(texturaPautado(ctx3, { giro, tipo: o.mioloTipo }));

  const base = caixa(W * 2 + 0.02, c, H + (duro ? 0.05 : 0.01), mats6({ topo: capaCor, lados: capaCor }));
  base.position.y = c / 2;
  g.add(base);

  const esq = caixa(pw, tl, ph, mats6({ topo: matEsq, lados: bordaPag }));
  esq.position.set(-pw / 2 - 0.004, c + tl / 2, 0);
  const dir = caixa(pw, tl, ph, mats6({ topo: matDir, lados: bordaPag }));
  dir.position.set(pw / 2 + 0.004, c + tl / 2, 0);
  g.add(esq, dir);

  const yTop = c + tl;
  const gut = new THREE.Mesh(
    new THREE.PlaneGeometry(0.34, ph),
    new THREE.MeshBasicMaterial({ map: texturaGutter(ctx3), transparent: true, depthWrite: false }),
  );
  gut.rotation.x = -Math.PI / 2;
  gut.position.set(0, yTop + 0.001, 0);
  g.add(gut);

  const metalMat = matMetal(metal);

  if (tipo === "wireo" || tipo === "espiral") {
    const a = tipo === "wireo" ? 0.06 : 0.05;
    aneisEnrolados(g, {
      tipo, metalMat, H, n: o.aneis,
      cx: 0, cy: yTop - 0.005, a, b: 0.06,
      furosX: [-a, a], yFuro: yTop + 0.0007,
      forma: formaFuro(o.furo, tipo),
    });
  }

  if (tipo === "discos") {
    const { zs, r } = zsDiscos(H, o.aneis);
    const forma = formaFuro(o.furo, tipo);
    for (const z of zs) {
      const esc = r / 0.045;
      const fe = furo(-0.08 * esc, yTop + 0.0007, z, forma, esc, 0.08 * esc);
      fe.rotation.y = Math.PI; // haste voltada ao centro
      g.add(fe, furo(0.08 * esc, yTop + 0.0007, z, forma, esc, 0.08 * esc));
      const d = disco(metalMat, r * 0.82, tl, c);
      d.position.set(0, 0, z);
      g.add(d);
    }
  }

  if (tipo === "argolas") {
    const placaM = caixa(0.07, 0.012, H - 0.06, metalMat);
    placaM.position.set(-0.18, yTop + 0.006, 0);
    g.add(placaM);
    const geo = new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(
        Array.from({ length: 33 }, (_, i) => {
          const r = (i / 32) * Math.PI;
          return new THREE.Vector3(-0.18 + 0.12 * Math.cos(r), yTop + 0.012 + (T + 0.03) * Math.sin(r), 0);
        }),
      ),
      40, 0.0125, 8, false,
    );
    for (const z of zsArgolas(H, o.aneis)) {
      const r = new THREE.Mesh(geo, metalMat);
      r.position.z = z;
      r.castShadow = true;
      g.add(r);
    }
  }

  if (tipo === "costura") {
    const fio = matCor("#e9dfc6", 0.9);
    for (let z = -H / 2 + 0.2; z < H / 2 - 0.1; z += 0.2) {
      const s = caixa(0.01, 0.003, 0.11, fio, { sombra: false });
      s.position.set(0, yTop + 0.0018, z);
      g.add(s);
    }
  }

  if (tipo === "grampo") {
    for (const z of [-H * 0.26, H * 0.26]) {
      const s = caixa(0.012, 0.004, 0.06, metalMat, { sombra: false });
      s.position.set(0, yTop + 0.002, z);
      g.add(s);
    }
  }

  return finalizar(g, { rotY, W: W * 2, H, T: c + tl });
}

// ---------------------------------------------------------------- BLOCO (pad)

export function construirBloco(ctx3, o) {
  const { formato, lado, espessura, folhaSrc, papelao, corCola, destacando } = o;
  const f = FORMATOS_BLOCO[formato] || FORMATOS_BLOCO.retrato;
  const { w: W, h: H } = f;
  const T = 0.05 + espessura * 0.03;
  const g = new THREE.Group();

  const mapFolha = carregarTextura(ctx3, folhaSrc, W / H) || texturaPautado(ctx3, { tipo: o.mioloTipo });
  const bordaPag = new THREE.MeshStandardMaterial({ map: texturaBordaPaginas(ctx3), roughness: 0.95 });
  const folha = matPapel(mapFolha);
  const cor = PAPELAO3D[papelao] || papelao;
  const kraft = matCor(cor, 0.85);

  const deslocX = destacando ? -W * 0.28 : 0;
  const pad = new THREE.Group();
  pad.position.x = deslocX;

  const base = caixa(W + 0.012, 0.012, H + 0.012, kraft);
  base.position.y = 0.006;
  const stack = caixa(W, T, H, mats6({ topo: folha, lados: bordaPag }));
  stack.position.y = 0.012 + T / 2;
  pad.add(base, stack);

  const faixa = 0.075;
  const colaMat = matCor(corCola, 0.55);
  const fita =
    lado === "topo"
      ? caixa(W + 0.004, T + 0.006, faixa, colaMat)
      : caixa(faixa, T + 0.006, H + 0.004, colaMat);
  fita.position.set(
    lado === "topo" ? 0 : -W / 2 + faixa / 2 - 0.002,
    0.012 + (T + 0.006) / 2,
    lado === "topo" ? -H / 2 + faixa / 2 - 0.002 : 0,
  );
  pad.add(fita);
  // picote
  const picote = new THREE.Mesh(
    new THREE.PlaneGeometry(lado === "topo" ? W : H, 0.004),
    new THREE.MeshBasicMaterial({ color: "#000", transparent: true, opacity: 0.25 }),
  );
  picote.rotation.x = -Math.PI / 2;
  if (lado === "topo") picote.position.set(0, 0.012 + T + 0.0012, -H / 2 + faixa + 0.012);
  else {
    picote.rotation.z = Math.PI / 2;
    picote.position.set(-W / 2 + faixa + 0.012, 0.012 + T + 0.0012, 0);
  }
  pad.add(picote);
  g.add(pad);

  if (destacando) {
    const solta = caixa(W, 0.004, H, mats6({ topo: folha, lados: bordaPag }));
    solta.position.set(W * 0.62, 0.002, H * 0.05);
    solta.rotation.y = 0.16;
    g.add(solta);
  }

  g.userData.w = destacando ? W * 1.75 : W;
  g.userData.h = H;
  g.userData.t = T;
  return g;
}

// ---------------------------------------------------------------- CALENDÁRIO DE MESA

export function construirCalendario(ctx3, o) {
  const tipo = o.tipo === "espiral" ? "espiral" : "wireo";
  const art = o.folhaSrc || o.capaSrc;
  const book = construirFechado(ctx3, {
    ...o, tipo, disp: "topo", Tov: 0.05, capaSrc: art, view: "fechada",
    elastico: false, fita: false, caneta: false,
  });
  const al = 1.22; // ~70° de inclinação
  const stand = new THREE.Group();
  stand.add(book);
  stand.rotation.x = al;
  stand.updateMatrixWorld(true);
  const bb = new THREE.Box3().setFromObject(stand);
  stand.position.y = -bb.min.y;

  const out = new THREE.Group();
  out.add(stand);

  // pé de apoio (cavalete) preso à parte de trás do painel
  const Wd = book.userData.w;
  const Lp = book.userData.h;
  const u = new THREE.Vector3(0, Math.sin(al), -Math.cos(al));
  const nrm = new THREE.Vector3(0, Math.cos(al), Math.sin(al));
  const C = new THREE.Vector3(0, stand.position.y, 0);
  const A = C.clone().add(u.clone().multiplyScalar(Lp * (0.8 - 0.5))).add(nrm.clone().multiplyScalar(-0.06));
  const F = new THREE.Vector3(0, 0.01, A.z - Lp * 0.42);
  const d = F.clone().sub(A);
  const leg = caixa(Wd * 0.88, 0.02, d.length(), matCor(o.corCapa, 0.7));
  leg.position.copy(A.clone().add(F).multiplyScalar(0.5));
  leg.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), d.clone().normalize());
  out.add(leg);

  out.userData.w = Wd;
  out.userData.h = Lp * 0.85;
  out.userData.cy = (Lp * Math.sin(al)) / 2;
  out.userData.t = 0.1;
  return out;
}

// ---------------------------------------------------------------- KIT (agenda + bloco + caneta)

export function construirKit(ctx3, o) {
  const tipoK = o.tipo === "bloco" ? "espiral" : o.tipo;
  const out = new THREE.Group();
  const ag = construirFechado(ctx3, { ...o, tipo: tipoK, view: "fechada", disp: "esquerda" });
  const aw = ag.userData.w;
  const ah = ag.userData.h;
  ag.position.set(-0.5, 0, 0);
  ag.rotation.y = 0.1;
  const pad = construirBloco(ctx3, {
    formato: "pequeno", lado: "topo", espessura: 2, folhaSrc: o.folhaSrc,
    papelao: o.papelao, corCola: o.corCola, destacando: false,
  });
  pad.position.set(aw / 2 + 0.55, 0, 0.3);
  pad.rotation.y = -0.12;
  const cn = caneta(o.corCapa && o.corCapa !== "#ffffff" ? o.corCapa : "#1b2430", matMetal(o.metal));
  cn.position.set(aw / 2 + 0.2, 0.026, ah / 2 - 0.15);
  cn.rotation.y = 1.25;
  out.add(ag, pad, cn);
  const bb = new THREE.Box3().setFromObject(out);
  const cx = (bb.min.x + bb.max.x) / 2;
  out.children.forEach((ch) => (ch.position.x -= cx));
  out.userData.w = bb.max.x - bb.min.x;
  out.userData.h = Math.max(ah, bb.max.z - bb.min.z);
  out.userData.t = 0.2;
  return out;
}

export function construirBase(ctx3, o) {
  if (o.produto === "kit") return construirKit(ctx3, o);
  if (o.produto === "calendario") return construirCalendario(ctx3, o);
  if (o.produto === "bloco" || o.tipo === "bloco") {
    return construirBloco(
      ctx3,
      o.produto === "bloco"
        ? o
        : { ...o, formato: "retrato", lado: "topo", espessura: 3, folhaSrc: o.capaSrc, papelao: "kraft", corCola: "#c0392b", destacando: false },
    );
  }
  return o.view === "aberta" ? construirAberto(ctx3, o) : construirFechado(ctx3, o);
}
