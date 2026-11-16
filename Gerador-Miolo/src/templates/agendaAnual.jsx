// Agenda Anual Completa: Clássica / Pop Color / Planner, para o ano escolhido.
import { PaginaAnual } from "../components/layouts/AgendaAnualLayout";
import { agendaAnualCfg, montarPaginasAnual } from "../lib/configAgendaAnual";

export default {
  nome: "Agenda Anual Completa",
  layout: (props) => {
    const { printing, ...rest } = props;
    const cfg = agendaAnualCfg.get();
    const paginas = montarPaginasAnual(cfg);
    if (!printing) {
      const vistos = new Set();
      const amostra = [];
      paginas.forEach((it) => {
        if (!vistos.has(it.tipo) && amostra.length < 12) { vistos.add(it.tipo); amostra.push(it); }
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
