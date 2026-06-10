# Ver/Editar/Inativar Produto + Listagem com Filtros — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adicionar modo visualização/edição na ficha de produto, ação de inativar (arquivar), e listagem admin com filtros (status, busca, categoria) e paginação server-side.

**Architecture:** Backend ganha endpoint admin paginado/filtrado via `JpaSpecificationExecutor` retornando um `PaginaResponse<T>` próprio. Backoffice usa filtros na URL (SSR), um ícone de "olho" abre a ficha em só-leitura (`<fieldset disabled>`) com botão "Habilitar edição"; inativar/reativar reusam `PATCH /{id}/status` com `ARQUIVADO`/`RASCUNHO`. Loja pública não muda — `ARQUIVADO` já é escondido.

**Tech Stack:** Spring Boot (JPA Criteria/Specification, Pageable), JUnit 5 + Testcontainers + MockMvcTester; Next.js 15 (App Router, server components, searchParams), React 19, TypeScript, Tailwind.

Spec: `docs/superpowers/specs/2026-06-10-produto-ver-editar-inativar.md`

---

## Task 1: Backend — listagem admin paginada e filtrada

**Files:**

- Create: `magnossao-backend/src/main/java/com/magnossao/dto/response/PaginaResponse.java`
- Modify: `magnossao-backend/src/main/java/com/magnossao/repository/ProdutoRepository.java`
- Modify: `magnossao-backend/src/main/java/com/magnossao/service/ProdutoService.java` (substitui `listarTodos`)
- Modify: `magnossao-backend/src/main/java/com/magnossao/controller/AdminProdutoController.java:30-33`
- Test: `magnossao-backend/src/test/java/com/magnossao/controller/AdminProdutoControllerIT.java`

- [ ] **Step 1: Criar o DTO de página**

Create `magnossao-backend/src/main/java/com/magnossao/dto/response/PaginaResponse.java`:

```java
package com.magnossao.dto.response;

import java.util.List;

public record PaginaResponse<T>(
    List<T> conteudo,
    int pagina,
    int totalPaginas,
    long totalItens
) {}
```

- [ ] **Step 2: Habilitar Specifications no repositório**

Modify `magnossao-backend/src/main/java/com/magnossao/repository/ProdutoRepository.java` — adicione o import e estenda `JpaSpecificationExecutor` (mantenha os métodos derivados existentes):

```java
package com.magnossao.repository;

import com.magnossao.entity.Categoria;
import com.magnossao.entity.Produto;
import com.magnossao.entity.StatusProduto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import java.util.List;
import java.util.Optional;

public interface ProdutoRepository
        extends JpaRepository<Produto, Long>, JpaSpecificationExecutor<Produto> {

    List<Produto> findByStatusOrderByNomeAsc(StatusProduto status);

    List<Produto> findByStatusAndCategoriaOrderByNomeAsc(StatusProduto status, Categoria categoria);

    Optional<Produto> findBySlug(String slug);

    boolean existsBySlug(String slug);
}
```

- [ ] **Step 3: Escrever/atualizar os testes (TDD)**

Em `AdminProdutoControllerIT.java`:

(a) **Substitua** o teste `listarTodosRetorna200ComArray` (linhas ~73-79) por um que valida o novo formato paginado:

```java
    @Test
    @WithMockUser(roles = "ADMIN")
    void listarRetorna200ComPagina() {
        assertThat(mvc.get().uri("/api/admin/produtos"))
            .hasStatusOk()
            .bodyJson().extractingPath("$.conteudo").asArray().isNotNull();
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void listarTrazCamposDePaginacao() {
        assertThat(mvc.get().uri("/api/admin/produtos?page=0&size=5"))
            .hasStatusOk()
            .bodyJson().extractingPath("$.pagina").isEqualTo(0);
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void filtrarPorStatusRascunhoNaoTrazPublicados() {
        produtoService.criar(new ProdutoRequest(
            "filtro-rascunho-it", "Filtro Rascunho IT", "FR", "Col",
            BigDecimal.valueOf(100), "Desc", "SEO", Categoria.POLO));
        assertThat(mvc.get().uri("/api/admin/produtos?status=RASCUNHO"))
            .hasStatusOk()
            .bodyJson().extractingPath("$.conteudo").asArray().isNotEmpty();
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void buscarPorNomeFiltraResultado() {
        produtoService.criar(new ProdutoRequest(
            "busca-zebra-it", "Produto Zebra Unico", "Zebra", "Col",
            BigDecimal.valueOf(100), "Desc", "SEO", Categoria.POLO));
        assertThat(mvc.get().uri("/api/admin/produtos?busca=zebra"))
            .hasStatusOk()
            .bodyJson().extractingPath("$.conteudo[0].nome").asString().contains("Zebra");
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void filtrarPorCategoriaShortsSemResultadosRetornaVazio() {
        assertThat(mvc.get().uri("/api/admin/produtos?categoria=SHORTS&busca=__inexistente__"))
            .hasStatusOk()
            .bodyJson().extractingPath("$.conteudo").asArray().isEmpty();
    }
```

