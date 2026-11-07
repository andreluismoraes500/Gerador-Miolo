// src/components/mockup3d/build.js
//
// Construtores 3D (three.js) dos produtos do Mockup: cadernos/agendas com
// vários tipos de encadernação e blocos colados. Unidade: 1 = 10 cm.
// O objeto fica deitado sobre a mesa (y = 0), capa para cima, lombada à esquerda.

import * as THREE from "three";

import { TAMANHOS, FORMATOS_BLOCO, MATERIAIS, METAIS3D, PAPELAO3D } from "./opcoes";
export { TAMANHOS, FORMATOS_BLOCO, MATERIAIS, METAIS3D, PAPELAO3D };

// ---------------------------------------------------------------- texturas

function canvasTex(w, h, draw, srgb = true) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c.getContext("2d"), w, h);
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

export function texturaPautado(ctx3, { cor = "#b9c4d6", margem = true } = {}) {
  return ctx3.track(
    canvasTex(512, 724, (g, w, h) => {
      g.fillStyle = "#fffdf8";
      g.fillRect(0, 0, w, h);
      g.strokeStyle = cor;
      g.lineWidth = 1.4;
      for (let y = 110; y < h - 40; y += 30) {
        g.beginPath();
        g.moveTo(36, y);
        g.lineTo(w - 36, y);
        g.stroke();
      }
      if (margem) {
        g.strokeStyle = "#e8a5a5";
        g.beginPath();
        g.moveTo(64, 40);
        g.lineTo(64, h - 40);
        g.stroke();
      }
    }),
  );
}

function texturaBordaPaginas(ctx3) {
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

export function carregarTextura(ctx3, src, aspect) {
  if (!src) return null;
  const t = new THREE.TextureLoader().load(src, (tex) => {
    const im = tex.image;
    if (!aspect || !im?.width) return;
    const ia = im.width / im.height; // "object-fit: cover"
    if (ia > aspect) {
      tex.repeat.x = aspect / ia;
      tex.offset.x = (1 - tex.repeat.x) / 2;
    } else {
      tex.repeat.y = ia / aspect;
      tex.offset.y = (1 - tex.repeat.y) / 2;
    }
    tex.needsUpdate = true;
  });
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return ctx3.track(t);
}

// ---------------------------------------------------------------- materiais

function matPapel(map) {
  return new THREE.MeshStandardMaterial({ color: "#fffdf8", roughness: 0.92, map: map || null });
}

function matCapa(ctx3, { cor, mat, map }) {
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

function matMetal(metal) {
  const c = (METAIS3D[metal] || METAIS3D.prata).color;
  return new THREE.MeshStandardMaterial({ color: c, metalness: 1, roughness: 0.28 });
}

function matCor(cor, rough = 0.7) {
  return new THREE.MeshStandardMaterial({ color: cor, roughness: rough });
}

const MAT_FURO = new THREE.MeshBasicMaterial({ color: "#14161a" });

// ---------------------------------------------------------------- helpers

function caixa(w, h, d, mats, { sombra = true } = {}) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mats);
  m.castShadow = sombra;
  m.receiveShadow = true;
  return m;
}

// Face order da BoxGeometry: +x, -x, +y, -y, +z, -z
function mats6({ topo, lados, base }) {
  return [lados, lados, topo, base || lados, lados, lados];
}

function furo(x, y, z, r = 0.012) {
  const m = new THREE.Mesh(new THREE.CircleGeometry(r, 16), MAT_FURO);
  m.rotation.x = -Math.PI / 2;
  m.position.set(x, y, z);
  return m;
}

function tubo(curva, seg, raio, mat) {
  const m = new THREE.Mesh(new THREE.TubeGeometry(curva, seg, raio, 8, false), mat);
  m.castShadow = true;
  return m;
}

function elipseCurva(cx, cy, a, b, passoGrau = 8) {
  const pts = [];
  for (let d = 0; d <= 360; d += passoGrau) {
    const r = (d * Math.PI) / 180;
    pts.push(new THREE.Vector3(cx + a * Math.cos(r), cy + b * Math.sin(r), 0));
  }
  return new THREE.CatmullRomCurve3(pts, true);
}

function zsDoRing(H, passo, margem = 0.17) {
  const n = Math.max(3, Math.floor((H - margem * 2) / passo) + 1);
  const total = (n - 1) * passo;
  return Array.from({ length: n }, (_, i) => -total / 2 + i * passo);
}

