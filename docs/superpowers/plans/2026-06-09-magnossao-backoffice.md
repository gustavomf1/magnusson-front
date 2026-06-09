# magnossao-backoffice Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar o app `magnossao-backoffice` separado do `magnossao-frontend`, com segurança em duas camadas (middleware server-side + auth guard client-side) e remover as rotas `/admin` do frontend.

**Architecture:** Cópia do `magnossao-frontend` purgada de tudo que não é admin; rotas reestruturadas de `src/app/admin/*` para `src/app/(admin)/*`; middleware Next.js que valida sessão via `GET /api/auth/me` antes de servir qualquer página.

**Tech Stack:** Next.js 15.1, React 19, TypeScript 5.7 strict, Tailwind CSS 3.4, lucide-react, cookie-based auth (httpOnly, gerenciado pelo backend Java)

---

## Mapa de arquivos

### magnossao-backoffice (novo app)

| Arquivo                                                             | O que faz                                                                             |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `package.json`                                                      | name: magnossao-backoffice, dev porta 3001                                            |
| `src/middleware.ts`                                                 | Auth guard server-side — chama `/api/auth/me`, redireciona para `/login` se não-ADMIN |
| `src/app/layout.tsx`                                                | Root layout: só `AuthProvider` + children                                             |
| `src/app/login/page.tsx`                                            | Única rota pública                                                                    |
| `src/app/(admin)/layout.tsx`                                        | Sidebar + auth guard client-side                                                      |
| `src/app/(admin)/page.tsx`                                          | Dashboard de produtos (era `/admin`)                                                  |
| `src/app/(admin)/estoque/page.tsx`                                  | Estoque                                                                               |
| `src/app/(admin)/pedidos/page.tsx`                                  | Pedidos                                                                               |
| `src/app/(admin)/cashback/page.tsx`                                 | Cashback                                                                              |
| `src/app/(admin)/produtos/novo/page.tsx`                            | Criar produto                                                                         |
| `src/app/(admin)/produtos/[id]/page.tsx`                            | Editar produto                                                                        |
| `src/components/auth/login-form.tsx`                                | Adaptado: redireciona para `/`, sem link de cadastro                                  |
| `src/components/admin/*`                                            | Copiados sem alteração                                                                |
| `src/contexts/auth-context.tsx`                                     | Copiado sem alteração                                                                 |
| `src/services/{auth,products,estoque,pedidos,cashback,estornos}.ts` | Copiados sem alteração                                                                |
| `src/lib/{api,api-server,cn,format}.ts`                             | Copiados sem alteração                                                                |
| `src/types/*`                                                       | Copiados sem alteração                                                                |

### magnossao-frontend (modificações)

| Arquivo                 | Mudança          |
| ----------------------- | ---------------- |
| `src/app/admin/`        | Deletado inteiro |
| `src/components/admin/` | Deletado inteiro |

---

## Task 1: Copiar e configurar o diretório base

**Files:**

- Create: `/home/mag/Documents/magnossao-loja/magnossao-backoffice/` (copiado do frontend)

- [ ] **Step 1: Copiar o frontend como base do backoffice**

```bash
cp -r /home/mag/Documents/magnossao-loja/magnossao-frontend \
      /home/mag/Documents/magnossao-loja/magnossao-backoffice
```

- [ ] **Step 2: Remover artefatos do frontend que não pertencem ao backoffice**

```bash
cd /home/mag/Documents/magnossao-loja/magnossao-backoffice
rm -rf .git node_modules .next
```

- [ ] **Step 3: Atualizar `package.json` — nome e porta de dev**

Abrir `/home/mag/Documents/magnossao-loja/magnossao-backoffice/package.json` e substituir:

```json
{
  "name": "magnossao-backoffice",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "start": "next start -p 3001",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "lucide-react": "^0.468.0",
    "next": "^15.1.4",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@types/node": "^22.10.2",
    "@types/react": "^19.0.2",
    "@types/react-dom": "^19.0.2",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "prettier": "^3.8.3",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.7.2"
  }
}
```

- [ ] **Step 4: Criar `.env.local`**

```bash
cat > /home/mag/Documents/magnossao-loja/magnossao-backoffice/.env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:8080
EOF
```

- [ ] **Step 5: Instalar dependências**

```bash
cd /home/mag/Documents/magnossao-loja/magnossao-backoffice && npm install
```

Expected: sem erros, `node_modules` criado.

- [ ] **Step 6: Inicializar git**