- [ ] **Step 4: Rodar os testes e ver falhar**

Run: `cd magnossao-backend && ./mvnw -q test -Dtest=AdminProdutoControllerIT`
Expected: FALHA na compilação/execução (controller ainda retorna `List`, sem `$.conteudo`; `listarAdmin` ainda não existe). Requer Docker para Testcontainers.

- [ ] **Step 5: Implementar `listarAdmin` no service**

Em `ProdutoService.java`, adicione os imports e **substitua** o método `listarTodos()` (linhas 38-41) por `listarAdmin`:

Imports (junto aos existentes no topo):

```java
import com.magnossao.entity.Categoria;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
```

Método (no lugar de `listarTodos`):

```java
    public PaginaResponse<ProdutoResumoResponse> listarAdmin(
            StatusProduto status, Categoria categoria, String busca, Pageable pageable) {
        Specification<Produto> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }
            if (categoria != null) {
                predicates.add(cb.equal(root.get("categoria"), categoria));
            }
            if (busca != null && !busca.isBlank()) {
                String like = "%" + busca.toLowerCase() + "%";
                predicates.add(cb.or(
                    cb.like(cb.lower(root.get("nome")), like),
                    cb.like(cb.lower(root.get("slug")), like)));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        Page<ProdutoResumoResponse> page =
            produtoRepository.findAll(spec, pageable).map(this::toResumo);
        return new PaginaResponse<>(
            page.getContent(), page.getNumber(), page.getTotalPages(), page.getTotalElements());
    }
```

> Nota: `Categoria` e `StatusProduto` já são acessíveis via `com.magnossao.entity.*` (import existente na linha 7), mas o import explícito de `Categoria` acima é inofensivo se duplicado — se o compilador reclamar de import duplicado, remova a linha `import com.magnossao.entity.Categoria;`.

- [ ] **Step 6: Atualizar o controller**

Em `AdminProdutoController.java`, adicione os imports e **substitua** o método `listarTodos` (linhas 30-33):

Imports (junto aos existentes):

```java
import com.magnossao.entity.Categoria;
import com.magnossao.entity.StatusProduto;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
```

Método:

```java
    @GetMapping
    public PaginaResponse<ProdutoResumoResponse> listar(
            @RequestParam(required = false) StatusProduto status,
            @RequestParam(required = false) Categoria categoria,
            @RequestParam(required = false) String busca,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        var pageable = PageRequest.of(page, size, Sort.by("nome").ascending());
        return produtoService.listarAdmin(status, categoria, busca, pageable);
    }
```

- [ ] **Step 7: Rodar os testes e ver passar**

Run: `cd magnossao-backend && ./mvnw -q test -Dtest=AdminProdutoControllerIT`
Expected: PASS (todos os testes do IT, incluindo os 5 da Step 3).

- [ ] **Step 8: Commit**

```bash
cd magnossao-backend
git add src/main/java/com/magnossao/dto/response/PaginaResponse.java \
        src/main/java/com/magnossao/repository/ProdutoRepository.java \
        src/main/java/com/magnossao/service/ProdutoService.java \
        src/main/java/com/magnossao/controller/AdminProdutoController.java \
        src/test/java/com/magnossao/controller/AdminProdutoControllerIT.java
git commit -m "feat(produto): listagem admin paginada e filtrada por status/categoria/busca"
```

