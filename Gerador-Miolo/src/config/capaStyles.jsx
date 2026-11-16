export const CAPA_ESTILOS = {
  classico: {
    id: "classico",
    nome: "Clássico",
    container: "text-center flex flex-col items-center justify-center h-full",
    nomeClasse: "font-serif text-5xl tracking-widest uppercase",
    subClasse: "text-sm uppercase tracking-[0.3em] font-sans",
    linhaClasse: "w-24 h-px bg-gray-300 mx-auto my-6",
    extra: null,
  },
  moderno: {
    id: "moderno",
    nome: "Moderno",
    container: "flex items-center justify-center h-full",
    nomeClasse: "font-sans text-7xl font-light tracking-[0.2em] uppercase",
    subClasse: "text-base font-light tracking-[0.4em]",
    linhaClasse: "hidden",
    extra: null,
  },
  caligrafia: {
    id: "caligrafia",
    nome: "Caligrafia",
    container: "text-center flex flex-col items-center justify-center h-full",
    nomeClasse: "font-cursive text-6xl italic",
    subClasse: "text-sm font-serif tracking-widest",
    linhaClasse: "w-32 h-0.5 bg-amber-300 mx-auto my-6",
    extra: null,
  },
  minimalista: {
    id: "minimalista",
    nome: "Minimalista",
    container: "flex items-start justify-start h-full pl-16 flex-col",
    nomeClasse: "font-sans text-5xl font-light tracking-[0.1em]",
    subClasse: "text-xs uppercase tracking-[0.4em] mt-4",
    linhaClasse: "hidden",
    extra: null,
  },
  vintage: {
    id: "vintage",
    nome: "Vintage",
    container:
      "text-center flex flex-col items-center justify-center h-full border-4 border-double border-amber-700 p-12",
    nomeClasse: "font-serif text-5xl tracking-widest italic",
    subClasse: "text-sm uppercase tracking-[0.3em]",
    linhaClasse: "w-32 h-0.5 bg-amber-700 mx-auto my-6",
    extra: () => (
      <div className="absolute inset-0 pointer-events-none border-4 border-amber-700/30 rounded-sm" />
    ),
  },
  elegante: {
    id: "elegante",
    nome: "Elegante",
    container:
      "text-center flex flex-col items-center justify-center h-full bg-gradient-to-b from-gray-50 to-white",
    nomeClasse: "font-serif text-6xl tracking-[0.3em] uppercase italic",
    subClasse: "text-sm uppercase tracking-[0.5em] font-light",
    linhaClasse:
      "w-32 h-0.5 bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto my-6",
    extra: () => (
      <div className="absolute inset-0 border border-gray-200/50 rounded-sm pointer-events-none" />
    ),
  },
  clean: {
    id: "clean",
    nome: "Clean",
    container: "text-center flex flex-col items-center justify-center h-full",
    nomeClasse: "font-sans text-5xl font-light tracking-[0.3em] uppercase",
    subClasse: "text-sm font-light italic mt-6 tracking-wider",
    linhaClasse:
      "w-24 h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto my-6",
    extra: null,
  },
  destaque: {
    id: "destaque",
    nome: "Destaque Japonês",
    container:
      "relative flex flex-col items-center justify-center h-full text-center overflow-visible",
    nomeClasse:
      "relative z-10 font-cursive text-5xl md:text-6xl drop-shadow-sm",
    subClasse: "relative z-10 text-sm tracking-[0.3em] uppercase",
    linhaClasse: "hidden",
    extra: null,
  },
};

export function getCapaEstiloOptions() {
  return Object.values(CAPA_ESTILOS).map((estilo) => ({
    value: estilo.id,
    label: estilo.nome,
  }));
}

export function getCapaEstiloById(id) {
  return CAPA_ESTILOS[id] || CAPA_ESTILOS.classico;
}
