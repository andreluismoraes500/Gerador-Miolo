// src/layout/AppLayout.jsx
//
// Casca visual persistente do app: cabeçalho, navegação entre páginas
// (Modelos / Configurações / Visualização) e o botão de impressão global.
// O estado de sessão (useAgendaSettings) e de montagem (useAgendaBuilder)
// vive aqui e é repassado às páginas via <Outlet context={...} />, então
// nada se perde ao trocar de rota.

import { cssFonte, fonteCfg } from "../lib/configFonte";
import { LadosImpressao } from "../components/OpcoesImpressao";
import { useEffect, useRef } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { MdPrint, MdGridView, MdTune, MdVisibility, MdReceiptLong, MdFavorite, MdPictureAsPdf, MdBadge, MdRadioButtonChecked, MdCalendarMonth, MdAutoStories } from "react-icons/md";
import { Toaster } from "react-hot-toast";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAgendaSettings } from "../hooks/useAgendaSettings";
import { useAgendaBuilder } from "../hooks/useAgendaBuilder";
import { animateHeaderIn, animatePageIn } from "../utils/gsapAnimations";
import ErrorBoundary from "../components/ErrorBoundary";
import "../styles/print.css";

gsap.registerPlugin(ScrollTrigger);

const NAV_ITEMS = [
  { to: "/templates", label: "Modelos", icon: MdGridView },
  { to: "/config", label: "Configurações", icon: MdTune },
  { to: "/preview", label: "Visualização", icon: MdVisibility },
  { to: "/talonario", label: "Talonário", icon: MdReceiptLong },
  { to: "/imprimir-pdf", label: "Imprimir PDF", icon: MdPictureAsPdf },
  { to: "/cartao-de-visita", label: "Cartão de visita", icon: MdBadge },
  { to: "/bottons", label: "Bottons", icon: MdRadioButtonChecked },
  { to: "/calendarios", label: "Calendários", icon: MdCalendarMonth },
  { to: "/mockup-agenda", label: "Mockup agenda", icon: MdAutoStories },
  { to: "/sobre", label: "Sobre", icon: MdFavorite },
];