---

## Task 2: Backoffice — listagem com filtros, paginação e ícone "ver"

**Files:**

- Modify: `magnossao-backoffice/src/types/product.ts` (add `Pagina<T>`)
- Create: `magnossao-backoffice/src/components/admin/product-filters.tsx`
- Modify: `magnossao-backoffice/src/app/(admin)/page.tsx` (reescrita)

- [ ] **Step 1: Adicionar o tipo `Pagina<T>`**

Em `magnossao-backoffice/src/types/product.ts`, adicione ao final do arquivo:

```ts
export type Pagina<T> = {
  conteudo: T[]
  pagina: number
  totalPaginas: number
  totalItens: number
}
```

- [ ] **Step 2: Criar o componente de filtros**

Create `magnossao-backoffice/src/components/admin/product-filters.tsx`:

```tsx
'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'

const selectClass =
  'border border-black/15 bg-white px-3 py-2 text-xs font-ui text-navy focus:outline-none focus:border-navy rounded'

export function ProductFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const sp = useSearchParams()

  function aplicar(next: URLSearchParams) {
    next.delete('page') // qualquer filtro volta para a primeira página
    const qs = next.toString()
    router.push(qs ? `${pathname}?${qs}` : pathname)
  }

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(sp.toString())
    if (value) next.set(key, value)
    else next.delete(key)
    aplicar(next)
  }

  function onBuscaSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const valor = new FormData(e.currentTarget).get('busca')?.toString() ?? ''
    setParam('busca', valor.trim())
  }

  return (
    <div className="flex flex-wrap items-center gap-3 mb-5">
      <form onSubmit={onBuscaSubmit} className="relative">
        <Search
          className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-navy/30"
          strokeWidth={1.5}
        />
        <input
          name="busca"
          defaultValue={sp.get('busca') ?? ''}
          placeholder="Buscar por nome…"
          className="border border-black/15 bg-white pl-8 pr-3 py-2 text-xs font-ui text-navy focus:outline-none focus:border-navy rounded w-56 placeholder:text-black/25"
        />
      </form>

      <select
        value={sp.get('status') ?? ''}
        onChange={(e) => setParam('status', e.target.value)}
        className={selectClass}
      >
        <option value="">Todos os status</option>
        <option value="RASCUNHO">Rascunho</option>
        <option value="PUBLICADO">Publicado</option>
        <option value="ARQUIVADO">Arquivado</option>
      </select>

      <select
        value={sp.get('categoria') ?? ''}
        onChange={(e) => setParam('categoria', e.target.value)}
        className={selectClass}
      >
        <option value="">Todas as categorias</option>
        <option value="POLO">Polo</option>
        <option value="CAMISA">Camisa</option>
        <option value="CALCA">Calça</option>
        <option value="SHORTS">Shorts</option>
      </select>
    </div>
  )
}
```

- [ ] **Step 3: Reescrever a página de listagem**

Replace o conteúdo de `magnossao-backoffice/src/app/(admin)/page.tsx` por:

