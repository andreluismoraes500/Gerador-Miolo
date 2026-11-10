// src/components/mockup3d/Mockup3D.jsx
//
// Visualizador 3D (three.js) do mockup: órbita com mouse/toque, iluminação
// com reflexos (metal realista), sombra de contato e exportação em PNG/JPG
// e vídeo giratório (WebM). Carregado sob demanda (React.lazy) pela página.

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { GTAOPass } from "three/examples/jsm/postprocessing/GTAOPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass.js";
import gsap from "gsap";
import { construir } from "./construir";
import { cenaDe } from "../mockup/MockupStage";

const PRESETS = {
  tres: new THREE.Vector3(0.55, 0.8, 0.75),
  topo: new THREE.Vector3(0, 1, 0.02),
  rasante: new THREE.Vector3(0.35, 0.24, 1),
  frente: new THREE.Vector3(0.12, 0.28, 1),
  frontal: new THREE.Vector3(0, 0.02, 1),
  lateral: new THREE.Vector3(1, 0.08, 0),
  iso: new THREE.Vector3(1, 0.95, 1),
  close: new THREE.Vector3(0.3, 0.45, 1),
  verso: new THREE.Vector3(0.05, 0.12, -1),
};

// direção inicial da câmera por produto (objetos em pé pedem vista mais baixa)
const DIR_PRODUTO = {
  quadro: new THREE.Vector3(0.22, 0.12, 1),
  caneca: new THREE.Vector3(0.45, 0.3, 1),
  sacola: new THREE.Vector3(0.45, 0.28, 1),
  calendario: new THREE.Vector3(0.35, 0.4, 1),
  botton: new THREE.Vector3(0.25, 1, 0.55),
  cartoes: new THREE.Vector3(0.3, 0.95, 0.7),
  caixa: new THREE.Vector3(0.55, 0.65, 0.9),
};

function texturaCena(cenaId) {
  const c = cenaDe(cenaId);
  const cv = document.createElement("canvas");
  cv.width = 512;
  cv.height = 512;
  const g = cv.getContext("2d");
  const gr = g.createRadialGradient(256, 190, 20, 256, 256, 400);
  gr.addColorStop(0, c.a);
  gr.addColorStop(1, c.b);
  g.fillStyle = gr;
  g.fillRect(0, 0, 512, 512);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function texturaPadrao(tipo) {
  const cv = document.createElement("canvas");
  cv.width = cv.height = 1024;
  const g = cv.getContext("2d");
  if (tipo === "marmore") {
    g.fillStyle = "#f2f2f0";
    g.fillRect(0, 0, 1024, 1024);
    for (let i = 0; i < 16; i++) {
      g.strokeStyle = `rgba(110,115,125,${0.07 + Math.random() * 0.18})`;
      g.lineWidth = 0.6 + Math.random() * 2.4;
      g.beginPath();
      let x = Math.random() * 1024, y = 0;
      g.moveTo(x, y);
      while (y < 1024) { x += (Math.random() - 0.5) * 90; y += 30 + Math.random() * 40; g.lineTo(x, y); }
      g.stroke();
    }
  } else if (tipo === "papelaria") {
    g.fillStyle = "#fbf3e8";
    g.fillRect(0, 0, 1024, 1024);
    g.strokeStyle = "rgba(190,150,120,0.28)";
    for (let i = 0; i <= 1024; i += 32) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, 1024); g.stroke(); g.beginPath(); g.moveTo(0, i); g.lineTo(1024, i); g.stroke(); }
  } else {
    g.fillStyle = "#fbe6ea";
    g.fillRect(0, 0, 1024, 1024);
    for (let i = 0; i < 70; i++) {
      const x = Math.random() * 1024, y = Math.random() * 1024, r = 14 + Math.random() * 26;
      g.fillStyle = ["#f4b6c4", "#f8cfd8", "#e9a0b4", "#fbe0b8"][i % 4];
      for (let p = 0; p < 6; p++) { g.beginPath(); g.ellipse(x + Math.cos(p * 1.047) * r * 0.7, y + Math.sin(p * 1.047) * r * 0.7, r * 0.55, r * 0.35, p * 1.047, 0, 7); g.fill(); }
      g.fillStyle = "#f3c969"; g.beginPath(); g.arc(x, y, r * 0.25, 0, 7); g.fill();
    }
  }
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(2, 2);
  t.anisotropy = 8;
  return t;
}

