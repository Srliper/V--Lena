# Domínio: padaria-lanchonete-vo-lena.com.br

## 1. Vercel (site / cardápio)

1. Faça deploy: `npm run vercel` (ou `scripts\vercel.cmd` no CMD com SSL).
2. No painel [Vercel](https://vercel.com) → projeto → **Settings** → **Domains**.
3. Adicione:
   - `padaria-lanchonete-vo-lena.com.br`
   - `www.padaria-lanchonete-vo-lena.com.br` (redireciona para o domínio sem www)
4. No registrador do domínio (.com.br), configure os DNS que a Vercel mostrar, por exemplo:
   - **A** `@` → `76.76.21.21`
   - **CNAME** `www` → `cname.vercel-dns.com`

Aguarde propagação (minutos a algumas horas). O `vercel.json` já trata SPA e proxy `/api`.

## 2. API (pedidos + admin)

O site chama a API em `https://api.padaria-lanchonete-vo-lena.com.br` (proxy no `vercel.json`).

Hospede o servidor Node (`server/index.js`) em **Render**, **Railway** ou VPS e aponte:

- **CNAME** `api` → URL do host (ex.: `seu-app.onrender.com`)

No servidor (variáveis de ambiente):

| Variável | Valor |
|----------|--------|
| `ADMIN_PASSWORD` | sua senha do `/admin` |
| `ADMIN_TOKEN_SECRET` | string aleatória longa |
| `MERCADOPAGO_ACCESS_TOKEN` | Access Token de **produção** (painel Mercado Pago) |
| `MERCADOPAGO_FRONTEND_URL` | `https://padaria-lanchonete-vo-lena.com.br` |
| `PORT` | (Render define automaticamente; o servidor já usa) |

SQLite: no Render, ative **Persistent Disk** em `server/data` para não perder pedidos.

## Mercado Pago (último passo)

1. Acesse https://www.mercadopago.com.br/developers/panel/app  
2. Sua aplicação → **Credenciais de produção** → copie o **Access Token** (começa com `APP_USR-...`).  
3. Cole **somente na API** (Render/Railway), variável `MERCADOPAGO_ACCESS_TOKEN` — **não** na Vercel.  
4. `MERCADOPAGO_FRONTEND_URL=https://padaria-lanchonete-vo-lena.com.br`  
5. Salve e reinicie o serviço da API.

Sem o token, o site e o WhatsApp funcionam; só o botão **“Pagar agora online”** fica indisponível.

## 3. Build de produção

O arquivo `.env.production` define:

`VITE_API_URL=https://padaria-lanchonete-vo-lena.com.br`

Assim o front usa o mesmo domínio; as rotas `/api/*` vão para o subdomínio `api`.

## 4. Testar

- Site: https://padaria-lanchonete-vo-lena.com.br  
- API: https://api.padaria-lanchonete-vo-lena.com.br/api/health  
- Admin: https://padaria-lanchonete-vo-lena.com.br/admin  
