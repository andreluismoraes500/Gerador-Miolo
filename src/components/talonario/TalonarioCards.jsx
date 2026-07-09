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
      className="absolute inset-0 pointer-events-none z-1 bg-repeat"
      style={style}
    />
  );
}

// ============================== PEDIDO ==============================

function Campo({ label, flex = 1 }) {
  return (
    <div
      className="py-1.5 px-2.5 pt-1"
      style={{
        flex,
        borderRight: "1.3px solid var(--tal-accent)",
        minHeight: 34,
      }}
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

export function PedidoCard({
  empresa,
  slogan,
  logo,
  campos,
  linhas,
  rodape,
  numero,
  digits,
  prefix,
  watermarkStyle,
}) {
  const numStr = `${prefix || ""}${pad(numero, digits)}`;
  const rows = [];

  if (campos.nome) {
    rows.push(
      <div
        key="nome"
        className="flex border-t-[1.3px]"
        style={{ borderColor: "var(--tal-accent)" }}
      >
        <Campo label="Nome / Razão Social" flex={1} />
      </div>,
    );
  }
  const r2 = [];
  if (campos.endereco) r2.push(<Campo key="end" label="Endereço" flex={2.4} />);
  if (campos.tel) r2.push(<Campo key="tel" label="Telefone" flex={1} />);
  if (r2.length)
    rows.push(
      <div
        key="r2"
        className="flex border-t-[1.3px]"
        style={{ borderColor: "var(--tal-accent)" }}
      >
        {r2}
      </div>,
    );

  if (campos.municipio) {
    rows.push(
      <div
        key="r3"
        className="flex border-t-[1.3px]"
        style={{ borderColor: "var(--tal-accent)" }}
      >
        <Campo label="Município" flex={1.6} />
        <Campo label="UF" flex={0.6} />
        <Campo label="CEP" flex={1} />
      </div>,
    );
  }
  const r4 = [];
  if (campos.cnpj) r4.push(<Campo key="cnpj" label="CNPJ / CPF" flex={1.6} />);
  if (campos.insc)
    r4.push(<Campo key="insc" label="Insc. Estadual" flex={1} />);
  if (r4.length)
    rows.push(
      <div
        key="r4"
        className="flex border-t-[1.3px]"
        style={{ borderColor: "var(--tal-accent)" }}
      >
        {r4}
      </div>,
    );
  if (campos.email) {
    rows.push(
      <div
        key="email"
        className="flex border-t-[1.3px]"
        style={{ borderColor: "var(--tal-accent)" }}
      >
        <Campo label="E-mail" flex={1} />
      </div>,
    );
  }

  return (
    <div
      className="doc-card relative w-full max-w-160 rounded-2xl overflow-hidden bg-(--tal-paper) shadow-[0_14px_34px_-12px_rgba(0,0,0,0.19),0_2px_6px_rgba(0,0,0,0.07)]"
      style={{
        border: "2.5px solid var(--tal-accent)",
        outline: "2px solid var(--tal-accent)",
        outlineOffset: 5,
        margin: 5,
      }}
    >
      <WatermarkLayer style={watermarkStyle} />
      <div className="relative z-2 px-7 pt-6 pb-5">
        <div
          className="flex items-start justify-between gap-3.5 pb-3 mb-2.5"
          style={{ borderBottom: "2px solid var(--tal-accent)" }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {logo && (
              <img
                src={logo}
                alt="Logo"
                className="max-w-16 max-h-16 object-contain rounded-md shrink-0"
              />
            )}
            <div className="min-w-0">
              <h2
                className="text-[19px] leading-tight m-0 truncate"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 700,
                  color: "var(--tal-accent-dark)",
                }}
              >
                {empresa || "Sua Empresa"}
              </h2>
              {slogan && (
                <p className="m-0 mt-0.5 text-[11.5px] text-(--tal-ink-soft)">
                  {slogan}
                </p>
              )}
            </div>
          </div>
          <div className="text-right shrink-0">
            <div
              className="text-[11px] uppercase tracking-[1.5px]"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                color: "var(--tal-ink-soft)",
              }}
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
            <div className="text-[11.5px] text-(--tal-ink-soft) mt-1.5">
              Data ____ / ____ / ______
            </div>
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
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    background: "var(--tal-accent)",
                  }}
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
                    className="h-5.75 px-1.5"
                    style={{
                      border: "1px solid var(--tal-accent)",
                      width:
                        c === 0
                          ? "11%"
                          : c === 2 || c === 3
                            ? "16%"
                            : undefined,
                      textAlign: c === 0 ? "center" : undefined,
                    }}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <div
          className="flex justify-between items-center"
          style={{ border: "1.3px solid var(--tal-accent)", borderTop: "none" }}
        >
          <div className="flex-1 py-2 px-2.5 text-[11px] text-(--tal-ink-soft)">
            {rodape ? (
              rodape
            ) : (
              <span className="italic text-[#c3cac8]">
                assinatura / carimbo
              </span>
            )}
          </div>
          <div
            className="w-32.5 py-2 px-2.5 font-bold text-[13px] text-right"
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

        <div
          className="text-center mt-3.5 pt-2.5 text-[10.5px] text-[#9aa5a3] tracking-wide"
          style={{ borderTop: "2px dashed #c7cdcb" }}
        >
          ✂ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
          - - - - - -
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
      className="doc-card relative w-full max-w-160 min-h-205 rounded-2xl overflow-hidden bg-(--tal-paper) flex flex-col shadow-[0_14px_34px_-12px_rgba(0,0,0,0.19),0_2px_6px_rgba(0,0,0,0.07)]"
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
          className="absolute top-5 right-6 font-bold rounded-lg px-2.5 py-0.5 text-sm z-3"
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
      <div className="relative z-2 px-7 pt-6 pb-5 flex flex-col flex-1">
        <div
          className="flex justify-between items-start pb-3.5 mb-4"
          style={{ borderBottom: "2px solid var(--tal-accent)" }}
        >
          <div className="flex items-center gap-2.5">
            {logo && (
              <img
                src={logo}
                alt="Logo"
                className="max-w-14.5 max-h-14.5 object-contain rounded-md"
              />
            )}
            <div>
              <h2
                className="text-[19px] m-0 mb-0.5"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 700,
                  color: "var(--tal-accent-dark)",
                }}
              >
                {clinica || "Nome da Clínica / Consultório"}
              </h2>
              <p className="m-0 text-[11px] text-(--tal-ink-soft)">
                {profissional || "Nome do Profissional"}
                {registro ? ` · ${registro}` : ""}
                {especialidade ? ` · ${especialidade}` : ""}
              </p>
              <p className="m-0 text-[11px] text-(--tal-ink-soft)">
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
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              color: "var(--tal-accent)",
            }}
          ></div>
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
            <div
              key={i}
              className="h-8"
              style={{ borderBottom: "1.3px solid #c9d2d0" }}
            />
          ))}
        </div>

        <div className="mt-auto pt-5 text-center">
          <div
            className="w-65 mx-auto mb-1.5 pt-1.5 text-[11.5px] text-(--tal-ink-soft)"
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
//
// Talão de pauta: nada de cartão ilustrado com foto e listas — só o
// cabeçalho com os dados do prato e linhas em branco para escrever à mão,
// com pequenas marcações (quadradinho para cada ingrediente, número para
// cada passo do preparo) para orientar o preenchimento.

