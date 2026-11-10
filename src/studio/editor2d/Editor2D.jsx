// Editor de composição 2D (react-konva): objetos arrastáveis, transformação,
// camadas, guias de alinhamento, zoom/pan e exportação.
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { Group, Image as KImage, Layer, Line, Rect, Stage, Text, Transformer } from "react-konva";
import { acessorioPorId, imagemAcessorio } from "../acessorios";
import { desenharCenario } from "../cenarios2d";
import { useImg } from "../useImg";
import ProdutoNode from "./ProdutoNode";

function Conteudo({ el }) {
  const acUrl = useMemo(() => (el.tipo === "acessorio" ? imagemAcessorio(acessorioPorId(el.acId), el.c, el.d).url : null), [el.tipo, el.acId, el.c, el.d]);
  const img = useImg(el.tipo === "imagem" ? el.src : el.tipo === "acessorio" ? acUrl : el.tipo === "produto" ? el.capa : null);
  if (el.tipo === "texto") {
    return <Text text={el.texto} width={el.w} fontSize={el.fontSize} fontFamily={el.fonte} fontStyle={el.negrito ? "bold" : "normal"} fill={el.cor} align={el.alinhar || "left"} lineHeight={1.15} />;
  }
  if (el.tipo === "produto") return <ProdutoNode el={el} img={img} />;
  return img ? <KImage image={img} width={el.w} height={el.h} /> : <Rect width={el.w} height={el.h} fill="rgba(128,128,128,0.15)" />;
}

function Fundo({ W, H, cenario, cor }) {
  const cv = useMemo(() => (cenario ? desenharCenario(cenario, Math.min(W, 1600), Math.round((Math.min(W, 1600) * H) / W)) : null), [cenario, W, H]);
  return cv ? <KImage name="fundo" image={cv} width={W} height={H} listening={false} /> : <Rect name="fundo" width={W} height={H} fill={cor || "#ffffff"} listening={false} />;
}

