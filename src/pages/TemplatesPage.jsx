// src/pages/TemplatesPage.jsx
//
// Primeira etapa do fluxo: escolher o modo (Único ou Montagem), o perfil de
// negócio, a data base e — no modo Único — o modelo de miolo desejado.

import { useNavigate, useOutletContext } from "react-router-dom";
import { MdDescription, MdAutoStories, MdArrowForward } from "react-icons/md";
import TemplateSelector from "../components/TemplateSelector";
import BusinessProfileSelector from "../components/BusinessProfileSelector";
import BuilderPanel from "../components/BuilderPanel";
import { useDateInput } from "../hooks/useDateInput";

function SectionCard({ title, description, children }) {
  return (
    <section className="bg-[#FBF8F1]/80 border border-[#D8CBA8] rounded-2xl p-5 sm:p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-sm font-bold text-[#24344D]">{title}</h2>
        {description && (
          <p className="text-xs text-[#8B6A1F] mt-0.5">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

export default function TemplatesPage() {
  const { settings, builder } = useOutletContext();
  const navigate = useNavigate();
  const {
    template,
    setTemplate,
    selectedDate,
    setSelectedDate,
    businessProfileId,
    setBusinessProfile,
  } = settings;
  const { builderMode, setBuilderMode } = builder;

  const { inputType, inputValue, handleDateChange } = useDateInput(
    template,
    selectedDate,
    setSelectedDate,
    builderMode,
  );

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-6 py-8 flex flex-col gap-6">
      {/* Cabeçalho da página */}
      <div>
        <h1
          className="text-2xl sm:text-3xl font-semibold text-[#24344D] tracking-tight"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Escolha o modelo da sua agenda
        </h1>
        <p className="text-sm text-[#6B6458] mt-1">
          Comece selecionando o modo de criação. Depois é só ajustar aparência
          e visualizar o resultado.
        </p>
      </div>

      {/* Seleção de modo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => setBuilderMode(false)}
          className={`text-left p-5 rounded-2xl border-2 transition-all flex items-start gap-4 ${
            !builderMode
              ? "border-[#24344D] bg-[#FBF8F1] shadow-[3px_3px_0_0_#24344D]"
              : "border-[#D8CBA8] bg-[#FBF8F1]/70 hover:border-[#B8933D]"
          }`}
        >
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
              !builderMode ? "bg-[#24344D] text-[#F6F1E7]" : "bg-[#EFE4C8] text-[#8B6A1F]"
            }`}
          >
            <MdDescription className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-[#24344D]">Modelo único</div>
            <p className="text-xs text-[#6B6458] mt-1 leading-relaxed">
              Escolha um único miolo (diário, semanal, mensal...) para imprimir.
            </p>
          </div>
        </button>

        <button
          onClick={() => setBuilderMode(true)}
          className={`text-left p-5 rounded-2xl border-2 transition-all flex items-start gap-4 ${
            builderMode
              ? "border-[#24344D] bg-[#FBF8F1] shadow-[3px_3px_0_0_#24344D]"
              : "border-[#D8CBA8] bg-[#FBF8F1]/70 hover:border-[#B8933D]"
          }`}
        >
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
              builderMode ? "bg-[#24344D] text-[#F6F1E7]" : "bg-[#EFE4C8] text-[#8B6A1F]"
            }`}
          >
            <MdAutoStories className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-[#24344D]">Montagem completa</div>
            <p className="text-xs text-[#6B6458] mt-1 leading-relaxed">
              Empilhe vários módulos (capa, mensal, semanal, hábitos...) em um
              único PDF contínuo.
            </p>
          </div>
        </button>
      </div>

      {/* Perfil e data base */}
      <SectionCard
        title="Perfil de negócio"
        description="Ajusta campos, textos e cores sugeridas para o seu segmento."
      >
        <BusinessProfileSelector selected={businessProfileId || "default"} onSelect={setBusinessProfile} />
      </SectionCard>

      <SectionCard
        title={builderMode ? "Ano base" : "Data base"}
        description="Usada para calcular os dias, semanas e meses do miolo."
      >
        <input
          type={inputType}
          min={inputType === "number" ? 2020 : undefined}
          max={inputType === "number" ? 2035 : undefined}
          value={inputValue}
          onChange={(e) => handleDateChange(e.target.value)}
          className="border border-[#D8CBA8] rounded-lg px-3 py-2 text-sm bg-[#FBF8F1] font-medium focus:ring-2 focus:ring-[#B8933D]/40 focus:border-[#B8933D] focus:outline-none transition w-40"
        />
      </SectionCard>

      {/* Modo único: galeria de modelos / Modo montagem: painel de módulos */}
      {!builderMode ? (
        <SectionCard
          title="Modelo de miolo"
          description="Selecione o modelo que será usado na visualização e impressão."
        >
          <TemplateSelector selected={template} onSelect={setTemplate} grid />
        </SectionCard>
      ) : (
        <div className="bg-[#FBF8F1]/80 border border-[#D8CBA8] rounded-2xl p-1 sm:p-2 shadow-sm overflow-hidden">
          <BuilderPanel builder={builder} />
        </div>
      )}

      {/* CTA */}
      <div className="flex justify-end pt-2">
        <button
          onClick={() => navigate("/config")}
          className="bg-[#24344D] hover:bg-[#1B2740] text-[#F6F1E7] font-semibold text-sm py-3 px-6 rounded-xl flex items-center gap-2 transition-all shadow-[0_2px_0_0_#111B2B] hover:shadow-[0_1px_0_0_#111B2B] hover:translate-y-px active:translate-y-0.5 active:shadow-none"
        >
          Continuar para Configurações
          <MdArrowForward className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
