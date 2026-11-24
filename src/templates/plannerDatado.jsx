// Planner Datado (wire-o): o planner anual completo com feriados, metas, finanças,
// semanas com hábitos e balanço mensal. Usa a mesma base da Agenda Anual Completa (estilo Planner).
import { PaginaAnual } from "../components/layouts/AgendaAnualLayout";
import { agendaAnualCfg, montarPaginasAnual, ESTILOS } from "../lib/configAgendaAnual";

export const cfgPlanner = () => {
  const c = agendaAnualCfg.get();
  return { ...c, estilo: "planner", ref: true, cor: c.corRef || ESTILOS.planner.cor, semanaComeca: 1, extrasPlanner: true };
};

export default {
  nome: "Planner Datado (wire-o)",
  layout: (props) => {
    const { printing, ...rest } = props;
    const cfg = cfgPlanner();
    const paginas = montarPaginasAnual(cfg);
    if (!printing) {
      const vistos = new Set();
      const amostra = [];
      paginas.forEach((it) => {
        if (!vistos.has(it.tipo) && amostra.length < 14) { vistos.add(it.tipo); amostra.push(it); }
      });
      return (
        <div className="flex flex-col gap-6">
          {amostra.map((it, i) => <PaginaAnual key={i} item={it} cfg={cfg} {...rest} />)}
          <p className="text-center text-xs text-gray-500">Amostra de {amostra.length} tipos de página — o arquivo completo terá {paginas.length} páginas.</p>
        </div>
      );
    }
    return (
      <div className="print-container">
        {paginas.map((it, i) => (
          <div key={i} className="page-break"><PaginaAnual item={it} cfg={cfg} {...rest} /></div>
        ))}
      </div>
    );
  },
};
