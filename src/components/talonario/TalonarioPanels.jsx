// src/components/talonario/TalonarioPanels.jsx
//
// Formulários da barra lateral do Talonário, um por aba (Pedido,
// Receituário, Receita) mais o painel de marca d'água, compartilhado.

import { MdImage, MdClose, MdAdd } from "react-icons/md";

export function SectionTitle({ children }) {
  return (
    <div
      className="flex items-center gap-2 mt-6 mb-3 first:mt-0 text-[13px] font-bold uppercase tracking-wide"
      style={{ color: "var(--tal-accent-dark)", fontFamily: "'Cormorant Garamond', serif" }}
    >
      <span className="w-1.5 h-4 rounded-sm inline-block" style={{ background: "var(--tal-accent)" }} />
      {children}
    </div>
  );
}

export function Label({ children, first }) {
  return (
    <label className={`block text-[12px] font-semibold text-[var(--tal-ink-soft)] ${first ? "mt-0" : "mt-3"} mb-1`}>
      {children}
    </label>
  );
}

const inputCls =
  "w-full rounded-lg px-2.5 py-2 text-[13.5px] text-[var(--tal-ink)] bg-[#fbfbfa] border-[1.5px] border-[#dfe3e1] focus:outline-none focus:bg-white transition-colors focus:border-[var(--tal-accent)]";

export function TextInput(props) {
  return <input type="text" {...props} className={inputCls} />;
}
export function NumberInput(props) {
  return <input type="number" {...props} className={inputCls} />;
}
export function TextArea(props) {
  return <textarea {...props} className={`${inputCls} min-h-[56px] resize-y`} />;
}
export function Select({ children, ...props }) {
  return (
    <select {...props} className={inputCls}>
      {children}
    </select>
  );
}

export function UploadBox({ label, hint, thumb, onFile, inputId }) {
  return (
    <div
      className="flex items-center gap-2.5 rounded-lg p-2.5 mt-1 cursor-pointer bg-[#fafbfa] border-[1.5px] border-dashed border-[#cfd6d4] hover:border-[var(--tal-accent)] hover:bg-[var(--tal-accent-light)] transition-colors"
      onClick={() => document.getElementById(inputId)?.click()}
    >
      <div className="w-11 h-11 rounded-lg bg-white border border-[#e2e6e4] flex items-center justify-center overflow-hidden shrink-0">
        {thumb ? <img src={thumb} alt="" className="w-full h-full object-contain" /> : <MdImage className="text-[var(--tal-ink-soft)]" />}
      </div>
      <div className="text-[12.5px] text-[var(--tal-ink-soft)]">
        <b className="block text-[13px] text-[var(--tal-ink)]">{label}</b>
        {hint}
      </div>
      <input
        id={inputId}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onFile(e.target.files?.[0])}
      />
    </div>
  );
}

export function CheckRow({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 py-1.5 text-[13px] text-[var(--tal-ink)]">
      <input type="checkbox" checked={checked} onChange={onChange} className="w-4 h-4 accent-[var(--tal-accent)]" />
      {label}
    </label>
  );
}

export function CountBadge({ children }) {
  return (
    <div
      className="inline-flex items-center gap-1.5 font-bold text-[12.5px] rounded-full px-2.5 py-1 mt-1.5"
      style={{ background: "var(--tal-accent-light)", color: "var(--tal-accent-dark)" }}
    >
      {children}
    </div>
  );
}

// ---------------- Pedido ----------------

