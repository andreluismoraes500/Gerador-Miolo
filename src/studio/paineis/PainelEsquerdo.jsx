import { Boxes, Flower2, ImagePlus, LayoutTemplate, Layers, Palette, Upload } from "lucide-react";
import { CENAS, cenaDe } from "../../components/mockup/MockupStage";
import { ACESSORIOS_3D, MATERIAIS, METAIS3D, PRODUTOS } from "../../components/mockup3d/opcoes";
import { ACESSORIOS, CATEGORIAS, imagemAcessorio } from "../acessorios";
import { CENARIOS_2D } from "../cenarios2d";
import { PRODUTOS_2D } from "../editor2d/ProdutoNode";
import { MODELOS } from "../modelos";
import { Chip } from "./Ui";

export const ABAS = [
  ["produtos", "Produtos", Boxes], ["modelos", "Modelos", LayoutTemplate], ["cenarios", "Cenários", Layers],
  ["materiais", "Materiais", Palette], ["acessorios", "Acessórios", Flower2], ["uploads", "Uploads", Upload],
];

function Miniatura({ m }) {
  return (
    <div className="st-modelo__img" style={{ background: `linear-gradient(135deg, ${m.cores[0]}, ${m.cores[1]})` }}>
      <svg viewBox="0 0 80 60" aria-hidden="true">
        <rect x="26" y="8" width="30" height="42" rx="3" fill="rgba(255,255,255,.88)" transform="rotate(-6 41 29)" />
        <rect x="30" y="10" width="28" height="42" rx="3" fill="rgba(30,41,59,.82)" transform="rotate(5 44 31)" />
        {Array.from({ length: 7 }).map((_, i) => <circle key={i} cx="31" cy={15 + i * 5.2} r="1.5" fill="#f3d27a" transform="rotate(5 44 31)" />)}
      </svg>
    </div>
  );
}
const Acessorio = ({ a, onAdd }) => (
  <button className="st-item" title={a.nome} onClick={() => onAdd(a)}>
    <img alt={a.nome} src={imagemAcessorio(a).url} />
    <span>{a.nome}</span>
  </button>
);

