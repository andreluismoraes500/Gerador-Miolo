import { Camera, Eye, Maximize2, RotateCw, Sun } from "lucide-react";
import { TIPOS_ENCADERNACAO } from "../../components/mockup/bindings";
import { ACABAMENTOS, BOTTON_TAMANHOS, CAIXA_TAMANHOS, DISPOSICOES, FORMATOS_BLOCO, MATERIAIS, METAIS3D, MOLDURAS, PAPELAO3D, QUADRO_TAMANHOS, SACOLA_TAMANHOS, TAMANHOS } from "../../components/mockup3d/opcoes";
import { LUZ_PADRAO } from "../padrao3d";
import { Botao, Cor, Linha, Secao, Seg, Slider } from "./Ui";

const sel = (obj, campo = "nome") => Object.entries(obj).map(([k, v]) => <option key={k} value={k}>{v[campo] ?? v}</option>);
const CAMERAS = [["frontal", "Frontal"], ["superior", "Superior"], ["lateral", "Lateral"], ["tres", "3/4"], ["iso", "Isométrica"], ["close", "Close-up"], ["verso", "Verso"]];

export default function PropsDireita3D({ s, setS, cam, exp, setExp, aoExportar, gravando, ocupado }) {
  const p = (patch) => setS((o) => ({ ...o, ...patch }));
  const agenda = ["agenda", "kit", "calendario"].includes(s.produto);
  const luz = (k) => (v) => p({ luz: { ...s.luz, [k]: v } });

  return (
    <div className="st-props">
      <Secao titulo="Dimensões e acabamento">
        {agenda && (
          <>
            <Linha rotulo="Tamanho"><select value={s.tamanho} onChange={(e) => p({ tamanho: e.target.value })}>{sel(TAMANHOS)}</select></Linha>
            <Linha rotulo="Encadernação"><select value={s.tipo} onChange={(e) => p({ tipo: e.target.value })}>{TIPOS_ENCADERNACAO.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}</select></Linha>
            <Linha rotulo="Posição"><Seg valor={s.disp} opcoes={Object.entries(DISPOSICOES)} onChange={(v) => p({ disp: v })} /></Linha>
            <Linha rotulo="Visualização"><Seg valor={s.view} opcoes={[["fechada", "Fechado"], ["aberta", "Aberto"]]} onChange={(v) => p({ view: v })} /></Linha>
            <div className="st-acoes">
              {[["cantos", "Cantos"], ["elastico", "Elástico"], ["fita", "Fita"], ["caneta", "Caneta"]].map(([k, n]) => (
                <button key={k} className={`st-tag ${s[k] ? "on" : ""}`} onClick={() => p({ [k]: !s[k] })}>{n}</button>
              ))}
            </div>
          </>
        )}
        {s.produto === "bloco" && (
          <>
            <Linha rotulo="Formato"><select value={s.formato} onChange={(e) => p({ formato: e.target.value })}>{sel(FORMATOS_BLOCO)}</select></Linha>
            <Slider rotulo="Espessura" valor={s.espessura} min={1} max={8} onChange={(v) => p({ espessura: v })} un=" cm" />
            <Linha rotulo="Papelão"><select value={s.papelao} onChange={(e) => p({ papelao: e.target.value })}>{Object.keys(PAPELAO3D).map((k) => <option key={k}>{k}</option>)}</select></Linha>
          </>
        )}
        {s.produto === "quadro" && (
          <>
            <Linha rotulo="Tamanho"><select value={s.qTam} onChange={(e) => p({ qTam: e.target.value })}>{sel(QUADRO_TAMANHOS)}</select></Linha>
            <Linha rotulo="Moldura"><select value={s.moldura} onChange={(e) => p({ moldura: e.target.value })}>{sel(MOLDURAS)}</select></Linha>
            <Slider rotulo="Largura moldura" valor={s.molduraLarg} min={1} max={5} onChange={(v) => p({ molduraLarg: v })} />
            <Seg valor={s.orient} opcoes={[["retrato", "Retrato"], ["paisagem", "Paisagem"]]} onChange={(v) => p({ orient: v })} />
          </>
        )}
        {s.produto === "botton" && (
          <>
            <Linha rotulo="Diâmetro"><select value={s.bTam} onChange={(e) => p({ bTam: e.target.value })}>{sel(BOTTON_TAMANHOS)}</select></Linha>
            <Slider rotulo="Quantidade" valor={s.bQtd} min={1} max={9} onChange={(v) => p({ bQtd: v })} />
          </>
        )}
        {s.produto === "caneca" && (
          <>
            <Slider rotulo="Arco da arte" valor={s.cArco} min={120} max={360} onChange={(v) => p({ cArco: v })} un="°" />
            <Seg valor={s.cMat} opcoes={[["brilho", "Brilhante"], ["fosco", "Fosca"]]} onChange={(v) => p({ cMat: v })} />
            <button className={`st-tag ${s.cafe ? "on" : ""}`} onClick={() => p({ cafe: !s.cafe })}>Café dentro</button>
          </>
        )}
        {s.produto === "cartoes" && <Slider rotulo="Quantidade" valor={s.cQtd} min={1} max={30} onChange={(v) => p({ cQtd: v })} />}
        {s.produto === "caixa" && (
          <>
            <Linha rotulo="Tamanho"><select value={s.cxTam} onChange={(e) => p({ cxTam: e.target.value })}>{sel(CAIXA_TAMANHOS)}</select></Linha>
            <Slider rotulo="Abertura" valor={s.abertura} min={0} max={110} onChange={(v) => p({ abertura: v })} un="°" />
          </>
        )}
        {s.produto === "sacola" && <Linha rotulo="Tamanho"><select value={s.sTam} onChange={(e) => p({ sTam: e.target.value })}>{sel(SACOLA_TAMANHOS)}</select></Linha>}
      </Secao>

      <Secao titulo="Cores">
        <Cor rotulo={s.produto === "caneca" ? "Cor da caneca" : "Cor da capa"} valor={s.produto === "caneca" ? s.corCaneca : s.corCapa} onChange={(c) => p(s.produto === "caneca" ? { corCaneca: c } : { corCapa: c })} />
        {s.produto === "caneca" && <Cor rotulo="Interior" valor={s.corInterior} onChange={(c) => p({ corInterior: c })} />}
        {s.produto === "caneca" && <Cor rotulo="Alça" valor={s.corAlca} onChange={(c) => p({ corAlca: c })} />}
        {agenda && s.elastico && <Cor rotulo="Elástico" valor={s.corElastico} onChange={(c) => p({ corElastico: c })} />}
        {agenda && s.fita && <Cor rotulo="Fita" valor={s.corFita} onChange={(c) => p({ corFita: c })} />}
      </Secao>

      <Secao titulo="Materiais">
        {agenda && (
          <>
            <Linha rotulo="Capa"><select value={s.mat} onChange={(e) => p({ mat: e.target.value })}>{sel(MATERIAIS)}</select></Linha>
            <Linha rotulo="Metal"><select value={s.metal} onChange={(e) => p({ metal: e.target.value })}>{sel(METAIS3D)}</select></Linha>
            <Linha rotulo="Acabamento"><select value={s.acab} onChange={(e) => p({ acab: e.target.value })}>{sel(ACABAMENTOS)}</select></Linha>
            {s.acab !== "nenhum" && <Linha rotulo="Texto"><input value={s.acabTexto} maxLength={28} onChange={(e) => p({ acabTexto: e.target.value })} /></Linha>}
            <Linha rotulo="Miolo">
              <select value={s.mioloTipo} onChange={(e) => p({ mioloTipo: e.target.value })}>
                {["pautado", "pontilhado", "quadriculado", "semanal", "partitura", "branco"].map((m) => <option key={m}>{m}</option>)}
              </select>
            </Linha>
          </>
        )}
        {!agenda && <p className="st-dica">Cor e arte definem o acabamento deste produto. Envie uma imagem em “Uploads” para aplicar.</p>}
      </Secao>

      <Secao titulo="Iluminação de estúdio">
        <Slider rotulo="Luz principal" valor={s.luz.principal} min={0} max={2.5} passo={0.05} onChange={luz("principal")} />
        <Slider rotulo="Preenchimento" valor={s.luz.preench} min={0} max={3} passo={0.05} onChange={luz("preench")} />
        <Slider rotulo="Recorte" valor={s.luz.recorte} min={0} max={3} passo={0.05} onChange={luz("recorte")} />
        <Slider rotulo="Ambiente" valor={s.luz.ambiente} min={0} max={2.5} passo={0.05} onChange={luz("ambiente")} />
        <Slider rotulo="Exposição" valor={s.luz.exposicao} min={0.5} max={1.6} passo={0.02} onChange={luz("exposicao")} />
        <Slider rotulo="Ângulo" valor={s.luz.angulo} min={-40} max={40} onChange={luz("angulo")} un="°" />
        <Botao icone={Sun} onClick={() => p({ luz: LUZ_PADRAO })}>Restaurar luz</Botao>
      </Secao>

      <Secao titulo="Câmeras">
        <div className="st-cams">
          {CAMERAS.map(([k, n]) => <button key={k} className="st-tag" onClick={() => cam(k)}><Camera size={12} /> {n}</button>)}
        </div>
      </Secao>

      <Secao titulo="Transformações" aberto={false}>
        <Botao icone={RotateCw} className={s.girar ? "on" : ""} onClick={() => p({ girar: !s.girar })}>{s.girar ? "Parar giro" : "Girar automaticamente"}</Botao>
        {agenda && s.capaSrc && (
          <>
            <Seg valor={s.ajuste.modo} opcoes={[["cobrir", "Cobrir"], ["caber", "Caber"]]} onChange={(v) => p({ ajuste: { ...s.ajuste, modo: v } })} />
            <Slider rotulo="Zoom da arte" valor={s.ajuste.zoom} min={0.5} max={3} passo={0.05} onChange={(v) => p({ ajuste: { ...s.ajuste, zoom: v } })} />
            <Slider rotulo="Posição X" valor={s.ajuste.x} min={-1} max={1} passo={0.02} onChange={(v) => p({ ajuste: { ...s.ajuste, x: v } })} />
            <Slider rotulo="Posição Y" valor={s.ajuste.y} min={-1} max={1} passo={0.02} onChange={(v) => p({ ajuste: { ...s.ajuste, y: v } })} />
          </>
        )}
      </Secao>

      <Secao titulo="Exportação">
        <Linha rotulo="Formato"><Seg valor={exp.formato} opcoes={[["png", "PNG"], ["jpg", "JPG"], ["webm", "Vídeo"]]} onChange={(v) => setExp({ ...exp, formato: v })} /></Linha>
        {exp.formato !== "webm" ? (
          <>
            <Linha rotulo="Resolução"><Seg valor={exp.largura} opcoes={[[1200, "HD"], [2048, "2K"], [3840, "4K"]]} onChange={(v) => setExp({ ...exp, largura: v })} /></Linha>
            {exp.formato === "png" && <label className="st-check"><input type="checkbox" checked={exp.transparente} onChange={(e) => setExp({ ...exp, transparente: e.target.checked })} /> Fundo transparente</label>}
          </>
        ) : (
          <>
            <Slider rotulo="Duração" valor={exp.segundos} min={3} max={20} onChange={(v) => setExp({ ...exp, segundos: v })} un=" s" />
            <Linha rotulo="Qualidade"><Seg valor={exp.bitrate} opcoes={[[4e6, "Média"], [8e6, "Alta"], [16e6, "Máxima"]]} onChange={(v) => setExp({ ...exp, bitrate: v })} /></Linha>
          </>
        )}
        <Botao icone={Maximize2} className="st-btn--primario" disabled={ocupado || gravando} onClick={aoExportar}>{gravando ? "Gravando…" : ocupado ? "Gerando…" : "Exportar agora"}</Botao>
        <p className="st-dica"><Eye size={11} /> A captura usa a câmera e a luz atuais.</p>
      </Secao>
    </div>
  );
}
