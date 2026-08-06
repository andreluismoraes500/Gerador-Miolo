# Setup — Front-end (Vite + React)

Este projeto agora é 100% front-end. O PDF é gerado pelo próprio
navegador: o botão "Baixar PDF" (e "Gerar e imprimir", no Talonário)
chama `window.print()` e o usuário escolhe **"Salvar como PDF"** na
janela de impressão do navegador.

(A versão anterior tinha uma API Express + fila BullMQ/Redis + worker
Puppeteer + microserviço na Vercel para gerar o PDF no servidor. Esse
pipeline inteiro foi removido por decisão do time — geração 100% client-side.)

## Rodando localmente

```
npm install
npm run dev
```

Abre em http://localhost:5173.

## Build de produção

```
npm run build
npm run preview   # opcional, para testar o build localmente
```

`npm run build` gera a pasta `dist/` — sirva com qualquer host de
arquivos estáticos (Vercel, Netlify, Render Static Site, etc).
