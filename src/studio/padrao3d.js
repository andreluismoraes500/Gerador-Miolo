// Estado inicial do estúdio 3D (todas as props que o Mockup3D/construir entendem).
export const LUZ_PADRAO = { principal: 1, preench: 1, recorte: 1, ambiente: 1, exposicao: 1, angulo: 0 };

export const PADRAO_3D = {
  produto: "agenda", tipo: "wireo", metal: "prata", mat: "carton", cena: "bege", view: "fechada", tamanho: "a5",
  corCapa: "#1e293b", capaSrc: null, ajuste: { zoom: 1, x: 0, y: 0, modo: "cobrir" }, miolosrc: null, mioloTipo: "pautado",
  formato: "retrato", lado: "topo", espessura: 3, folhaSrc: null, papelao: "kraft", corCola: "#c0392b", destacando: true,
  girar: false, qualidade: "auto", arteVerso: null,
  qTam: "a4", orient: "retrato", moldura: "preto", molduraLarg: 2, passepartout: true, montagem: "parede",
  bTam: "38", bQtd: 3, bBrilho: true, cArco: 340, cMat: "brilho", corCaneca: "#ffffff", corInterior: "#ffffff", cafe: false,
  cQtd: 12, cFosco: false, cxTam: "m", abertura: 0, sTam: "m", corAlca: "#ffffff", disp: "esquerda", aneis: null, furo: "auto",
  elasticoLarg: 6, elasticoPos: 22, passante: false, corPassante: "#111111", elastico: false, corElastico: "#111111",
  acab: "nenhum", acabTexto: "Minha Agenda", acessorios3d: [],
  fita: false, corFita: "#b3262e", caneta: false, cantos: false, luz: LUZ_PADRAO,
};