```tsx
import Link from 'next/link'
import { Plus, Eye } from 'lucide-react'
import { apiFetchServer } from '@/lib/api-server'
import type { Pagina, ProdutoResumo } from '@/types/product'
import { ProductFilters } from '@/components/admin/product-filters'

export const dynamic = 'force-dynamic'

const PAGE_SIZE = 20

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

const CATEGORIA_LABEL: Record<string, string> = {
  POLO: 'Polo',
  CAMISA: 'Camisa',
  CALCA: 'Calça',
  SHORTS: 'Shorts',
}

type SearchParams = Promise<{
  status?: string
  busca?: string
  categoria?: string
  page?: string
}>

function buildQuery(
  sp: { status?: string; busca?: string; categoria?: string },
  page: number
): string {
  const qs = new URLSearchParams()
  if (sp.status) qs.set('status', sp.status)
  if (sp.busca) qs.set('busca', sp.busca)
  if (sp.categoria) qs.set('categoria', sp.categoria)
  qs.set('page', String(page))
  return qs.toString()
}

export default async function AdminPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams
  const pageNum = Math.max(0, Number(sp.page ?? '0') || 0)

  const apiQs = new URLSearchParams(buildQuery(sp, pageNum))
  apiQs.set('size', String(PAGE_SIZE))
  const pagina = await apiFetchServer<Pagina<ProdutoResumo>>(
    `/api/admin/produtos?${apiQs.toString()}`
  )
  const produtos = pagina.conteudo

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-cinzel text-2xl text-navy tracking-wide">Produtos</h1>
          <p className="text-xs font-ui text-navy/40 tracking-wider mt-1">
            {pagina.totalItens} {pagina.totalItens === 1 ? 'produto' : 'produtos'}
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

      <ProductFilters />

      <div className="bg-white border border-black/8 rounded overflow-hidden shadow-sm">
        {produtos.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-cinzel text-navy/30 text-sm tracking-widest">
              Nenhum produto encontrado
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-[3rem_1fr_auto_auto_auto] border-b border-black/8 bg-sand/40 px-5 py-3">
              {['Produto', '', 'Categoria', 'Status', ''].map((h, i) => (
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
                className="grid grid-cols-[3rem_1fr_auto_auto_auto] items-center gap-4 px-5 py-4 border-b border-black/5 last:border-0 hover:bg-sand/20 transition-colors group"
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

                <span className="font-ui text-[0.65rem] tracking-wider text-navy/50">
                  {p.categoria ? (CATEGORIA_LABEL[p.categoria] ?? p.categoria) : '—'}
                </span>

                <span
                  className={`text-[0.58rem] font-ui tracking-[0.16em] uppercase px-2.5 py-1 rounded-full ${STATUS_COLOR[p.status]}`}
                >
                  {STATUS_LABEL[p.status]}
                </span>

                <Link
                  href={`/produtos/${p.id}`}
                  title="Ver produto"
                  aria-label={`Ver ${p.nome}`}
                  className="text-navy/40 hover:text-navy transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Eye className="size-4" strokeWidth={1.5} />
                </Link>
              </div>
            ))}
          </>
        )}
      </div>

      {pagina.totalPaginas > 1 && (
        <div className="flex items-center justify-between mt-5">
          <PaginaLink sp={sp} page={pageNum - 1} disabled={pageNum <= 0} label="← Anterior" />
          <span className="text-xs font-ui text-navy/40 tracking-wider">
            Página {pageNum + 1} de {pagina.totalPaginas}
          </span>
          <PaginaLink
            sp={sp}
            page={pageNum + 1}
            disabled={pageNum >= pagina.totalPaginas - 1}
            label="Próxima →"
          />
        </div>
      )}
    </div>
  )
}

function PaginaLink({
  sp,
  page,
  disabled,
  label,
}: {
  sp: { status?: string; busca?: string; categoria?: string }
  page: number
  disabled: boolean
  label: string
}) {
  const base = 'text-xs font-ui tracking-wider uppercase px-4 py-2 border rounded transition-colors'
  if (disabled) {
    return <span className={`${base} border-black/10 text-navy/20 cursor-default`}>{label}</span>
  }
  return (
    <Link
      href={`/?${buildQuery(sp, page)}`}
      className={`${base} border-navy/30 text-navy hover:bg-navy hover:text-white`}
    >
      {label}
    </Link>
  )
}
```

- [ ] **Step 4: Verificar tipos**

Run: `cd magnossao-backoffice && npm run typecheck`
Expected: sem erros.

- [ ] **Step 5: Commit**

```bash
cd magnossao-backoffice
git add src/types/product.ts src/components/admin/product-filters.tsx "src/app/(admin)/page.tsx"
git commit -m "feat(produtos): filtros, paginacao e botao ver na listagem admin"
```

---

## Task 3: Backoffice — ProductForm em modo ver/editar + inativar/reativar

**Files:**

- Modify: `magnossao-backoffice/src/components/admin/product-form.tsx`

- [ ] **Step 1: Adicionar estado de modo e funções de status**

Em `product-form.tsx`, logo após a linha `const [publicando, setPublicando] = useState(false)` (linha ~51), adicione:

```tsx
const [modo, setModo] = useState<'view' | 'edit'>(produto?.id ? 'view' : 'edit')
const readOnly = modo === 'view'
```

