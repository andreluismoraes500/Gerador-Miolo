// src/components/talonario/TalonarioCards.jsx
//
// Renderização "de papel" dos três documentos do Talonário. São componentes
// puros — recebem os dados já prontos e não sabem nada sobre o hook de
// estado, então servem tanto para a pré-visualização quanto para o lote
// de impressão.

function pad(n, digits) {
  let s = String(n);
  while (s.length < digits) s = "0" + s;
  return s;
}

function WatermarkLayer({ style }) {
  if (!style) return null;
  return (
    <div
      className="absolute inset-0 pointer-events-none z-[1] bg-repeat"
      style={style}
    />
  );
}

// ============================== PEDIDO ==============================

function Campo({ label, flex = 1 }) {
  return (
    <div
      className="py-1.5 px-2.5 pt-1"
      style={{ flex, borderRight: "1.3px solid var(--tal-accent)", minHeight: 34 }}
    >
      <span
        className="block text-[9.5px] font-bold uppercase tracking-wide"
        style={{ color: "var(--tal-accent-dark)" }}
      >
        {label}
      </span>
    </div>
  );
}

export function PedidoCard({ empresa, slogan, logo, campos, linhas, rodape, numero, digits, prefix, watermarkStyle }) {
  const numStr = `${prefix || ""}${pad(numero, digits)}`;
  const rows = [];

  if (campos.nome) {
    rows.push(
      <div key="nome" className="flex border-t-[1.3px]" style={{ borderColor: "var(--tal-accent)" }}>
        <Campo label="Nome / Razão Social" flex={1} />
      </div>,
    );
  }
  const r2 = [];
  if (campos.endereco) r2.push(<Campo key="end" label="Endereço" flex={2.4} />);
  if (campos.tel) r2.push(<Campo key="tel" label="Telefone" flex={1} />);
  if (r2.length)
    rows.push(
      <div key="r2" className="flex border-t-[1.3px]" style={{ borderColor: "var(--tal-accent)" }}>
        {r2}
      </div>,
    );

  if (campos.municipio) {
    rows.push(
      <div key="r3" className="flex border-t-[1.3px]" style={{ borderColor: "var(--tal-accent)" }}>
        <Campo label="Município" flex={1.6} />
        <Campo label="UF" flex={0.6} />
        <Campo label="CEP" flex={1} />
      </div>,
    );
  }
  const r4 = [];
  if (campos.cnpj) r4.push(<Campo key="cnpj" label="CNPJ / CPF" flex={1.6} />);
  if (campos.insc) r4.push(<Campo key="insc" label="Insc. Estadual" flex={1} />);
  if (r4.length)
    rows.push(
      <div key="r4" className="flex border-t-[1.3px]" style={{ borderColor: "var(--tal-accent)" }}>
        {r4}
      </div>,
    );
  if (campos.email) {
    rows.push(
      <div key="email" className="flex border-t-[1.3px]" style={{ borderColor: "var(--tal-accent)" }}>
        <Campo label="E-mail" flex={1} />
      </div>,
    );
  }

  return (
    <div
      className="doc-card relative w-full max-w-[640px] rounded-2xl overflow-hidden bg-[var(--tal-paper)] shadow-[0_14px_34px_-12px_rgba(0,0,0,0.19),0_2px_6px_rgba(0,0,0,0.07)]"
      style={{
        border: "2.5px solid var(--tal-accent)",
        outline: "2px solid var(--tal-accent)",
        outlineOffset: 5,
        margin: 5,
      }}
    >
      <WatermarkLayer style={watermarkStyle} />
      <div className="relative z-[2] px-7 pt-6 pb-5">
        <div
          className="flex items-start justify-between gap-3.5 pb-3 mb-2.5"
          style={{ borderBottom: "2px solid var(--tal-accent)" }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {logo && (
              <img src={logo} alt="Logo" className="max-w-16 max-h-16 object-contain rounded-md shrink-0" />
            )}
            <div className="min-w-0">
              <h2
                className="text-[19px] leading-tight m-0 truncate"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, color: "var(--tal-accent-dark)" }}
              >
                {empresa || "Sua Empresa"}
              </h2>
              {slogan && <p className="m-0 mt-0.5 text-[11.5px] text-[var(--tal-ink-soft)]">{slogan}</p>}
            </div>
          </div>
          <div className="text-right shrink-0">
            <div
              className="text-[11px] uppercase tracking-[1.5px]"
              style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--tal-ink-soft)" }}
            >
              Pedido de Venda
            </div>
            <div
              className="inline-block font-bold text-2xl rounded-lg px-3 py-1 mt-0.5"
              style={{
                fontFamily: "'Space Mono', monospace",
                color: "var(--tal-stamp)",
                border: "2px solid var(--tal-stamp)",
                transform: "rotate(-2deg)",
              }}
            >
              Nº {numStr}
            </div>
            <div className="text-[11.5px] text-[var(--tal-ink-soft)] mt-1.5">Data ____ / ____ / ______</div>
          </div>
        </div>

        {rows}

        <table className="w-full border-collapse mt-3.5 text-xs">
          <thead>
            <tr>
              {["Quant.", "Descrição", "Unitário", "Total"].map((h) => (
                <th
                  key={h}
                  className="text-white font-semibold text-[11px] uppercase tracking-wide py-1.5 px-1.5"
                  style={{ fontFamily: "'Cormorant Garamond', serif", background: "var(--tal-accent)" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: linhas }).map((_, i) => (
              <tr key={i}>
                {[0, 1, 2, 3].map((c) => (
                  <td
                    key={c}
                    className="h-[23px] px-1.5"
                    style={{
                      border: "1px solid var(--tal-accent)",
                      width: c === 0 ? "11%" : c === 2 || c === 3 ? "16%" : undefined,
                      textAlign: c === 0 ? "center" : undefined,
                    }}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between items-center" style={{ border: "1.3px solid var(--tal-accent)", borderTop: "none" }}>
          <div className="flex-1 py-2 px-2.5 text-[11px] text-[var(--tal-ink-soft)]">
            {rodape ? rodape : <span className="italic text-[#c3cac8]">assinatura / carimbo</span>}
          </div>
          <div
            className="w-[130px] py-2 px-2.5 font-bold text-[13px] text-right"
            style={{
              background: "var(--tal-accent-light)",
              borderLeft: "1.3px solid var(--tal-accent)",
              color: "var(--tal-accent-dark)",
              fontFamily: "'Cormorant Garamond', serif",
            }}
          >
            TOTAL
          </div>
        </div>

        <div className="text-center mt-3.5 pt-2.5 text-[10.5px] text-[#9aa5a3] tracking-wide" style={{ borderTop: "2px dashed #c7cdcb" }}>
          ✂ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        </div>
      </div>
    </div>
  );
}

// ============================ RECEITUÁRIO ============================

export function ReceituarioCard({
  clinica,
  profissional,
  registro,
  especialidade,
  endereco,
  telefone,
  email,
  logo,
  linhas,
  numero,
  watermarkStyle,
}) {
  return (
    <div
      className="doc-card relative w-full max-w-[640px] min-h-[820px] rounded-2xl overflow-hidden bg-[var(--tal-paper)] flex flex-col shadow-[0_14px_34px_-12px_rgba(0,0,0,0.19),0_2px_6px_rgba(0,0,0,0.07)]"
      style={{
        border: "2.5px solid var(--tal-accent)",
        outline: "2px solid var(--tal-accent)",
        outlineOffset: 5,
        margin: 5,
      }}
    >
      <WatermarkLayer style={watermarkStyle} />
      {numero != null && (
        <div
          className="absolute top-5 right-6 font-bold rounded-lg px-2.5 py-0.5 text-sm z-[3]"
          style={{
            fontFamily: "'Space Mono', monospace",
            color: "var(--tal-stamp)",
            border: "2px solid var(--tal-stamp)",
            transform: "rotate(-2deg)",
          }}
        >
          Nº {numero}
        </div>
      )}
      <div className="relative z-[2] px-7 pt-6 pb-5 flex flex-col flex-1">
        <div
          className="flex justify-between items-start pb-3.5 mb-4"
          style={{ borderBottom: "2px solid var(--tal-accent)" }}
        >
          <div className="flex items-center gap-2.5">
            {logo && <img src={logo} alt="Logo" className="max-w-[58px] max-h-[58px] object-contain rounded-md" />}
            <div>
              <h2
                className="text-[19px] m-0 mb-0.5"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, color: "var(--tal-accent-dark)" }}
              >
                {clinica || "Nome da Clínica / Consultório"}
              </h2>
              <p className="m-0 text-[11px] text-[var(--tal-ink-soft)]">
                {profissional || "Nome do Profissional"}
                {registro ? ` · ${registro}` : ""}
                {especialidade ? ` · ${especialidade}` : ""}
              </p>
              <p className="m-0 text-[11px] text-[var(--tal-ink-soft)]">
                {endereco && (
                  <>
                    {endereco}
                    <br />
                  </>
                )}
                {telefone ? `Tel: ${telefone}  ` : ""}
                {email || ""}
              </p>
            </div>
          </div>
          <div
            className="text-[44px] leading-none opacity-85 font-bold"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--tal-accent)" }}
          >
            ℞
          </div>
        </div>

        <div
          className="flex gap-4.5 mb-4 py-2 px-3 text-[11px] rounded-lg"
          style={{ border: "1.3px solid var(--tal-accent)" }}
        >
          {["Paciente", "Idade", "Data"].map((l) => (
            <div key={l} className="flex-1">
              <span
                className="block font-bold text-[9.5px] uppercase tracking-wide"
                style={{ color: "var(--tal-accent-dark)" }}
              >
                {l}
              </span>
              &nbsp;
            </div>
          ))}
        </div>

        <div className="flex-1">
          {Array.from({ length: linhas }).map((_, i) => (
            <div key={i} className="h-8" style={{ borderBottom: "1.3px solid #c9d2d0" }} />
          ))}
        </div>

        <div className="mt-auto pt-5 text-center">
          <div
            className="w-[260px] mx-auto mb-1.5 pt-1.5 text-[11.5px] text-[var(--tal-ink-soft)]"
            style={{ borderTop: "1.3px solid var(--tal-ink)" }}
          >
            {profissional || "Nome do Profissional"}
            {registro ? ` — ${registro}` : ""}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================== RECEITA ==============================

export function ReceitaCard({
  titulo,
  categoria,
  porcoes,
  tempoPreparo,
  tempoCoccao,
  dificuldade,
  autor,
  logo,
  foto,
  ingredientes,
  passos,
  dica,
  watermarkStyle,
}) {
  const meta = [];
  if (porcoes) meta.push({ v: porcoes, l: "porções" });
  if (tempoPreparo) meta.push({ v: tempoPreparo, l: "preparo" });
  if (tempoCoccao) meta.push({ v: tempoCoccao, l: "cocção" });
  meta.push({ v: dificuldade, l: "dificuldade" });

  const ingList = ingredientes.filter((i) => i.nome || i.qtd);
  const stepList = passos.filter((p) => p.texto);

  return (
    <div className="doc-card relative w-full max-w-[640px] rounded-[22px] overflow-hidden bg-[var(--tal-paper)] shadow-[0_14px_34px_-12px_rgba(0,0,0,0.21)]">
      <WatermarkLayer style={watermarkStyle} />
      <div className="relative z-[2] text-white px-7 pt-6 pb-5" style={{ background: "var(--tal-accent)" }}>
        {logo && (
          <img
            src={logo}
            alt="Logo"
            className="absolute top-5 right-6 max-w-14 max-h-14 object-contain bg-white rounded-lg p-1"
          />
        )}
        <div className="text-[11px] uppercase tracking-[1.5px] font-bold opacity-85">{categoria || "Receita"}</div>
        <h2
          className="text-[28px] leading-tight my-1.5"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}
        >
          {titulo || "Nome da Receita"}
        </h2>
        <div className="flex gap-4.5 flex-wrap">
          {meta.map((m, i) => (
            <div key={i} className="text-[11.5px] opacity-95">
              <b className="block text-[15px]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {m.v}
              </b>
              {m.l}
            </div>
          ))}
        </div>
      </div>

      {foto && <img src={foto} alt="Prato" className="relative z-[2] w-full h-[220px] object-cover block" />}

      <div className="relative z-[2] px-7 pt-6 pb-6 grid grid-cols-[1fr_1.5fr] gap-6">
        <div>
          <h3
            className="text-[14px] uppercase tracking-wide m-0 mb-3 pb-1.5"
            style={{ color: "var(--tal-accent-dark)", borderBottom: "2px solid var(--tal-accent-light)", fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}
          >
            Ingredientes
          </h3>
          {ingList.length ? (
            ingList.map((ing, i) => (
              <div key={i} className="flex gap-2 text-[13px] py-1.5 items-baseline" style={{ borderBottom: "1px dashed #e6e2d8" }}>
                <span
                  className="font-bold min-w-14"
                  style={{ color: "var(--tal-accent-dark)", fontFamily: "'Space Mono', monospace", fontSize: 12 }}
                >
                  {ing.qtd} {ing.unidade}
                </span>
                <span>{ing.nome}</span>
              </div>
            ))
          ) : (
            <div className="italic text-[#c3cac8]">Adicione os ingredientes ao lado</div>
          )}
        </div>
        <div>
          <h3
            className="text-[14px] uppercase tracking-wide m-0 mb-3 pb-1.5"
            style={{ color: "var(--tal-accent-dark)", borderBottom: "2px solid var(--tal-accent-light)", fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}
          >
            Modo de preparo
          </h3>
          {stepList.length ? (
            stepList.map((p, i) => (
              <div key={i} className="flex gap-2.5 text-[13.5px] py-2 leading-relaxed" style={{ borderBottom: "1px solid #f1ede2" }}>
                <div
                  className="font-bold text-white w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0"
                  style={{ background: "var(--tal-accent)", fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {i + 1}
                </div>
                <div>{p.texto}</div>
              </div>
            ))
          ) : (
            <div className="italic text-[#c3cac8]">Adicione o modo de preparo ao lado</div>
          )}
          {dica && (
            <div
              className="rounded-xl mt-4 py-3 px-4 text-[12.5px] leading-relaxed"
              style={{ background: "var(--tal-accent-light)", color: "var(--tal-ink)" }}
            >
              <b style={{ color: "var(--tal-accent-dark)" }}>Dica do chef:</b> {dica}
            </div>
          )}
        </div>
      </div>

      {autor && (
        <div className="relative z-[2] py-3 px-7 flex justify-between items-center text-[11px]" style={{ background: "#faf8f2", borderTop: "1px solid #eee6d4", color: "#9a9382" }}>
          <span>{autor}</span>
          <span>feito com Talonário</span>
        </div>
      )}
    </div>
  );
}
