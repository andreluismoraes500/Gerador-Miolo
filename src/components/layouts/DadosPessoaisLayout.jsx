import {
  MdPersonOutline,
  MdOutlineBusinessCenter,
  MdOutlineEmergencyShare,
} from "react-icons/md";
import Footer from "../Footer";

const PALETAS = {
  slate: {
    border: "border-slate-300",
    text: "text-slate-600",
    headerBorder: "border-slate-900",
    bgLight: "bg-slate-50/50",
  },
  zinc: {
    border: "border-zinc-300",
    text: "text-zinc-600",
    headerBorder: "border-zinc-900",
    bgLight: "bg-zinc-50/50",
  },
  blue: {
    border: "border-blue-200",
    text: "text-blue-600",
    headerBorder: "border-blue-700",
    bgLight: "bg-blue-50/30",
  },
  emerald: {
    border: "border-emerald-200",
    text: "text-emerald-600",
    headerBorder: "border-emerald-700",
    bgLight: "bg-emerald-50/30",
  },
  amber: {
    border: "border-amber-200",
    text: "text-amber-600",
    headerBorder: "border-amber-700",
    bgLight: "bg-amber-50/30",
  },
  rose: {
    border: "border-rose-200",
    text: "text-rose-600",
    headerBorder: "border-rose-700",
    bgLight: "bg-rose-50/30",
  },
};

export default function DadosPessoaisLayout({
  footerName,
  colorTheme = "slate",
}) {
  const tema = PALETAS[colorTheme] || PALETAS.slate;

  return (
    <div className="printable-page bg-white font-sans text-gray-900 flex flex-col justify-between box-border select-none border-0 shadow-none rounded-none">
      <div className="flex flex-col flex-1 min-h-0 justify-center max-w-xl mx-auto w-full px-4 space-y-10">
        {/* Bloco de Título de Abertura */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-light tracking-widest text-gray-900 uppercase font-serif italic">
            Esta agenda pertence a:
          </h2>
          <div
            className={`w-16 h-0.5 mx-auto ${tema.headerBorder.replace("border-", "bg-")}`}
          ></div>
        </div>

        {/* Seção 1: Dados Pessoais */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b pb-1 border-gray-100">
            <MdPersonOutline className={`w-4 h-4 ${tema.text}`} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Dados Pessoais
            </span>
          </div>
          <div className="space-y-4">
            {["Nome:", "Telefone:", "E-mail:", "Endereço:"].map((campo) => (
              <div key={campo} className="flex items-end gap-3 w-full">
                <span className="text-xs font-serif italic font-medium text-gray-600 shrink-0 min-w-16">
                  {campo}
                </span>
                <div className="border-b border-solid border-gray-200 w-full h-5"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Seção 2: Dados Comerciais */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b pb-1 border-gray-100">
            <MdOutlineBusinessCenter className={`w-4 h-4 ${tema.text}`} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Comercial / Profissional
            </span>
          </div>
          <div className="space-y-4">
            {[
              "Empresa:",
              "Cargo / Função:",
              "Contato Profissional:",
              "Redes Sociais:",
            ].map((campo) => (
              <div key={campo} className="flex items-end gap-3 w-full">
                <span className="text-xs font-serif italic font-medium text-gray-600 shrink-0 min-w-32">
                  {campo}
                </span>
                <div className="border-b border-solid border-gray-200 w-full h-5"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Seção 3: Em Caso de Emergência */}
        <div
          className={`border border-solid ${tema.border} rounded-sm p-4 ${tema.bgLight} space-y-4`}
        >
          <div className="flex items-center gap-2 border-b pb-1 border-gray-200">
            <MdOutlineEmergencyShare className="w-4 h-4 text-red-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-800">
              Em Caso de Emergência
            </span>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-end gap-3 w-full">
              <span className="text-xs font-serif italic font-medium text-gray-600 shrink-0">
                Avisar a:
              </span>
              <div className="border-b border-solid border-gray-300 w-full h-5"></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-end gap-3 w-full">
                <span className="text-xs font-serif italic font-medium text-gray-600 shrink-0">
                  Telefone:
                </span>
                <div className="border-b border-solid border-gray-300 w-full h-5"></div>
              </div>
              <div className="flex items-end gap-3 w-full">
                <span className="text-xs font-serif italic font-medium text-gray-600 shrink-0">
                  Grupo Sanguíneo:
                </span>
                <div className="border-b border-solid border-gray-300 w-full h-5"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rodapé Padrão */}
      <Footer name={footerName} />
    </div>
  );
}
