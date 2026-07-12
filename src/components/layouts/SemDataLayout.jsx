// src/components/layouts/SemDataLayout.jsx
//
// Página diária "Sem Data" (agenda permanente) — mesma estrutura da
// DiarioLivre (tabela de horários + notas do dia), mas em vez de calcular
// dia da semana / número / mês a partir de um `data` fixo, os três campos
// do cabeçalho ficam editáveis (contentEditable), para a própria pessoa
// preencher a mão (ou digitar) toda vez que for usar a folha. Isso permite
// imprimir a mesma página várias vezes e reaproveitar em qualquer época —
// não fica "presa" a um ano/mês específico.

import { FaCalendarDays } from "react-icons/fa6";
import { gerarHorarios } from "../../utils/agendaUtils";
import Footer from "../Footer";
import { TEMAS } from "../../themes";
import Logo from "../Logo";
import Watermark from "../Watermark";
import Background from "../Background";
import EditableField from "../EditableField";

const HORARIOS = gerarHorarios();
const LINHAS_NOTAS = 5;

export default function SemDataLayout({
  footerName,
  colorTheme = "classico",
  logo,
  footerType = "default",
  customColors = {},
  fontFamily = "sans-serif",
  watermarkSrc,
  watermarkOpacity,
  backgroundSrc,
  backgroundOpacity,
  // instanceKey diferencia os campos editáveis quando a mesma folha é
  // impressa em lote (várias cópias em branco na mesma sessão)
  instanceKey = "unica",
}) {
  const tema = TEMAS[colorTheme] || TEMAS.classico;

  const bgColor      = customColors.background || "#ffffff";
  const primaryColor = customColors.primary    || tema.text   || "#000000";
  const secondary    = customColors.secondary  || tema.border || "#cbd5e1";

  const chave = `semdata-${instanceKey}`;

  return (
    <div
      className="printable-page font-sans text-gray-900 flex flex-col justify-between box-border select-none border-0 shadow-none rounded-none"
      style={{ backgroundColor: bgColor, fontFamily }}
    >
      {backgroundSrc && <Background src={backgroundSrc} opacity={backgroundOpacity} />}
      {watermarkSrc && <Watermark src={watermarkSrc} opacity={watermarkOpacity} />}

      <div className="flex flex-col flex-1 min-h-0">

        {/* ── Cabeçalho: dia da semana, mês/ano e nº do dia, todos editáveis ── */}
        <div
          className="border-b-2 pb-3 flex items-end justify-between mb-4 w-full shrink-0 print:mb-2"
          style={{ borderBottomColor: primaryColor }}
        >
          <div className="flex items-center gap-3.5">
            <Logo src={logo} />
            <div className="flex items-center gap-3.5">
              <FaCalendarDays className="w-5 h-5 mb-1" style={{ color: primaryColor }} />
              <div className="space-y-0.5">
                <EditableField
                  fieldKey={`${chave}-dia-semana`}
                  className="capitalize text-lg font-semibold min-w-[7rem]"
                  style={{ color: primaryColor }}
                  placeholder="Dia da semana"
                />
                <EditableField
                  fieldKey={`${chave}-mes-ano`}
                  className="text-[11px] uppercase tracking-wide text-gray-400 font-semibold min-w-[7rem]"
                  placeholder="Mês / Ano"
                />
              </div>
            </div>
          </div>

          {/* Data — escrita à mão ou digitada. Antes havia um campo de
              número gigante com placeholder "00": como a folha normalmente
              fica em branco (o uso típico é imprimir e preencher a mão),
              esse "00" saía impresso de verdade na página, parecendo um
              erro. Agora é uma linha de data com sublinhados de verdade
              (border-bottom, não texto), que fica limpa até ser preenchida. */}
          <div className="flex flex-col items-end gap-1.5">
            <span className="text-[9px] uppercase tracking-wider font-semibold text-gray-300">
              Data
            </span>
            <div className="flex items-baseline gap-1.5">
              <EditableField
                fieldKey={`${chave}-data-dia`}
                className="w-7 text-center text-lg font-serif font-light text-black leading-none pb-0.5"
                style={{ borderBottom: `1.5px solid ${secondary}` }}
                placeholder=""
              />
              <span className="text-gray-300 font-light text-sm select-none">/</span>
              <EditableField
                fieldKey={`${chave}-data-mes`}
                className="w-7 text-center text-lg font-serif font-light text-black leading-none pb-0.5"
                style={{ borderBottom: `1.5px solid ${secondary}` }}
                placeholder=""
              />
              <span className="text-gray-300 font-light text-sm select-none">/</span>
              <EditableField
                fieldKey={`${chave}-data-ano`}
                className="w-12 text-center text-lg font-serif font-light text-black leading-none pb-0.5"
                style={{ borderBottom: `1.5px solid ${secondary}` }}
                placeholder=""
              />
            </div>
          </div>
        </div>

        {/* ── Tabela de horários ────────────────────────────────── */}
        <div className="flex-1 overflow-hidden min-h-0">
          <table className="w-full table-fixed text-[11.5px] border-collapse">
            <thead>
              <tr
                className="border-b-2 text-gray-500 text-[8.5px] uppercase tracking-widest text-left font-bold"
                style={{ borderBottomColor: primaryColor }}
              >
                <th
                  className="w-[14%] pb-2 text-black border-r pr-1"
                  style={{ borderRightColor: secondary }}
                >
                  Hora
                </th>
                <th
                  className="w-[55%] pb-2 text-black border-r px-2"
                  style={{ borderRightColor: secondary }}
                >
                  Compromisso / Tarefa
                </th>
                <th className="w-[31%] pb-2 text-black px-2">
                  Observações
                </th>
              </tr>
            </thead>
            <tbody>
              {HORARIOS.map((hora) => (
                <tr
                  key={hora}
                  className="border-b-[1.5px] border-solid h-[1.94rem] print:h-[1.94rem]"
                  style={{ borderBottomColor: secondary }}
                >
                  <td
                    className="font-mono text-black font-bold text-[12px] align-middle border-r pr-1"
                    style={{ borderRightColor: secondary }}
                  >
                    {hora}
                  </td>
                  <td
                    className="border-r align-middle px-2"
                    style={{ borderRightColor: secondary }}
                  >
                    <EditableField
                      fieldKey={`${chave}-${hora}-compromisso`}
                      className="w-full"
                      placeholder=""
                    />
                  </td>
                  <td className="align-middle px-2">
                    <EditableField
                      fieldKey={`${chave}-${hora}-obs`}
                      className="w-full"
                      placeholder=""
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Bloco de Notas do Dia ─────────────────────────────── */}
        <div className="mt-4 shrink-0 print:mt-2">
          <p
            className="text-[8.5px] uppercase tracking-widest font-bold mb-1.5"
            style={{ color: primaryColor }}
          >
            Notas do Dia
          </p>
          <div className="border-t" style={{ borderColor: secondary }}>
            {Array.from({ length: LINHAS_NOTAS }).map((_, i) => (
              <div
                key={i}
                className="border-b h-6 print:h-6"
                style={{ borderColor: secondary }}
              >
                <EditableField
                  fieldKey={`${chave}-nota-${i}`}
                  className="w-full h-full px-1 text-[11px]"
                  placeholder=""
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Rodapé ────────────────────────────────────────────── */}
      <Footer
        name={footerName}
        type={footerType}
        colorTheme={colorTheme}
        customColors={customColors}
        fontFamily={fontFamily}
      />
    </div>
  );
}
