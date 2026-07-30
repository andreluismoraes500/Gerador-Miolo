// src/components/layouts/CadernoInvestimentosLayout.jsx
import EditableField from "../EditableField";
import { PageShell, PageHeader, useVisual } from "./NotebookShared";

function TableHeader({ cols, secondaryColor }) {
  return (
    <div
      className="grid gap-2 pb-1.5 mb-1 border-b-2 text-[9px] font-bold uppercase tracking-widest text-gray-500"
      style={{ borderBottomColor: secondaryColor, gridTemplateColumns: cols.map((c) => c[1] || "1fr").join(" ") }}
    >
      {cols.map(([label]) => <span key={label}>{label}</span>)}
    </div>
  );
}

export function InvestPerfilPage({ logo, ...rest }) {
  const { primaryColor, secondaryColor, tema } = useVisual(rest.colorTheme, rest.customColors, rest.fontFamily);
  return (
    <PageShell {...rest}>
      <PageHeader logo={logo} title="Perfil do Investidor" subtitle="Caderno de Investimentos" primaryColor={primaryColor} tema={tema} />
      <div className="flex flex-col gap-4">
        {[
          ["Objetivo principal", "objetivo", "Ex: aposentadoria, reserva de emergência, casa própria..."],
          ["Perfil de risco", "perfil", "Conservador / Moderado / Arrojado"],
          ["Meta de aporte mensal", "aporte", "R$ ___"],
          ["Reserva de emergência (meta)", "reserva", "R$ ___ (equivalente a ___ meses de gastos)"],
          ["Horizonte de tempo", "horizonte", "Curto / Médio / Longo prazo"],
        ].map(([label, key, placeholder]) => (
          <div key={key} className="border rounded-sm p-3" style={{ borderColor: secondaryColor }}>
            <p className="text-[9px] uppercase tracking-widest text-gray-400 mb-1.5">{label}</p>
            <EditableField fieldKey={`invest-perfil-${key}`} className="text-sm min-h-[6mm]" placeholder={placeholder} />
          </div>
        ))}
      </div>
    </PageShell>
  );
}

export function InvestCarteiraPage({ logo, numLinhas = 24, ...rest }) {
  const { primaryColor, secondaryColor, tema } = useVisual(rest.colorTheme, rest.customColors, rest.fontFamily);
  const cols = [["Ativo", "1.2fr"], ["Tipo", "1fr"], ["Qtd.", "0.6fr"], ["Preço médio", "1fr"], ["Valor investido", "1fr"]];
  return (
    <PageShell {...rest}>
      <PageHeader logo={logo} title="Controle de Carteira" primaryColor={primaryColor} tema={tema} />
      <TableHeader cols={cols} secondaryColor={secondaryColor} />
      {Array.from({ length: numLinhas }).map((_, i) => (
        <div key={i} className="grid gap-2 py-1.5 border-b border-dotted border-gray-200 last:border-0" style={{ gridTemplateColumns: cols.map((c) => c[1]).join(" ") }}>
          {["ativo", "tipo", "qtd", "preco", "valor"].map((k) => (
            <EditableField key={k} fieldKey={`invest-carteira-${i}-${k}`} className="text-xs" />
          ))}
        </div>
      ))}
    </PageShell>
  );
}

export function InvestProventosPage({ logo, numLinhas = 24, ...rest }) {
  const { primaryColor, secondaryColor, tema } = useVisual(rest.colorTheme, rest.customColors, rest.fontFamily);
  const cols = [["Data", "0.8fr"], ["Ativo", "1fr"], ["Tipo de provento", "1fr"], ["Valor recebido", "1fr"]];
  return (
    <PageShell {...rest}>
      <PageHeader logo={logo} title="Dividendos e Proventos" primaryColor={primaryColor} tema={tema} />
      <TableHeader cols={cols} secondaryColor={secondaryColor} />
      {Array.from({ length: numLinhas }).map((_, i) => (
        <div key={i} className="grid gap-2 py-1.5 border-b border-dotted border-gray-200 last:border-0" style={{ gridTemplateColumns: cols.map((c) => c[1]).join(" ") }}>
          {["data", "ativo", "tipo", "valor"].map((k) => (
            <EditableField key={k} fieldKey={`invest-proventos-${i}-${k}`} className="text-xs" placeholder={k === "data" ? "__/__" : undefined} />
          ))}
        </div>
      ))}
    </PageShell>
  );
}

export function InvestMetasPage({ logo, numMetas = 8, ...rest }) {
  const { primaryColor, secondaryColor, tema } = useVisual(rest.colorTheme, rest.customColors, rest.fontFamily);
  return (
    <PageShell {...rest}>
      <PageHeader logo={logo} title="Metas Financeiras" primaryColor={primaryColor} tema={tema} />
      <div className="flex flex-col gap-3">
        {Array.from({ length: numMetas }).map((_, i) => (
          <div key={i} className="border rounded-sm p-2.5" style={{ borderColor: secondaryColor }}>
            <div className="grid grid-cols-[1fr_28mm_28mm] gap-2 items-center">
              <EditableField fieldKey={`invest-meta-${i}-nome`} className="text-sm font-medium" placeholder="Meta" />
              <EditableField fieldKey={`invest-meta-${i}-valor`} className="text-xs text-center" placeholder="R$ ___" />
              <EditableField fieldKey={`invest-meta-${i}-prazo`} className="text-xs text-center" placeholder="prazo" />
            </div>
            <div className="mt-1.5 h-2 rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full" style={{ width: "0%", backgroundColor: primaryColor }} />
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

export function InvestDiarioPage({ logo, pageIndex, totalPaginas, numLinhas = 18, ...rest }) {
  const { primaryColor, secondaryColor, tema } = useVisual(rest.colorTheme, rest.customColors, rest.fontFamily);
  const cols = [["Data", "0.7fr"], ["Ativo", "1fr"], ["C/V", "0.5fr"], ["Qtd.", "0.6fr"], ["Preço", "0.8fr"], ["Motivo da operação", "1.4fr"]];
  return (
    <PageShell {...rest}>
      <PageHeader logo={logo} title="Diário de Operações" subtitle={`Página ${pageIndex + 1} de ${totalPaginas}`} primaryColor={primaryColor} tema={tema} />
      <TableHeader cols={cols} secondaryColor={secondaryColor} />
      {Array.from({ length: numLinhas }).map((_, i) => (
        <div key={i} className="grid gap-2 py-1.5 border-b border-dotted border-gray-200 last:border-0" style={{ gridTemplateColumns: cols.map((c) => c[1]).join(" ") }}>
          {["data", "ativo", "cv", "qtd", "preco", "motivo"].map((k) => (
            <EditableField key={k} fieldKey={`invest-diario-${pageIndex}-${i}-${k}`} className="text-xs" placeholder={k === "data" ? "__/__" : undefined} />
          ))}
        </div>
      ))}
    </PageShell>
  );
}