export default function AppLayout() {
  const settings = useAgendaSettings();
  const builder = useAgendaBuilder();
  const navigate = useNavigate();
  const location = useLocation();
  const { escala: escalaFonte } = fonteCfg.useStore();

  useEffect(() => {
    const st = document.createElement("style");
    st.textContent = cssFonte(escalaFonte);
    document.head.appendChild(st);
    return () => st.remove();
  }, [escalaFonte]);

  const rotaPropria = ["/talonario", "/sobre", "/imprimir-pdf", "/cartao-de-visita", "/bottons", "/calendarios", "/mockup-agenda"].includes(location.pathname);
  const headerRef = useRef(null);
  const mainRef = useRef(null);

  // Cabeçalho entra suavemente uma única vez, ao montar o app.
  useEffect(() => {
    animateHeaderIn(headerRef.current);
  }, []);

  // A cada troca de rota, o conteúdo principal recebe um fade + leve subida
  // — dá sensação de transição de página sem precisar de rota animada.
  //
  // Também é aqui que resolvemos um bug de navegação: se o usuário rolar a
  // página (ex.: Sobre, que é longa e usa ScrollTrigger) e trocar de rota, o
  // React Router NÃO reseta o scroll do navegador sozinho. O resultado é
  // "aterrissar" na página nova já rolado lá embaixo — às vezes além da
  // altura do conteúdo dela — dando a impressão de que a página não
  // carregou, e só um F5 (que reseta o scroll) resolvia. Por isso, a cada
  // troca de rota: voltamos o scroll pro topo e mandamos o ScrollTrigger
  // recalcular as posições dos triggers da página recém-montada.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    const tween = animatePageIn(mainRef.current);

    // Espera o próximo frame (DOM da nova página já pintado) antes de
    // recalcular; refresh() antes disso mediria a página anterior/errada.
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      tween?.kill();
      cancelAnimationFrame(raf);
    };
  }, [location.pathname]);

  // Imprimir de qualquer página: se não estivermos na Visualização, navega
  // até lá primeiro (é onde o miolo completo é renderizado) e só então
  // dispara o diálogo de impressão do navegador.
  const handlePrintClick = () => {
    if (location.pathname !== "/preview") {
      navigate("/preview");
      setTimeout(() => settings.handlePrint(), 350);
    } else {
      settings.handlePrint();
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F1E7] bg-[radial-gradient(circle_at_top,#FBF8F1_0%,#F1EADB_55%,#EAE1CD_100%)] flex flex-col font-sans text-[#2B2A28]">
      <Toaster position="bottom-right" />

      <header
        ref={headerRef}
        className="sticky top-0 z-40 bg-[#FBF8F1]/90 backdrop-blur-md border-b border-[#D8CBA8] print:hidden"
      >
        <div className="max-w-7xl 2xl:max-w-[1700px] mx-auto px-4 sm:px-6 py-2 md:py-3 flex flex-wrap 2xl:flex-nowrap items-center justify-between gap-x-3 gap-y-2">
          {/* Marca */}
          <div className="flex items-center gap-3 shrink-0 mr-auto md:mr-0">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-[#24344D] shadow-[2px_2px_0_0_#B8933D]">
              <span
                className="text-[#F6F1E7] text-base leading-none"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                M
              </span>
            </div>
            <div className="hidden sm:flex items-baseline gap-2.5">
              <h1
                className="text-xl font-semibold tracking-tight text-[#24344D]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Miolos de Agenda
              </h1>
              <span className="text-[9px] uppercase tracking-[0.15em] bg-[#EFE4C8] text-[#8B6A1F] px-2 py-0.5 font-semibold rounded-full border border-[#DEC98B]">
                Beta
              </span>
            </div>
          </div>

          {/* Navegação entre páginas */}
          <nav aria-label="Navegação principal" className="order-last 2xl:order-none w-full 2xl:w-auto flex items-center justify-between gap-0.5 sm:gap-1 bg-[#F1EADB] border border-[#D8CBA8] rounded-xl p-1 shadow-inner">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                title={label}
                aria-label={label}
                className={({ isActive }) =>
                  `flex items-center justify-center gap-1.5 flex-1 2xl:flex-none min-w-0 px-1.5 sm:px-3 py-2.5 2xl:py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#24344D] text-[#F6F1E7] shadow-sm"
                      : "text-[#6B6458] hover:bg-[#EFE4C8] hover:text-[#24344D]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className={`${isActive ? "hidden sm:inline" : "hidden xl:inline"} truncate`}>{label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Ação principal — o Talonário tem seu próprio botão de impressão
              em lote (numeração/marca d'água), então o botão global de PDF
              da agenda fica escondido nessa rota para não confundir. */}
          {!rotaPropria && (
            <div className="hidden min-[1960px]:block"><LadosImpressao compacto /></div>
          )}
          {!rotaPropria && (
            <button
              onClick={handlePrintClick}
              className="relative shrink-0 bg-[#8B2E3F] hover:bg-[#7A2837] text-[#FBF8F1] text-xs font-semibold py-2.5 px-4 sm:px-5 rounded-lg flex items-center gap-2 transition-all shadow-[0_2px_0_0_#5E1F2B] hover:shadow-[0_1px_0_0_#5E1F2B] hover:translate-y-px active:translate-y-0.5 active:shadow-none"
            >
              <MdPrint className="w-4 h-4" />
              <span className="hidden sm:inline">Gerar Impressão / PDF</span>
            </button>
          )}
        </div>
      </header>

      <main ref={mainRef} className="flex-1 print:p-0 print:overflow-visible">
        <ErrorBoundary key={location.pathname}>
          <Outlet context={{ settings, builder }} />
        </ErrorBoundary>
      </main>
    </div>
  );
}