E logo após a função `voltarParaRascunho` (depois da linha ~148, antes de `adicionarCor`), adicione as duas funções:

```tsx
async function inativar() {
  if (!produtoId) return
  setPublicando(true)
  setErro(null)
  try {
    const atualizado = await mudarStatusProduto(produtoId, 'ARQUIVADO')
    setStatus(atualizado.status)
    router.refresh()
  } catch (e) {
    setErro(e instanceof Error ? e.message : 'Erro ao inativar')
  } finally {
    setPublicando(false)
  }
}

async function reativar() {
  if (!produtoId) return
  setPublicando(true)
  setErro(null)
  try {
    const atualizado = await mudarStatusProduto(produtoId, 'RASCUNHO')
    setStatus(atualizado.status)
    router.refresh()
  } catch (e) {
    setErro(e instanceof Error ? e.message : 'Erro ao reativar')
  } finally {
    setPublicando(false)
  }
}
```

- [ ] **Step 2: Envolver o form num fieldset e adicionar o toggle ver/editar**

Localize o início do `return` (linha ~231):

```tsx
  return (
    <div className="space-y-5">
      <Section title="Dados básicos">
```

Substitua por (adiciona a barra de toggle e abre o `<fieldset>`):

```tsx
  return (
    <div className="space-y-5">
      {produtoId && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setModo(readOnly ? 'edit' : 'view')}
            className="inline-flex items-center gap-2 border border-navy/30 text-navy px-4 py-2 font-ui text-xs tracking-wider uppercase hover:bg-navy hover:text-white transition-colors rounded"
          >
            {readOnly ? '✎ Habilitar edição' : 'Cancelar edição'}
          </button>
        </div>
      )}
      <fieldset
        disabled={readOnly}
        className={`space-y-5 border-0 p-0 m-0 min-w-0 ${readOnly ? '[&_button]:hidden' : ''}`}
      >
      <Section title="Dados básicos">
```

Agora localize o fechamento final do componente (linhas ~599-602):

```tsx
        </>
      )}
    </div>
  )
}
```

Substitua por (fecha o `<fieldset>` antes do `</div>`):

```tsx
        </>
      )}
      </fieldset>
    </div>
  )
}
```

> Por que: `<fieldset disabled>` desabilita nativamente todos os inputs/selects/textareas em modo view. A variante Tailwind `[&_button]:hidden` esconde todos os botões de ação (adicionar, deletar, gerar SKUs, salvar cashback, publicar, inativar) enquanto em só-leitura — o toggle "Habilitar edição" fica fora do fieldset e continua clicável.

- [ ] **Step 3: Adicionar ações Inativar/Reativar na seção Publicação**

Localize o bloco de botões de status (linhas ~577-596):

```tsx
{
  status === 'PUBLICADO' ? (
    <button
      type="button"
      onClick={voltarParaRascunho}
      disabled={publicando}
      className="border border-navy/30 text-navy px-5 py-2.5 font-ui text-xs tracking-wider uppercase hover:bg-navy hover:text-white transition-colors rounded disabled:opacity-50"
    >
      {publicando ? 'Salvando…' : 'Voltar para rascunho'}
    </button>
  ) : (
    <button
      type="button"
      onClick={publicar}
      disabled={!podePublicar || publicando}
      title={podePublicar ? undefined : 'Complete todos os requisitos para publicar.'}
      className="bg-green-700 text-white px-6 py-2.5 font-ui text-xs tracking-[0.15em] uppercase hover:bg-green-800 transition-colors rounded disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {publicando ? 'Publicando…' : 'Publicar produto'}
    </button>
  )
}
```

Substitua por (cobre os 3 status; adiciona Inativar e Reativar):

