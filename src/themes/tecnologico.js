// src/themes/tecnologico.js
export default {
  nome: "Cyber Tech Evolution",

  // Estrutura e Fundos
  border: "border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]",
  text: "text-slate-300",
  headerBorder: "border-cyan-500/50 shadow-[0_4px_20px_rgba(6,182,212,0.2)]",
  bgLight: "bg-slate-950/80 backdrop-blur-md",
  cardBg:
    "bg-slate-900/90 border border-slate-800/80 relative overflow-hidden before:absolute before:top-0 before:left-0 before:w-full before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-cyan-500/50 before:to-transparent",

  // Fontes e Tipografia
  headingFont:
    "font-mono tracking-wider uppercase font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400",
  bodyFont: "font-sans antialiased",

  // Elementos de Destaque
  accent: "text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]",
  sabado:
    "text-purple-400 bg-purple-950/30 border-l-2 border-purple-500 shadow-[inset_5px_0_10px_rgba(168,85,247,0.1)]",
  domingo:
    "text-rose-400 bg-rose-950/30 border-l-2 border-rose-500 shadow-[inset_5px_0_10px_rgba(244,63,94,0.1)]", // Adicionado para diferenciar o fim de semana!

  // Botões e Interações (Com efeitos de transição e brilho expansivo)
  button:
    "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-slate-950 font-mono font-bold tracking-tight uppercase transition-all duration-300 transform hover:-translate-y-0.5 shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.7)] active:translate-y-0",
  buttonSecondary:
    "border border-cyan-500/50 hover:border-cyan-400 text-cyan-400 font-mono bg-cyan-950/20 hover:bg-cyan-950/50 transition-all duration-300",

  // Novas Propriedades Criativas (Componentes Extras)
  techGrid:
    "bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]", // Malha de circuitos para o fundo da página
  badgeActive:
    "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 inline-flex items-center gap-1.5 before:w-2 before:h-2 before:bg-emerald-400 before:rounded-full before:animate-pulse", // Status online piscando
  badgeAlert:
    "bg-rose-500/10 text-rose-400 border border-rose-500/30 inline-flex items-center gap-1.5 before:w-2 before:h-2 before:bg-rose-400 before:rounded-full before:animate-ping", // Alerta crítico piscando
  techDivider:
    "h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent relative after:content-['<>'] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:bg-slate-950 after:px-2 after:text-[10px] after:text-cyan-500/60 after:font-mono", // Divisor com símbolo de código
  inputField:
    "bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 font-mono text-sm rounded transition-all duration-200 placeholder:text-slate-600", // Inputs estilo terminal
};
