// <option>s de fonte agrupados (sem serifa, cursivas, letra de mão…), cada uma escrita na própria fonte.
import { FONTES_TODAS, GRUPOS_FONTES } from "../../lib/fontes";

const grupoDe = Object.fromEntries(FONTES_TODAS.map((f) => [f[0], f[3]]));

export default function OpcoesFonte({ lista }) {
  const soltas = lista.filter(([v]) => !grupoDe[v]);
  return (
    <>
      {soltas.map(([v, n]) => <option key={v || n} value={v}>{n}</option>)}
      {GRUPOS_FONTES.map((g) => {
        const its = lista.filter(([v]) => grupoDe[v] === g);
        return its.length ? (
          <optgroup key={g} label={g}>
            {its.map(([v, n]) => <option key={v} value={v} style={{ fontFamily: v }}>{n}</option>)}
          </optgroup>
        ) : null;
      })}
    </>
  );
}