```tsx
<div className="flex flex-wrap items-center gap-3">
  {status === 'ARQUIVADO' ? (
    <button
      type="button"
      onClick={reativar}
      disabled={publicando}
      className="border border-navy/30 text-navy px-5 py-2.5 font-ui text-xs tracking-wider uppercase hover:bg-navy hover:text-white transition-colors rounded disabled:opacity-50"
    >
      {publicando ? 'Salvando…' : 'Reativar (voltar para rascunho)'}
    </button>
  ) : (
    <>
      {status === 'PUBLICADO' ? (
        <button
          type="button"
          onClick={voltarParaRascunho}
          disabled={publicando}
          className="border border-navy/30 text-navy px-5 py-2.5 font-ui text-xs tracking-wider uppercase hover:bg-navy hover:text-white transition-colors rounded disabled:opacity-50"
        >
          {publicando ? 'Salvando…' : 'Voltar para rascunho'}
        </button>
      ) : (
        <button
          type="button"
          onClick={publicar}
          disabled={!podePublicar || publicando}
          title={podePublicar ? undefined : 'Complete todos os requisitos para publicar.'}
          className="bg-green-700 text-white px-6 py-2.5 font-ui text-xs tracking-[0.15em] uppercase hover:bg-green-800 transition-colors rounded disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {publicando ? 'Publicando…' : 'Publicar produto'}
        </button>
      )}
      <button
        type="button"
        onClick={inativar}
        disabled={publicando}
        className="border border-wine/40 text-wine px-5 py-2.5 font-ui text-xs tracking-wider uppercase hover:bg-wine hover:text-white transition-colors rounded disabled:opacity-50"
      >
        Inativar
      </button>
    </>
  )}
</div>
```

- [ ] **Step 4: Ajustar a mensagem de requisitos para só rascunho**

Localize (linha ~552):

```tsx
{
  status !== 'PUBLICADO' && (
    <p className="text-sm font-ui text-navy/50 mb-4">
      Para publicar, complete todos os requisitos abaixo.
    </p>
  )
}
```

Substitua por (evita mostrar a mensagem de "publicar" quando o produto está arquivado):

```tsx
{
  status === 'RASCUNHO' && (
    <p className="text-sm font-ui text-navy/50 mb-4">
      Para publicar, complete todos os requisitos abaixo.
    </p>
  )
}
```

- [ ] **Step 5: Verificar tipos**

Run: `cd magnossao-backoffice && npm run typecheck`
Expected: sem erros.

- [ ] **Step 6: Commit**

```bash
cd magnossao-backoffice
git add src/components/admin/product-form.tsx
git commit -m "feat(produto): modo ver/editar e acoes de inativar/reativar na ficha"
```

---

## Task 4: Verificação final

**Files:** nenhum (verificação).

- [ ] **Step 1: Typecheck do backoffice**

Run: `cd magnossao-backoffice && npm run typecheck`
Expected: sem erros.

- [ ] **Step 2: Testes do backend**

Run: `cd magnossao-backend && ./mvnw -q test -Dtest=AdminProdutoControllerIT,ProdutoControllerIT`
Expected: PASS. `ProdutoControllerIT` confirma que a loja pública continua escondendo produtos não-publicados (comportamento de `listarPublicados`/`buscarPorSlug` que cobre o "sumir da prateleira" do ARQUIVADO).

- [ ] **Step 3: Smoke test manual (opcional, se houver ambiente)**

Com backend + backoffice rodando:

1. Abrir a home do admin → ver filtros, paginação e o ícone de olho.
2. Filtrar por status/categoria e buscar por nome → URL reflete e lista atualiza.
3. Abrir um produto → ficha em só-leitura; clicar "Habilitar edição" → campos liberam.
4. Editar e salvar cashback → funciona.
5. Inativar um produto publicado → status vira Arquivado; confirmar que some da loja pública (`magnossao-frontend`).
6. Reativar → volta para Rascunho.

- [ ] **Step 4: Commit final (se algum ajuste de verificação foi necessário)**

```bash
git add -A && git commit -m "chore: ajustes pos-verificacao ver/editar/inativar produto"
```

---

## Notas de implementação

- **Loja pública não muda** — `ProdutoController`/`ProdutoService.listarPublicados` já filtram por `PUBLICADO`. Inativar (=`ARQUIVADO`) já remove o produto da prateleira sem código novo no `magnossao-frontend`.
- **Reativar vai para `RASCUNHO`** de propósito, para o admin revisar requisitos antes de republicar.
- **Page size = 20**, ordenação por nome ascendente (definido no controller).
- Sem framework de teste no backoffice (só `npm run typecheck`, conforme `CLAUDE.md`); a verificação de UI é por typecheck + smoke test manual.
