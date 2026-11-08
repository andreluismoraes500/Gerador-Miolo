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
import { CENAS } from "../mockup/MockupStage";

const PRESETS = {
  tres: new THREE.Vector3(0.55, 0.8, 0.75),
  topo: new THREE.Vector3(0, 1, 0.02),
  rasante: new THREE.Vector3(0.35, 0.24, 1),
  frente: new THREE.Vector3(0.12, 0.28, 1),
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
  const c = CENAS[cenaId] || CENAS.creme;
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
    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
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
    // contraluz frio e preenchimento: dão volume e "recorte" ao objeto
    const rim = new THREE.DirectionalLight("#cfe0ff", 0.8);
    rim.position.set(4, 3, -4);
    scene.add(rim);
    const fill = new THREE.DirectionalLight("#fff0dd", 0.5);
    fill.position.set(4, 2.5, 4);
    scene.add(fill);

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

    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      controls.update();
      desenhar();
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
    if (CENAS[props.cena]?.madeira) {
      s.piso = texturaMadeira();
      s.chao.material = new THREE.MeshStandardMaterial({ map: s.piso, roughness: 0.75 });
    } else {
      s.chao.material = new THREE.ShadowMaterial({ opacity: props.cena === "grafite" ? 0.55 : 0.3 });
    }
    s.chao.material.needsUpdate = true;
  }, [props.cena]);

  // ------------------------------------------------ modelo
  const { capaSrc, miolosrc, folhaSrc, arte, arteVerso, girar, qualidade, ...resto } = props;
  const chave = JSON.stringify(resto);
  const chaveFit = `${props.produto}|${props.view}|${props.tamanho}|${props.formato}|${props.tipo === "bloco"}|${props.destacando}|${props.disp}|${props.qTam}|${props.orient}|${props.montagem}|${props.bTam}|${props.sTam}|${props.cxTam}|${(props.abertura ?? 0) > 30}`;

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
      const r = Math.hypot(w, h) / 2;
      const caixaM = new THREE.Box3().setFromObject(m);
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
    if (S.current.controls) S.current.controls.autoRotate = !!props.girar;
  }, [props.girar]);

  useEffect(() => {
    if (S.current.renderer) S.current.hq = props.qualidade !== "rapida";
  }, [props.qualidade]);

  // ------------------------------------------------ API imperativa
  useImperativeHandle(ref, () => ({
    preset(nome) {
      const s = S.current;
      const dir = (PRESETS[nome] || PRESETS.tres).clone().normalize();
      const dist = s.camera.position.distanceTo(s.controls.target);
      const pos = s.controls.target.clone().add(dir.multiplyScalar(dist));
      gsap.killTweensOf(s.camera.position);
      gsap.to(s.camera.position, { x: pos.x, y: pos.y, z: pos.z, duration: 0.8, ease: "power3.inOut", onUpdate: () => s.controls.update() });
    },
    capturar({ tipo = "png", largura = 2400 } = {}) {
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
      const usar = composer && s.hq !== false;
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
    gravar(segundos = 6) {
      const s = S.current;
      const canvas = s.renderer.domElement;
      if (!canvas.captureStream || typeof MediaRecorder === "undefined") {
        return Promise.reject(new Error("Este navegador não grava vídeo do canvas."));
      }
      const mime = ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm"].find((m) =>
        MediaRecorder.isTypeSupported(m),
      );
      const rec = new MediaRecorder(canvas.captureStream(30), { mimeType: mime, videoBitsPerSecond: 8_000_000 });
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
