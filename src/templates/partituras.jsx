// src/templates/partituras.jsx
//
// Caderno de Partituras: capa + pautas. O usuário escolhe um ou vários
// tipos de pauta (sol, fá, piano, tablatura, cifra, letra, bateria) e se
// eles se alternam página a página ou ficam em blocos (ver lib/configPartituras).

import {
  PartiturasCapaPage,
  PartiturasPautaPage,
} from "../components/layouts/PartiturasLayout";
import { partiturasCfg, tipoDaPagina } from "../lib/configPartituras";

const PAGINAS_NA_TELA = 10;

export default {
  nome: "Caderno de Partituras",
  layout: (props) => {
    const { printing, ...rest } = props;

    const cfg = partiturasCfg.get();
    const total = cfg.paginas;

    // Na tela: capa + primeiras páginas de pauta (10 no total), para dar
    // noção real do que será impresso.
    if (!printing) {
      const amostra = Math.min(total, PAGINAS_NA_TELA - 1);
      return (
        <div className="flex flex-col gap-6">
          <PartiturasCapaPage {...rest} />
          {Array.from({ length: amostra }).map((_, i) => (
            <PartiturasPautaPage
              key={`previa-${i}`}
              pageIndex={i}
              totalPaginas={total}
              comCampos={i === 0}
              tipo={tipoDaPagina(i, cfg)}
              {...rest}
            />
          ))}
          {total > amostra && (
            <p className="text-center text-xs text-gray-500">
              Mostrando 10 páginas; o arquivo completo terá {total + 1}.
            </p>
          )}
        </div>
      );
    }

    return (
      <div className="print-container">
        <div className="page-break">
          <PartiturasCapaPage {...rest} />
        </div>

        {Array.from({ length: total }).map((_, i) => (
          <div key={`pauta-${i}`} className="page-break">
            <PartiturasPautaPage
              pageIndex={i}
              totalPaginas={total}
              comCampos={i === 0}
              tipo={tipoDaPagina(i, cfg)}
              {...rest}
            />
          </div>
        ))}
      </div>
    );
  },
};
