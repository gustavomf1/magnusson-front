# Design — magnossao-backoffice

**Data:** 2026-06-09  
**Status:** Aprovado

## Contexto

O `magnossao-frontend` acumula tanto a loja do cliente quanto o painel admin. O objetivo é extrair o painel admin para um app Next.js separado (`magnossao-backoffice`), eliminando acoplamento entre as duas superfícies e permitindo arquitetura de segurança independente.

## Estrutura de diretórios

```
/home/mag/Documents/magnossao-loja/
  magnossao-backend/
  magnossao-frontend/       ← loja do cliente (sem /admin)
  magnossao-backoffice/     ← painel admin (novo)
  magnossao-docs/
```

## Abordagem de criação

Copiar `magnossao-frontend` como base e remover tudo que não é admin. Preserva stack idêntico (Next.js 15.1, React 19, TypeScript 5.7 strict, Tailwind 3.4, design system com paleta navy/gold e fontes Cinzel/Cormorant).

## Arquitetura do backoffice

### Camadas

```
src/
  app/
    layout.tsx          ← root layout: só AuthProvider, sem SiteHeader/CartProvider
    login/
      page.tsx          ← única rota pública
    (admin)/            ← route group protegido
      layout.tsx        ← sidebar + auth guard
      page.tsx          ← dashboard / produtos
      estoque/page.tsx
      pedidos/page.tsx
      cashback/page.tsx
      produtos/
        novo/page.tsx
        [id]/page.tsx
  middleware.ts         ← proteção server-side de todas as rotas (exceto /login)
  components/
    admin/              ← product-form, image-uploader
    auth/
      login-form.tsx
    ui/
      primitives.tsx
  contexts/
    auth-context.tsx    ← sem CartProvider nem SiteHeader
  services/             ← cópia dos serviços relevantes do frontend
    auth.ts
    products.ts
    estoque.ts
    pedidos.ts
    cashback.ts
    estornos.ts
  lib/
    api.ts
    cn.ts
    format.ts
  types/
    product.ts
    pedido.ts
    cupom.ts
    endereco.ts
```

### Segurança

A autenticação usa `credentials: 'include'` com cookie httpOnly gerenciado pelo backend Java. Não há JWT decodificável no frontend — a validade da sessão só pode ser confirmada pelo backend via `GET /api/auth/me`.

**Duas camadas de proteção — ambas obrigatórias:**

1. **Middleware (`src/middleware.ts`) — server-side, primeira linha de defesa**
   - Intercepta toda requisição antes de chegar ao React
   - Chama `GET ${NEXT_PUBLIC_API_URL}/api/auth/me` com o cookie da requisição (`Cookie` header repassado)
   - Se o backend retornar 401/erro → redirect 307 para `/login`
   - Se retornar usuário com `role !== 'ADMIN'` → redirect 307 para `/login`
   - Única rota pública: `/login` (e assets estáticos `/_next/*`, `/favicon.ico`)
   - Impede que qualquer página admin seja renderizada sem sessão válida no backend, mesmo com JS desabilitado

2. **Auth guard no layout `(admin)/layout.tsx` — client-side, segunda camada**
   - Mantém o `useEffect` que verifica `usuario.role === 'ADMIN'`
   - Protege contra mudanças de estado em runtime (sessão expirada durante uso, logout em outra aba)
   - Faz redirect automático para `/login` se auth state inválido

**Por que duas camadas?**
O middleware protege o _carregamento inicial_ da página (SSR). O guard client-side protege _durante a sessão_. Um sem o outro deixa brechas: sem middleware, um request direto com curl acessa o HTML; sem guard, uma sessão expirada não é detectada até reload.

**Trade-off do middleware:** cada navegação server-side faz uma chamada ao backend. Aceitável para painel admin com tráfego baixo. Se o backend estiver fora do ar, o middleware falha-seguro para `/login`.

### Root layout

Sem `SiteHeader`, sem `CartDrawer`, sem `CartProvider`. Apenas:

```tsx
<AuthProvider>{children}</AuthProvider>
```

### Remoções do magnossao-frontend

- `src/app/admin/` inteiro
- `src/components/admin/` inteiro

Nenhum redirect — as rotas `/admin` simplesmente deixam de existir no frontend.

## Configuração de desenvolvimento

| App                  | Porta |
| -------------------- | ----- |
| magnossao-frontend   | 3000  |
| magnossao-backoffice | 3001  |

O `package.json` do backoffice define `"dev": "next dev -p 3001"`.

## O que NÃO entra no backoffice

- `src/contexts/cart-context.tsx`
- `src/components/cart/`
- `src/components/catalog/`
- `src/components/layout/site-header.tsx`
- `src/components/marketing/`
- `src/services/carrinho.ts`
- `src/services/enderecos.ts`
- `src/app/checkout/`, `produto/`, `minha-conta/`, `pedidos/`, `status/`, `classic/`, `cadastro/`

## Critérios de sucesso

- `npm run dev` no backoffice sobe na porta 3001 sem erros
- `npm run typecheck` passa sem erros em ambos os apps
- Acessar qualquer rota `/` ou `/(admin)/*` sem token → redirect para `/login`
- Login com role `ADMIN` → acesso ao dashboard
- Login com role diferente de `ADMIN` → redirect para `/login`
- Frontend não tem mais nenhuma rota `/admin`
