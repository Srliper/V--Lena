# Lanchonete Vo Lena

Aplicacao web com cardapio, carrinho e fluxo de delivery com painel administrativo.

## Stack
- Frontend: React + Vite + TypeScript
- Backend API: Node.js + Express
- Persistencia: arquivo JSON em `server/data/orders.json`

## Rodando localmente
1. Instale dependencias:
   - `npm install`
2. Crie o `.env` a partir de `.env.example` (opcional no local)
3. Inicie frontend + API:
   - `npm run dev`
4. Acesse:
   - Frontend: `http://localhost:8080`
   - API: `http://localhost:3001/api/health`

## Como o delivery funciona
- Cliente finaliza pedido no carrinho.
- Frontend envia `POST /api/orders` para API.
- API salva o pedido e retorna ID.
- Admin lista pedidos em tempo real por polling e atualiza status via `PATCH /api/orders/:id/status`.
- Checkout ainda abre WhatsApp do fornecedor com o resumo para operacao imediata.

## Deploy (versao final)

### 1) Deploy da API
Suba a pasta inteira em um host Node (Render, Railway, VPS, etc.) e configure:
- Comando de start: `npm run start:api`
- Variavel: `API_PORT` (opcional, padrao 3001)

Observacao importante: em hospedagens sem disco persistente, use banco de dados (Postgres/Supabase) no lugar de `orders.json`.

### 2) Deploy do Frontend
No Vercel/Netlify:
- Build command: `npm run build`
- Output dir: `dist`
- Variavel de ambiente obrigatoria:
  - `VITE_API_URL=https://SUA-API.com`

### 3) Fluxo em producao
- Cliente cria pedido -> API persiste -> Admin enxerga e atualiza status.
- Fornecedor recebe resumo no WhatsApp para operacao e despacho.

## Endpoints da API
- `GET /api/health`
- `GET /api/orders`
- `POST /api/orders`
- `PATCH /api/orders/:id/status`
