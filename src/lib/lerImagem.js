// Lê um arquivo de imagem e reduz para no máximo `max` px (economiza memória).
export function lerImagem(file, max = 1600) {
  return new Promise((ok, erro) => {
    const fr = new FileReader();
    fr.onerror = erro;
    fr.onload = () => {
      const i = new Image();
      i.onerror = erro;
      i.onload = () => {
        const k = Math.min(1, max / Math.max(i.width, i.height));
        const cv = document.createElement("canvas");
        cv.width = Math.round(i.width * k); cv.height = Math.round(i.height * k);
        cv.getContext("2d").drawImage(i, 0, 0, cv.width, cv.height);
        ok(file.type === "image/png" ? cv.toDataURL("image/png") : cv.toDataURL("image/jpeg", 0.9));
      };
      i.src = fr.result;
    };
    fr.readAsDataURL(file);
  });
}