const Editor2D = forwardRef(function Editor2D({ estado, set, selecao, setSelecao, ferramenta }, ref) {
  const { W, H, cenario, fundoCor, elementos } = estado;
  const boxRef = useRef(null), stageRef = useRef(null), trRef = useRef(null), camadaRef = useRef(null);
  const [tam, setTam] = useState({ w: 800, h: 600 });
  const [vista, setVista] = useState({ k: 0.5, x: 20, y: 20 });
  const [guias, setGuias] = useState([]);
  const [espaco, setEspaco] = useState(false);
  const arrasto = useRef(null);
  const medido = useRef(true);

  // ----- tamanho / ajuste de vista
  const ajustar = useCallback(() => {
    const k = Math.min((tam.w - 60) / W, (tam.h - 60) / H, 1.5);
    setVista({ k, x: (tam.w - W * k) / 2, y: (tam.h - H * k) / 2 });
  }, [tam, W, H]);
  useEffect(() => {
    const ro = new ResizeObserver(() => { const b = boxRef.current; if (b) { setTam({ w: b.clientWidth, h: b.clientHeight }); medido.current = false; } });
    ro.observe(boxRef.current);
    return () => ro.disconnect();
  }, []);
  useEffect(() => { medido.current = true; ajustar(); }, [W, H, tam.w, tam.h]); // eslint-disable-line react-hooks/exhaustive-deps

  // ----- transformer
  useEffect(() => {
    const st = stageRef.current, tr = trRef.current;
    if (!st || !tr) return;
    const nos = selecao.filter((id) => !elementos.find((x) => x.id === id)?.locked).map((id) => st.findOne("#" + id)).filter(Boolean);
    tr.nodes(nos);
    tr.getLayer()?.batchDraw();
  }, [selecao, elementos]);

  // ----- teclado
  useEffect(() => {
    const dn = (e) => {
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.code === "Space") { setEspaco(true); e.preventDefault(); }
      if (!selecao.length) return;
      if (e.key === "Delete" || e.key === "Backspace") { set((l) => ({ ...l, elementos: l.elementos.filter((x) => !selecao.includes(x.id) || x.locked) })); setSelecao([]); }
      const d = e.shiftKey ? 10 : 1;
      const m = { ArrowLeft: [-d, 0], ArrowRight: [d, 0], ArrowUp: [0, -d], ArrowDown: [0, d] }[e.key];
      if (m) { e.preventDefault(); set((l) => ({ ...l, elementos: l.elementos.map((x) => (selecao.includes(x.id) && !x.locked ? { ...x, x: x.x + m[0], y: x.y + m[1] } : x)) })); }
    };
    const up = (e) => e.code === "Space" && setEspaco(false);
    window.addEventListener("keydown", dn); window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", dn); window.removeEventListener("keyup", up); };
  }, [selecao, set, setSelecao]);

  // ----- zoom com a roda
  const aoRoda = (e) => {
    e.evt.preventDefault();
    const st = stageRef.current, p = st.getPointerPosition();
    const f = e.evt.deltaY < 0 ? 1.1 : 1 / 1.1;
    const k = Math.max(0.1, Math.min(4, vista.k * f));
    const ptx = (p.x - vista.x) / vista.k, pty = (p.y - vista.y) / vista.k;
    setVista({ k, x: p.x - ptx * k, y: p.y - pty * k });
  };

  // ----- guias de alinhamento (ímã)
  const aoArrastar = (e, el) => {
    const no = e.target, st = stageRef.current, cam = camadaRef.current;
    const lim = 7 / vista.k;
    const r = no.getClientRect({ relativeTo: cam, skipShadow: true });
    const alvosX = [0, W / 2, W], alvosY = [0, H / 2, H];
    st.find(".el").forEach((o) => {
      if (selecao.includes(o.id())) return;
      const q = o.getClientRect({ relativeTo: cam, skipShadow: true });
      alvosX.push(q.x, q.x + q.width / 2, q.x + q.width);
      alvosY.push(q.y, q.y + q.height / 2, q.y + q.height);
    });
    let dx = null, dy = null, gx = null, gy = null;
    [r.x, r.x + r.width / 2, r.x + r.width].forEach((v) => alvosX.forEach((a) => { const d = a - v; if (Math.abs(d) < lim && (dx === null || Math.abs(d) < Math.abs(dx))) { dx = d; gx = a; } }));
    [r.y, r.y + r.height / 2, r.y + r.height].forEach((v) => alvosY.forEach((a) => { const d = a - v; if (Math.abs(d) < lim && (dy === null || Math.abs(d) < Math.abs(dy))) { dy = d; gy = a; } }));
    if (dx !== null) no.x(no.x() + dx);
    if (dy !== null) no.y(no.y() + dy);
    setGuias([...(gx !== null ? [{ v: true, p: gx }] : []), ...(gy !== null ? [{ v: false, p: gy }] : [])]);
    // arrasto em grupo: move os demais selecionados junto
    const a = arrasto.current;
    if (a) a.outros.forEach(({ no: o, x, y }) => { o.x(x + (no.x() - a.x0)); o.y(y + (no.y() - a.y0)); });
  };
  const aoIniciarArrasto = (e) => {
    const st = stageRef.current, no = e.target;
    const ids = selecao.includes(no.id()) ? selecao : [no.id()];
    if (ids !== selecao) setSelecao(ids);
    arrasto.current = { ids, x0: no.x(), y0: no.y(), outros: ids.filter((id) => id !== no.id()).map((id) => st.findOne("#" + id)).filter(Boolean).map((o) => ({ no: o, x: o.x(), y: o.y() })) };
  };
  const aoFimArrasto = () => {
    const st = stageRef.current;
    const ids = arrasto.current?.ids || selecao;
    setGuias([]); arrasto.current = null;
    set((l) => ({ ...l, elementos: l.elementos.map((x) => { const o = ids.includes(x.id) ? st.findOne("#" + x.id) : null; return o ? { ...x, x: Math.round(o.x()), y: Math.round(o.y()) } : x; }) }));
  };
  const aoTransformar = () => {
    const st = stageRef.current;
    set((l) => ({
      ...l,
      elementos: l.elementos.map((x) => {
        const o = selecao.includes(x.id) ? st.findOne("#" + x.id) : null;
        if (!o) return x;
        const sx = o.scaleX(), sy = o.scaleY();
        o.scaleX(1); o.scaleY(1);
        const n = { ...x, x: Math.round(o.x()), y: Math.round(o.y()), rotation: Math.round(o.rotation() * 10) / 10, w: Math.max(8, Math.round(x.w * sx)), h: Math.max(8, Math.round(x.h * sy)) };
        if (x.tipo === "texto") { n.fontSize = Math.max(6, Math.round(x.fontSize * sy)); n.h = n.fontSize * 1.15; }
        return n;
      }),
    }));
  };

  const clicar = (e, el) => {
    e.cancelBubble = true;
    const ids = el.grupo ? elementos.filter((x) => x.grupo === el.grupo).map((x) => x.id) : [el.id];
    if (e.evt.shiftKey) setSelecao((s) => (ids.every((i) => s.includes(i)) ? s.filter((i) => !ids.includes(i)) : [...new Set([...s, ...ids])]));
    else setSelecao(ids);
  };

  // ----- exportação
  const preparar = (fn) => {
    const st = stageRef.current, tr = trRef.current;
    const v = { x: st.x(), y: st.y(), sx: st.scaleX() };
    tr.visible(false); setGuias([]);
    st.scale({ x: 1, y: 1 }); st.position({ x: 0, y: 0 });
    try { return fn(st); } finally { st.scale({ x: v.sx, y: v.sx }); st.position({ x: v.x, y: v.y }); tr.visible(true); st.batchDraw(); }
  };
  useImperativeHandle(ref, () => ({
    ajustar,
    zoom: (f) => setVista((v) => { const k = Math.max(0.1, Math.min(4, v.k * f)); const cx = tam.w / 2, cy = tam.h / 2; return { k, x: cx - ((cx - v.x) / v.k) * k, y: cy - ((cy - v.y) / v.k) * k }; }),
    zoomAtual: () => vista.k,
    exportar({ formato = "png", escala = 2, transparente = false } = {}) {
      return preparar((st) => {
        const fundo = st.findOne(".fundo");
        const tira = transparente && formato === "png";
        if (tira) fundo.visible(false);
        const url = st.toDataURL({ x: 0, y: 0, width: W, height: H, pixelRatio: escala, mimeType: formato === "jpg" ? "image/jpeg" : "image/png", quality: 0.93 });
        if (tira) fundo.visible(true);
        return url;
      });
    },
    exportarSVG({ transparente = false } = {}) {
      return preparar((st) => {
        const cam = camadaRef.current;
        const partes = [];
        const fundo = st.findOne(".fundo");
        if (!transparente) partes.push(`<image x="0" y="0" width="${W}" height="${H}" href="${fundo.toDataURL({ pixelRatio: 1 })}"/>`);
        elementos.forEach((el) => {
          if (el.hidden) return;
          const no = st.findOne("#" + el.id);
          if (!no) return;
          const r = no.getClientRect({ relativeTo: cam });
          if (el.tipo === "texto" && !el.rotation && !el.sombra?.on) {
            partes.push(`<text x="${el.x}" y="${el.y + el.fontSize * 0.88}" font-family="${el.fonte.replace(/"/g, "'")}" font-size="${el.fontSize}" font-weight="${el.negrito ? 700 : 400}" fill="${el.cor}" opacity="${el.opacidade}">${el.texto.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</text>`);
          } else {
            partes.push(`<image x="${r.x}" y="${r.y}" width="${r.width}" height="${r.height}" href="${no.toDataURL({ pixelRatio: 2 })}"/>`);
          }
        });
        return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${partes.join("")}</svg>`;
      });
    },
  }));

  const arrastavel = ferramenta === "mao" || espaco;
  return (
    <div ref={boxRef} className="st-canvas" style={{ cursor: arrastavel ? "grab" : "default" }}>
      <Stage
        ref={stageRef} width={tam.w} height={tam.h} x={vista.x} y={vista.y} scaleX={vista.k} scaleY={vista.k}
        draggable={arrastavel}
        onDragEnd={(e) => e.target === stageRef.current && setVista((v) => ({ ...v, x: e.target.x(), y: e.target.y() }))}
        onWheel={aoRoda}
        onMouseDown={(e) => { if (e.target === stageRef.current || e.target.name() === "fundo") setSelecao([]); }}
        onTouchStart={(e) => { if (e.target === stageRef.current || e.target.name() === "fundo") setSelecao([]); }}
      >
        <Layer ref={camadaRef}>
          <Rect x={4} y={6} width={W} height={H} fill="rgba(0,0,0,0.35)" blurRadius={0} listening={false} shadowBlur={30} shadowColor="#000" shadowOpacity={0.4} />
          <Group clipFunc={(c) => c.rect(0, 0, W, H)}>
            <Fundo W={W} H={H} cenario={cenario} cor={fundoCor} />
            {elementos.filter((el) => !el.hidden).map((el) => (
              <Group
                key={el.id} id={el.id} name="el" x={el.x} y={el.y} rotation={el.rotation || 0} opacity={el.opacidade ?? 1}
                draggable={!el.locked && !arrastavel} listening={!el.locked}
                shadowColor={el.sombra?.on ? el.sombra.cor : undefined} shadowBlur={el.sombra?.on ? el.sombra.blur : 0}
                shadowOffset={{ x: el.sombra?.on ? el.sombra.x : 0, y: el.sombra?.on ? el.sombra.y : 0 }} shadowOpacity={el.sombra?.on ? el.sombra.op : 0}
                onClick={(e) => clicar(e, el)} onTap={(e) => clicar(e, el)}
                onDragStart={aoIniciarArrasto} onDragMove={(e) => aoArrastar(e, el)} onDragEnd={aoFimArrasto}
                onTransformEnd={aoTransformar}
              >
                <Conteudo el={el} />
              </Group>
            ))}
          </Group>
          {guias.map((g, i) => <Line key={i} points={g.v ? [g.p, -2000, g.p, H + 2000] : [-2000, g.p, W + 2000, g.p]} stroke="#ec4899" strokeWidth={1 / vista.k} dash={[6 / vista.k, 4 / vista.k]} listening={false} />)}
          <Transformer ref={trRef} rotateEnabled keepRatio={false} anchorSize={9} anchorCornerRadius={3} borderStroke="#6366f1" anchorStroke="#6366f1" rotationSnaps={[0, 45, 90, 135, 180, 225, 270, 315]} boundBoxFunc={(a, b) => (b.width < 8 || b.height < 8 ? a : b)} />
        </Layer>
      </Stage>
    </div>
  );
});

export default Editor2D;
