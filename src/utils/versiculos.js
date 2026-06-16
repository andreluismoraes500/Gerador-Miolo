export const VERSICULOS_BIBLICOS = [
  "O Senhor é o meu pastor; nada me faltará. (Salmos 23:1)",
  "Confie no Senhor de todo o seu coração e não se apoie em seu próprio entendimento. (Provérbios 3:5)",
  "Posso todas as coisas naquele que me fortalece. (Filipenses 4:13)",
  "O amor é paciente, o amor é bondoso. (1 Coríntios 13:4)",
  "Não se preocupem com o amanhã, pois o amanhã trará suas próprias preocupações. (Mateus 6:34)",
  "Alegrem-se sempre, orem continuamente, deem graças em todas as circunstâncias. (1 Tessalonicenses 5:16-18)",
  "O Senhor é bom, um refúgio em tempos de angústia. (Naum 1:7)",
  "Tudo posso naquele que me fortalece. (Filipenses 4:13)",
  "O temor do Senhor é o princípio da sabedoria. (Provérbios 9:10)",
  "Buscai primeiro o Reino de Deus e a sua justiça, e todas essas coisas vos serão acrescentadas. (Mateus 6:33)",
  "O Senhor te abençoará e te guardará. (Números 6:24)",
  "Deus é o nosso refúgio e fortaleza, socorro bem presente na angústia. (Salmos 46:1)",
];

export function getVersiculoAleatorio() {
  return VERSICULOS_BIBLICOS[
    Math.floor(Math.random() * VERSICULOS_BIBLICOS.length)
  ];
}
