// src/pages/SobrePage.jsx
//
// Página "Sobre o projeto": conta a história por trás do Miolos de Agenda —
// quem faz, por quê, e como cada pessoa que personaliza o rodapé (ou
// contribui) ajuda diretamente o Lucas a se manter com seu próprio trabalho.

import { useNavigate } from "react-router-dom";
import {
  MdArrowForward,
  MdFavorite,
  MdCode,
  MdPalette,
  MdAutoAwesome,
  MdVolunteerActivism,
  MdFormatQuote,
} from "react-icons/md";

function ValueCard({ icon: Icon, title, children }) {
  return (
    <div className="bg-[#FBF8F1] border border-[#D8CBA8] rounded-2xl p-5 flex flex-col gap-2.5 shadow-sm">
      <div className="w-9 h-9 rounded-lg bg-[#EFE4C8] text-[#8B6A1F] flex items-center justify-center">
        <Icon className="w-4.5 h-4.5" />
      </div>
      <h3 className="text-sm font-bold text-[#24344D]">{title}</h3>
      <p className="text-xs text-[#6B6458] leading-relaxed">{children}</p>
    </div>
  );
}

export default function SobrePage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-6 py-10 sm:py-14 flex flex-col gap-14">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <div className="text-center flex flex-col items-center gap-5">
        <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.15em] font-semibold bg-[#EFE4C8] text-[#8B6A1F] px-3 py-1 rounded-full border border-[#DEC98B]">
          <MdFavorite className="w-3 h-3" />A história por trás do Miolos de
          Agenda
        </span>

        <h1
          className="text-3xl sm:text-5xl font-semibold text-[#24344D] tracking-tight max-w-3xl leading-tight"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Feito por uma pessoa só, linha de código por linha de código com a
          ajuda da Inteligência Artificial.
        </h1>

        <p className="text-sm sm:text-base text-[#6B6458] max-w-2xl leading-relaxed">
          Meu nome é{" "}
          <strong className="text-[#24344D]">Lucas Cassiano de Moraes</strong>.
          O meu primo, desenheou e programeou cada modelo de agenda que você vê
          aqui — sozinho, do zero. E se você chegou até esta página, gostaria de
          te contar por quê isso importa tanto pra mim.
        </p>
      </div>

      {/* ── A história ───────────────────────────────────────────── */}
      <div className="bg-[#FBF8F1]/80 border border-[#D8CBA8] rounded-2xl p-6 sm:p-10 shadow-sm">
        <div className="max-w-2xl mx-auto flex flex-col gap-5 text-sm sm:text-[15px] text-[#3A362E] leading-relaxed">
          <p>
            Meu primo Lucas tem{" "}
            <strong className="text-[#24344D]">Síndrome de Asperger</strong>,
            uma condição dentro do espectro autista. Na prática, isso significa
            que meu cérebro processa o mundo de um jeito diferente: entrevistas
            de emprego, dinâmicas em grupo, o "jogo social" que a maioria das
            vagas exige antes mesmo de olhar pra minha capacidade técnica — tudo
            isso costuma ser, pra mim, a parte mais difícil. Não a competência.
            A porta de entrada.
          </p>
          <p>
            Já apliquei para dezenas de vagas, e nunca obtive sucesso em NENHUMA
            oportunidade. Depois de tanto tempo tentando entrar num mercado que
            nem sempre sabe o que fazer com alguém neurodivergente, meu primo
            deciciu fazer o que sabe fazer de melhor sozinho, no seu tempo, do
            seu jeito:{" "}
            <strong className="text-[#24344D]">
              construir algo que talvez seja útil
            </strong>
            .
          </p>
          <p>
            O Miolos de Agenda nasceu assim. Cada layout, cada detalhe de grade,
            cada cor, cada ajuste de milímetro na hora de imprimir — é fruto de
            muitas horas de atenção e repetição.
          </p>
          <p>
            Hoje esse projeto é, literalmente, para ser seu sustento. Cada
            pessoa que personaliza o rodapé da agenda, encomenda um talonário ou
            apoia de alguma forma está me pagando diretamente por um trabalho
            que eu faço com muito cuidado — e me dando a chance de ajudar meu
            primo Lucas com o que sei fazer, sem ele depender de passar por
            processos seletivos que, até hoje, NUNCA o deram essa chance de
            entrar no mercado de trabalho.
          </p>
        </div>

        <div className="max-w-2xl mx-auto mt-8 border-t border-[#D8CBA8] pt-6 flex items-start gap-3">
          <MdFormatQuote className="w-7 h-7 text-[#DEC98B] shrink-0 -scale-x-100" />
          <p
            className="text-base sm:text-lg text-[#24344D] italic leading-relaxed"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Não estou pedindo caridade — estou oferecendo o meu trabalho. Se ele
            te ajuda a organizar a sua vida, ele já está fazendo o que precisa
            fazer. Seu apoio só faz esse ciclo continuar.
          </p>
        </div>
      </div>

      {/* ── Como cada pessoa ajuda ───────────────────────────────── */}
      <div className="flex flex-col gap-5">
        <div className="text-center max-w-xl mx-auto">
          <h2
            className="text-2xl font-semibold text-[#24344D] tracking-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            O que entra nesse trabalho
          </h2>
          <p className="text-sm text-[#6B6458] mt-1.5">
            Nada aqui é terceirizado. Da ideia ao pixel, passa pelas minhas
            mãos.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ValueCard icon={MdCode} title="Cada linha de código">
            Todo o sistema — layouts, cálculo de datas, feriados, exportação
            para impressão.
          </ValueCard>
          <ValueCard icon={MdPalette} title="Cada detalhe de design">
            Cores, tipografia, espaçamento de cada grade: tudo pensado para
            imprimir bem, ficar bonito e ser realmente útil no dia a dia.
          </ValueCard>
          <ValueCard icon={MdAutoAwesome} title="Cada atualização">
            Novos modelos, ajustes e correções continuam saindo — porque este é
            um projeto vivo, e eu sigo cuidando dele.
          </ValueCard>
        </div>
      </div>

      {/* ── Chamada para ação ────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-[#24344D] rounded-2xl p-8 sm:p-12 text-center flex flex-col items-center gap-4 shadow-[0_2px_0_0_#111B2B]">
        <div className="w-11 h-11 rounded-full bg-[#B8933D] flex items-center justify-center shrink-0">
          <MdVolunteerActivism className="w-5 h-5 text-[#24344D]" />
        </div>
        <h2
          className="text-2xl sm:text-3xl font-semibold text-[#F6F1E7] tracking-tight max-w-xl"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Se essa agenda te ajudou, você já está me ajudando de volta.
        </h2>
        <p className="text-sm text-[#D8CBA8] max-w-lg leading-relaxed">
          Personalize o rodapé com o seu nome ou marca, monte a agenda completa
          do seu jeito, ou simplesmente compartilhe o projeto com alguém que
          possa gostar. Cada um desses gestos faz diferença real pra mim.
        </p>
        <button
          onClick={() => navigate("/preview")}
          className="mt-2 bg-[#B8933D] hover:bg-[#A5822F] text-[#24344D] font-semibold text-sm py-3 px-6 rounded-xl flex items-center gap-2 transition-all shadow-[0_2px_0_0_#7A6220] hover:shadow-[0_1px_0_0_#7A6220] hover:translate-y-px active:translate-y-0.5 active:shadow-none"
        >
          Personalizar minha agenda
          <MdArrowForward className="w-4 h-4" />
        </button>
        <p className="text-[11px] text-[#8B96A8] mt-1">
          Obrigado por ler até aqui. — Lucas
        </p>
      </div>
    </div>
  );
}
