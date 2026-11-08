// src/components/mockup3d/produtosGraficos.js
//
// Produtos de gráfica em 3D (three.js): quadro, botton, caneca, cartões de
// visita, caixa e sacola de papel. Unidade: 1 = 10 cm. Todos recebem a "arte"
// (imagem) e as opções próprias; o dispatcher fica em construir.js.

import * as THREE from "three";
import {
  carregarTextura, caixa, mats6, matCor, matMetal, matPapel, texturaBordaPaginas,
  tubo, canvasTex,
} from "./build";
import { QUADRO_TAMANHOS, BOTTON_TAMANHOS, CAIXA_TAMANHOS, SACOLA_TAMANHOS, MOLDURAS } from "./opcoes";

function sombrear(m) {
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

function texturaMadeira(ctx3, tom = "#a9794a") {
  const t = canvasTex(512, 512, (g, w, h) => {
    g.fillStyle = tom;
    g.fillRect(0, 0, w, h);
    for (let i = 0; i < 46; i++) {
      const y = (i / 46) * h + Math.random() * 6;
      g.strokeStyle = `rgba(60,34,12,${0.08 + Math.random() * 0.2})`;
      g.lineWidth = 1 + Math.random() * 2.4;
      g.beginPath();
      g.moveTo(0, y);
      for (let x = 0; x <= w; x += 64) g.lineTo(x, y + (Math.random() - 0.5) * 6);
      g.stroke();
    }
  });
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return ctx3.track(t);
}

// =================================================================== QUADRO

export function construirQuadro(ctx3, o) {
  const tam = QUADRO_TAMANHOS[o.qTam] || QUADRO_TAMANHOS.a4;
  const orient = o.orient || "retrato";
  let w = tam.w;
  let h = tam.h;
  if (orient === "paisagem") [w, h] = [h, w];
  if (orient === "quadrado") w = h = Math.min(w, h) * 1.1;
  const fw = [0.045, 0.085, 0.14][(o.molduraLarg || 2) - 1];
  const fd = 0.08;
  const passe = !!o.passepartout;
  const pm = passe ? Math.min(w, h) * 0.12 : 0; // margem do passe-partout

  const g = new THREE.Group();
  const frame = MOLDURAS[o.moldura] || MOLDURAS.preto;
  let matMold;
  if (o.moldura === "madeira") {
    matMold = new THREE.MeshStandardMaterial({ map: texturaMadeira(ctx3), roughness: 0.6 });
  } else if (o.moldura === "dourado") {
    matMold = new THREE.MeshStandardMaterial({ color: frame.cor, metalness: 1, roughness: 0.28 });
  } else {
    matMold = new THREE.MeshStandardMaterial({ color: frame.cor, roughness: 0.42 });
  }

  const W = w + fw * 2;
  const H = h + fw * 2;
  // 4 barras (topo/base inteiras, laterais entre elas)
  const barras = [
    [W, fw, 0, H / 2 - fw / 2],
    [W, fw, 0, -H / 2 + fw / 2],
    [fw, H - fw * 2, -W / 2 + fw / 2, 0],
    [fw, H - fw * 2, W / 2 - fw / 2, 0],
  ];
  for (const [bw, bh, bx, by] of barras) {
    const b = sombrear(new THREE.Mesh(new THREE.BoxGeometry(bw, bh, fd), matMold));
    b.position.set(bx, by, 0);
    g.add(b);
  }
  // fundo (papelão) e arte
  const fundo = sombrear(new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.01), matCor("#d8cdb8", 0.9)));
  fundo.position.z = -fd / 2 + 0.005;
  g.add(fundo);

  const aw = w - pm * 2;
  const ah = h - pm * 2;
  const mapArte = carregarTextura(ctx3, o.arte, aw / ah);
  const arte = new THREE.Mesh(
    new THREE.PlaneGeometry(aw, ah),
    new THREE.MeshStandardMaterial({ color: mapArte ? "#ffffff" : "#e9e2d3", map: mapArte, roughness: 0.8 }),
  );
  arte.position.z = -fd / 2 + 0.016;
  arte.receiveShadow = true;
  g.add(arte);

  // passe-partout com janela
  if (passe) {
    const shape = new THREE.Shape();
    shape.moveTo(-w / 2, -h / 2);
    shape.lineTo(w / 2, -h / 2);
    shape.lineTo(w / 2, h / 2);
    shape.lineTo(-w / 2, h / 2);
    shape.closePath();
    const furo = new THREE.Path();
    furo.moveTo(-aw / 2, -ah / 2);
    furo.lineTo(-aw / 2, ah / 2);
    furo.lineTo(aw / 2, ah / 2);
    furo.lineTo(aw / 2, -ah / 2);
    furo.closePath();
    shape.holes.push(furo);
    const pg = new THREE.ExtrudeGeometry(shape, { depth: 0.012, bevelEnabled: true, bevelSize: 0.002, bevelThickness: 0.002, bevelSegments: 1 });
    const pp = sombrear(new THREE.Mesh(pg, matCor(o.corPasse || "#f7f4ec", 0.95)));
    pp.position.z = -fd / 2 + 0.018;
    g.add(pp);
  }

  // vidro (reflexo sutil)
  const vidro = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshPhysicalMaterial({ color: "#ffffff", transparent: true, opacity: 0.07, roughness: 0, clearcoat: 1, depthWrite: false }),
  );
  vidro.position.z = fd / 2 - 0.012;
  g.add(vidro);

  const out = new THREE.Group();
  out.add(g);

  if (o.montagem === "parede") {
    g.position.set(0, H / 2, fd / 2 + 0.01);
    const cor = new THREE.Color(o.parede || "#efe9dc");
    const parede = new THREE.Mesh(new THREE.PlaneGeometry(40, 20), new THREE.MeshStandardMaterial({ color: cor, roughness: 0.95 }));
    parede.position.set(0, 6, 0);
    parede.receiveShadow = true;
    out.add(parede);
    out.userData.parede = true;
    out.userData.cy = H / 2;
  } else {
    // sobre a mesa: leve inclinação + apoio traseiro
    const inc = 0.2;
    g.rotation.x = -inc;
    g.position.set(0, (H / 2) * Math.cos(inc) + 0.01, 0);
    const P = new THREE.Vector3(0, H * 0.72 * Math.cos(inc), -fd / 2 - H * 0.22 * Math.sin(inc));
    const Q = new THREE.Vector3(0, 0.01, -H * 0.38);
    const d = Q.clone().sub(P);
    const apoio = sombrear(new THREE.Mesh(new THREE.BoxGeometry(w * 0.14, 0.02, d.length()), matMold));
    apoio.position.copy(P.clone().add(Q).multiplyScalar(0.5));
    apoio.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), d.clone().normalize());
    out.add(apoio);
    out.userData.cy = (H / 2) * Math.cos(inc);
  }
  out.userData.w = W;
  out.userData.h = H;
  out.userData.upright = true;
  return out;
}

