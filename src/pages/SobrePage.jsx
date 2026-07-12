// src/pages/SobrePage.jsx
//
// Página "Sobre o projeto": não é sobre pedir nada — é sobre mostrar o que o
// Miolos de Agenda realmente faz. Da folha em branco até o PDF pronto pra
// imprimir, com um pouco de teatro (GSAP) pelo caminho.

import { useEffect, useLayoutEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  MdArrowForward,
  MdAutoAwesome,
  MdGridView,
  MdPalette,
  MdPictureAsPdf,
  MdBusinessCenter,
  MdTune,
  MdFavorite,
  MdQrCode2,
  MdContentCopy,
  MdCheck,
} from "react-icons/md";
import { staggerIn, popHover } from "../utils/gsapAnimations";
import { TEMPLATE_KEYS } from "../templates/manifest";
import { BUSINESS_PROFILES } from "../config/businessProfiles";
import { TEMAS } from "../themes";
import pixQrCode from "../assets/pix.png";

gsap.registerPlugin(ScrollTrigger);

const CHAVE_PIX = "eb076378-eef6-4504-8b12-713f19d1c510"; // TODO: substitua pela chave PIX real

function FeatureCard({ icon: Icon, title, children }) {
  const cardRef = useRef(null);
  return (
    <div
      ref={cardRef}
      onMouseEnter={() => popHover(cardRef.current, true)}
      onMouseLeave={() => popHover(cardRef.current, false)}
      className="feature-card bg-[#FBF8F1] border border-[#D8CBA8] rounded-2xl p-5 flex flex-col gap-2.5 shadow-sm cursor-default"
    >
      <div className="w-9 h-9 rounded-lg bg-[#EFE4C8] text-[#8B6A1F] flex items-center justify-center">
        <Icon className="w-4.5 h-4.5" />
      </div>
      <h3 className="text-sm font-bold text-[#24344D]">{title}</h3>
      <p className="text-xs text-[#6B6458] leading-relaxed">{children}</p>
    </div>
  );
}

function StatBlock({ value, suffix = "", label, statRef }) {
  return (
    <div className="flex flex-col items-center text-center gap-1">
      <p className="text-3xl sm:text-4xl font-semibold text-[#F6F1E7] tabular-nums">
        <span ref={statRef}>0</span>
        {suffix}
      </p>
      <p className="text-[11px] uppercase tracking-[0.12em] text-[#B8933D] font-semibold">
        {label}
      </p>
    </div>
  );
}

function StepNode({ n, title, children, stepRef }) {
  return (
    <div
      ref={stepRef}
      className="step-node flex flex-col items-center text-center gap-3 flex-1"
    >
      <div className="w-11 h-11 rounded-full bg-[#24344D] text-[#F6F1E7] flex items-center justify-center font-semibold text-sm shrink-0 relative z-10">
        {n}
      </div>
      <h3 className="text-sm font-bold text-[#24344D]">{title}</h3>
      <p className="text-xs text-[#6B6458] leading-relaxed max-w-55">
        {children}
      </p>
    </div>
  );
}