export function PedidoPanel({ pedido, setField, toggleCampo, range }) {
  return (
    <div>
      <SectionTitle>Identidade</SectionTitle>
      <Label first>Nome da empresa / loja</Label>
      <TextInput
        placeholder="Ex: Papelaria Estrela"
        value={pedido.empresa}
        onChange={(e) => setField("empresa", e.target.value)}
      />
      <Label>Slogan (opcional)</Label>
      <TextInput
        placeholder="Ex: Tudo para seu negócio"
        value={pedido.slogan}
        onChange={(e) => setField("slogan", e.target.value)}
      />

      <SectionTitle>Numeração automática</SectionTitle>
      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <Label first>Do número</Label>
          <NumberInput min={1} value={pedido.numStart} onChange={(e) => setField("numStart", e.target.value)} />
        </div>
        <div>
          <Label first>Até o número</Label>
          <NumberInput min={1} value={pedido.numEnd} onChange={(e) => setField("numEnd", e.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <Label>Prefixo (opcional)</Label>
          <TextInput placeholder="Ex: PV-" value={pedido.prefix} onChange={(e) => setField("prefix", e.target.value)} />
        </div>
        <div>
          <Label>Zeros à esquerda</Label>
          <Select value={pedido.digits} onChange={(e) => setField("digits", Number(e.target.value))}>
            <option value={0}>Sem zeros (1, 2, 3…)</option>
            <option value={3}>3 dígitos (001)</option>
            <option value={4}>4 dígitos (0001)</option>
            <option value={5}>5 dígitos (00001)</option>
          </Select>
        </div>
      </div>
      <CountBadge>
        {range.total} página{range.total > 1 ? "s" : ""} será{range.total > 1 ? "ão" : ""} gerada
        {range.total > 1 ? "s" : ""}
      </CountBadge>

      <SectionTitle>Campos do cabeçalho</SectionTitle>
      <div className="grid grid-cols-2 gap-x-2.5">
        <CheckRow label="Nome / Razão Social" checked={pedido.campos.nome} onChange={() => toggleCampo("nome")} />
        <CheckRow label="Endereço" checked={pedido.campos.endereco} onChange={() => toggleCampo("endereco")} />
        <CheckRow label="Telefone" checked={pedido.campos.tel} onChange={() => toggleCampo("tel")} />
        <CheckRow label="Município / UF / CEP" checked={pedido.campos.municipio} onChange={() => toggleCampo("municipio")} />
        <CheckRow label="CNPJ / CPF" checked={pedido.campos.cnpj} onChange={() => toggleCampo("cnpj")} />
        <CheckRow label="Insc. Estadual" checked={pedido.campos.insc} onChange={() => toggleCampo("insc")} />
        <CheckRow label="E-mail" checked={pedido.campos.email} onChange={() => toggleCampo("email")} />
      </div>

      <SectionTitle>Tabela de itens</SectionTitle>
      <Label first>Linhas em branco na tabela</Label>
      <NumberInput
        min={4}
        max={30}
        value={pedido.linhas}
        onChange={(e) => setField("linhas", Number(e.target.value) || 12)}
      />
      <Label>Texto de rodapé (opcional)</Label>
      <TextInput
        placeholder="Ex: Válido por 7 dias"
        value={pedido.rodape}
        onChange={(e) => setField("rodape", e.target.value)}
      />
    </div>
  );
}

// ---------------- Receituário ----------------

export function ReceituarioPanel({ receituario, setField, range }) {
  return (
    <div>
      <SectionTitle>Identidade da clínica</SectionTitle>
      <Label first>Nome da clínica / consultório</Label>
      <TextInput
        placeholder="Ex: Clínica Vida Plena"
        value={receituario.clinica}
        onChange={(e) => setField("clinica", e.target.value)}
      />
      <Label>Profissional responsável</Label>
      <TextInput
        placeholder="Ex: Dr. João Pereira"
        value={receituario.profissional}
        onChange={(e) => setField("profissional", e.target.value)}
      />
      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <Label first>Registro (CRM/CRO...)</Label>
          <TextInput placeholder="CRM 12345" value={receituario.registro} onChange={(e) => setField("registro", e.target.value)} />
        </div>
        <div>
          <Label first>Especialidade</Label>
          <TextInput placeholder="Clínico geral" value={receituario.especialidade} onChange={(e) => setField("especialidade", e.target.value)} />
        </div>
      </div>
      <Label>Endereço</Label>
      <TextInput
        placeholder="Rua, número, bairro, cidade"
        value={receituario.endereco}
        onChange={(e) => setField("endereco", e.target.value)}
      />
      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <Label first>Telefone</Label>
          <TextInput value={receituario.telefone} onChange={(e) => setField("telefone", e.target.value)} />
        </div>
        <div>
          <Label first>E-mail</Label>
          <TextInput value={receituario.email} onChange={(e) => setField("email", e.target.value)} />
        </div>
      </div>

      <SectionTitle>Conteúdo da via</SectionTitle>
      <Label first>Linhas para prescrição</Label>
      <NumberInput
        min={4}
        max={20}
        value={receituario.linhas}
        onChange={(e) => setField("linhas", Number(e.target.value) || 9)}
      />

      <SectionTitle>Numeração (talonário controlado)</SectionTitle>
      <CheckRow
        label="Numerar as vias"
        checked={receituario.numerar}
        onChange={(e) => setField("numerar", e.target.checked)}
      />
      {receituario.numerar && (
        <div className="mt-1">
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <Label first>Do número</Label>
              <NumberInput min={1} value={receituario.numStart} onChange={(e) => setField("numStart", e.target.value)} />
            </div>
            <div>
              <Label first>Até o número</Label>
              <NumberInput min={1} value={receituario.numEnd} onChange={(e) => setField("numEnd", e.target.value)} />
            </div>
          </div>
          <CountBadge>
            {range.total} via{range.total > 1 ? "s" : ""} será{range.total > 1 ? "ão" : ""} gerada
            {range.total > 1 ? "s" : ""}
          </CountBadge>
        </div>
      )}
    </div>
  );
}

// ---------------- Receita ----------------

export function ReceitaPanel({
  receita,
  setField,
  ingredientes,
  addIngrediente,
  updateIngrediente,
  removeIngrediente,
  passos,
  addPasso,
  updatePasso,
  removePasso,
}) {
  return (
    <div>
      <SectionTitle>Sobre o prato</SectionTitle>
      <Label first>Nome da receita</Label>
      <TextInput
        placeholder="Ex: Bolo de Cenoura com Cobertura"
        value={receita.titulo}
        onChange={(e) => setField("titulo", e.target.value)}
      />
      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <Label first>Categoria</Label>
          <TextInput placeholder="Sobremesa" value={receita.categoria} onChange={(e) => setField("categoria", e.target.value)} />
        </div>
        <div>
          <Label first>Dificuldade</Label>
          <Select value={receita.dificuldade} onChange={(e) => setField("dificuldade", e.target.value)}>
            <option>Fácil</option>
            <option>Média</option>
            <option>Difícil</option>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2.5">
        <div>
          <Label first>Porções</Label>
          <TextInput placeholder="8" value={receita.porcoes} onChange={(e) => setField("porcoes", e.target.value)} />
        </div>
        <div>
          <Label first>Preparo</Label>
          <TextInput placeholder="20 min" value={receita.tempoPreparo} onChange={(e) => setField("tempoPreparo", e.target.value)} />
        </div>
        <div>
          <Label first>Cocção</Label>
          <TextInput placeholder="40 min" value={receita.tempoCoccao} onChange={(e) => setField("tempoCoccao", e.target.value)} />
        </div>
      </div>

      <Label>Assinatura / marca do autor</Label>
      <TextInput
        placeholder="Ex: Receitas da Vovó Alice"
        value={receita.autor}
        onChange={(e) => setField("autor", e.target.value)}
      />

      <SectionTitle>Ingredientes</SectionTitle>
      {ingredientes.map((ing) => (
        <div key={ing.id} className="relative rounded-lg p-2.5 mb-2 bg-[#fafbfa] border border-[#e6e9e7]">
          <button
            onClick={() => removeIngrediente(ing.id)}
            className="absolute top-1.5 right-2 text-[#b8bfbd] hover:text-[var(--tal-stamp)] text-base"
            aria-label="Remover ingrediente"
          >
            <MdClose />
          </button>
          <div className="grid grid-cols-3 gap-2.5">
            <TextInput placeholder="Qtd" value={ing.qtd} onChange={(e) => updateIngrediente(ing.id, "qtd", e.target.value)} />
            <TextInput placeholder="Unidade" value={ing.unidade} onChange={(e) => updateIngrediente(ing.id, "unidade", e.target.value)} />
            <TextInput placeholder="Ingrediente" value={ing.nome} onChange={(e) => updateIngrediente(ing.id, "nome", e.target.value)} />
          </div>
        </div>
      ))}
      <button
        onClick={addIngrediente}
        className="w-full flex items-center justify-center gap-1.5 font-bold text-[13px] rounded-lg py-2 border-[1.5px] border-dashed"
        style={{ borderColor: "var(--tal-accent)", background: "var(--tal-accent-light)", color: "var(--tal-accent-dark)" }}
      >
        <MdAdd /> adicionar ingrediente
      </button>

      <SectionTitle>Modo de preparo</SectionTitle>
      {passos.map((p, i) => (
        <div key={p.id} className="relative rounded-lg p-2.5 mb-2 bg-[#fafbfa] border border-[#e6e9e7]">
          <button
            onClick={() => removePasso(p.id)}
            className="absolute top-1.5 right-2 text-[#b8bfbd] hover:text-[var(--tal-stamp)] text-base"
            aria-label="Remover passo"
          >
            <MdClose />
          </button>
          <Label first>Passo {i + 1}</Label>
          <TextArea placeholder="Descreva o passo..." value={p.texto} onChange={(e) => updatePasso(p.id, e.target.value)} />
        </div>
      ))}
      <button
        onClick={addPasso}
        className="w-full flex items-center justify-center gap-1.5 font-bold text-[13px] rounded-lg py-2 border-[1.5px] border-dashed"
        style={{ borderColor: "var(--tal-accent)", background: "var(--tal-accent-light)", color: "var(--tal-accent-dark)" }}
      >
        <MdAdd /> adicionar passo
      </button>

      <SectionTitle>Dica do chef (opcional)</SectionTitle>
      <TextArea
        placeholder="Ex: Sirva gelado para um sabor ainda melhor."
        value={receita.dica}
        onChange={(e) => setField("dica", e.target.value)}
      />
    </div>
  );
}

// ---------------- Marca d'água ----------------

export function WatermarkPanel({ watermark, setField, activeTab, hasLogo }) {
  return (
    <div>
      <SectionTitle>Marca d'água</SectionTitle>
      <CheckRow label="Ativar marca d'água" checked={watermark.on} onChange={(e) => setField("on", e.target.checked)} />
      {watermark.on && (
        <div className="mt-1">
          <div className="flex bg-[#f0f2f1] rounded-lg p-1 gap-1 mb-2">
            <button
              onClick={() => setField("type", "text")}
              className="flex-1 rounded-md py-1.5 text-[12.5px] font-semibold"
              style={
                watermark.type === "text"
                  ? { background: "#fff", color: "var(--tal-accent-dark)", boxShadow: "0 1px 4px #0002" }
                  : { color: "var(--tal-ink-soft)" }
              }
            >
              Texto
            </button>
            <button
              onClick={() => setField("type", "logo")}
              disabled={!hasLogo}
              className="flex-1 rounded-md py-1.5 text-[12.5px] font-semibold disabled:opacity-40"
              style={
                watermark.type === "logo"
                  ? { background: "#fff", color: "var(--tal-accent-dark)", boxShadow: "0 1px 4px #0002" }
                  : { color: "var(--tal-ink-soft)" }
              }
            >
              Usar logo
            </button>
          </div>
          {watermark.type === "text" && (
            <TextInput placeholder="Ex: AMOSTRA" value={watermark.text} onChange={(e) => setField("text", e.target.value)} />
          )}
          <Label>Opacidade</Label>
          <div className="flex items-center gap-2.5">
            <input
              type="range"
              min={4}
              max={35}
              value={watermark.opacity}
              onChange={(e) => setField("opacity", Number(e.target.value))}
              className="flex-1 accent-[var(--tal-accent)]"
            />
            <span className="text-xs text-[var(--tal-ink-soft)] w-9 text-right">{watermark.opacity}%</span>
          </div>
          <Label>Tamanho</Label>
          <div className="flex items-center gap-2.5">
            <input
              type="range"
              min={120}
              max={420}
              value={watermark.size}
              onChange={(e) => setField("size", Number(e.target.value))}
              className="flex-1 accent-[var(--tal-accent)]"
            />
            <span className="text-xs text-[var(--tal-ink-soft)] w-9 text-right">{watermark.size}</span>
          </div>
        </div>
      )}
    </div>
  );
}