// =================================================================== BOTTON

function umBotton(ctx3, { d, mapArte, brilho, verso }) {
  const r = d / 2;
  const g = new THREE.Group();
  const metal = new THREE.MeshStandardMaterial({ color: "#c9ced6", metalness: 1, roughness: 0.3 });
  const aro = sombrear(new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.032, 72), metal));
  aro.position.y = 0.016;
  g.add(aro);

  if (!verso) {
    const disco = new THREE.Mesh(
      new THREE.CircleGeometry(r - 0.012, 72),
      new THREE.MeshStandardMaterial({ color: mapArte ? "#fff" : "#e9e2d3", map: mapArte, roughness: 0.5 }),
    );
    disco.rotation.x = -Math.PI / 2;
    disco.position.y = 0.0328;
    disco.receiveShadow = true;
    g.add(disco);
    // cúpula de acrílico/verniz
    const Rs = r * 4;
    const th = Math.asin((r - 0.012) / Rs);
    const dome = new THREE.Mesh(
      new THREE.SphereGeometry(Rs, 64, 12, 0, Math.PI * 2, 0, th),
      new THREE.MeshPhysicalMaterial({
        color: "#ffffff", transparent: true, opacity: brilho ? 0.1 : 0.03, roughness: brilho ? 0 : 0.5,
        clearcoat: brilho ? 1 : 0, depthWrite: false,
      }),
    );
    dome.position.y = 0.0332 - Rs * Math.cos(th);
    g.add(dome);
  } else {
    // verso: disco metálico + alfinete de segurança
    const costas = new THREE.Mesh(new THREE.CircleGeometry(r - 0.012, 72), new THREE.MeshStandardMaterial({ color: "#aeb4be", metalness: 1, roughness: 0.4 }));
    costas.rotation.x = -Math.PI / 2;
    costas.position.y = 0.0328;
    g.add(costas);
    const alfinete = new THREE.MeshStandardMaterial({ color: "#d9dde3", metalness: 1, roughness: 0.25 });
    const L = r * 1.2;
    const haste = tubo(new THREE.CatmullRomCurve3([new THREE.Vector3(-L / 2, 0.042, 0.0), new THREE.Vector3(L / 2, 0.042, 0.0)]), 2, 0.0035, alfinete);
    g.add(haste);
    const mola = tubo(
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-L / 2, 0.042, 0), new THREE.Vector3(-L / 2 - 0.02, 0.05, 0.02),
        new THREE.Vector3(-L / 2 + 0.01, 0.058, 0.03), new THREE.Vector3(-L / 2 + 0.03, 0.045, 0.0),
      ]),
      12, 0.0035, alfinete,
    );
    g.add(mola);
    const trava = sombrear(new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.016, 0.026), alfinete));
    trava.position.set(L / 2, 0.047, 0);
    g.add(trava);
  }
  return g;
}

