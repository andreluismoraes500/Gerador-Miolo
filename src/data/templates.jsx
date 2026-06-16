import DiaCompleto from "../components/layouts/DiaCompleto";
import SemanalLayout from "../components/layouts/SemanalLayout";
import TarefasLayout from "../components/layouts/TarefasLayout";
import DadosPessoaisLayout from "../components/layouts/DadosPessoaisLayout";
import CalendarioLayout from "../components/layouts/CalendarioLayout";
import { MdCalendarToday } from "react-icons/md";
import { gerarDiasDoMes, gerarDiasDoAno } from "../utils/agendaUtils";

export const TEMPLATES = {
  diario: {
    nome: "Diário",
    layout: (
      footerName,
      selectedDate,
      printing = false,
      colorTheme = "slate",
      logo,
      footerType = "default",
    ) => {
      const [y, m, d] = selectedDate.split("-").map(Number);
      const data = new Date(y, m - 1, d);

      if (!printing) {
        return (
          <DiaCompleto
            data={data}
            footerName={footerName}
            colorTheme={colorTheme}
            logo={logo}
            footerType={footerType}
          />
        );
      }

      return (
        <div className="print-container">
          <div className="page-break">
            <DiaCompleto
              data={data}
              footerName={footerName}
              colorTheme={colorTheme}
              logo={logo}
              footerType={footerType}
            />
          </div>
        </div>
      );
    },
  },
  mensalCompleto: {
    nome: "Mensal (completo)",
    layout: (
      footerName,
      selectedDate,
      printing = false,
      colorTheme = "slate",
      logo,
      footerType = "default",
    ) => {
      const [y, m] = selectedDate.split("-").map(Number);
      const data = new Date(y, m - 1, 1);
      const dias = gerarDiasDoMes(y, m - 1);

      if (!printing) {
        return (
          <div className="max-w-[210mm] mx-auto p-12 text-center flex flex-col justify-between min-h-[250mm]">
            <div className="my-auto">
              <MdCalendarToday className="mx-auto text-gray-300 w-10 h-10 mb-3" />
              <p className="text-md font-light text-gray-700">
                Agenda Mensal:{" "}
                <span className="font-semibold capitalize">
                  {data.toLocaleDateString("pt-BR", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Contém {dias.length} páginas formatadas para impressão
                consecutiva (Tema:{" "}
                <span className="uppercase font-bold">{colorTheme}</span>).
              </p>
            </div>
          </div>
        );
      }

      return (
        <div className="print-container">
          {dias.map((dia, i) => (
            <div key={i} className="page-break">
              <DiaCompleto
                data={dia}
                footerName={footerName}
                colorTheme={colorTheme}
                logo={logo}
                footerType={footerType}
              />
            </div>
          ))}
        </div>
      );
    },
  },
  anualCompleto: {
    nome: "Anual (completo)",
    layout: (
      footerName,
      selectedDate,
      printing = false,
      colorTheme = "slate",
      logo,
      footerType = "default",
    ) => {
      const [y] = selectedDate.split("-").map(Number);
      const dias = gerarDiasDoAno(y);

      if (!printing) {
        return (
          <div className="max-w-[210mm] mx-auto p-12 text-center flex flex-col justify-between min-h-[250mm]">
            <div className="my-auto">
              <MdCalendarToday className="mx-auto text-gray-300 w-10 h-10 mb-3" />
              <p className="text-md font-light text-gray-700">
                Miolo de Agenda Anual Completo — Ano {y}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Contém {dias.length} páginas consecutivas otimizadas para
                PDF/Impressora (Tema:{" "}
                <span className="uppercase font-bold">{colorTheme}</span>).
              </p>
            </div>
          </div>
        );
      }

      return (
        <div className="print-container">
          {dias.map((dia, i) => (
            <div key={i} className="page-break">
              <DiaCompleto
                data={dia}
                footerName={footerName}
                colorTheme={colorTheme}
                logo={logo}
                footerType={footerType}
              />
            </div>
          ))}
        </div>
      );
    },
  },
  semanal: {
    nome: "Semanal",
    layout: (
      footerName,
      selectedDate,
      printing = false,
      colorTheme = "slate",
      logo,
      footerType = "default",
    ) => {
      if (!printing) {
        return (
          <SemanalLayout
            footerName={footerName}
            colorTheme={colorTheme}
            logo={logo}
            footerType={footerType}
          />
        );
      }
      return (
        <div className="print-container">
          <div className="page-break">
            <SemanalLayout
              footerName={footerName}
              colorTheme={colorTheme}
              logo={logo}
              footerType={footerType}
            />
          </div>
        </div>
      );
    },
  },
  tarefas: {
    nome: "Lista de Tarefas",
    layout: (
      footerName,
      selectedDate,
      printing = false,
      colorTheme = "slate",
      logo,
      footerType = "default",
    ) => {
      if (!printing) {
        return (
          <TarefasLayout
            footerName={footerName}
            colorTheme={colorTheme}
            logo={logo}
            footerType={footerType}
          />
        );
      }
      return (
        <div className="print-container">
          <div className="page-break">
            <TarefasLayout
              footerName={footerName}
              colorTheme={colorTheme}
              logo={logo}
              footerType={footerType}
            />
          </div>
        </div>
      );
    },
  },
  dadosPessoais: {
    nome: "Dados Pessoais",
    layout: (
      footerName,
      selectedDate,
      printing = false,
      colorTheme = "slate",
      logo,
      footerType = "default",
    ) => {
      if (!printing) {
        return (
          <DadosPessoaisLayout
            footerName={footerName}
            colorTheme={colorTheme}
            logo={logo}
            footerType={footerType}
          />
        );
      }
      return (
        <div className="print-container">
          <div className="page-break">
            <DadosPessoaisLayout
              footerName={footerName}
              colorTheme={colorTheme}
              logo={logo}
              footerType={footerType}
            />
          </div>
        </div>
      );
    },
  },
  calendarios: {
    nome: "Calendários",
    layout: (
      footerName,
      selectedDate,
      printing = false,
      colorTheme = "slate",
      logo,
      footerType = "default",
    ) => {
      const anoBase = parseInt(selectedDate.split("-")[0], 10);
      const anos = [anoBase, anoBase + 1, anoBase + 2];

      if (!printing) {
        return (
          <CalendarioLayout
            ano={anoBase}
            footerName={footerName}
            colorTheme={colorTheme}
            logo={logo}
            footerType={footerType}
          />
        );
      }

      return (
        <div className="print-container">
          {anos.map((ano) => (
            <div key={ano} className="page-break">
              <CalendarioLayout
                ano={ano}
                footerName={footerName}
                colorTheme={colorTheme}
                logo={logo}
                footerType={footerType}
              />
            </div>
          ))}
        </div>
      );
    },
  },
};