export default function PainelEsquerdo({ aba, modo, s3, setS3, set2d, uploads, onUpload, aoAdd, aoModelo, estado2d, selecao }) {
  const proxy = (patch) => setS3((o) => ({ ...o, ...patch }));
  if (aba === "produtos") {
    return modo === "3d" ? (
      <div className="st-lista">
        {Object.entries(PRODUTOS).map(([k, n]) => <button key={k} className={`st-card ${s3.produto === k ? "on" : ""}`} onClick={() => proxy({ produto: k })}>{n}</button>)}
      </div>
    ) : (
      <div className="st-grade">
        {PRODUTOS_2D.map((p) => <button key={p.id} className="st-card" onClick={() => aoAdd("produto", p)}>{p.nome}</button>)}
        <p className="st-dica st-span">Dica: envie uma arte em “Uploads” e clique nela com o produto selecionado para aplicar na capa.</p>
      </div>
    );
  }
  if (aba === "modelos") {
    return (
      <div className="st-lista">
        {MODELOS.map((m) => (
          <article key={m.id} className="st-modelo">
            <Miniatura m={m} />
            <div className="st-modelo__txt">
              <b>{m.nome}</b>
              <small>{m.categoria} · {m.produto} · {m.tipo.toUpperCase()}</small>
              <p>{m.desc}</p>
              <button className="st-btn st-btn--primario" onClick={() => aoModelo(m)}>Personalizar</button>
            </div>
          </article>
        ))}
      </div>
    );
  }
  if (aba === "cenarios") {
    return modo === "3d" ? (
      <div className="st-grade">
        {Object.entries(CENAS).map(([k, c]) => (
          <button key={k} className={`st-cena ${s3.cena === k ? "on" : ""}`} style={{ background: `linear-gradient(135deg, ${c.a}, ${c.b})`, color: c.escuro ? "#fff" : "#1e293b" }} onClick={() => proxy({ cena: k })}>{c.nome}</button>
        ))}
        <label className="st-cena st-cena--cor">Cor própria<input type="color" value={/^#/.test(s3.cena) ? s3.cena : cenaDe(s3.cena).b} onChange={(e) => proxy({ cena: e.target.value })} /></label>
      </div>
    ) : (
      <div className="st-grade">
        {CENARIOS_2D.map((c) => (
          <button key={c.id} className={`st-cena ${estado2d.cenario === c.id ? "on" : ""}`} style={{ background: `linear-gradient(135deg, ${c.a}, ${c.b})`, color: ["profissional", "escritorio"].includes(c.id) ? "#fff" : "#1e293b" }} onClick={() => set2d((l) => ({ ...l, cenario: c.id }))}>{c.nome}</button>
        ))}
      </div>
    );
  }
  if (aba === "materiais") {
    return modo === "3d" ? (
      <div className="st-lista">
        <h4>Material da capa</h4>
        <div className="st-grade">{Object.entries(MATERIAIS).map(([k, m]) => <button key={k} className={`st-card ${s3.mat === k ? "on" : ""}`} onClick={() => proxy({ mat: k })}>{m.nome}</button>)}</div>
        <h4>Acabamento metálico</h4>
        <div className="st-chips">{Object.entries(METAIS3D).map(([k, m]) => <Chip key={k} titulo={m.nome} cor={m.color} on={s3.metal === k} onClick={() => proxy({ metal: k })} />)}</div>
        <h4>Cor da capa</h4>
        <div className="st-chips">
          {["#1e293b", "#7b2d3a", "#1f3a33", "#c2557a", "#e98aa6", "#f4f4f1", "#b99366", "#2f6fd0", "#3a3f48"].map((c) => <Chip key={c} cor={c} titulo={c} on={s3.corCapa === c} onClick={() => proxy({ corCapa: c })} />)}
        </div>
      </div>
    ) : (
      <div className="st-lista">
        <h4>Cor do objeto selecionado</h4>
        <div className="st-chips">
          {["#1e293b", "#7b2d3a", "#1f3a33", "#c2557a", "#e98aa6", "#f4f4f1", "#b99366", "#2f6fd0", "#f6c453", "#6aa86f"].map((c) => (
            <Chip key={c} cor={c} titulo={c} onClick={() => set2d((l) => ({ ...l, elementos: l.elementos.map((e) => (selecao.includes(e.id) ? (e.tipo === "acessorio" ? { ...e, c } : e.tipo === "texto" ? { ...e, cor: c } : e.tipo === "produto" ? { ...e, cor: c } : e) : e)) }))} />
          ))}
        </div>
        <p className="st-dica">Selecione um objeto na tela e clique numa cor.</p>
      </div>
    );
  }
  if (aba === "acessorios") {
    return modo === "3d" ? (
      <div className="st-lista">
        <h4>Objetos na cena (até 8)</h4>
        <div className="st-grade">
          {Object.entries(ACESSORIOS_3D).map(([k, n]) => {
            const on = (s3.acessorios3d || []).includes(k);
            return <button key={k} className={`st-card ${on ? "on" : ""}`} onClick={() => proxy({ acessorios3d: on ? s3.acessorios3d.filter((x) => x !== k) : [...(s3.acessorios3d || []), k] })}>{n}</button>;
          })}
        </div>
        <h4>Da agenda</h4>
        <div className="st-grade">
          {[["elastico", "Elástico"], ["fita", "Fita marcadora"], ["caneta", "Caneta presa"], ["cantos", "Cantos arredondados"]].map(([k, n]) => (
            <button key={k} className={`st-card ${s3[k] ? "on" : ""}`} onClick={() => proxy({ [k]: !s3[k] })}>{n}</button>
          ))}
        </div>
      </div>
    ) : (
      <div className="st-lista">
        <button className="st-btn" onClick={() => aoAdd("texto")}>+ Adicionar texto</button>
        {CATEGORIAS.map((c) => (
          <div key={c}>
            <h4>{c}</h4>
            <div className="st-grade st-grade--3">{ACESSORIOS.filter((a) => a.cat === c).map((a) => <Acessorio key={a.id} a={a} onAdd={(x) => aoAdd("acessorio", x)} />)}</div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="st-lista">
      <label className="st-btn st-btn--primario st-upload"><ImagePlus size={15} /> Enviar imagens<input type="file" accept="image/*" multiple hidden onChange={(e) => { onUpload([...e.target.files]); e.target.value = ""; }} /></label>
      <div className="st-grade st-grade--3">
        {uploads.map((u, i) => (
          <button key={i} className="st-item" title={modo === "3d" ? "Usar como capa" : "Adicionar / aplicar na capa"} onClick={() => aoAdd("upload", u)}>
            <img alt={u.nome} src={u.src} /><span>{u.nome}</span>
          </button>
        ))}
      </div>
      {!uploads.length && <p className="st-dica">Nenhuma imagem enviada. No 3D, a imagem vira a capa/arte do produto; no 2D, vira um objeto (ou a capa do produto selecionado).</p>}
    </div>
  );
}