export function construirBotton(ctx3, o) {
  const d = (BOTTON_TAMANHOS[o.bTam] || BOTTON_TAMANHOS["38"]).d;
  const qtd = o.bQtd || 3;
  const mapArte = carregarTextura(ctx3, o.arte, 1);
  const out = new THREE.Group();
  const gap = d * 0.14;
  const pos = [];
  if (qtd === 1) pos.push([0, 0]);
  else if (qtd === 3) pos.push([-d * 0.62 - gap / 2, 0.05], [d * 0.62 + gap / 2, -0.05], [0, d * 0.95]);
  else {
    const hx = d + gap;
    pos.push([-hx, -hx * 0.5], [0, -hx * 0.5], [hx, -hx * 0.5], [-hx / 2, hx * 0.4], [hx / 2, hx * 0.4], [0, hx * 1.3]);
  }
  pos.forEach(([x, z], i) => {
    const verso = qtd > 1 && i === pos.length - 1 && o.bVerso !== false;
    const b = umBotton(ctx3, { d, mapArte, brilho: o.bBrilho !== false, verso });
    b.position.set(x, 0, z);
    b.rotation.y = (i % 2 ? 0.35 : -0.2) + i * 0.4;
    out.add(b);
  });
  const ext = d * (qtd === 1 ? 1 : qtd === 3 ? 2.4 : 3.6);
  out.userData.w = ext;
  out.userData.h = ext * 0.8;
  out.userData.folga = 1.1;
  out.userData.cy = 0.02;
  return out;
}

// =================================================================== CANECA