function SectionMark({ children }) {
  return (
    <div className="flex items-center gap-2 mt-1 mb-1.5">
      <span
        className="w-1.5 h-3.5 rounded-sm inline-block"
        style={{ background: "var(--tal-accent)" }}
      />
      <span
        className="text-[11px] font-bold uppercase tracking-wide"
        style={{
          color: "var(--tal-accent-dark)",
          fontFamily: "'Cormorant Garamond', serif",
        }}
      >
        {children}
      </span>
    </div>
  );
}

export function ReceitaCard({
  titulo,
  categoria,
  porcoes,
  tempoPreparo,
  tempoCoccao,
  dificuldade,
  autor,
  logo,
  linhasIngredientes,
  linhasPreparo,
  watermarkStyle,
}) {
  const meta = [];
  if (porcoes) meta.push({ v: porcoes, l: "porções" });
  if (tempoPreparo) meta.push({ v: tempoPreparo, l: "preparo" });
  if (tempoCoccao) meta.push({ v: tempoCoccao, l: "cocção" });
  meta.push({ v: "", l: "" });

  return (
    <div
      className="doc-card relative w-full max-w-160 min-h-205 rounded-2xl overflow-hidden bg-(--tal-paper) flex flex-col shadow-[0_14px_34px_-12px_rgba(0,0,0,0.19),0_2px_6px_rgba(0,0,0,0.07)]"
      style={{
        border: "2.5px solid var(--tal-accent)",
        outline: "2px solid var(--tal-accent)",
        outlineOffset: 5,
        margin: 5,
      }}
    >
      <WatermarkLayer style={watermarkStyle} />

      <div className="relative z-2 px-7 pt-6 pb-5 flex flex-col flex-1">
        {/* cabeçalho */}
        <div
          className="flex justify-between items-start gap-3.5 pb-3.5 mb-4"
          style={{ borderBottom: "2px solid var(--tal-accent)" }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {logo && (
              <img
                src={logo}
                alt="Logo"
                className="max-w-13 max-h-13 object-contain rounded-md shrink-0"
              />
            )}
            <div className="min-w-0">
              <div
                className="text-[10.5px] uppercase tracking-[1.5px] font-bold"
                style={{ color: "var(--tal-accent-dark)" }}
              >
                {categoria || "Receita"}
              </div>
              <h2
                className="text-[22px] leading-tight m-0 truncate"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 700,
                  color: "var(--tal-ink)",
                }}
              >
                {titulo || ""}
              </h2>
            </div>
          </div>
          <div className="flex gap-3.5 shrink-0 text-right">
            {meta.map((m, i) => (
              <div key={i} className="text-[10px] text-(--tal-ink-soft)">
                <b
                  className="block text-[14px]"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    color: "var(--tal-accent-dark)",
                  }}
                >
                  {m.v}
                </b>
                {m.l}
              </div>
            ))}
          </div>
        </div>

        {/* pauta — ingredientes (marcação: quadradinho de checagem) */}
        <SectionMark>Ingredientes</SectionMark>
        <div className="mb-3.5">
          {Array.from({ length: linhasIngredientes }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5"
              style={{ height: 26, borderBottom: "1.2px solid #d7ddda" }}
            >
              <span
                className="shrink-0"
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: 2,
                  border: "1.3px solid var(--tal-accent)",
                }}
              />
            </div>
          ))}
        </div>

        {/* pauta — modo de preparo (marcação: número do passo) */}
        <SectionMark>Modo de preparo</SectionMark>
        <div className="flex-1">
          {Array.from({ length: linhasPreparo }).map((_, i) => (
            <div
              key={i}
              className="flex items-start gap-2.5"
              style={{ height: 27, borderBottom: "1.2px solid #d7ddda" }}
            >
              <span
                className="shrink-0 text-right"
                style={{
                  width: 15,
                  fontSize: 10,
                  fontWeight: 700,
                  fontFamily: "'Space Mono', monospace",
                  color: "var(--tal-accent-dark)",
                  lineHeight: "26px",
                }}
              >
                {i + 1}
              </span>
            </div>
          ))}
        </div>

        {autor && (
          <div
            className="mt-auto pt-4 text-center text-[11px] italic"
            style={{ color: "var(--tal-ink-soft)" }}
          >
            {autor}
          </div>
        )}
      </div>
    </div>
  );
}
