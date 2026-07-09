// src/components/AgendaBuilderPreview.jsx
//
// Renderiza o "Modo Montagem":
// - Na tela: cada módulo aparece como um cartão empilhado, rotulado e na
//   ordem escolhida, reutilizando o preview normal de cada template.
// - Na impressão: os `.page-break` de CADA módulo são extraídos e
//   concatenados em UM ÚNICO `.print-container`, para que o navegador gere
//   um PDF/impressão contínua com paginação e margens espelhadas corretas
//   do início ao fim — sem precisar de html2canvas ou libs de PDF.

import React from "react";
import { TEMPLATES } from "../templates";
import { useAgendaConfig } from "../context/AgendaConfigContext";
import PlannerMensalLayout from "./layouts/PlannerMensalLayout";

// Templates que geram os dias do ANO INTEIRO (miolo diário completo).
// Quando um destes estiver na Montagem junto com o "Planner Mensal", os dois
// são mesclados automaticamente: o planner de cada mês passa a sair logo
// antes dos dias daquele mês, em vez de sair todo de uma vez no início.
const ANNUAL_DAY_TEMPLATES = new Set(["anualCompleto", "anualLivre", "anualComercialDuplo"]);

// Cada template, quando chamado com printing=true, sempre retorna:
//   <div className="print-container">{ ...um ou mais .page-break... }</div>
// Essa função "desembrulha" esse container e devolve só as páginas, com
// chaves únicas por módulo, prontas para serem concatenadas.
function extractPrintPages(renderedElement, keyPrefix) {
  if (!renderedElement || !renderedElement.props) return [];
  const { children } = renderedElement.props;
  if (children === undefined) return [];

  return React.Children.toArray(children).map((child, i) =>
    React.isValidElement(child)
      ? React.cloneElement(child, { key: `${keyPrefix}-${i}` })
      : child,
  );
}

const AgendaBuilderPreview = React.memo(function AgendaBuilderPreview({
  modules,
  customName,
  selectedDate,
  printing,
  businessProfile,
  businessProfileId,
}) {
  const {
    colorTheme,
    logo,
    footerType,
    customColors,
    fontFamily,
    watermarkSrc,
    watermarkOpacity,
    backgroundSrc,
    backgroundOpacity,
    capaNome,
    capaEstilo,
    capaFrase,
    setCapaFrase,
  } = useAgendaConfig();

  const baseLayoutProps = {
    footerName: customName,
    selectedDate,
    colorTheme,
    logo,
    footerType,
    customColors,
    fontFamily,
    watermarkSrc,
    watermarkOpacity,
    backgroundSrc,
    backgroundOpacity,
    businessType: businessProfileId || "default",
    businessProfile,
    capaNome,
    capaEstilo,
    capaFrase,
    setCapaFrase,
  };

  const validModules = modules.filter((m) => TEMPLATES[m.templateKey]);

  if (validModules.length === 0) {
    return (
      <div className="max-w-[210mm] w-full mx-auto p-16 text-center text-[#8a8272] border-2 border-dashed border-[#D8CBA8] rounded-xl bg-[#FBF8F1]">
        <p className="text-sm">
          Nenhum módulo adicionado ainda.
          <br />
          Use o painel acima para montar sua agenda completa.
        </p>
      </div>
    );
  }

  // ── Impressão: achata tudo em um único print-container ──
  if (printing) {
    const temPlannerMensal = validModules.some((m) => m.templateKey === "plannerMensal");
    const modulosAnuais = validModules.filter((m) => ANNUAL_DAY_TEMPLATES.has(m.templateKey));
    // Só faz sentido mesclar mês-a-mês quando o Planner Mensal está
    // acompanhado de pelo menos um miolo diário anual.
    const usarMesclagemMensal = temPlannerMensal && modulosAnuais.length > 0;
    const anoBase = parseInt(selectedDate.split("-")[0], 10);

    let jaMesclado = false;
    const allPages = validModules.flatMap((mod) => {
      const ehModuloEspecial =
        mod.templateKey === "plannerMensal" || ANNUAL_DAY_TEMPLATES.has(mod.templateKey);

      if (usarMesclagemMensal && ehModuloEspecial) {
        // Insere o bloco mesclado (Planner Jan + dias Jan + Planner Fev + ...)
        // uma única vez, na posição do primeiro módulo especial encontrado.
        // As demais ocorrências de módulos especiais são ignoradas aqui,
        // pois já fazem parte do bloco mesclado.
        if (jaMesclado) return [];
        jaMesclado = true;

        const paginasMescladas = [];
        for (let mes = 0; mes < 12; mes += 1) {
          paginasMescladas.push(
            <div key={`planner-${mod.uid}-mes${mes}`} className="page-break">
              <PlannerMensalLayout ano={anoBase} mes={mes} {...baseLayoutProps} />
            </div>,
          );
          modulosAnuais.forEach((modAnual) => {
            const defAnual = TEMPLATES[modAnual.templateKey];
            const renderizado = defAnual.layout({
              ...baseLayoutProps,
              printing: true,
              apenasMes: mes,
            });
            paginasMescladas.push(...extractPrintPages(renderizado, `${modAnual.uid}-mes${mes}`));
          });
        }
        return paginasMescladas;
      }

      const def = TEMPLATES[mod.templateKey];
      const rendered = def.layout({ ...baseLayoutProps, printing: true });
      return extractPrintPages(rendered, mod.uid);
    });

    return <div className="print-container">{allPages}</div>;
  }

  // ── Tela: cada módulo como um cartão rotulado, na ordem escolhida ──
  return (
    <div className="flex flex-col gap-8 w-full items-center">
      {validModules.map((mod, idx) => {
        const def = TEMPLATES[mod.templateKey];
        return (
          <div key={mod.uid} className="w-full max-w-[210mm]">
            <div className="flex items-center gap-2 mb-2 px-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B6A1F] bg-[#EFE4C8] border border-[#DEC98B] rounded-full w-5 h-5 flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
              <span className="text-xs font-semibold text-[#24344D]">{def.nome}</span>
            </div>
            <div className="agenda-preview-container">
              {def.layout({ ...baseLayoutProps, printing: false })}
            </div>
          </div>
        );
      })}
    </div>
  );
});

export default AgendaBuilderPreview;
