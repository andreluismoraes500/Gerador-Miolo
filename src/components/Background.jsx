// src/components/Background.jsx
//
// Imagem de fundo em tela cheia da página impressa — mesmo espírito do
// componente Watermark (marca d'água), mas cobrindo a página inteira em vez
// de um ícone central discreto. Fica sempre atrás de todo o conteúdo.

export default function Background({ src, opacity = 1 }) {
  if (!src) return null;
  return (
    <div
      className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
      style={{ backgroundImage: `url(${src})`, opacity }}
      aria-hidden="true"
    />
  );
}