export default function SobrePage() {
  const navigate = useNavigate();
  const rootRef = useRef(null);
  const heroTitleRef = useRef(null);
  const heroBadgeRef = useRef(null);
  const heroSubRef = useRef(null);
  const cardsWrapRef = useRef(null);
  const statsSectionRef = useRef(null);
  const statTemplatesRef = useRef(null);
  const statPerfisRef = useRef(null);
  const statTemasRef = useRef(null);
  const stepsWrapRef = useRef(null);
  const stepLineRef = useRef(null);
  const stepNodeRefs = useRef([]);
  const pixCardRef = useRef(null);
  const pixButtonRef = useRef(null);
  const copyIconRef = useRef(null);
  const checkIconRef = useRef(null);

  const totalTemplates = TEMPLATE_KEYS.length;
  const totalPerfis = Object.keys(BUSINESS_PROFILES).length;
  const totalTemas = Object.keys(TEMAS).length;

  // ── Entrada do hero: badge, título palavra a palavra, subtítulo ──────────
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const words = heroTitleRef.current?.querySelectorAll(".hero-word");

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        heroBadgeRef.current,
        { opacity: 0, y: -10, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5 },
      )
        .fromTo(
          words,
          { opacity: 0, y: 26, rotateX: -40 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.7,
            stagger: 0.045,
            transformOrigin: "50% 100%",
          },
          "-=0.15",
        )
        .fromTo(
          heroSubRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.55 },
          "-=0.35",
        );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  // ── Scroll reveals: cards, stats (contador), linha de passos ─────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Cards de "o que dá pra fazer aqui"
      if (cardsWrapRef.current) {
        ScrollTrigger.create({
          trigger: cardsWrapRef.current,
          start: "top 82%",
          once: true,
          onEnter: () =>
            staggerIn(cardsWrapRef.current.querySelectorAll(".feature-card")),
        });
      }

      // Contadores animados quando a faixa de estatísticas entra em cena
      if (statsSectionRef.current) {
        ScrollTrigger.create({
          trigger: statsSectionRef.current,
          start: "top 80%",
          once: true,
          onEnter: () => {
            [
              { ref: statTemplatesRef, value: totalTemplates },
              { ref: statPerfisRef, value: totalPerfis },
              { ref: statTemasRef, value: totalTemas },
            ].forEach(({ ref, value }) => {
              if (!ref.current) return;
              const counter = { n: 0 };
              gsap.to(counter, {
                n: value,
                duration: 1.1,
                ease: "power2.out",
                onUpdate: () => {
                  ref.current.textContent = Math.round(counter.n);
                },
              });
            });
          },
        });
      }

      // Linha do "como funciona" se desenhando + nós entrando em cascata
      if (stepsWrapRef.current) {
        ScrollTrigger.create({
          trigger: stepsWrapRef.current,
          start: "top 78%",
          once: true,
          onEnter: () => {
            const tl = gsap.timeline();
            if (stepLineRef.current) {
              const len = stepLineRef.current.getTotalLength();
              gsap.set(stepLineRef.current, {
                strokeDasharray: len,
                strokeDashoffset: len,
              });
              tl.to(stepLineRef.current, {
                strokeDashoffset: 0,
                duration: 1,
                ease: "power2.inOut",
              });
            }
            tl.fromTo(
              stepNodeRefs.current.filter(Boolean),
              { opacity: 0, y: 16, scale: 0.9 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.45,
                stagger: 0.18,
                ease: "back.out(1.6)",
              },
              "-=0.75",
            );
          },
        });
      }

      // Cartão do PIX: leve "respiração" contínua pra chamar o olho sem gritar
      if (pixCardRef.current) {
        gsap.to(pixCardRef.current, {
          y: -4,
          duration: 2.2,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      }
    }, rootRef);

    return () => ctx.revert();
  }, [totalTemplates, totalPerfis, totalTemas]);

  function handleCopyPix() {
    navigator.clipboard?.writeText(CHAVE_PIX).catch(() => {});
    gsap.to(pixButtonRef.current, {
      scale: 1.04,
      duration: 0.15,
      yoyo: true,
      repeat: 1,
      ease: "power1.out",
    });
    if (copyIconRef.current && checkIconRef.current) {
      gsap.to(copyIconRef.current, { opacity: 0, scale: 0.6, duration: 0.15 });
      gsap.fromTo(
        checkIconRef.current,
        { opacity: 0, scale: 0.6 },
        { opacity: 1, scale: 1, duration: 0.2, delay: 0.1 },
      );
      gsap.to(checkIconRef.current, {
        opacity: 0,
        scale: 0.6,
        duration: 0.15,
        delay: 1.6,
        onComplete: () => {
          gsap.set(copyIconRef.current, { opacity: 1, scale: 1 });
        },
      });
    }
  }

  const heroTitleWords =
    "Uma agenda em branco vira exatamente a agenda que você precisa.".split(
      " ",
    );

  return (
    <div
      ref={rootRef}
      className="max-w-5xl mx-auto px-5 sm:px-6 py-10 sm:py-14 flex flex-col gap-16"
    >
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <div className="text-center flex flex-col items-center gap-5">
        <span
          ref={heroBadgeRef}
          className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.15em] font-semibold bg-[#EFE4C8] text-[#8B6A1F] px-3 py-1 rounded-full border border-[#DEC98B]"
        >
          <MdAutoAwesome className="w-3 h-3" />
          Sobre o Miolos de Agenda
        </span>

        <h1
          ref={heroTitleRef}
          className="text-3xl sm:text-5xl font-semibold text-[#24344D] tracking-tight max-w-3xl leading-tight"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            perspective: 600,
          }}
        >
          {heroTitleWords.map((word, i) => (
            <span
              key={i}
              className="hero-word inline-block will-change-transform"
              style={{ marginRight: "0.28em" }}
            >
              {word}
            </span>
          ))}
        </h1>

        <p
          ref={heroSubRef}
          className="text-sm sm:text-base text-[#6B6458] max-w-2xl leading-relaxed"
        >
          O Miolos de Agenda é um ateliê digital de agendas e planners: você
          escolhe o miolo, ajusta cada detalhe na tela e sai daqui com um PDF
          pronto pra imprimir — sem instalar nada, sem entender de design, sem
          complicação.
        </p>
      </div>

      {/* ── O que é, contado como história ──────────────────────── */}
      <div className="bg-[#FBF8F1]/80 border border-[#D8CBA8] rounded-2xl p-6 sm:p-10 shadow-sm">
        <div className="max-w-2xl mx-auto flex flex-col gap-5 text-sm sm:text-[15px] text-[#3A362E] leading-relaxed">
          <p>
            Toda agenda começa do mesmo jeito por aqui: uma folha em branco na
            tela. A partir daí, o Miolos de Agenda entra em ação — dezenas de
            layouts prontos, cada um pensado pixel a pixel pra funcionar tanto
            na tela quanto no papel impresso, com grades que se alinham certinho
            na hora do corte e da encadernação.
          </p>
          <p>
            Não é um gerador genérico. Tem miolo para quem vive de agenda de
            horários — advogados, psicólogos, manicures, personal trainers,
            fotógrafos, dentistas — e tem miolo para quem só quer organizar a
            própria vida: diário, hábitos, finanças, estudos, sono, leitura,
            metas, viagens. Cada um com sua própria lógica de grade, e não uma
            adaptação forçada de um modelo único.
          </p>
          <p>
            No fim, você monta a agenda do seu jeito: escolhe o modelo, ajusta
            cores e tipografia, decide o que aparece em cada página, coloca seu
            nome ou o da sua marca no rodapé — e exporta um PDF em alta
            resolução, calibrado para sair impresso do jeito que apareceu na
            tela.
          </p>
        </div>
      </div>

      {/* ── Estatísticas animadas ───────────────────────────────── */}
      <div
        ref={statsSectionRef}
        className="relative overflow-hidden bg-[#24344D] rounded-2xl px-8 py-10 sm:py-12 shadow-[0_2px_0_0_#111B2B]"
      >
        <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-lg mx-auto">
          <StatBlock
            statRef={statTemplatesRef}
            suffix="+"
            value={totalTemplates}
            label="Modelos de miolo"
          />
          <StatBlock
            statRef={statPerfisRef}
            suffix=""
            value={totalPerfis}
            label="Perfis de negócio"
          />
          <StatBlock
            statRef={statTemasRef}
            suffix=""
            value={totalTemas}
            label="Temas visuais"
          />
        </div>
      </div>

      {/* ── O que dá pra fazer aqui ──────────────────────────────── */}
      <div className="flex flex-col gap-5">
        <div className="text-center max-w-xl mx-auto">
          <h2
            className="text-2xl font-semibold text-[#24344D] tracking-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            O que dá pra fazer aqui
          </h2>
          <p className="text-sm text-[#6B6458] mt-1.5">
            Do modelo em branco à agenda pronta, sem sair da tela.
          </p>
        </div>

        <div
          ref={cardsWrapRef}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          <FeatureCard icon={MdGridView} title="Dezenas de layouts">
            Diários, semanais, mensais, anuais, planners temáticos e agendas
            comerciais — cada um com grade própria, feita para o que ele se
            propõe a organizar.
          </FeatureCard>
          <FeatureCard icon={MdBusinessCenter} title="Perfis de negócio">
            Campos, cores e vocabulário se adaptam à sua área: o que aparece
            numa agenda de advogado não é o que aparece na de uma manicure.
          </FeatureCard>
          <FeatureCard icon={MdPalette} title="Temas e identidade visual">
            Paletas prontas ou cores personalizadas, tipografia, capa e rodapé —
            pra a agenda sair com a sua cara ou a da sua marca.
          </FeatureCard>
          <FeatureCard icon={MdTune} title="Ajuste fino de verdade">
            Escolha a data de início, o que cada página mostra, a ordem dos
            módulos — o controle é seu, não um pacote fechado.
          </FeatureCard>
          <FeatureCard icon={MdPictureAsPdf} title="PDF pronto pra imprimir">
            Exportação calibrada milímetro a milímetro para sair correta na
            impressão, sem margens tortas ou grade desalinhada.
          </FeatureCard>
          <FeatureCard icon={MdAutoAwesome} title="Sempre em construção">
            Novos modelos e ajustes continuam entrando — o catálogo de hoje não
            é o catálogo definitivo.
          </FeatureCard>
        </div>
      </div>

      {/* ── Como funciona (linha do tempo desenhada) ────────────── */}
      <div ref={stepsWrapRef} className="flex flex-col gap-8">
        <div className="text-center max-w-xl mx-auto">
          <h2
            className="text-2xl font-semibold text-[#24344D] tracking-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Da tela ao papel, em três passos
          </h2>
        </div>

        <div className="relative">
          <svg
            className="hidden sm:block absolute top-5.5 left-0 w-full h-0.5"
            viewBox="0 0 100 2"
            preserveAspectRatio="none"
          >
            <line
              ref={stepLineRef}
              x1="16"
              y1="1"
              x2="84"
              y2="1"
              stroke="#D8CBA8"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <div className="relative flex flex-col sm:flex-row gap-8 sm:gap-4">
            <StepNode
              n={1}
              title="Escolha o miolo"
              stepRef={(el) => (stepNodeRefs.current[0] = el)}
            >
              Navegue pelos modelos e pelo perfil de negócio que mais combina
              com o que você precisa organizar.
            </StepNode>
            <StepNode
              n={2}
              title="Personalize"
              stepRef={(el) => (stepNodeRefs.current[1] = el)}
            >
              Ajuste data, cores, tema e o que aparece em cada página, vendo o
              resultado em tempo real.
            </StepNode>
            <StepNode
              n={3}
              title="Baixe o PDF"
              stepRef={(el) => (stepNodeRefs.current[2] = el)}
            >
              Exporte em alta resolução, pronto pra imprimir e encadernar do
              jeito que você quiser.
            </StepNode>
          </div>
        </div>
      </div>

      {/* ── Apoio via PIX (leve, opcional, sem pressão) ─────────── */}
      <div
        ref={pixCardRef}
        className="bg-[#FBF8F1] border border-[#D8CBA8] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-sm"
      >
        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden border border-[#D8CBA8] shrink-0 bg-white flex items-center justify-center">
          <img
            src={pixQrCode}
            alt="QR Code para apoiar via PIX"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex-1 text-center sm:text-left flex flex-col gap-2">
          <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.12em] font-semibold text-[#8B6A1F] justify-center sm:justify-start">
            <MdFavorite className="w-3 h-3" />
            Gostou do projeto?
          </span>
          <h3
            className="text-lg font-semibold text-[#24344D]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Um PIX é sempre bem-vindo, mas o principal é você aproveitar as
            agendas.
          </h3>
          <p className="text-xs text-[#6B6458] leading-relaxed">
            Escaneie o QR Code ou copie a chave abaixo se quiser deixar um
            agradecimento por trás do projeto.
          </p>
          <button
            ref={pixButtonRef}
            onClick={handleCopyPix}
            className="mt-1 self-center sm:self-start inline-flex items-center gap-2 bg-[#EFE4C8] hover:bg-[#E5D6AC] text-[#8B6A1F] text-xs font-semibold py-2 px-3.5 rounded-lg border border-[#DEC98B] transition-colors"
          >
            <MdQrCode2 className="w-4 h-4" />
            <span className="font-mono">{CHAVE_PIX}</span>
            <span className="relative w-3.5 h-3.5 inline-block">
              <MdContentCopy
                ref={copyIconRef}
                className="w-3.5 h-3.5 absolute inset-0"
              />
              <MdCheck
                ref={checkIconRef}
                className="w-3.5 h-3.5 absolute inset-0 opacity-0 text-[#3F7D4F]"
              />
            </span>
          </button>
        </div>
      </div>

      {/* ── Chamada para ação ────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-[#24344D] rounded-2xl p-8 sm:p-12 text-center flex flex-col items-center gap-4 shadow-[0_2px_0_0_#111B2B]">
        <h2
          className="text-2xl sm:text-3xl font-semibold text-[#F6F1E7] tracking-tight max-w-xl"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Sua agenda ainda é só uma ideia. Vamos colocar no papel?
        </h2>
        <p className="text-sm text-[#D8CBA8] max-w-lg leading-relaxed">
          Escolha um modelo, personalize do seu jeito e baixe um PDF pronto pra
          imprimir em poucos minutos.
        </p>
        <button
          onClick={() => navigate("/preview")}
          className="mt-2 bg-[#B8933D] hover:bg-[#A5822F] text-[#24344D] font-semibold text-sm py-3 px-6 rounded-xl flex items-center gap-2 transition-all shadow-[0_2px_0_0_#7A6220] hover:shadow-[0_1px_0_0_#7A6220] hover:translate-y-px active:translate-y-0.5 active:shadow-none"
        >
          Começar minha agenda
          <MdArrowForward className="w-4 h-4" />
        </button>
        <p className="text-[11px] text-[#8B96A8] mt-1">
          Miolos de Agenda — idealizado por André Luis de Moraes.
        </p>
      </div>
    </div>
  );
}
