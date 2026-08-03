# Setup — Local e Produção (fila em memória, sem Redis)

## Arquitetura atual

```
Navegador do usuário
   │  POST /api/generate  (state completo + template/módulos)
   ▼
api/generate.js
   │  cria o job na fila EM MEMÓRIA (api/_lib/memoryQueue.js)
   │  responde na hora: { jobId, position }
   ▼
Fila em memória (dentro do próprio processo Node)
   │  concurrency: 1 → processa 1 PDF por vez, em ordem de chegada (FIFO)
   │  (o processamento roda no MESMO processo, sem worker separado)
   ▼
Navegador do usuário faz polling:
   GET /api/status/:jobId  → posição na fila / "gerando..." / concluído
   GET /api/result/:jobId  → baixa o PDF quando pronto
```

Sem Redis, sem BullMQ, sem serviço externo — a fila é só um array em
memória dentro do processo Node (`api/_lib/memoryQueue.js`), processado
um job de cada vez (`concurrency: 1`), que é o que garante o
comportamento FIFO: quem pediu primeiro, sai primeiro, sem dois
Chromiums disputando CPU/memória ao mesmo tempo.

## ⚠️ Por que isso muda como o deploy funciona

Uma fila em memória só existe **dentro de um processo que fica rodando**.
Isso tem uma consequência direta:

- ✅ **Funciona perfeitamente** com `node server/index.js` rodando local
  ou em qualquer host "always-on" (Railway, Render, Fly.io, um VPS com
  pm2/systemd).
- ❌ **Não funciona de forma confiável em funções serverless da Vercel.**
  Cada requisição pode cair numa instância diferente (ou numa nova, em
  "cold start"), e a Vercel pode inclusive congelar a execução assim que
  a resposta HTTP é enviada — o job ficaria "processando" para sempre e
  nunca terminaria, e o próximo `GET /api/status/:id` poderia cair numa
  instância que nunca viu aquele job.

**Por isso, a partir de agora, a forma recomendada de rodar isso em
produção é como UM ÚNICO SERVIÇO NODE PERSISTENTE** — o mesmo processo
Express serve o front-end (já buildado) e a API/fila juntos. Nada de
Vercel para o backend neste modelo. Se um dia a demanda justificar rodar
em múltiplas instâncias ao mesmo tempo, aí sim vale voltar para
Redis+BullMQ (fica registrado como próximo passo natural de escala).

## Rodando localmente

```bash
cp .env.example .env
npm install
npm run dev:all
```

Isso sobe dois processos:
- Front-end (Vite): http://localhost:5173
- Backend (Express, já com a fila embutida): http://localhost:3000 — o
  Vite já faz proxy de `/api/*` para lá (`vite.config.js`)

Teste pela UI: escolha "Montagem Completa" + combo "Universitário",
clique em "Baixar PDF (backend)". Deve aparecer "Na fila...", depois
"Gerando seu PDF...", e o arquivo baixado deve ficar **idêntico** ao
"Imprimir (navegador)".

### Testando a fila FIFO

Abra várias abas e clique em "Baixar PDF" quase ao mesmo tempo em todas.
Como o processamento é `concurrency: 1`, os toasts vão mostrar "posição
2", "posição 3" etc., e cada PDF é gerado em ordem de chegada.

## Deploy em produção (Railway, Render, Fly.io ou VPS)

A ideia é rodar **um único serviço** que faz build do front-end e depois
sobe o Express servindo tudo:

1. Configure a variável de ambiente `FRONTEND_URL` no host escolhido
   com o próprio domínio público do serviço (ex:
   `https://minhaagenda.up.railway.app`) — é para lá que o Puppeteer,
   rodando dentro do mesmo serviço, vai apontar para renderizar o
   `/preview`.
2. Comando de build: `npm install && npm run build`
3. Comando de start: `node server/index.js`
   (ele detecta a pasta `dist/` e passa a servir o front-end junto com a
   API automaticamente — ver o bloco de `express.static` no final de
   `server/index.js`)
4. A porta é lida de `process.env.PORT` (a maioria desses hosts já
   define isso sozinha).

Isso é tudo — não precisa configurar Redis, worker separado, nem dividir
front-end e backend em serviços diferentes.

### E se eu ainda quiser usar a Vercel para alguma coisa?

Dá para usar a Vercel só para o front-end estático, mas nesse caso o
botão "Baixar PDF (backend)" precisaria apontar para o domínio do
serviço persistente (Railway/Render) em vez de `/api/generate` relativo,
e você precisaria liberar CORS para o domínio da Vercel em
`server/index.js`. Funciona, mas para o seu caso (evitar peças extras de
infraestrutura) o caminho de serviço único acima é bem mais simples — eu
recomendo esse.

## Se o PDF ainda sair diferente do navegador

Isso é resolvido pela hidratação de estado (`src/utils/agendaStateSnapshot.js`
+ `src/bootstrap/hydrateFromServer.js`), que roda independente da fila
usar Redis ou memória. Se acontecer, o candidato mais provável é alguma
configuração nova guardada fora do padrão
`usePersistedState("agenda-...", ...)` — `captureAgendaState()` só
enxerga chaves com esse prefixo.