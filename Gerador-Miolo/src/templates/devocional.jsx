// Diário Devocional: ordem e quantidade de páginas vêm de lib/configDevocional.
import { PaginaDevocional } from "../components/layouts/DevocionalLayout";
import { devocionalCfg, montarPaginas } from "../lib/configDevocional";

const AMOSTRA = 10;

export default {
  nome: "Diário Devocional",
  layout: (props) => {
    const { printing, ...rest } = props;
    const cfg = devocionalCfg.get();
    const paginas = montarPaginas(cfg);

    if (!printing) {
      // Amostra: primeira página de cada tipo (no máximo 10).
      const vistos = new Set();
      const amostra = [];
      paginas.forEach((it, i) => {
        const chave = it.tipo === "calendario" ? `${it.tipo}${it.ano}` : it.tipo;
        if (!vistos.has(chave) && amostra.length < AMOSTRA) { vistos.add(chave); amostra.push([it, i]); }
      });
      return (
        <div className="flex flex-col gap-6">
          {amostra.map(([it, i]) => <PaginaDevocional key={i} item={it} idx={i} {...rest} />)}
          <p className="text-center text-xs text-gray-500">Amostra de {amostra.length} tipos de página — o arquivo completo terá {paginas.length} páginas.</p>
        </div>
      );
    }
    return (
      <div className="print-container">
        {paginas.map((it, i) => (
          <div key={i} className="page-break"><PaginaDevocional item={it} idx={i} {...rest} /></div>
        ))}
      </div>
    );
  },
};
