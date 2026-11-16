#!/usr/bin/env python3
"""
Gera src/components/layouts/caligrafia/pontosCursiva.js a partir de uma fonte .ttf.

Uso:   python3 gerar_pontos_cursiva.py caminho/da/fonte.ttf saida/pontosCursiva.js
Requer: pip install pillow scikit-image skan scipy fonttools

Para a Playwrite CL: baixe `@fontsource/playwrite-cl` (npm) e converta o .woff
para .ttf com fontTools (TTFont(...).flavor=None; .save(...)).
Se trocar de fonte, atualize também FONTE_CURSIVA e METRICAS_CURSIVA em base.jsx
e o @import em print.css.
"""
import sys, json
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from skimage.morphology import skeletonize
from scipy.ndimage import gaussian_filter
from skan import Skeleton
from fontTools.ttLib import TTFont

S, OX, OY, W, H = 1000, 800, 1500, 2800, 2400
ESP = 0.056  # espaçamento entre pontos, em "em"

def pontos(ttf, ch):
    ft = ImageFont.truetype(ttf, S)
    im = Image.new("L", (W, H), 0)
    ImageDraw.Draw(im).text((OX, OY), ch, font=ft, fill=255, anchor="ls")
    sk = skeletonize(gaussian_filter(np.array(im).astype(float), 2) > 127)
    if sk.sum() < 5:
        return []
    s = Skeleton(sk, keep_images=False)
    pts, mind = [], ESP * S * 0.62
    for i in range(s.n_paths):
        p = s.path_coordinates(i)
        if len(p) < 2:
            continue
        d = np.r_[0, np.cumsum(np.hypot(*np.diff(p, axis=0).T))]
        n = max(1, int(round(d[-1] / (ESP * S))))
        for t in np.linspace(0, d[-1], n + 1):
            y, x = np.interp(t, d, p[:, 0]), np.interp(t, d, p[:, 1])
            if all((x - q[0]) ** 2 + (y - q[1]) ** 2 >= mind ** 2 for q in pts):
                pts.append((x, y))
    return [[round((x - OX) / S * 1000), round((y - OY) / S * 1000)] for x, y in pts]

ttf, saida = sys.argv[1], sys.argv[2]
letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
f = TTFont(ttf); cm = f.getBestCmap(); upm = f["head"].unitsPerEm
adv = {c: round(f["hmtx"][cm[ord(c)]][0] / upm, 3) for c in letras}
js = "// GERADO AUTOMATICAMENTE por ferramentas/gerar_pontos_cursiva.py\n"
js += f"export const ADV_CURSIVA = {json.dumps(adv, separators=(',', ':'))};\n\nexport const PONTOS_CURSIVA = {{\n"
for c in letras:
    flat = [v for xy in pontos(ttf, c) for v in xy]
    js += f"  {c}: [{','.join(map(str, flat))}],\n"
js += "};\n"
open(saida, "w", encoding="utf8").write(js)
print("ok ->", saida)