export function construirCaneca(ctx3, o) {
  const R = 0.4;
  const Hh = 0.95;
  const t = 0.04;
  const brilho = o.cMat !== "fosco";
  const g = new THREE.Group();
  const ceramica = (cor) =>
    new THREE.MeshPhysicalMaterial({
      color: cor, roughness: brilho ? 0.14 : 0.55, clearcoat: brilho ? 1 : 0, clearcoatRoughness: 0.05, side: THREE.DoubleSide,
    });
  const corCaneca = o.corCaneca || "#ffffff";
  const corInt = o.corInterior || "#ffffff";
  const corAlca = o.corAlca || corCaneca;

  const V = (x, y) => new THREE.Vector2(x, y);
  const externo = [V(0.0001, 0), V(R - 0.03, 0), V(R - 0.012, 0.006), V(R, 0.03), V(R, Hh - 0.015), V(R - 0.004, Hh), V(R - t / 2, Hh)];
  const interno = [V(R - t / 2, Hh), V(R - t, Hh - 0.006), V(R - t, 0.07), V(R - t - 0.03, t), V(0.0001, t)];
  g.add(sombrear(new THREE.Mesh(new THREE.LatheGeometry(externo, 96), ceramica(corCaneca))));
  g.add(sombrear(new THREE.Mesh(new THREE.LatheGeometry(interno, 96), ceramica(corInt))));

  // arte envolvente (decalque) — theta 0 = frente (+z)
  const arco = ((o.cArco || 200) * Math.PI) / 180;
  const altArte = Hh * 0.84;
  const mapArte = carregarTextura(ctx3, o.arte, (arco * R) / altArte);
  const decal = new THREE.Mesh(
    new THREE.CylinderGeometry(R + 0.0015, R + 0.0015, altArte, 128, 1, true, -arco / 2, arco),
    new THREE.MeshPhysicalMaterial({
      color: mapArte ? "#ffffff" : "#e9e2d3", map: mapArte, roughness: brilho ? 0.16 : 0.5, clearcoat: brilho ? 1 : 0,
    }),
  );
  decal.position.y = Hh * 0.5 + 0.005;
  decal.castShadow = true;
  g.add(decal);

  // alça
  const curva = new THREE.CatmullRomCurve3([
    new THREE.Vector3(R - 0.012, Hh * 0.8, 0),
    new THREE.Vector3(R + 0.17, Hh * 0.82, 0),
    new THREE.Vector3(R + 0.31, Hh * 0.62, 0),
    new THREE.Vector3(R + 0.29, Hh * 0.38, 0),
    new THREE.Vector3(R + 0.15, Hh * 0.2, 0),
    new THREE.Vector3(R - 0.012, Hh * 0.22, 0),
  ]);
  g.add(sombrear(new THREE.Mesh(new THREE.TubeGeometry(curva, 64, 0.034, 14), ceramica(corAlca))));

  if (o.cafe) {
    const cafe = new THREE.Mesh(
      new THREE.CircleGeometry(R - t - 0.004, 64),
      new THREE.MeshPhysicalMaterial({ color: "#3a2112", roughness: 0.12, clearcoat: 1 }),
    );
    cafe.rotation.x = -Math.PI / 2;
    cafe.position.y = Hh * 0.84;
    g.add(cafe);
  }

  g.userData.w = R * 2 + 0.7;
  g.userData.h = Hh * 1.1;
  g.userData.cy = Hh / 2;
  g.userData.upright = true;
  return g;
}

// =================================================================== CARTÕES DE VISITA

export function construirCartoes(ctx3, o) {
  const cw = 0.85;
  const ch = 0.55;
  const mapF = carregarTextura(ctx3, o.arte, cw / ch);
  const mapV = carregarTextura(ctx3, o.arteVerso, cw / ch);
  const bordaPag = new THREE.MeshStandardMaterial({ map: texturaBordaPaginas(ctx3), roughness: 0.9 });
  const frente = new THREE.MeshStandardMaterial({ color: mapF ? "#fff" : "#f1ece0", map: mapF, roughness: o.cFosco ? 0.7 : 0.35 });
  const verso = new THREE.MeshStandardMaterial({ color: mapV ? "#fff" : (o.corVerso || "#ffffff"), map: mapV, roughness: o.cFosco ? 0.7 : 0.35 });

  const out = new THREE.Group();
  const n = o.cQtd || 12;
  const T = 0.0028 * n;
  const pilha = caixa(cw, T, ch, mats6({ topo: frente, lados: bordaPag, base: verso }));
  pilha.position.y = T / 2;
  out.add(pilha);

  // um cartão virado (verso) ao lado
  const solto = caixa(cw, 0.0028, ch, mats6({ topo: verso, lados: bordaPag, base: frente }));
  solto.position.set(cw * 0.78, 0.0014, ch * 0.34);
  solto.rotation.y = -0.38;
  out.add(solto);

  // um cartão em pé, encostado atrás da pilha
  const preso = caixa(cw, 0.0028, ch, mats6({ topo: frente, lados: bordaPag, base: verso }));
  preso.rotation.x = 1.22;
  preso.position.set(-cw * 0.08, T + ch * 0.5 * Math.sin(1.22) + 0.002, -ch * 0.42);
  out.add(preso);

  out.userData.w = cw * 2.6;
  out.userData.h = ch * 2.1;
  out.userData.folga = 0.7;
  out.userData.cy = 0.1;
  return out;
}

