// Ajuste automático de imagem: por padrão a imagem aparece INTEIRA na área (sem cortar o logo)
// e o espaço que sobra é preenchido com a cor do canto da própria imagem.
export const AJ_PADRAO = { modo: "inteira", zoom: 1, x: 0, y: 0 };

export function corDoCanto(src) {
  return new Promise((ok) => {
    const im = new Image();
    im.onload = () => {
      try {
        const c = document.createElement("canvas");
        c.width = 4; c.height = 4;
        const x = c.getContext("2d");
        x.drawImage(im, 0, 0, 4, 4);
        const [r, g, b, a] = x.getImageData(0, 0, 1, 1).data;
        ok(a < 40 ? "" : `rgb(${r},${g},${b})`);
      } catch { ok(""); }
    };
    im.onerror = () => ok("");
    im.src = src;
  });
}
