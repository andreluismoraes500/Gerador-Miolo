// src/templates/pautado.jsx
//
// Caderno Pautado: só linhas, sem capa nem cabeçalho. Espaçamento, estilo,
// cor, margem e número de folhas ficam em lib/configPautado (painel "Caderno pautado").
import { PautadoPage } from "../components/layouts/PautadoLayout";
import { pautadoCfg } from "../lib/configPautado";

const PAGINAS_NA_TELA = 3;

export default {
  nome: "Caderno Pautado (só linhas)",
  layout: (props) => {
    const { printing, ...rest } = props;
    const total = Math.max(1, pautadoCfg.get().paginas);

    if (!printing) {
      const amostra = Math.min(total, PAGINAS_NA_TELA);
      return (
        <div className="flex flex-col gap-6">
          {Array.from({ length: amostra }).map((_, i) => (
            <PautadoPage key={`previa-${i}`} pageIndex={i} totalPaginas={total} {...rest} />
          ))}
          {total > amostra && <p className="text-center text-xs text-gray-500">Mostrando {amostra} folhas; o arquivo completo terá {total}.</p>}
        </div>
      );
    }

    return (
      <div className="print-container">
        {Array.from({ length: total }).map((_, i) => (
          <div key={`pauta-${i}`} className="page-break">
            <PautadoPage pageIndex={i} totalPaginas={total} {...rest} />
          </div>
        ))}
      </div>
    );
  },
};