// =================================================================== CAIXA (com tampa)

export function construirCaixa(ctx3, o) {
  const d = CAIXA_TAMANHOS[o.cxTam] || CAIXA_TAMANHOS.m;
  const W = d.w;
  const D = d.d;
  const Hc = d.h;
  const t = 0.022;
  const corCaixa = o.corCapa || "#1e293b";
  const mapTampa = carregarTextura(ctx3, o.arte, (W + 0.05) / (D + 0.05));
  const papel = (cor, map) =>
    new THREE.MeshPhysicalMaterial({
      color: map ? "#fff" : cor, map: map || null, roughness: o.mat === "brilho" ? 0.25 : 0.7, clearcoat: o.mat === "brilho" ? 1 : 0.1, side: THREE.DoubleSide,
    });
  const corInt = o.corInterior || "#f4efe4";

  const g = new THREE.Group();
  // base (casco)
  const piso = caixa(W, t, D, papel(corCaixa));
  piso.position.y = t / 2;
  g.add(piso);
  const paredes = [
    [W, Hc, t, 0, Hc / 2, D / 2 - t / 2],
    [W, Hc, t, 0, Hc / 2, -D / 2 + t / 2],
    [t, Hc, D - t * 2, -W / 2 + t / 2, Hc / 2, 0],
    [t, Hc, D - t * 2, W / 2 - t / 2, Hc / 2, 0],
  ];
  for (const [bw, bh, bd, x, y, z] of paredes) {
    const b = caixa(bw, bh, bd, papel(corCaixa));
    b.position.set(x, y, z);
    g.add(b);
  }
  // forro interno
  const forro = matCor(corInt, 0.9);
  const f0 = caixa(W - t * 2 - 0.004, 0.004, D - t * 2 - 0.004, forro, { sombra: false });
  f0.position.y = t + 0.002;
  g.add(f0);
  for (const [bw, bh, bd, x, z] of [
    [W - t * 2, Hc - t, 0.004, 0, D / 2 - t - 0.002],
    [W - t * 2, Hc - t, 0.004, 0, -D / 2 + t + 0.002],
    [0.004, Hc - t, D - t * 2, -W / 2 + t + 0.002, 0],
    [0.004, Hc - t, D - t * 2, W / 2 - t - 0.002, 0],
  ]) {
    const f = caixa(bw, bh, bd, forro, { sombra: false });
    f.position.set(x, t + (Hc - t) / 2, z);
    g.add(f);
  }

  // tampa articulada na borda de trás
  const Wl = W + 0.05;
  const Dl = D + 0.05;
  const alt = Math.min(0.36, Hc * 0.5);
  const tampa = new THREE.Group();
  tampa.position.set(0, Hc + 0.004, -Dl / 2);
  const placa = caixa(Wl, t, Dl, [papel(corCaixa), papel(corCaixa), papel(corCaixa, mapTampa), papel(corCaixa), papel(corCaixa), papel(corCaixa)]);
  placa.position.set(0, -t / 2 + t, Dl / 2);
  tampa.add(placa);
  for (const [bw, bh, bd, x, z] of [
    [Wl, alt, t, 0, Dl - t / 2],
    [Wl, alt, t, 0, t / 2],
    [t, alt, Dl - t * 2, -Wl / 2 + t / 2, Dl / 2],
    [t, alt, Dl - t * 2, Wl / 2 - t / 2, Dl / 2],
  ]) {
    const b = caixa(bw, bh, bd, papel(corCaixa));
    b.position.set(x, -alt / 2 + t / 2, z);
    tampa.add(b);
  }
  const ang = ((o.abertura ?? 0) * Math.PI) / 180;
  tampa.rotation.x = -ang;
  // eleva a tampa fechada para ela "vestir" o casco
  tampa.position.y = Hc + 0.004;
  g.add(tampa);

  g.userData.w = W + 0.4;
  g.userData.h = Math.max(D, Hc + (ang > 0.2 ? Dl * Math.sin(ang) : 0));
  g.userData.folga = ang > 0.5 ? 1.5 : 1.2;
  g.userData.cy = (Hc + (ang > 0.2 ? Dl * Math.sin(ang) * 0.5 : 0)) / 2;
  return g;
}