function texturaMadeira() {
  const cv = document.createElement("canvas");
  cv.width = 1024;
  cv.height = 1024;
  const g = cv.getContext("2d");
  g.fillStyle = "#a9794a";
  g.fillRect(0, 0, 1024, 1024);
  for (let i = 0; i < 70; i++) {
    const y = (i / 70) * 1024 + Math.random() * 10;
    g.strokeStyle = `rgba(70,40,15,${0.08 + Math.random() * 0.2})`;
    g.lineWidth = 1 + Math.random() * 3;
    g.beginPath();
    g.moveTo(0, y);
    for (let x = 0; x <= 1024; x += 128) g.lineTo(x, y + (Math.random() - 0.5) * 8);
    g.stroke();
  }
  for (let x = 0; x < 1024; x += 256) {
    g.fillStyle = "rgba(0,0,0,0.25)";
    g.fillRect(x, 0, 2, 1024);
  }
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(3, 3);
  t.anisotropy = 8;
  return t;
}

const Mockup3D = forwardRef(function Mockup3D(props, ref) {
  const hostRef = useRef(null);
  const S = useRef({}); // estado three (renderer, scene, camera...)
  const propsRef = useRef(props);
  propsRef.current = props;

  // ------------------------------------------------ inicialização única
  useEffect(() => {
    const host = hostRef.current;
    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NeutralToneMapping; // preserva branco e cores da capa
    renderer.toneMappingExposure = 1.0;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.domElement.style.cssText = "display:block;width:100%;height:100%;touch-action:none";
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(2.4, 3.4, 3.2); // direção inicial (evita o OrbitControls "cair" para o topo)
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.55;

    scene.add(new THREE.HemisphereLight("#ffffff", "#d8cdb5", 0.35));
    const sol = new THREE.DirectionalLight("#fff6e6", 2.1);
    sol.position.set(-2.4, 7.5, 3.2);
    sol.castShadow = true;
    sol.shadow.mapSize.set(2048, 2048);
    sol.shadow.camera.left = -4;
    sol.shadow.camera.right = 4;
    sol.shadow.camera.top = 4;
    sol.shadow.camera.bottom = -4;
    sol.shadow.camera.near = 1;
    sol.shadow.camera.far = 18;
    sol.shadow.radius = 6;
    sol.shadow.bias = -0.0004;
    sol.shadow.normalBias = 0.02;
    scene.add(sol);
    S.current.sol = sol;
    // contraluz frio e preenchimento: dão volume e "recorte" ao objeto
    const rim = new THREE.DirectionalLight("#cfe0ff", 0.8);
    rim.position.set(4, 3, -4);
    scene.add(rim);
    S.current.rim = rim;
    const fill = new THREE.DirectionalLight("#fff0dd", 0.5);
    fill.position.set(4, 2.5, 4);
    scene.add(fill);
    S.current.fill = fill;

    const chao = new THREE.Mesh(
      new THREE.PlaneGeometry(60, 60),
      new THREE.ShadowMaterial({ opacity: 0.32 }),
    );
    chao.rotation.x = -Math.PI / 2;
    chao.receiveShadow = true;
    scene.add(chao);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 1.2;
    controls.maxDistance = 14;
    controls.maxPolarAngle = Math.PI * 0.49;
    controls.autoRotateSpeed = 2;

    // Pós-processamento (three.js): oclusão de ambiente GTAO + antialias SMAA.
    let composer = null;
    try {
      composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      const gtao = new GTAOPass(scene, camera, 800, 600);
      gtao.blendIntensity = 1;
      gtao.updateGtaoMaterial({ radius: 0.4, distanceExponent: 1.6, thickness: 1.4, scale: 1.1, samples: 12, distanceFallOff: 1, screenSpaceRadius: false });
      gtao.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 6, radiusExponent: 1, rings: 2, samples: 12 });
      composer.addPass(gtao);
      composer.addPass(new OutputPass());
      composer.addPass(new SMAAPass());
    } catch (e) {
      console.warn("[Mockup3D] pós-processamento indisponível:", e);
      composer = null;
    }

    const resize = () => {
      const w = host.clientWidth || 800;
      const h = host.clientHeight || 600;
      renderer.setSize(w, h, false);
      composer?.setPixelRatio(renderer.getPixelRatio());
      composer?.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    resize();

    // Renderização sob demanda + qualidade adaptativa.
    let raf = 0, quadro = 0, ultimo = performance.now(), lentos = 0, medidos = 0;
    const invalidar = (n = 90) => { S.current.sujo = Math.max(S.current.sujo || 0, n); };
    controls.addEventListener("change", () => invalidar(30));
    S.current.invalidar = invalidar;
    const loop = (agora) => {
      raf = requestAnimationFrame(loop);
      quadro += 1;
      const mudou = controls.update();
      const animando = gsap.globalTimeline.getChildren(false, true, false).length > 0;
      if (animando || controls.autoRotate) invalidar(20);
      const ativo = (S.current.sujo || 0) > 0;
      if (!ativo && !mudou && quadro % 20 !== 0) return; // parado: ~3 quadros/s (texturas assíncronas)
      if (ativo) S.current.sujo -= 1;
      desenhar();
      // qualidade adaptativa: se a animação ficar lenta, desliga GTAO e reduz a resolução
      if (ativo && propsRef.current.qualidade === "auto" && !S.current.degradou) {
        const dt = agora - ultimo;
        medidos += 1;
        if (medidos > 15) lentos += dt > 45 ? 1 : 0;
        if (medidos > 75 && lentos > 40) {
          S.current.degradou = true;
          S.current.hq = false;
          renderer.setPixelRatio(1);
          resize();
          propsRef.current.onQualidade?.("rapida");
        }
      }
      ultimo = agora;
    };
    const desenhar = () => {
      const st = S.current;
      if (composer && st.hq !== false) {
        try {
          composer.render();
          return;
        } catch (e) {
          console.warn("[Mockup3D] composer falhou, usando render simples:", e);
          st.hq = false;
        }
      }
      renderer.render(scene, camera);
    };
    loop();

    Object.assign(S.current, { renderer, scene, camera, controls, chao, pmrem, host, composer, hq: true });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      controls.dispose();
      S.current.modelo && limpar(S.current.modelo, S.current.track);
      S.current.fundo?.dispose?.();
      S.current.piso?.dispose?.();
      gsap.killTweensOf(camera.position);
      composer?.dispose?.();
      pmrem.dispose();
      renderer.dispose();
      host.removeChild(renderer.domElement);
      S.current = {};
    };
  }, []);

  // ------------------------------------------------ cenário (fundo + piso)
  useEffect(() => {
    const s = S.current;
    if (!s.scene) return;
    s.fundo?.dispose();
    s.fundo = texturaCena(props.cena);
    s.scene.background = s.fundo;
    s.piso?.dispose();
    s.piso = null;
    if (cenaDe(props.cena).madeira) {
      s.piso = texturaMadeira();
      s.chao.material = new THREE.MeshStandardMaterial({ map: s.piso, roughness: 0.75 });
    } else if (cenaDe(props.cena).textura) {
      s.piso = texturaPadrao(cenaDe(props.cena).textura);
      s.chao.material = new THREE.MeshStandardMaterial({ map: s.piso, roughness: props.cena === "marmore" ? 0.25 : 0.8 });
    } else {
      s.chao.material = new THREE.ShadowMaterial({ opacity: cenaDe(props.cena).escuro || props.cena === "grafite" ? 0.55 : 0.3 });
    }
    s.chao.material.needsUpdate = true;
    s.invalidar?.();
  }, [props.cena]);

  // ------------------------------------------------ modelo
  const { capaSrc, miolosrc, folhaSrc, arte, arteVerso, girar, qualidade, luz: _luz, onQualidade: _oq, ...resto } = props;
  const chave = JSON.stringify(resto);
  const chaveFit = `${props.produto}|${props.view}|${props.tamanho}|${props.formato}|${props.tipo === "bloco"}|${props.destacando}|${props.disp}|${props.qTam}|${props.orient}|${props.montagem}|${props.bTam}|${props.sTam}|${props.cxTam}|${(props.abertura ?? 0) > 30}|${(props.acessorios3d || []).length}`;

  useEffect(() => {
    const s = S.current;
    if (!s.scene) return;
    if (s.modelo) {
      s.scene.remove(s.modelo);
      limpar(s.modelo, s.track);
    }
    const track = [];
    const ctx3 = { track: (o) => (track.push(o), o) };
    const m = construir(ctx3, propsRef.current);
    s.scene.add(m);
    s.modelo = m;
    s.track = track;

    s.chao.visible = !m.userData.parede;
    s.invalidar?.(120);
    // entrada suave do objeto
    m.scale.setScalar(0.93);
    gsap.to(m.scale, { x: 1, y: 1, z: 1, duration: 0.55, ease: "back.out(1.5)" });

    // enquadra a câmera quando muda o "tamanho" do objeto
    if (s.fitKey !== chaveFit) {
      const trocouProduto = s.prodKey !== props.produto;
      s.fitKey = chaveFit;
      s.prodKey = props.produto;
      const w = m.userData.w || 1.5;
      const h = m.userData.h || 2;
      const caixaM = new THREE.Box3().setFromObject(m);
      const temAcc = (props.acessorios3d || []).length > 0;
      const r = temAcc ? Math.hypot(caixaM.max.x - caixaM.min.x, caixaM.max.z - caixaM.min.z) / 2 : Math.hypot(w, h) / 2;
      const centro = caixaM.getCenter(new THREE.Vector3());
      const dir = trocouProduto
        ? (DIR_PRODUTO[props.produto] || PRESETS.tres).clone()
        : s.camera.position.clone().sub(s.controls.target);
      if (dir.lengthSq() < 0.01) dir.copy(PRESETS.tres);
      dir.normalize();
      const aspect = s.camera.aspect || 1;
      const fov = (s.camera.fov * Math.PI) / 180;
      let dist = (r / Math.sin(fov / 2)) * (aspect < 1.1 ? (1.2 / Math.min(aspect, 1.1)) * 0.9 : 0.9);
      if (m.userData.upright) {
        // objetos em pé: enquadra pela altura/largura reais (+ folga de perspectiva)
        const t = Math.tan(fov / 2);
        dist = Math.max(h / 2 / t, w / 2 / (t * aspect)) * 1.22;
      }
      dist *= m.userData.folga ?? 1;
      s.distBase = dist;
      const alvo = new THREE.Vector3(centro.x, m.userData.cy ?? 0.05, centro.z);
      const pos = alvo.clone().add(dir.multiplyScalar(dist));
      gsap.killTweensOf(s.camera.position);
      gsap.killTweensOf(s.controls.target);
      if (s.primeiro === undefined) {
        s.primeiro = true;
        s.controls.target.copy(alvo);
        s.camera.position.copy(pos);
        s.controls.update();
      } else {
        gsap.to(s.controls.target, { x: alvo.x, y: alvo.y, z: alvo.z, duration: 0.9, ease: "power3.inOut" });
        gsap.to(s.camera.position, { x: pos.x, y: pos.y, z: pos.z, duration: 0.9, ease: "power3.inOut", onUpdate: () => s.controls.update() });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chave, props.capaSrc, props.miolosrc, props.folhaSrc, props.arte, props.arteVerso]);

  useEffect(() => {
    const s = S.current;
    if (!s.sol) return;
    const l = props.luz || {};
    s.sol.intensity = 2.1 * (l.principal ?? 1);
    s.fill.intensity = 0.5 * (l.preench ?? 1);
    s.rim.intensity = 0.8 * (l.recorte ?? 1);
    s.renderer.toneMappingExposure = l.exposicao ?? 1;
    s.scene.environmentIntensity = 0.55 * (l.ambiente ?? 1);
    s.sol.position.x = -2.4 + (l.angulo ?? 0) * 0.08;
    s.invalidar?.();
  }, [props.luz]);

  useEffect(() => {
    if (S.current.controls) { S.current.controls.autoRotate = !!props.girar; S.current.invalidar?.(); }
  }, [props.girar]);

  useEffect(() => {
    if (S.current.renderer) {
      S.current.hq = props.qualidade !== "rapida";
      S.current.degradou = false;
      S.current.invalidar?.();
    }
  }, [props.qualidade]);

  // ------------------------------------------------ API imperativa
  useImperativeHandle(ref, () => ({
    preset(nome) {
      const s = S.current;
      const dir = (PRESETS[nome] || PRESETS.tres).clone().normalize();
      let dist = s.camera.position.distanceTo(s.controls.target);
      if (nome === "close") dist = Math.max(1.4, dist * 0.55);
      else if (s.distBase && nome !== "close") dist = s.distBase;
      const pos = s.controls.target.clone().add(dir.multiplyScalar(dist));
      gsap.killTweensOf(s.camera.position);
      gsap.to(s.camera.position, { x: pos.x, y: pos.y, z: pos.z, duration: 0.8, ease: "power3.inOut", onUpdate: () => s.controls.update() });
    },
    capturar({ tipo = "png", largura = 2400, transparente = false } = {}) {
      const s = S.current;
      const { renderer, camera, scene, composer } = s;
      // conclui animações em andamento (câmera/entrada) antes de fotografar
      [s.camera.position, s.controls.target, s.modelo?.scale].filter(Boolean).forEach((alvo) =>
        gsap.getTweensOf(alvo).forEach((t) => t.progress(1)),
      );
      s.controls.update();
      const prevPR = renderer.getPixelRatio();
      const prev = renderer.getSize(new THREE.Vector2());
      const aspect = camera.aspect;
      const altura = Math.round(largura / aspect);
      const transp = transparente && tipo !== "jpg";
      const fundoAntes = scene.background;
      if (transp) { scene.background = null; renderer.setClearColor(0x000000, 0); }
      const usar = composer && s.hq !== false && !transp;
      renderer.setPixelRatio(1);
      renderer.setSize(largura, altura, false);
      if (usar) {
        composer.setPixelRatio(1);
        composer.setSize(largura, altura);
        composer.render();
      } else {
        renderer.render(scene, camera);
      }
      return new Promise((ok) => {
        renderer.domElement.toBlob(
          (b) => {
            if (transp) scene.background = fundoAntes;
            renderer.setPixelRatio(prevPR);
            renderer.setSize(prev.x, prev.y, false);
            composer?.setPixelRatio(prevPR);
            composer?.setSize(prev.x, prev.y);
            ok(b);
          },
          tipo === "jpg" ? "image/jpeg" : "image/png",
          0.93,
        );
      });
    },
    gravar(segundos = 6, bitrate = 8_000_000) {
      const s = S.current;
      const canvas = s.renderer.domElement;
      if (!canvas.captureStream || typeof MediaRecorder === "undefined") {
        return Promise.reject(new Error("Este navegador não grava vídeo do canvas."));
      }
      const mime = ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm"].find((m) =>
        MediaRecorder.isTypeSupported(m),
      );
      const rec = new MediaRecorder(canvas.captureStream(30), { mimeType: mime, videoBitsPerSecond: bitrate });
      const partes = [];
      rec.ondataavailable = (e) => e.data.size && partes.push(e.data);
      const antes = { auto: s.controls.autoRotate, vel: s.controls.autoRotateSpeed };
      s.controls.autoRotate = true;
      s.controls.autoRotateSpeed = 60 / segundos;
      return new Promise((ok) => {
        rec.onstop = () => {
          s.controls.autoRotate = antes.auto;
          s.controls.autoRotateSpeed = antes.vel;
          ok(new Blob(partes, { type: "video/webm" }));
        };
        rec.start();
        setTimeout(() => rec.stop(), segundos * 1000);
      });
    },
  }));

  return <div ref={hostRef} className="mk3d-host" />;
});

function limpar(obj, track = []) {
  obj.traverse((o) => {
    if (o.geometry) o.geometry.dispose();
    const ms = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : [];
    ms.forEach((m) => {
      if (m.isMeshBasicMaterial && m.color?.getHexString() === "14161a") return; // MAT_FURO compartilhado
      m.dispose();
    });
  });
  track.forEach((t) => t.dispose?.());
}

export default Mockup3D;
