// src/components/layouts/caligrafia/AlfabetoCursivo.jsx
//
// Alfabeto cursivo (A–Z): 2 páginas por letra — maiúscula e minúscula —,
// cada uma com:
//   1. Cubra os tracejados   (2 linhas, letra em "tubo" pontilhado)
//   2. Cubra os tracejados   (2 linhas, tracejado fino — um degrau mais difícil)
//   3. Copie a letra         (3 linhas, modelo sólido no início)
// Também: palavra/nome personalizado e frases no mesmo traçado pontilhado.

import { useAgendaData } from "../../../context/AgendaDataContext";
import EditableField from "../../EditableField";
import {
  PageShell,
  useVisual,
  Pauta,
  Cabecalho,
  Secao,
  distribuir,
  larguraTexto,
  ADV,
  LARGURA,
  FONTE_CURSIVA,
} from "./base";

const ALFABETO = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const FS = 12; // mm — tamanho do corpo da letra na pauta
const ALTURA_LINHA = 23.5; // mm

// Lista de páginas: A, a, B, b, ...
export const PAGINAS_ALFABETO_CURSIVO = [...ALFABETO].flatMap((letra) => [
  { letra, maiuscula: true },
  { letra: letra.toLowerCase(), maiuscula: false },
]);

function qtdPorLinha(letra, maiuscula) {
  const larguraGlifo = (ADV[letra] ?? 0.8) * FS + 6.5;
  const max = maiuscula ? 7 : 8;
  return Math.max(3, Math.min(max, Math.floor(LARGURA / larguraGlifo)));
}

export function CaligrafiaAlfabetoCursivoPage({ item, ...rest }) {
  const { primaryColor } = useVisual(rest.colorTheme, rest.customColors, rest.fontFamily);
  const { letra, maiuscula } = item;
  const n = qtdPorLinha(letra, maiuscula);
  const nome = `Letra ${letra} ${maiuscula ? "Maiúscula" : "Minúscula"}`;
  const tipo = maiuscula ? "maiúscula" : "minúscula";

  const linhaTraco = (modo) => (
    <Pauta
      h={ALTURA_LINHA}
      fs={FS}
      itens={distribuir(Array(n).fill(letra), modo)}
    />
  );
  // linha de cópia: modelo sólido à esquerda, resto em branco
  const linhaCopia = (
    <Pauta
      h={ALTURA_LINHA}
      fs={FS}
      itens={[{ t: letra, x: ((ADV[letra] ?? 0.8) * FS) / 2 + 2, modo: "solido" }]}
    />
  );

  return (
    <PageShell {...rest}>
      <Cabecalho
        titulo="Alfabeto Cursivo"
        faixa={nome}
        logo={rest.logo}
        primaryColor={primaryColor}
      />

      <Secao n={1}>Cubra os tracejados.</Secao>
      <div className="flex flex-col gap-1 shrink-0">
        {linhaTraco("pontos")}
        {linhaTraco("pontos")}
      </div>

      <Secao n={2}>Cubra os tracejados.</Secao>
      <div className="flex flex-col gap-1 shrink-0">
        {linhaTraco("tracejado")}
        {linhaTraco("tracejado")}
      </div>

      <Secao n={3}>Copie a letra {letra} {tipo}.</Secao>
      <div className="flex flex-col gap-1 shrink-0">
        {linhaCopia}
        {linhaCopia}
        {linhaCopia}
      </div>
    </PageShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// PALAVRA / NOME PERSONALIZADO
// ─────────────────────────────────────────────────────────────────────────

// Escolhe tamanho de fonte e repetições para a palavra caber na linha.
function encaixar(texto, fsMax = 10, margem = 8) {
  if (!texto) return { fs: fsMax, reps: 1 };
  const unit = larguraTexto(texto, 1); // largura em mm para fs=1
  const fs = Math.min(fsMax, (LARGURA - 4) / unit);
  const reps = Math.max(1, Math.min(4, Math.floor(LARGURA / (unit * fs + margem))));
  return { fs, reps };
}

export function CaligrafiaPalavraCursivaPage({ numLinhas = 8, ...rest }) {
  const { primaryColor } = useVisual(rest.colorTheme, rest.customColors, rest.fontFamily);
  const { getField } = useAgendaData();
  const palavra = (getField("caligrafia-palavra-modelo") || "").trim();
  const { fs, reps } = encaixar(palavra);
  const h = Math.max(ALTURA_LINHA, fs * 1.85 + 2);

  const linha = (modo) =>
    palavra ? (
      <Pauta h={h} fs={fs} itens={distribuir(Array(reps).fill(palavra), modo)} />
    ) : (
      <Pauta h={h} fs={fs} itens={[]} />
    );

  return (
    <PageShell {...rest}>
      <Cabecalho
        titulo="Meu Nome em Cursiva"
        faixa="Palavra personalizada"
        logo={rest.logo}
        primaryColor={primaryColor}
      />
      <EditavelPalavra />
      <div className="flex flex-col gap-1.5 min-h-0 flex-1 overflow-hidden">
        {linha("solido")}
        {linha("pontos")}
        {linha("pontos")}
        {linha("tracejado")}
        {Array.from({ length: Math.max(0, numLinhas - 4) }).map((_, i) => (
          <Pauta key={i} h={h} fs={fs} itens={[]} />
        ))}
      </div>
    </PageShell>
  );
}


function EditavelPalavra() {
  return (
    <div className="mb-2 shrink-0">
      <span className="text-[9px] uppercase tracking-widest text-gray-400">
        Escreva aqui o nome ou a palavra-modelo (ex.: nome da criança)
      </span>
      <EditableField
        fieldKey="caligrafia-palavra-modelo"
        className="w-full min-h-8 border-b-2 text-lg py-0.5"
        style={{ borderColor: "#3b82f6", fontFamily: FONTE_CURSIVA }}
        placeholder=""
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// FRASES EM CURSIVA — modelo pontilhado + linha livre logo abaixo
// ─────────────────────────────────────────────────────────────────────────

export function CaligrafiaFrasesCursivaPage({
  frases,
  pageIndex = 0,
  totalPaginas = 1,
  ...rest
}) {
  const { primaryColor } = useVisual(rest.colorTheme, rest.customColors, rest.fontFamily);

  return (
    <PageShell {...rest}>
      <Cabecalho
        titulo="Frases para Copiar"
        faixa={totalPaginas > 1 ? `Cursiva · ${pageIndex + 1}/${totalPaginas}` : "Cursiva"}
        logo={rest.logo}
        primaryColor={primaryColor}
      />
      <div className="flex flex-col gap-3 pt-1">
        {frases.map((frase, i) => {
          const fs = Math.min(8.5, (LARGURA - 4) / larguraTexto(frase, 1));
          const h = fs * 1.85 + 3;
          return (
            <div key={i} className="flex flex-col gap-1">
              <Pauta h={h} fs={fs} itens={[{ t: frase, x: LARGURA / 2, modo: "pontos" }]} />
              <Pauta h={h} fs={fs} itens={[]} />
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}
