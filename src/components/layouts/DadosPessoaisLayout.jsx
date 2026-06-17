import {
  MdPersonOutline,
  MdOutlineBusinessCenter,
  MdOutlineEmergencyShare,
} from "react-icons/md";
import Footer from "../Footer";
import { TEMAS } from "../../themes";
import Logo from "../Logo";

export default function DadosPessoaisLayout({
  footerName,
  colorTheme = "classico",
  logo,
  footerType = "default",
  businessType = "manicure",
}) {
  const tema = TEMAS[colorTheme] || TEMAS.classico;

  return (
    <div className="printable-page bg-white font-sans text-gray-900 flex flex-col justify-between box-border select-none border-0 shadow-none rounded-none">
      <div className="flex flex-col flex-1 min-h-0 justify-center max-w-xl mx-auto w-full px-4 space-y-10">
        {/* Logo e Título */}
        <div className="text-center space-y-2">
          {logo && (
            <div className="flex justify-center mb-2">
              <Logo src={logo} className="h-12" />
            </div>
          )}
          <h2
            className={`text-2xl font-light tracking-widest text-gray-900 uppercase ${tema.headingFont}`}
          >
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
                <span
                  className={`text-xs font-medium text-gray-600 shrink-0 min-w-16 ${tema.bodyFont}`}
                >
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
                <span
                  className={`text-xs font-medium text-gray-600 shrink-0 min-w-32 ${tema.bodyFont}`}
                >
                  {campo}
                </span>
                <div className="border-b border-solid border-gray-200 w-full h-5"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Seção 3: Emergência */}
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
              <span
                className={`text-xs font-medium text-gray-600 shrink-0 ${tema.bodyFont}`}
              >
                Avisar a:
              </span>
              <div className="border-b border-solid border-gray-300 w-full h-5"></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-end gap-3 w-full">
                <span
                  className={`text-xs font-medium text-gray-600 shrink-0 ${tema.bodyFont}`}
                >
                  Telefone:
                </span>
                <div className="border-b border-solid border-gray-300 w-full h-5"></div>
              </div>
              <div className="flex items-end gap-3 w-full">
                <span
                  className={`text-xs font-medium text-gray-600 shrink-0 ${tema.bodyFont}`}
                >
                  Grupo Sanguíneo:
                </span>
                <div className="border-b border-solid border-gray-300 w-full h-5"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer
        name={footerName}
        type={footerType}
        colorTheme={colorTheme}
        businessType={businessType}
      />
    </div>
  );
}
