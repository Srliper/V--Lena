# Lanchonete Vo Lena

Aplicacao web com cardapio, carrinho e fluxo de delivery com painel administrativo.

## Stack
- Frontend: React + Vite + TypeScript
- Backend API: Node.js + Express
- Persistencia: **SQLite** em `server/data/orders.db` (migra automaticamente de `server/data/orders.json` na primeira execucao se o banco estiver vazio)

## Rodando localmente
1. Instale dependencias:
   - `npm install`
2. Crie o `.env` a partir de `.env.example` (opcional no local)
3. Inicie frontend + API:
   - `npm run dev`
4. Acesse:
   - Frontend: `http://localhost:8080`
   - API: `http://localhost:3001/api/health`
5. Painel `/admin`: senha em `ADMIN_PASSWORD` no `.env` da API (padrao local em `.env.example`: `7778`). Em producao use senha forte e `ADMIN_TOKEN_SECRET` aleatorio.

## Como o delivery funciona
- Cliente finaliza pedido no carrinho.
- Frontend envia `POST /api/orders` para API.
- API salva o pedido e retorna ID.
- Admin lista pedidos em tempo real por polling e atualiza status via `PATCH /api/orders/:id/status`.
- Checkout ainda abre WhatsApp do fornecedor com o resumo para operacao imediata.
- Opcional: **Mercado Pago** no carrinho ("Pagar agora online") — PIX e cartões pelo checkout oficial. Configure no servidor `MERCADOPAGO_ACCESS_TOKEN` e `MERCADOPAGO_FRONTEND_URL` (URL publica do site, ex.: Vercel). Retorno em `/checkout/retorno`.

## Deploy (versao final)

### 1) Deploy da API
Suba a pasta inteira em um host Node (Render, Railway, VPS, etc.) e configure:
- Comando de start: `npm run start:api`
- Variavel: `API_PORT` (opcional, padrao 3001)
- `ADMIN_PASSWORD` — obrigatorio definir na producao (lista de pedidos e alteracao de status exigem login + token)
- Se usar pagamento online: `MERCADOPAGO_ACCESS_TOKEN`, `MERCADOPAGO_FRONTEND_URL` (URL do frontend em producao)

Observacao importante: em hospedagens **sem disco persistente** (ex.: dyno free sem volume), o arquivo `orders.db` pode sumir a cada deploy — use **disco persistente** no host ou migre para **Postgres/Supabase** se precisar de historico garantido na nuvem.

O painel `/admin` **nao** depende do Mercado Pago: basta API no ar, `ADMIN_PASSWORD` e login com a senha (ex.: `7778` no local). Mercado Pago so afeta "Pagar agora online".

### 2) Deploy do Frontend
No Vercel/Netlify:
- Build command: `npm run build`
- Output dir: `dist`
- Variavel de ambiente obrigatoria:
  - `VITE_API_URL=https://padaria-lanchonete-vo-lena.com.br` (ou subdomínio `api.` — ver `DEPLOY-DOMINIO.md`)

### 3) Fluxo em producao
- Cliente cria pedido -> API persiste -> Admin enxerga e atualiza status.
- Fornecedor recebe resumo no WhatsApp para operacao e despacho.

## Endpoints da API
- `GET /api/health`
- `POST /api/auth/admin-login` — body `{ "password": "..." }` → `{ ok, token }`
- `GET /api/orders` — header **Authorization: Bearer** + token retornado no login (sessao admin)
- `POST /api/orders`
- `PATCH /api/orders/:id/status` — **Bearer token** admin
- `POST /api/orders` — publico (checkout cliente)
- `POST /api/webhooks/pedidos-automation` — recebe JSON do pedido e envia WhatsApp (cliente + dono) via Evolution API (`EVOLUTION_API_KEY`, `EVOLUTION_API_URL`, `EVOLUTION_INSTANCE` no `.env`)
- `POST /api/payments/mercadopago/preference` — cria Checkout Pro do Mercado Pago (credenciais `MERCADOPAGO_ACCESS_TOKEN` + `MERCADOPAGO_FRONTEND_URL`)