// ---------------------------------------------------------------- caderno FECHADO

export function construirFechado(ctx3, o) {
  const { tipo, metal, mat, corCapa, capaSrc, tamanho } = o;
  const { w: W, h: H } = TAMANHOS[tamanho] || TAMANHOS.a5;
  const duro = tipo === "argolas" || tipo === "brochura" || tipo === "costura";
  const c = duro ? 0.026 : 0.012;
  const T = tipo === "grampo" ? 0.07 : 0.2;
  const g = new THREE.Group();

  const mapCapa = carregarTextura(ctx3, capaSrc, W / H);
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
  // contracapa e capa
  const back = caixa(W, c, H, mats6({ topo: capaCor, lados: capaCor }));
  back.position.y = c / 2;
  const front = caixa(W, c, H, mats6({ topo: capa, lados: capaCor, base: capaCor }));
  front.position.y = c + T + c / 2;
  g.add(back, front);

  // bloco de folhas
  const pw = W - (duro ? over * 2 : 0.04);
  const ph = H - over * 2;
  const pages = caixa(pw, T, ph, mats6({ topo: pagTopo, lados: bordaPag }));
  pages.position.set(duro ? 0.005 : 0.0, c + T / 2, 0);
  g.add(pages);

  const yTop = c + T + c; // topo da capa
  const yMid = (c + T + c) / 2;
  const metalMat = matMetal(metal);

  if (tipo === "wireo" || tipo === "espiral") {
    const bR = yMid + 0.032; // meia-altura do anel (acima/abaixo do bloco)
    const a = tipo === "wireo" ? 0.062 : 0.052;
    const xc = -W / 2 + 0.008;
    const s = Math.sqrt(Math.max(0.05, 1 - Math.pow((yTop - yMid) / bR, 2)));
    const hx = xc + a * s;
    // recua folhas e capas para o anel passar "pelos furos"
    if (tipo === "wireo") {
      const passo = 0.085;
      const zs = zsDoRing(H, passo);
      const geo = new THREE.TubeGeometry(elipseCurva(xc, yMid, a, bR), 56, 0.0085, 8, true);
      for (const z of zs) {
        const r = new THREE.Mesh(geo, metalMat);
        r.position.z = z;
        r.castShadow = true;
        g.add(r);
        g.add(furo(hx, yTop + 0.0007, z));
      }
    } else {
      const turns = Math.floor((H - 0.3) / 0.09);
      const pts = [];
      const pitch = 0.09;
      const total = turns * pitch;
      const N = turns * 28;
      for (let i = 0; i <= N; i++) {
        const t = i / 28; // voltas
        const ang = t * Math.PI * 2;
        pts.push(new THREE.Vector3(xc + a * Math.cos(ang), yMid + bR * Math.sin(ang), -total / 2 + t * pitch));
      }
      g.add(tubo(new THREE.CatmullRomCurve3(pts), N * 2, 0.0095, metalMat));
      for (let i = 0; i < turns; i++) g.add(furo(hx, yTop + 0.0007, -total / 2 + (i + 0.0) * pitch));
    }
  }

  if (tipo === "argolas") {
    // lombada grossa + rebites
    const sp = caixa(0.07, T + c * 2 + 0.006, H + 0.004, matCor(corCapa, 0.6));
    sp.position.set(-W / 2 + 0.035, yMid + 0.003, 0);
    g.add(sp);
    for (const z of [-H * 0.3, 0, H * 0.3]) {
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
    lomb.rotation.z = 0;
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
        const s = caixa(0.05, 0.003, 0.012, fio, { sombra: false });
        s.position.set(-W / 2 + 0.03, yTop + 0.0015, z);
        g.add(s);
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

  g.userData.w = W;
  g.userData.h = H;
  g.userData.t = T + c * 2;
  return g;
}

// ---------------------------------------------------------------- caderno ABERTO

export function construirAberto(ctx3, o) {
  const { tipo, metal, mat, corCapa, miolosrc, tamanho } = o;
  const { w: W, h: H } = TAMANHOS[tamanho] || TAMANHOS.a5;
  const duro = tipo === "argolas" || tipo === "brochura" || tipo === "costura";
  const c = duro ? 0.026 : 0.012;
  const T = tipo === "grampo" ? 0.07 : 0.2;
  const tl = T / 2; // espessura de cada lado
  const g = new THREE.Group();
  const pw = W - 0.03;
  const ph = H - (duro ? 0.05 : 0.02);

  const capaCor = matCapa(ctx3, { cor: corCapa, mat, map: null });
  const bordaPag = new THREE.MeshStandardMaterial({ map: texturaBordaPaginas(ctx3), roughness: 0.95 });
  const mapMiolo = carregarTextura(ctx3, miolosrc, pw / ph);
  const matDir = matPapel(mapMiolo || texturaPautado(ctx3));
  const matEsq = matPapel(texturaPautado(ctx3));

  const base = caixa(W * 2 + 0.02, c, H + (duro ? 0.05 : 0.01), mats6({ topo: capaCor, lados: capaCor }));
  base.position.y = c / 2;
  g.add(base);

  const esq = caixa(pw, tl, ph, mats6({ topo: matEsq, lados: bordaPag }));
  esq.position.set(-pw / 2 - 0.004, c + tl / 2, 0);
  const dir = caixa(pw, tl, ph, mats6({ topo: matDir, lados: bordaPag }));
  dir.position.set(pw / 2 + 0.004, c + tl / 2, 0);
  g.add(esq, dir);

  const yTop = c + tl;
  // sombra da dobra
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
    const bR = 0.06;
    if (tipo === "wireo") {
      const geo = new THREE.TubeGeometry(elipseCurva(0, yTop - 0.005, a, bR), 56, 0.0085, 8, true);
      for (const z of zsDoRing(H, 0.085)) {
        const r = new THREE.Mesh(geo, metalMat);
        r.position.z = z;
        r.castShadow = true;
        g.add(r);
        g.add(furo(-a, yTop + 0.0007, z), furo(a, yTop + 0.0007, z));
      }
    } else {
      const turns = Math.floor((H - 0.3) / 0.09);
      const pitch = 0.09;
      const total = turns * pitch;
      const N = turns * 28;
      const pts = [];
      for (let i = 0; i <= N; i++) {
        const t = i / 28;
        const ang = t * Math.PI * 2;
        pts.push(new THREE.Vector3(a * Math.cos(ang), yTop - 0.005 + bR * Math.sin(ang), -total / 2 + t * pitch));
      }
      g.add(tubo(new THREE.CatmullRomCurve3(pts), N * 2, 0.0095, metalMat));
      for (let i = 0; i < turns; i++) {
        const z = -total / 2 + i * pitch;
        g.add(furo(-a, yTop + 0.0007, z), furo(a, yTop + 0.0007, z));
      }
    }
  }

  if (tipo === "argolas") {
    const x0 = -W * 0.5 - 0.02 + 0.0;
    const placa = caixa(0.07, 0.012, H - 0.06, metalMat);
    placa.position.set(-0.18, yTop + 0.006, 0);
    g.add(placa);
    const geo = new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(
        Array.from({ length: 33 }, (_, i) => {
          const r = (i / 32) * Math.PI;
          return new THREE.Vector3(-0.18 + 0.12 * Math.cos(r), yTop + 0.012 + (T + 0.03) * Math.sin(r), 0);
        }),
      ),
      40,
      0.0125,
      8,
      false,
    );
    for (const z of [-H * 0.3, 0, H * 0.3]) {
      const r = new THREE.Mesh(geo, metalMat);
      r.position.z = z;
      r.castShadow = true;
      g.add(r);
    }
    void x0;
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

  g.userData.w = W * 2;
  g.userData.h = H;
  g.userData.t = c + tl;
  return g;
}

// ---------------------------------------------------------------- BLOCO (pad)

export function construirBloco(ctx3, o) {
  const { formato, lado, espessura, folhaSrc, papelao, corCola, destacando } = o;
  const f = FORMATOS_BLOCO[formato] || FORMATOS_BLOCO.retrato;
  const { w: W, h: H } = f;
  const T = 0.05 + espessura * 0.03;
  const g = new THREE.Group();

  const mapFolha = carregarTextura(ctx3, folhaSrc, W / H) || texturaPautado(ctx3);
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

export function construir(ctx3, o) {
  if (o.produto === "bloco" || o.tipo === "bloco") {
    return construirBloco(ctx3, o.produto === "bloco" ? o : { ...o, formato: "retrato", lado: "topo", espessura: 3, folhaSrc: o.capaSrc, papelao: "kraft", corCola: "#c0392b", destacando: false });
  }
  return o.view === "aberta" ? construirAberto(ctx3, o) : construirFechado(ctx3, o);
}