```bash
cd /home/mag/Documents/magnossao-loja/magnossao-backoffice
git init
echo "node_modules/\n.next/\n.env.local\n.env*.local" > .gitignore
git add .
git commit -m "chore: scaffold inicial copiado do magnossao-frontend"
```

---

## Task 2: Remover arquivos não-admin do backoffice

**Files:**

- Delete: todos os arquivos de rota/componente que não são admin

- [ ] **Step 1: Deletar rotas do cliente**

```bash
cd /home/mag/Documents/magnossao-loja/magnossao-backoffice
rm -rf src/app/checkout
rm -rf src/app/classic
rm -rf src/app/minha-conta
rm -rf "src/app/pedidos"
rm -rf src/app/produto
rm -rf src/app/status
rm -rf src/app/cadastro
```

- [ ] **Step 2: Deletar componentes do cliente**

```bash
cd /home/mag/Documents/magnossao-loja/magnossao-backoffice
rm -rf src/components/cart
rm -rf src/components/catalog
rm -rf src/components/layout
rm -rf src/components/marketing
rm src/components/auth/cadastro-form.tsx
```

- [ ] **Step 3: Deletar services e contexts do cliente**

```bash
cd /home/mag/Documents/magnossao-loja/magnossao-backoffice
rm src/services/carrinho.ts
rm src/services/enderecos.ts
rm src/contexts/cart-context.tsx
```

- [ ] **Step 4: Commit**

```bash
cd /home/mag/Documents/magnossao-loja/magnossao-backoffice
git add -A
git commit -m "chore: remove arquivos não-admin do backoffice"
```

---

## Task 3: Reestruturar rotas — mover admin para route group (admin)

O route group `(admin)` cria um layout isolado sem afetar as URLs. As páginas continuam em `/`, `/estoque`, etc. — sem o prefixo `/admin`.

**Files:**

- Create: `src/app/(admin)/layout.tsx`
- Create: `src/app/(admin)/page.tsx`
- Create: `src/app/(admin)/estoque/page.tsx`
- Create: `src/app/(admin)/pedidos/page.tsx`
- Create: `src/app/(admin)/cashback/page.tsx`
- Create: `src/app/(admin)/produtos/novo/page.tsx`
- Create: `src/app/(admin)/produtos/[id]/page.tsx`
- Delete: `src/app/admin/` (inteiro)

- [ ] **Step 1: Criar diretórios do route group**

```bash
cd /home/mag/Documents/magnossao-loja/magnossao-backoffice
mkdir -p src/app/\(admin\)/estoque
mkdir -p src/app/\(admin\)/pedidos
mkdir -p src/app/\(admin\)/cashback
mkdir -p src/app/\(admin\)/produtos/novo
mkdir -p "src/app/(admin)/produtos/[id]"
```

- [ ] **Step 2: Criar `src/app/(admin)/layout.tsx`**

Conteúdo igual ao `src/app/admin/layout.tsx` existente, mas com as hrefs do nav atualizadas (sem prefixo `/admin`):

```tsx
'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { cn } from '@/lib/cn'
import { Package, Archive, ShoppingBag, Tag, LogOut } from 'lucide-react'

const NAV = [
  { href: '/', label: 'Produtos', icon: Package, exact: true },
  { href: '/estoque', label: 'Estoque', icon: Archive },
  { href: '/pedidos', label: 'Pedidos', icon: ShoppingBag },
  { href: '/cashback', label: 'Cashback', icon: Tag },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { usuario, loading, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && (!usuario || usuario.role !== 'ADMIN')) {
      router.replace('/login')
    }
  }, [usuario, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy">
        <span className="text-gold/60 font-cinzel tracking-[0.35em] text-xs animate-pulse">
          VERIFICANDO ACESSO
        </span>
      </div>
    )
  }

  if (!usuario || usuario.role !== 'ADMIN') return null

  async function handleLogout() {
    await logout()
    router.replace('/login')
  }

  return (
    <div className="flex min-h-screen bg-sand/20">
      <aside className="w-52 shrink-0 bg-navy flex flex-col sticky top-0 h-screen overflow-y-auto">
        <div className="px-6 pt-8 pb-6 border-b border-white/10">
          <p className="font-cinzel text-white text-sm tracking-[0.18em]">MAGNOSSÃO</p>
          <p className="text-gold text-[0.58rem] tracking-[0.4em] uppercase mt-1 font-ui">
            Backoffice
          </p>
        </div>

        <nav className="flex-1 py-2">
          {NAV.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'relative flex items-center gap-3 px-6 py-3.5 text-xs font-ui tracking-[0.12em] uppercase transition-colors',
                  active
                    ? 'text-gold bg-white/5 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[2px] before:bg-gold before:rounded-full'
                    : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                )}
              >
                <Icon className="size-4 shrink-0" strokeWidth={1.5} />
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="px-6 py-5 border-t border-white/10">
          <p className="font-ui text-[0.58rem] tracking-widest text-white/30 uppercase mb-2 truncate">
            {usuario.nome}
          </p>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-white/30 hover:text-wine transition-colors font-ui text-[0.65rem] tracking-wider uppercase"
          >
            <LogOut className="size-3.5" strokeWidth={1.5} />
            Sair
          </button>
        </div>
      </aside>

      <div className="flex-1 min-h-screen">
        <div className="max-w-5xl mx-auto px-8 py-8">{children}</div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Criar `src/app/(admin)/page.tsx`**

Igual ao `src/app/admin/page.tsx` existente, mas com os hrefs internos sem prefixo `/admin`:

```tsx
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { apiFetchServer } from '@/lib/api-server'
import type { ProdutoResumo } from '@/types/product'