// =================================================================== SACOLA

export function construirSacola(ctx3, o) {
  const d = SACOLA_TAMANHOS[o.sTam] || SACOLA_TAMANHOS.m;
  const W = d.w;
  const D = d.d;
  const Hb = d.h;
  const corBase = o.corCapa || "#f1ece0";
  const mapArte = carregarTextura(ctx3, o.arte, W / Hb);
  const papel = (map, cor = corBase) =>
    new THREE.MeshStandardMaterial({ color: map ? "#fff" : cor, map: map || null, roughness: o.mat === "brilho" ? 0.3 : 0.75 });
  const lateral = new THREE.MeshStandardMaterial({ color: new THREE.Color(corBase).multiplyScalar(0.86), roughness: 0.8 });
  const g = new THREE.Group();

  const corpo = caixa(W, Hb, D, [lateral, lateral, papel(null), papel(null), papel(mapArte), papel(mapArte)]);
  corpo.position.y = Hb / 2;
  g.add(corpo);
  // dobra do topo
  const dobra = caixa(W + 0.004, 0.05, D + 0.004, papel(null), { sombra: false });
  dobra.material.color.multiplyScalar(0.95);
  dobra.position.y = Hb - 0.025;
  g.add(dobra);
  // vinco lateral (sanfona)
  for (const sx of [-1, 1]) {
    const v = caixa(0.004, Hb - 0.1, 0.002, matCor("#000", 1), { sombra: false });
    v.material.transparent = true;
    v.material.opacity = 0.25;
    v.position.set(sx * (W / 2 + 0.0015), Hb / 2, 0);
    g.add(v);
  }

  // alças de corda
  const corAlca = o.corAlca || "#c9b27c";
  const mat = new THREE.MeshStandardMaterial({ color: corAlca, roughness: 0.65 });
  for (const sz of [-1, 1]) {
    const pts = [];
    const largura = W * 0.34;
    for (let i = 0; i <= 24; i++) {
      const a = (i / 24) * Math.PI;
      pts.push(new THREE.Vector3(-largura * Math.cos(a), Hb - 0.08 + Math.sin(a) * Hb * 0.2, sz * (D / 2 + 0.012)));
    }
    g.add(tubo(new THREE.CatmullRomCurve3(pts), 48, 0.012, mat));
    for (const sx of [-1, 1]) {
      const rb = caixa(0.07, 0.07, 0.006, matCor(corBase, 0.8), { sombra: false });
      rb.position.set(sx * largura, Hb - 0.08, sz * (D / 2 + 0.003));
      g.add(rb);
    }
  }
  g.userData.w = W + 0.5;
  g.userData.h = Hb * 1.2;
  g.userData.cy = Hb * 0.5;
  g.userData.upright = true;
  return g;
}

void matMetal;
void matPapel;
