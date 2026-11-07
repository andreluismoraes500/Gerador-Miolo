// src/components/mockup3d/Mockup3D.jsx
//
// Visualizador 3D (three.js) do mockup: órbita com mouse/toque, iluminação
// com reflexos (metal realista), sombra de contato e exportação em PNG/JPG
// e vídeo giratório (WebM). Carregado sob demanda (React.lazy) pela página.

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { construir } from "./build";
import { CENAS } from "../mockup/MockupStage";

const PRESETS = {
  tres: new THREE.Vector3(0.55, 0.8, 0.75),
  topo: new THREE.Vector3(0, 1, 0.02),
  rasante: new THREE.Vector3(0.35, 0.24, 1),
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
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
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

    const resize = () => {
      const w = host.clientWidth || 800;
      const h = host.clientHeight || 600;
      renderer.setSize(w, h, false);
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
      renderer.render(scene, camera);
    };
    loop();

    Object.assign(S.current, { renderer, scene, camera, controls, chao, pmrem, host });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      controls.dispose();
      S.current.modelo && limpar(S.current.modelo, S.current.track);
      S.current.fundo?.dispose?.();
      S.current.piso?.dispose?.();
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
  const chave = JSON.stringify([
    props.produto, props.tipo, props.metal, props.mat, props.view, props.corCapa,
    props.tamanho, props.formato, props.lado, props.espessura, props.papelao,
    props.corCola, props.destacando,
  ]);
  const chaveFit = `${props.produto}|${props.view}|${props.tamanho}|${props.formato}|${props.tipo === "bloco"}|${props.destacando}`;

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

    // enquadra a câmera quando muda o "tamanho" do objeto
    if (s.fitKey !== chaveFit) {
      s.fitKey = chaveFit;
      const w = m.userData.w || 1.5;
      const h = m.userData.h || 2;
      const r = Math.hypot(w, h) / 2;
      const dir = s.camera.position.clone().sub(s.controls.target);
      if (dir.lengthSq() < 0.01) dir.copy(PRESETS.tres);
      dir.normalize();
      const aspect = s.camera.aspect || 1;
      const fov = (s.camera.fov * Math.PI) / 180;
      const dist = (r / Math.sin(fov / 2)) * (aspect < 1.1 ? 1.2 / Math.min(aspect, 1.1) * 0.9 : 0.9);
      s.controls.target.set(0, 0.05, 0);
      s.camera.position.copy(dir.multiplyScalar(dist));
      s.controls.update();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chave, props.capaSrc, props.miolosrc, props.folhaSrc]);

  useEffect(() => {
    if (S.current.controls) S.current.controls.autoRotate = !!props.girar;
  }, [props.girar]);

  // ------------------------------------------------ API imperativa
  useImperativeHandle(ref, () => ({
    preset(nome) {
      const s = S.current;
      const dir = (PRESETS[nome] || PRESETS.tres).clone().normalize();
      const dist = s.camera.position.distanceTo(s.controls.target);
      s.camera.position.copy(s.controls.target).add(dir.multiplyScalar(dist));
      s.controls.update();
    },
    capturar({ tipo = "png", largura = 2400 } = {}) {
      const s = S.current;
      const { renderer, camera, scene } = s;
      const prevPR = renderer.getPixelRatio();
      const prev = renderer.getSize(new THREE.Vector2());
      const aspect = camera.aspect;
      renderer.setPixelRatio(1);
      renderer.setSize(largura, Math.round(largura / aspect), false);
      renderer.render(scene, camera);
      return new Promise((ok) => {
        renderer.domElement.toBlob(
          (b) => {
            renderer.setPixelRatio(prevPR);
            renderer.setSize(prev.x, prev.y, false);
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