export const dynamic = 'force-dynamic'

const STATUS_LABEL: Record<string, string> = {
  RASCUNHO: 'Rascunho',
  PUBLICADO: 'Publicado',
  ARQUIVADO: 'Arquivado',
}

const STATUS_COLOR: Record<string, string> = {
  RASCUNHO: 'bg-amber-100 text-amber-700',
  PUBLICADO: 'bg-green-100 text-green-700',
  ARQUIVADO: 'bg-gray-100 text-gray-500',
}

export default async function AdminPage() {
  const produtos = await apiFetchServer<ProdutoResumo[]>('/api/admin/produtos')

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-cinzel text-2xl text-navy tracking-wide">Produtos</h1>
          <p className="text-xs font-ui text-navy/40 tracking-wider mt-1">
            {produtos.length} {produtos.length === 1 ? 'produto' : 'produtos'}
          </p>
        </div>
        <Link
          href="/produtos/novo"
          className="inline-flex items-center gap-2 bg-navy text-white px-4 py-2.5 font-ui text-xs tracking-[0.15em] uppercase hover:bg-navy/90 transition-colors"
        >
          <Plus className="size-3.5" strokeWidth={2} />
          Novo Produto
        </Link>
      </div>

      <div className="bg-white border border-black/8 rounded overflow-hidden shadow-sm">
        {produtos.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-cinzel text-navy/30 text-sm tracking-widest">
              Nenhum produto cadastrado
            </p>
            <Link
              href="/produtos/novo"
              className="mt-4 inline-block text-xs font-ui text-gold tracking-wider underline underline-offset-4"
            >
              Criar primeiro produto
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-[auto_1fr_auto_auto] border-b border-black/8 bg-sand/40 px-5 py-3">
              {['Produto', '', 'Status', ''].map((h, i) => (
                <span
                  key={i}
                  className="font-ui text-[0.6rem] tracking-[0.2em] uppercase text-navy/40 font-semibold"
                >
                  {h}
                </span>
              ))}
            </div>
            {produtos.map((p) => (
              <div
                key={p.id}
                className="grid grid-cols-[3rem_1fr_auto_auto] items-center gap-4 px-5 py-4 border-b border-black/5 last:border-0 hover:bg-sand/20 transition-colors group"
              >
                <div className="size-12 rounded overflow-hidden bg-sand/40 shrink-0">
                  {p.imagemPrincipal ? (
                    <img
                      src={p.imagemPrincipal}
                      alt={p.nome}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-navy/20 text-lg font-cinzel">{p.nome.charAt(0)}</span>
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <p className="font-cinzel text-sm text-navy truncate">{p.nome}</p>
                  <p className="text-xs font-ui text-navy/40 mt-0.5">
                    R$ {p.preco.toFixed(2).replace('.', ',')}
                  </p>
                </div>

                <span
                  className={`text-[0.58rem] font-ui tracking-[0.16em] uppercase px-2.5 py-1 rounded-full ${STATUS_COLOR[p.status]}`}
                >
                  {STATUS_LABEL[p.status]}
                </span>

                <Link
                  href={`/produtos/${p.id}`}
                  className="text-[0.65rem] font-ui tracking-wider text-navy/40 hover:text-navy underline underline-offset-4 transition-colors opacity-0 group-hover:opacity-100"
                >
                  Editar
                </Link>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Copiar as demais páginas admin para o route group**

```bash
cd /home/mag/Documents/magnossao-loja/magnossao-backoffice
cp src/app/admin/estoque/page.tsx   src/app/\(admin\)/estoque/page.tsx
cp src/app/admin/pedidos/page.tsx   src/app/\(admin\)/pedidos/page.tsx
cp src/app/admin/cashback/page.tsx  src/app/\(admin\)/cashback/page.tsx
cp src/app/admin/produtos/novo/page.tsx "src/app/(admin)/produtos/novo/page.tsx"
cp "src/app/admin/produtos/[id]/page.tsx" "src/app/(admin)/produtos/[id]/page.tsx"
```

- [ ] **Step 5: Corrigir links internos nas páginas copiadas**

Nas páginas copiadas, substituir todas as ocorrências de `/admin/` por `/`:

```bash
cd /home/mag/Documents/magnossao-loja/magnossao-backoffice
find src/app/\(admin\) -name "*.tsx" -exec sed -i 's|href="/admin/|href="/|g; s|href={`/admin/|href={`/|g; s|router\.push.*'"'"'/admin|router.push\x27/|g; s|router\.replace.*'"'"'/admin|router.replace\x27/|g' {} \;
```

> **Atenção:** Após este comando, abrir cada arquivo em `src/app/(admin)/` e verificar manualmente que não sobrou nenhuma referência `/admin/`. Corrigir qualquer residual.

- [ ] **Step 6: Deletar `src/app/admin/` (já substituído pelo route group)**

```bash
cd /home/mag/Documents/magnossao-loja/magnossao-backoffice
rm -rf src/app/admin
```

- [ ] **Step 7: Commit**

```bash
cd /home/mag/Documents/magnossao-loja/magnossao-backoffice
git add -A
git commit -m "refactor: reestrutura rotas admin para route group (admin)"
```

---

## Task 4: Reescrever root layout e login

**Files:**

- Modify: `src/app/layout.tsx`
- Modify: `src/app/login/page.tsx`
- Modify: `src/components/auth/login-form.tsx`

- [ ] **Step 1: Reescrever `src/app/layout.tsx` — remover SiteHeader e CartProvider**

```tsx
import type { Metadata } from 'next'
import { AuthProvider } from '@/contexts/auth-context'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'MAGNOSSÃO Backoffice',
    template: '%s | MAGNOSSÃO Backoffice',
  },
  description: 'Painel administrativo MAGNOSSÃO',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Reescrever `src/app/login/page.tsx` — remover metadata pública da loja**

```tsx
import { LoginForm } from '@/components/auth/login-form'

export const metadata = { title: 'Acesso — MAGNOSSÃO Backoffice' }

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-navy px-4">
      <div className="w-full max-w-sm bg-white rounded-lg shadow p-8">
        <h1 className="font-cinzel text-2xl text-navy tracking-widest text-center mb-2">
          MAGNOSSÃO
        </h1>
        <p className="font-ui text-[0.6rem] tracking-[0.35em] uppercase text-gold text-center mb-6">
          Backoffice
        </p>
        <LoginForm />
      </div>
    </main>
  )
}
```

- [ ] **Step 3: Reescrever `src/components/auth/login-form.tsx`**

Mudanças em relação ao frontend: sem link de cadastro, redireciona para `/` após login bem-sucedido de ADMIN, mostra erro para roles não-ADMIN sem redirecionar.

```tsx
'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'

export function LoginForm() {
  const { login, logout } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErro(null)
    setLoading(true)
    try {
      const u = await login(email, senha)
      if (u.role !== 'ADMIN') {
        await logout()
        setErro('Acesso restrito a administradores.')
        return
      }
      router.push('/')
    } catch {
      setErro('Email ou senha incorretos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium text-navy">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-sand rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="senha" className="text-sm font-medium text-navy">
          Senha
        </label>
        <input
          id="senha"
          type="password"
          required
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="border border-sand rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
        />
      </div>
      {erro && <p className="text-sm text-red-600">{erro}</p>}
      <button
        type="submit"
        disabled={loading}
        className="bg-navy text-white font-cinzel tracking-widest py-2 rounded hover:bg-navy/90 disabled:opacity-50"
      >
        {loading ? 'Entrando…' : 'ENTRAR'}
      </button>
    </form>
  )
}
```

- [ ] **Step 4: Commit**

```bash
cd /home/mag/Documents/magnossao-loja/magnossao-backoffice
git add -A
git commit -m "feat: root layout limpo e login form adaptado para backoffice"
```

---

## Task 5: Adicionar middleware de autenticação server-side

**Files:**

- Create: `src/middleware.ts`

O middleware intercepta toda requisição antes do React. Para rotas protegidas, chama `GET /api/auth/me` com o cookie da requisição. Se o backend retornar 401 ou o role não for `ADMIN`, redireciona para `/login`. O matcher exclui assets estáticos automaticamente.

- [ ] **Step 1: Criar `src/middleware.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_PATHS = new Set(['/login'])

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (PUBLIC_PATHS.has(pathname)) {
    return NextResponse.next()
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'
  const cookieHeader = req.headers.get('cookie') ?? ''

  try {
    const res = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { Cookie: cookieHeader },
      cache: 'no-store',
    })

    if (!res.ok) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    const usuario = await res.json()

    if (usuario.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  } catch {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$|.*\\.ico$).*)'],
}
```

- [ ] **Step 2: Commit**

```bash
cd /home/mag/Documents/magnossao-loja/magnossao-backoffice
git add src/middleware.ts
git commit -m "feat: adiciona middleware de auth server-side"
```

---

## Task 6: Verificar typecheck do backoffice

**Files:**

- Leitura de erros de TypeScript

- [ ] **Step 1: Rodar typecheck**

```bash
cd /home/mag/Documents/magnossao-loja/magnossao-backoffice && npm run typecheck
```

Expected: zero erros. Se houver erros:

- Erros de import faltando: verificar se o arquivo existe em `src/` e se o path `@/` está correto
- Erros de tipo em páginas copiadas: comparar com a versão original no frontend para identificar o que mudou
- Erros do `globals.css`: o root layout não importa mais `Script` nem faz referência a `SiteHeader` — garantir que nenhum import ficou órfão

- [ ] **Step 2: Commit após corrigir erros**

```bash
cd /home/mag/Documents/magnossao-loja/magnossao-backoffice
git add -A
git commit -m "fix: corrige erros de TypeScript no backoffice"
```

> Se não houver erros, pular este commit.

---

## Task 7: Remover admin do magnossao-frontend

**Files:**

- Delete: `magnossao-frontend/src/app/admin/`
- Delete: `magnossao-frontend/src/components/admin/`

- [ ] **Step 1: Deletar as rotas e componentes admin do frontend**

```bash
cd /home/mag/Documents/magnossao-loja/magnossao-frontend
rm -rf src/app/admin
rm -rf src/components/admin
```

- [ ] **Step 2: Rodar typecheck no frontend**

```bash
cd /home/mag/Documents/magnossao-loja/magnossao-frontend && npm run typecheck
```

Expected: zero erros. O frontend não tem nenhuma importação das rotas ou componentes admin deletados — se houver erros, significa que algo ainda referencia `src/app/admin` ou `src/components/admin` e precisa ser removido.

- [ ] **Step 3: Commit no frontend**

```bash
cd /home/mag/Documents/magnossao-loja/magnossao-frontend
git add -A
git commit -m "refactor: remove rotas e componentes admin (movidos para magnossao-backoffice)"
```

---

## Task 8: Smoke test dos dois apps

- [ ] **Step 1: Subir o backoffice em desenvolvimento**

```bash
cd /home/mag/Documents/magnossao-loja/magnossao-backoffice && npm run dev
```

Expected: servidor rodando em `http://localhost:3001` sem erros de compilação.

- [ ] **Step 2: Verificar comportamento de segurança**

Com o browser ou curl:

```bash
# Sem sessão — deve redirecionar para /login
curl -I http://localhost:3001/

# Login page — deve retornar 200
curl -I http://localhost:3001/login
```

- [ ] **Step 3: Subir o frontend em desenvolvimento**

```bash
cd /home/mag/Documents/magnossao-loja/magnossao-frontend && npm run dev
```

Expected: servidor rodando em `http://localhost:3000`. Navegar para `http://localhost:3000/admin` deve retornar 404.

- [ ] **Step 4: Commit final no backoffice**

```bash
cd /home/mag/Documents/magnossao-loja/magnossao-backoffice
git add -A
git commit -m "chore: smoke test aprovado — backoffice pronto para desenvolvimento"
```
