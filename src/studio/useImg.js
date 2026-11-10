import { useEffect, useState } from "react";

const cache = new Map();
export function carregarImg(src) {
  if (!src) return Promise.resolve(null);
  if (!cache.has(src)) cache.set(src, new Promise((ok) => { const i = new Image(); i.crossOrigin = "anonymous"; i.onload = () => ok(i); i.onerror = () => ok(null); i.src = src; }));
  return cache.get(src);
}
export function useImg(src) {
  const [img, setImg] = useState(null);
  useEffect(() => { let vivo = true; carregarImg(src).then((i) => vivo && setImg(i)); return () => { vivo = false; }; }, [src]);
  return img;
}

// Lê um arquivo e reduz para no máximo `max` px (economiza memória e armazenamento).
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
        ok({ src: file.type === "image/jpeg" ? cv.toDataURL("image/jpeg", 0.9) : cv.toDataURL("image/png"), w: cv.width, h: cv.height, nome: file.name });
      };
      i.src = fr.result;
    };
    fr.readAsDataURL(file);
  });
}
