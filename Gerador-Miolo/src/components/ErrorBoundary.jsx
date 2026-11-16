// src/components/ErrorBoundary.jsx
//
// Rede de segurança: se qualquer página lançar um erro não tratado durante
// a renderização (ex.: um bug futuro, uma tween do GSAP mexendo em algo que
// já sumiu, etc.), o React por padrão desmonta a ÁRVORE INTEIRA e a tela
// fica em branco — como aconteceu com o crash da Sobre. Um Error Boundary
// contém o estrago dentro da página que quebrou, mostra uma mensagem
// amigável com opção de tentar de novo ou recarregar, e — o mais importante
// — é usado em AppLayout.jsx com `key={location.pathname}`, então ele reseta
// sozinho sempre que o usuário navega pra outra rota. Ou seja: mesmo que uma
// página quebre, dá pra continuar usando o resto do app sem precisar de F5.

import { Component } from "react";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error("[ErrorBoundary] Erro capturado:", error, info?.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-md mx-auto my-16 p-8 text-center bg-[#FBF8F1] border border-[#D8CBA8] rounded-2xl flex flex-col items-center gap-3">
          <p className="text-sm font-semibold text-[#24344D]">
            Algo deu errado ao carregar esta página.
          </p>
          <p className="text-xs text-[#6B6458]">
            Isso pode acontecer se a página estiver em atualização. Tente
            novamente ou recarregue.
          </p>
          <div className="flex gap-3 mt-1">
            <button
              type="button"
              onClick={() => this.setState({ hasError: false })}
              className="text-xs font-semibold text-[#8B6A1F] underline underline-offset-2 hover:text-[#6B4F10]"
            >
              Tentar novamente
            </button>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="text-xs font-semibold text-[#8B6A1F] underline underline-offset-2 hover:text-[#6B4F10]"
            >
              Recarregar página
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
