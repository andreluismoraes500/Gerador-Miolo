// src/templates/cadernoReceitas.jsx
//
// Caderno de Receitas Culinárias: sumário, e para cada categoria uma
// divisória seguida de N fichas de receita (ingredientes + modo de preparo).
// Ajuste CATEGORIAS e RECEITAS_POR_CATEGORIA para mudar o tamanho do caderno.
import { Fragment } from "react";
import {
  ReceitasSumarioPage,
  ReceitasDivisoriaPage,
  ReceitaFichaPage,
} from "../components/layouts/CadernoReceitasLayout";

const CATEGORIAS = ["Entradas", "Pratos Principais", "Sobremesas", "Bebidas"];
const RECEITAS_POR_CATEGORIA = 8;

export default {
  nome: "Caderno de Receitas Culinárias",
  layout: (props) => {
    const { printing, ...rest } = props;
    const numReceitasTotal = CATEGORIAS.length * RECEITAS_POR_CATEGORIA;

    if (!printing) {
      return <ReceitasSumarioPage numReceitas={numReceitasTotal} {...rest} />;
    }

    return (
      <div className="print-container">
        <div className="page-break">
          <ReceitasSumarioPage numReceitas={numReceitasTotal} {...rest} />
        </div>

        {CATEGORIAS.map((categoria, categoriaIndex) => (
          <Fragment key={`categoria-${categoriaIndex}`}>
            <div className="page-break">
              <ReceitasDivisoriaPage
                index={categoriaIndex}
                defaultTitle={categoria}
                {...rest}
              />
            </div>
            {Array.from({ length: RECEITAS_POR_CATEGORIA }).map((_, receitaIndex) => (
              <div key={`receita-${categoriaIndex}-${receitaIndex}`} className="page-break">
                <ReceitaFichaPage
                  categoriaIndex={categoriaIndex}
                  receitaIndex={receitaIndex}
                  {...rest}
                />
              </div>
            ))}
          </Fragment>
        ))}
      </div>
    );
  },
};
