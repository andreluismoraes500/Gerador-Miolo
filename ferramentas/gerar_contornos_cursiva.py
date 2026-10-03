#!/usr/bin/env python3
"""
Gera contornosCursiva.js (modelo sólido das letras) a partir de uma fonte .ttf.
Uso:   python3 gerar_contornos_cursiva.py fonte.ttf saida/contornosCursiva.js
Requer: pip install fonttools
"""
import sys, re
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

ttf, saida = sys.argv[1], sys.argv[2]
f = TTFont(ttf); gs = f.getGlyphSet(); cm = f.getBestCmap()
assert f["head"].unitsPerEm == 1000, "ajuste a escala se a fonte não for 1000 upm"
js = "// GERADO AUTOMATICAMENTE por ferramentas/gerar_contornos_cursiva.py\nexport const CONTORNOS_CURSIVA = {\n"
for c in "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz":
    pen = SVGPathPen(gs)
    gs[cm[ord(c)]].draw(TransformPen(pen, (1, 0, 0, -1, 0, 0)))  # y negativo = acima da linha de base
    d = re.sub(r"-?\d+\.\d+", lambda m: str(round(float(m.group(0)))), pen.getCommands())
    js += f'  {c}: "{d}",\n'
js += "};\n"
open(saida, "w", encoding="utf8").write(js)
print("ok ->", saida)
