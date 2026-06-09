# Catálogo de Produtos — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar a página `/produtos` no frontend com listagem e filtro por categoria, adicionando o campo `categoria` no backend Java e no formulário do backoffice.

**Architecture:** O backend expõe `GET /api/produtos?categoria=POLO` (param opcional). O frontend usa um Server Component com ISR 60s que busca todos os produtos e repassa para um Client Component que filtra localmente e mantém `?categoria=X` na URL via `useSearchParams`. O backoffice ganha campo `categoria` no `ProductForm` e coluna na listagem.

**Tech Stack:** Java 21 / Spring Boot / JPA · Flyway · Next.js 15 App Router · React 19 · TypeScript 5.7 strict · Tailwind CSS 3.4

---

## Mapa de arquivos

| Arquivo                                                                   | Ação                                                               |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `magnossao-backend/.../entity/Categoria.java`                             | Criar — enum                                                       |
| `magnossao-backend/.../resources/db/migration/V10__categoria_produto.sql` | Criar — migration                                                  |
| `magnossao-backend/.../entity/Produto.java`                               | Modificar — add campo categoria                                    |
| `magnossao-backend/.../dto/response/ProdutoResumoResponse.java`           | Modificar — add campo categoria                                    |
| `magnossao-backend/.../dto/response/ProdutoResponse.java`                 | Modificar — add campo categoria                                    |
| `magnossao-backend/.../dto/request/ProdutoRequest.java`                   | Modificar — add campo categoria                                    |
| `magnossao-backend/.../service/ProdutoService.java`                       | Modificar — aplicarRequest, toResumo, toResponse, listarPublicados |
| `magnossao-backend/.../repository/ProdutoRepository.java`                 | Modificar — add query com categoria                                |
| `magnossao-backend/.../controller/ProdutoController.java`                 | Modificar — add @RequestParam categoria                            |
| `magnossao-backend/.../service/ProdutoServiceTest.java`                   | Criar — testes de filtragem                                        |
| `magnossao-frontend/src/types/product.ts`                                 | Modificar — add Categoria + campo em ProdutoResumo                 |
| `magnossao-frontend/src/components/catalog/product-card.tsx`              | Criar — card individual                                            |
| `magnossao-frontend/src/components/catalog/catalog-page.tsx`              | Criar — client component com sidebar e grid                        |
| `magnossao-frontend/src/app/produtos/page.tsx`                            | Criar — server component ISR                                       |
| `magnossao-frontend/src/components/layout/site-header.tsx`                | Modificar — add link Produtos                                      |
| `magnossao-backoffice/src/types/product.ts`                               | Modificar — add Categoria + campo em Produto e ProdutoResumo       |
| `magnossao-backoffice/src/components/admin/product-form.tsx`              | Modificar — add campo categoria                                    |
| `magnossao-backoffice/src/app/(admin)/page.tsx`                           | Modificar — add coluna Categoria                                   |

---

## Task 1: Backend — Enum Categoria + Migration Flyway

**Files:**

- Create: `magnossao-backend/src/main/java/com/magnossao/entity/Categoria.java`
- Create: `magnossao-backend/src/main/resources/db/migration/V10__categoria_produto.sql`

- [ ] **Step 1: Criar o enum Categoria**

```java
// magnossao-backend/src/main/java/com/magnossao/entity/Categoria.java
package com.magnossao.entity;

public enum Categoria {
    POLO, CAMISA, CALCA, SHORTS
}
```

- [ ] **Step 2: Criar a migration Flyway**

```sql
-- magnossao-backend/src/main/resources/db/migration/V10__categoria_produto.sql
ALTER TABLE produto ADD COLUMN categoria VARCHAR(50);
```

A coluna é nullable — produtos existentes ficam sem categoria.

- [ ] **Step 3: Commit**

```bash
cd /home/mag/Documents/magnossao-loja/magnossao-backend
git add src/main/java/com/magnossao/entity/Categoria.java \
        src/main/resources/db/migration/V10__categoria_produto.sql
git commit -m "feat(catalogo): adiciona enum Categoria e migration V10"
```

---

## Task 2: Backend — Entidade + DTOs

**Files:**

- Modify: `magnossao-backend/src/main/java/com/magnossao/entity/Produto.java`
- Modify: `magnossao-backend/src/main/java/com/magnossao/dto/request/ProdutoRequest.java`
- Modify: `magnossao-backend/src/main/java/com/magnossao/dto/response/ProdutoResumoResponse.java`
- Modify: `magnossao-backend/src/main/java/com/magnossao/dto/response/ProdutoResponse.java`

- [ ] **Step 1: Adicionar campo categoria na entidade Produto**

No arquivo `Produto.java`, adicione após o campo `colecao` (linha ~28):

```java
@Enumerated(EnumType.STRING)
@Column(length = 50)
private Categoria categoria;
```

Getter/setter são gerados pelo Lombok (`@Getter @Setter`), nenhuma mudança adicional necessária.

- [ ] **Step 2: Atualizar ProdutoRequest**

O record atual é:

```java
public record ProdutoRequest(
    String slug, String nome, String nomeCurto, String colecao,
    BigDecimal preco, String descricao, String descricaoSeo
) {}
```

Substitua por:

```java
package com.magnossao.dto.request;

import com.magnossao.entity.Categoria;
import java.math.BigDecimal;

public record ProdutoRequest(
    String slug, String nome, String nomeCurto, String colecao,
    BigDecimal preco, String descricao, String descricaoSeo,
    Categoria categoria
) {}
```

- [ ] **Step 3: Atualizar ProdutoResumoResponse**

O record atual é:

```java
public record ProdutoResumoResponse(
    Long id, String slug, String nome, String nomeCurto, String colecao,
    BigDecimal preco, String status, String imagemPrincipal
) {}
```

Substitua por:

```java
package com.magnossao.dto.response;

import com.magnossao.entity.Categoria;
import java.math.BigDecimal;

public record ProdutoResumoResponse(
    Long id, String slug, String nome, String nomeCurto, String colecao,
    BigDecimal preco, String status, String imagemPrincipal,
    Categoria categoria
) {}
```

- [ ] **Step 4: Atualizar ProdutoResponse**

O record atual começa com:

```java
public record ProdutoResponse(
    Long id, String slug, String nome, String nomeCurto, String colecao,
    BigDecimal preco, String descricao, String descricaoSeo, String status,
    List<ImagemDto> imagens, ...
```

Adicione `Categoria categoria` após `String status`:

```java
package com.magnossao.dto.response;

import com.magnossao.entity.Categoria;
import java.math.BigDecimal;
import java.util.List;

public record ProdutoResponse(
    Long id, String slug, String nome, String nomeCurto, String colecao,
    BigDecimal preco, String descricao, String descricaoSeo, String status,
    Categoria categoria,
    List<ImagemDto> imagens, List<CorDto> cores, List<TamanhoDto> tamanhos,
    List<SkuDto> skus, List<BeneficioDto> beneficios, List<DetalheDto> detalhes,
    List<ReviewDto> reviews, List<FaqDto> faqs, RegraCashbackInfoDto regraCashback
) {}
```

- [ ] **Step 5: Commit**

```bash
git add src/main/java/com/magnossao/entity/Produto.java \
        src/main/java/com/magnossao/dto/request/ProdutoRequest.java \
        src/main/java/com/magnossao/dto/response/ProdutoResumoResponse.java \
        src/main/java/com/magnossao/dto/response/ProdutoResponse.java
git commit -m "feat(catalogo): adiciona campo categoria em Produto e DTOs"
```

---

## Task 3: Backend — Repository + Service + Controller + Testes

**Files:**

- Modify: `magnossao-backend/src/main/java/com/magnossao/repository/ProdutoRepository.java`
- Modify: `magnossao-backend/src/main/java/com/magnossao/service/ProdutoService.java`
- Modify: `magnossao-backend/src/main/java/com/magnossao/controller/ProdutoController.java`
- Create: `magnossao-backend/src/test/java/com/magnossao/service/ProdutoServiceTest.java`

- [ ] **Step 1: Escrever os testes (TDD — escrever primeiro)**

```java
// src/test/java/com/magnossao/service/ProdutoServiceTest.java
package com.magnossao.service;

import com.magnossao.entity.Categoria;
import com.magnossao.entity.Produto;
import com.magnossao.entity.StatusProduto;
import com.magnossao.repository.ProdutoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProdutoServiceTest {

    @Mock
    private ProdutoRepository produtoRepository;

    @InjectMocks
    private ProdutoService produtoService;

    private Produto produto(String nome, Categoria categoria) {
        Produto p = new Produto();
        p.setSlug(nome.toLowerCase().replace(" ", "-"));
        p.setNome(nome);
        p.setPreco(BigDecimal.valueOf(100));
        p.setStatus(StatusProduto.PUBLICADO);
        p.setCategoria(categoria);
        return p;
    }

    @Test
    void listarPublicados_semFiltro_retornaTodos() {
        var polo = produto("Polo Classic", Categoria.POLO);
        var camisa = produto("Camisa Oxford", Categoria.CAMISA);
        when(produtoRepository.findByStatusOrderByNomeAsc(StatusProduto.PUBLICADO))
            .thenReturn(List.of(polo, camisa));

        var resultado = produtoService.listarPublicados(null);

        assertThat(resultado).hasSize(2);
    }

    @Test
    void listarPublicados_comCategoria_filtraSomenteCategoriaEscolhida() {
        var polo = produto("Polo Classic", Categoria.POLO);
        var camisa = produto("Camisa Oxford", Categoria.CAMISA);
        when(produtoRepository.findByStatusAndCategoriaOrderByNomeAsc(
                StatusProduto.PUBLICADO, Categoria.POLO))
            .thenReturn(List.of(polo));

        var resultado = produtoService.listarPublicados(Categoria.POLO);

        assertThat(resultado).hasSize(1);
        assertThat(resultado.get(0).categoria()).isEqualTo(Categoria.POLO);
    }
}
```

- [ ] **Step 2: Rodar os testes e confirmar que falham**

```bash
cd /home/mag/Documents/magnossao-loja/magnossao-backend
./mvnw test -pl . -Dtest=ProdutoServiceTest -q 2>&1 | tail -20
```

Esperado: erro de compilação ou falha (`listarPublicados` não aceita parâmetro).

- [ ] **Step 3: Adicionar query no Repository**

O arquivo atual tem apenas `findByStatusOrderByNomeAsc`. Adicione:

```java
package com.magnossao.repository;

import com.magnossao.entity.Categoria;
import com.magnossao.entity.Produto;
import com.magnossao.entity.StatusProduto;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    List<Produto> findByStatusOrderByNomeAsc(StatusProduto status);

    List<Produto> findByStatusAndCategoriaOrderByNomeAsc(StatusProduto status, Categoria categoria);

    Optional<Produto> findBySlug(String slug);

    boolean existsBySlug(String slug);
}
```

- [ ] **Step 4: Atualizar ProdutoService**

**4a** — Atualizar `listarPublicados` para aceitar `Categoria` opcional (linha ~29):

```java
public List<ProdutoResumoResponse> listarPublicados(Categoria categoria) {
    if (categoria == null) {
        return produtoRepository.findByStatusOrderByNomeAsc(StatusProduto.PUBLICADO)
            .stream().map(this::toResumo).toList();
    }
    return produtoRepository.findByStatusAndCategoriaOrderByNomeAsc(StatusProduto.PUBLICADO, categoria)
        .stream().map(this::toResumo).toList();
}
```

**4b** — Atualizar `aplicarRequest` (linha ~201):

```java
private void aplicarRequest(Produto p, ProdutoRequest req) {
    p.setSlug(req.slug()); p.setNome(req.nome()); p.setNomeCurto(req.nomeCurto());
    p.setColecao(req.colecao()); p.setPreco(req.preco());
    p.setDescricao(req.descricao()); p.setDescricaoSeo(req.descricaoSeo());
    p.setCategoria(req.categoria());
}
```

**4c** — Atualizar `toResumo` (linha ~207):

```java
private ProdutoResumoResponse toResumo(Produto p) {
    String imagemPrincipal = p.getImagens().isEmpty() ? null : p.getImagens().getFirst().getUrl();
    return new ProdutoResumoResponse(p.getId(), p.getSlug(), p.getNome(), p.getNomeCurto(),
        p.getColecao(), p.getPreco(), p.getStatus().name(), imagemPrincipal, p.getCategoria());
}
```

**4d** — Atualizar `toResponse` — adicione `p.getCategoria()` após `p.getStatus().name()`:

```java
ProdutoResponse toResponse(Produto p) {
    return new ProdutoResponse(
        p.getId(), p.getSlug(), p.getNome(), p.getNomeCurto(),
        p.getColecao(), p.getPreco(), p.getDescricao(), p.getDescricaoSeo(),
        p.getStatus().name(),
        p.getCategoria(),
        p.getImagens().stream().map(i -> new ImagemDto(i.getId(), i.getUrl(), i.getAlt(), i.getOrdem())).toList(),
        p.getCores().stream().map(c -> new CorDto(c.getId(), c.getNome(), c.getToken(), c.getHex())).toList(),
        p.getTamanhos().stream().map(t -> new TamanhoDto(t.getId(), t.getLabel(), t.getPeito(), t.getComprimento(), t.getOmbro())).toList(),
        p.getSkus().stream().map(s -> new SkuDto(s.getId(), s.getCor().getId(), s.getTamanho().getId(), s.getCodigo(), s.isAtivo(), s.getQuantidade() > 0)).toList(),
        p.getBeneficios().stream().map(b -> new BeneficioDto(b.getId(), b.getIconeNome(), b.getTitulo(), b.getCorpo(), b.getOrdem())).toList(),
        p.getDetalhes().stream().map(d -> new DetalheDto(d.getId(), d.getLabel(), d.getUrlImagem(), d.getAlt(), d.getOrdem())).toList(),
        p.getReviews().stream().map(r -> new ReviewDto(r.getId(), r.getCitacao(), r.getNome(), r.getCidade())).toList(),
        p.getFaqs().stream().map(f -> new FaqDto(f.getId(), f.getPergunta(), f.getResposta(), f.getOrdem())).toList(),
        p.getRegraCashback() == null ? null : new RegraCashbackInfoDto(
            p.getRegraCashback().getPercentual(), p.getRegraCashback().getPrazoValidadeDias())
    );
}
```

- [ ] **Step 5: Atualizar ProdutoController**

```java
package com.magnossao.controller;

import com.magnossao.entity.Categoria;
import com.magnossao.service.ProdutoService;
import com.magnossao.dto.response.ProdutoResponse;
import com.magnossao.dto.response.ProdutoResumoResponse;
import com.magnossao.entity.StatusProduto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {

    private final ProdutoService produtoService;

    public ProdutoController(ProdutoService produtoService) {
        this.produtoService = produtoService;
    }

    @GetMapping
    public List<ProdutoResumoResponse> listar(
            @RequestParam(required = false) Categoria categoria) {
        return produtoService.listarPublicados(categoria);
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ProdutoResponse> buscar(@PathVariable String slug) {
        try {
            ProdutoResponse produto = produtoService.buscarPorSlug(slug);
            if (!produto.status().equals(StatusProduto.PUBLICADO.name())) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(produto);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
```

- [ ] **Step 6: Rodar os testes e confirmar que passam**

```bash
./mvnw test -pl . -Dtest=ProdutoServiceTest -q 2>&1 | tail -10
```

Esperado: `BUILD SUCCESS`, 2 testes passando.

- [ ] **Step 7: Rodar toda a suite**

```bash
./mvnw test -q 2>&1 | tail -15
```

Esperado: `BUILD SUCCESS`, sem regressão.

- [ ] **Step 8: Commit**

```bash
git add src/main/java/com/magnossao/repository/ProdutoRepository.java \
        src/main/java/com/magnossao/service/ProdutoService.java \
        src/main/java/com/magnossao/controller/ProdutoController.java \
        src/test/java/com/magnossao/service/ProdutoServiceTest.java
git commit -m "feat(catalogo): filtragem por categoria em listarPublicados + testes"
```

---

## Task 4: Frontend — Atualizar tipos TypeScript

**Files:**

- Modify: `magnossao-frontend/src/types/product.ts`

- [ ] **Step 1: Adicionar tipo Categoria e campo em ProdutoResumo**

No topo de `src/types/product.ts`, antes de qualquer outro tipo, adicione:

```typescript
export type Categoria = 'POLO' | 'CAMISA' | 'CALCA' | 'SHORTS'
```

No tipo `ProdutoResumo`, adicione o campo após `imagemPrincipal`:

```typescript
export type ProdutoResumo = {
  id: number
  slug: string
  nome: string
  nomeCurto: string | null
  colecao: string | null
  preco: number
  status: 'RASCUNHO' | 'PUBLICADO' | 'ARQUIVADO'
  imagemPrincipal: string | null
  categoria: Categoria | null
}
```

No tipo `Produto`, adicione `categoria: Categoria | null` após `status`:

```typescript
export type Produto = {
  id: number
  slug: string
  nome: string
  nomeCurto: string | null
  colecao: string | null
  preco: number
  descricao: string | null
  descricaoSeo: string | null
  status: 'RASCUNHO' | 'PUBLICADO' | 'ARQUIVADO'
  categoria: Categoria | null
  imagens: ImagemDto[]
  cores: CorDto[]
  tamanhos: TamanhoDto[]
  skus: SkuDto[]
  beneficios: BeneficioDto[]
  detalhes: DetalheDto[]
  reviews: ReviewDto[]
  faqs: FaqDto[]
  regraCashback: { percentual: number; prazoValidadeDias: number | null } | null
}
```

- [ ] **Step 2: Verificar tipos**

```bash
cd /home/mag/Documents/magnossao-loja/magnossao-frontend
npm run typecheck 2>&1 | tail -10
```

Esperado: sem erros relacionados a `Categoria`.

- [ ] **Step 3: Commit**

```bash
git add src/types/product.ts
git commit -m "feat(catalogo): adiciona Categoria ao tipo ProdutoResumo"
```

---

## Task 5: Frontend — ProductCard component

**Files:**

- Create: `magnossao-frontend/src/components/catalog/product-card.tsx`

- [ ] **Step 1: Criar o componente**

```tsx
// src/components/catalog/product-card.tsx
import Image from 'next/image'
import Link from 'next/link'
import { formatCurrency } from '@/lib/format'
import type { ProdutoResumo } from '@/types/product'

const CATEGORIA_LABEL: Record<string, string> = {
  POLO: 'Polo',
  CAMISA: 'Camisa',
  CALCA: 'Calça',
  SHORTS: 'Shorts',
}

export function ProductCard({ produto }: { produto: ProdutoResumo }) {
  return (
    <Link
      href={`/produto/${produto.slug}`}
      className="group block rounded-md overflow-hidden bg-white shadow-card hover:shadow-card-lg transition-shadow duration-200 ease-magn"
    >
      <div className="relative aspect-[4/3] bg-sand/40 overflow-hidden">
        {produto.imagemPrincipal ? (
          <Image
            src={produto.imagemPrincipal}
            alt={produto.nome}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 400px"
            className="object-cover group-hover:scale-[1.03] transition-transform duration-300 ease-magn"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-xs tracking-display text-navy/20 uppercase">
              Magnossão
            </span>
          </div>
        )}
        {produto.categoria && (
          <span className="absolute top-2 left-2 bg-navy text-gold font-ui text-[0.6rem] tracking-caps uppercase px-2 py-0.5 rounded-xs">
            {CATEGORIA_LABEL[produto.categoria] ?? produto.categoria}
          </span>
        )}
      </div>
      <div className="px-3 py-2.5">
        <p className="font-ui text-[0.75rem] font-semibold text-navy leading-snug line-clamp-1">
          {produto.nome}
        </p>
        {produto.colecao && (
          <p className="font-body text-[0.68rem] text-muted mt-0.5">{produto.colecao}</p>
        )}
        <p className="font-ui text-[0.8rem] font-bold text-gold mt-1">
          {formatCurrency(produto.preco)}
        </p>
      </div>
    </Link>
  )
}
```

- [ ] **Step 2: Verificar tipos**

```bash
cd /home/mag/Documents/magnossao-loja/magnossao-frontend
npm run typecheck 2>&1 | tail -10
```

Esperado: sem erros.

- [ ] **Step 3: Commit**

```bash
git add src/components/catalog/product-card.tsx
git commit -m "feat(catalogo): cria componente ProductCard"
```

---

## Task 6: Frontend — CatalogPage (Client Component)

**Files:**

- Create: `magnossao-frontend/src/components/catalog/catalog-page.tsx`

- [ ] **Step 1: Criar o componente**

```tsx
// src/components/catalog/catalog-page.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { ProductCard } from '@/components/catalog/product-card'
import type { Categoria, ProdutoResumo } from '@/types/product'
import { cn } from '@/lib/cn'

const CATEGORIAS: { value: Categoria; label: string }[] = [
  { value: 'POLO', label: 'Polo' },
  { value: 'CAMISA', label: 'Camisa' },
  { value: 'CALCA', label: 'Calça' },
  { value: 'SHORTS', label: 'Shorts' },
]

export function CatalogPage({ produtos }: { produtos: ProdutoResumo[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const categoriaAtiva = searchParams.get('categoria') as Categoria | null

  const produtosFiltrados = categoriaAtiva
    ? produtos.filter((p) => p.categoria === categoriaAtiva)
    : produtos

  const contagem = (cat: Categoria) => produtos.filter((p) => p.categoria === cat).length

  function selecionar(cat: Categoria | null) {
    const params = new URLSearchParams(searchParams.toString())
    if (cat) {
      params.set('categoria', cat)
    } else {
      params.delete('categoria')
    }
    router.push(`/produtos?${params.toString()}`)
  }

  return (
    <div className="flex gap-8 px-5 py-8 md:px-9 max-w-[1280px] mx-auto">
      {/* Sidebar */}
      <aside className="hidden md:block w-[120px] shrink-0">
        <p className="font-ui text-[0.6rem] font-bold tracking-caps uppercase text-navy mb-3">
          Categoria
        </p>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => selecionar(null)}
              className={cn(
                'flex items-center gap-2 font-ui text-[0.75rem] transition-colors',
                !categoriaAtiva ? 'text-navy font-semibold' : 'text-muted hover:text-navy'
              )}
            >
              <span
                className={cn(
                  'size-2.5 rounded-xs border',
                  !categoriaAtiva ? 'bg-navy border-navy' : 'border-black/20'
                )}
              />
              Todos ({produtos.length})
            </button>
          </li>
          {CATEGORIAS.map((c) => (
            <li key={c.value}>
              <button
                onClick={() => selecionar(c.value)}
                className={cn(
                  'flex items-center gap-2 font-ui text-[0.75rem] transition-colors',
                  categoriaAtiva === c.value
                    ? 'text-navy font-semibold'
                    : 'text-muted hover:text-navy'
                )}
              >
                <span
                  className={cn(
                    'size-2.5 rounded-xs border',
                    categoriaAtiva === c.value ? 'bg-navy border-navy' : 'border-black/20'
                  )}
                />
                {c.label} ({contagem(c.value)})
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Filtros mobile (pílulas) */}
      <div className="md:hidden w-full">
        <div className="flex gap-2 flex-wrap mb-6">
          <button
            onClick={() => selecionar(null)}
            className={cn(
              'px-3 py-1 rounded-full font-ui text-[0.7rem] tracking-wider uppercase border transition-colors',
              !categoriaAtiva
                ? 'bg-navy text-white border-navy'
                : 'border-black/20 text-muted hover:border-navy'
            )}
          >
            Todos
          </button>
          {CATEGORIAS.map((c) => (
            <button
              key={c.value}
              onClick={() => selecionar(c.value)}
              className={cn(
                'px-3 py-1 rounded-full font-ui text-[0.7rem] tracking-wider uppercase border transition-colors',
                categoriaAtiva === c.value
                  ? 'bg-navy text-white border-navy'
                  : 'border-black/20 text-muted hover:border-navy'
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
        <Grid produtos={produtosFiltrados} />
      </div>

      {/* Grid desktop */}
      <div className="hidden md:block flex-1">
        <p className="font-body text-[0.75rem] text-muted mb-4">
          {produtosFiltrados.length} {produtosFiltrados.length === 1 ? 'produto' : 'produtos'}
        </p>
        <Grid produtos={produtosFiltrados} />
      </div>
    </div>
  )
}

function Grid({ produtos }: { produtos: ProdutoResumo[] }) {
  if (produtos.length === 0) {
    return (
      <p className="font-editorial text-navy/40 text-lg italic py-16 text-center">
        Nenhum produto nesta categoria.
      </p>
    )
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {produtos.map((p) => (
        <ProductCard key={p.id} produto={p} />
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Verificar tipos**

```bash
cd /home/mag/Documents/magnossao-loja/magnossao-frontend
npm run typecheck 2>&1 | tail -10
```

Esperado: sem erros.

- [ ] **Step 3: Commit**

```bash
git add src/components/catalog/catalog-page.tsx
git commit -m "feat(catalogo): cria CatalogPage com sidebar e filtro por categoria"
```

---

## Task 7: Frontend — Página /produtos + link no header

**Files:**

- Create: `magnossao-frontend/src/app/produtos/page.tsx`
- Modify: `magnossao-frontend/src/components/layout/site-header.tsx`

- [ ] **Step 1: Criar a página Server Component**

```tsx
// src/app/produtos/page.tsx
import { Suspense } from 'react'
import type { Metadata } from 'next'
import { Footer } from '@/components/marketing/landing-page'
import { SiteHeader } from '@/components/layout/site-header'
import { CatalogPage } from '@/components/catalog/catalog-page'
import { getProducts } from '@/services/products'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Produtos | MAGNOSSÃO',
  description: 'Conheça a coleção completa Magnossão — polos, camisas, calças e mais.',
}

export default async function ProdutosPage() {
  const produtos = await getProducts()
  const publicados = produtos.filter((p) => p.status === 'PUBLICADO')

  return (
    <>
      <SiteHeader />
      <main>
        <div className="bg-navy pt-[76px]">
          <div className="max-w-[1280px] mx-auto px-5 md:px-9 py-10">
            <p className="font-ui text-[0.65rem] tracking-caps uppercase text-gold mb-3">
              Coleção 2026
            </p>
            <h1 className="font-display text-3xl text-white tracking-display">Produtos</h1>
            <div className="w-10 h-px bg-gold mt-4" />
          </div>
        </div>
        <Suspense>
          <CatalogPage produtos={publicados} />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
```

> **Nota:** `<Suspense>` é obrigatório porque `CatalogPage` usa `useSearchParams()`. Sem ele o build Next.js falha.

- [ ] **Step 2: Adicionar link "Produtos" no header**

Em `src/components/layout/site-header.tsx`, a array `nav` atual é:

```typescript
const nav = [
  { label: 'Produto', href: '/#produto' },
  { label: 'História', href: '/#historia' },
  { label: 'Tamanhos', href: '/#tamanhos' },
  { label: 'Avaliações', href: '/#avaliacoes' },
  { label: 'FAQ', href: '/#faq' },
]
```

Adicione o item `Produtos` no início:

```typescript
const nav = [
  { label: 'Produtos', href: '/produtos' },
  { label: 'Produto', href: '/#produto' },
  { label: 'História', href: '/#historia' },
  { label: 'Tamanhos', href: '/#tamanhos' },
  { label: 'Avaliações', href: '/#avaliacoes' },
  { label: 'FAQ', href: '/#faq' },
]
```

- [ ] **Step 3: Verificar tipos e build**

```bash
cd /home/mag/Documents/magnossao-loja/magnossao-frontend
npm run typecheck 2>&1 | tail -10
```

Esperado: sem erros.

- [ ] **Step 4: Commit**

```bash
git add src/app/produtos/page.tsx src/components/layout/site-header.tsx
git commit -m "feat(catalogo): cria página /produtos e adiciona link no header"
```

---

## Task 8: Backoffice — Tipos + ProductForm

**Files:**

- Modify: `magnossao-backoffice/src/types/product.ts`
- Modify: `magnossao-backoffice/src/components/admin/product-form.tsx`

- [ ] **Step 1: Atualizar tipos no backoffice**

Em `magnossao-backoffice/src/types/product.ts`, adicione no topo:

```typescript
export type Categoria = 'POLO' | 'CAMISA' | 'CALCA' | 'SHORTS'
```

Em `ProdutoResumo`, adicione `categoria: Categoria | null` após `imagemPrincipal`:

```typescript
export type ProdutoResumo = {
  id: number
  slug: string
  nome: string
  nomeCurto: string | null
  colecao: string | null
  preco: number
  status: 'RASCUNHO' | 'PUBLICADO' | 'ARQUIVADO'
  imagemPrincipal: string | null
  categoria: Categoria | null
}
```

Em `Produto`, adicione `categoria: Categoria | null` após `status`:

```typescript
export type Produto = {
  id: number
  slug: string
  nome: string
  nomeCurto: string | null
  colecao: string | null
  preco: number
  descricao: string | null
  descricaoSeo: string | null
  status: 'RASCUNHO' | 'PUBLICADO' | 'ARQUIVADO'
  categoria: Categoria | null
  imagens: ImagemDto[]
  cores: CorDto[]
  tamanhos: TamanhoDto[]
  skus: SkuDto[]
  beneficios: BeneficioDto[]
  detalhes: DetalheDto[]
  reviews: ReviewDto[]
  faqs: FaqDto[]
  regraCashback: { percentual: number; prazoValidadeDias: number | null } | null
}
```

- [ ] **Step 2: Atualizar ProductForm — FormState e estado inicial**

Em `src/components/admin/product-form.tsx`, o `FormState` atual é (linhas ~16-22):

```typescript
type FormState = {
  slug: string
  nome: string
  nomeCurto: string
  colecao: string
  // ... cashback fields
}
```

Adicione `categoria: string` ao tipo `FormState`:

```typescript
type FormState = {
  slug: string
  nome: string
  nomeCurto: string
  colecao: string
  categoria: string // ← adicionar
  cashbackPercentual: string
  cashbackPrazoValidadeDias: string
}
```

No `useState` de inicialização (linha ~49), adicione o campo `categoria`:

```typescript
const [form, setForm] = useState<FormState>({
  slug: produto?.slug ?? '',
  nome: produto?.nome ?? '',
  nomeCurto: produto?.nomeCurto ?? '',
  colecao: produto?.colecao ?? '',
  categoria: produto?.categoria ?? '', // ← adicionar
  cashbackPercentual: produto?.regraCashback?.percentual?.toString() ?? '',
  cashbackPrazoValidadeDias: produto?.regraCashback?.prazoValidadeDias?.toString() ?? '',
})
```

- [ ] **Step 3: Atualizar ProductForm — payload de salvar**

Na função `salvar` (linha ~83), o body atual é:

```typescript
const body = {
  slug: form.slug,
  nome: form.nome,
  nomeCurto: form.nomeCurto,
  colecao: form.colecao,
  // ...
}
```

Adicione `categoria` ao body:

```typescript
const body = {
  slug: form.slug,
  nome: form.nome,
  nomeCurto: form.nomeCurto,
  colecao: form.colecao,
  categoria: form.categoria || null, // ← adicionar (string vazia → null)
  preco: parseFloat(form.preco),
  descricao: form.descricao || null,
  descricaoSeo: form.descricaoSeo || null,
}
```

> **Nota:** se os campos `preco`, `descricao`, `descricaoSeo` não estiverem no `FormState` atual, não os inclua — só adicione `categoria`.

- [ ] **Step 4: Adicionar campo select na seção de informações básicas**

Localize o campo `colecao` no JSX (linha ~205):

```tsx
<input
  value={form.colecao}
  onChange={(e) => set('colecao', e.target.value)}
  ...
/>
```

Logo após esse campo, adicione o select de categoria. O `labelClass` e `inputClass` já estão definidos no componente:

```tsx
<div>
  <label className={labelClass}>Categoria</label>
  <select
    value={form.categoria}
    onChange={(e) => set('categoria', e.target.value)}
    className={inputClass}
  >
    <option value="">— Sem categoria —</option>
    <option value="POLO">Polo</option>
    <option value="CAMISA">Camisa</option>
    <option value="CALCA">Calça</option>
    <option value="SHORTS">Shorts</option>
  </select>
</div>
```

- [ ] **Step 5: Verificar tipos**

```bash
cd /home/mag/Documents/magnossao-loja/magnossao-backoffice
npm run typecheck 2>&1 | tail -10
```

Esperado: sem erros.

- [ ] **Step 6: Commit**

```bash
cd /home/mag/Documents/magnossao-loja/magnossao-backoffice
git add src/types/product.ts src/components/admin/product-form.tsx
git commit -m "feat(catalogo): adiciona campo categoria no ProductForm do backoffice"
```

---

## Task 9: Backoffice — Coluna Categoria na listagem

**Files:**

- Modify: `magnossao-backoffice/src/app/(admin)/page.tsx`

- [ ] **Step 1: Adicionar coluna Categoria na tabela**

O grid atual usa `grid-cols-[auto_1fr_auto_auto]` com colunas: imagem, nome, status, editar.

Altere o `grid-cols` para `grid-cols-[auto_1fr_auto_auto_auto]` e adicione o header e a célula de categoria.

**Header row** (linha ~45 do componente, onde monta o cabeçalho):

```tsx
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
```

**Row de produto** (dentro do `.map((p) => ...)`, altere também para `grid-cols-[3rem_1fr_auto_auto_auto]`):

```tsx
<div
  key={p.id}
  className="grid grid-cols-[3rem_1fr_auto_auto_auto] items-center gap-4 px-5 py-4 border-b border-black/5 last:border-0 hover:bg-sand/20 transition-colors group"
>
  {/* imagem e nome existentes — não mudar */}
  ...
  {/* Nova célula de categoria */}
  <span className="font-ui text-[0.65rem] tracking-wider text-navy/50">
    {p.categoria
      ? { POLO: 'Polo', CAMISA: 'Camisa', CALCA: 'Calça', SHORTS: 'Shorts' }[p.categoria]
      : '—'}
  </span>
  {/* status e editar existentes — não mudar */}
  ...
</div>
```

- [ ] **Step 2: Verificar tipos**

```bash
cd /home/mag/Documents/magnossao-loja/magnossao-backoffice
npm run typecheck 2>&1 | tail -10
```

Esperado: sem erros.

- [ ] **Step 3: Commit**

```bash
git add src/app/\(admin\)/page.tsx
git commit -m "feat(catalogo): adiciona coluna Categoria na listagem de produtos do backoffice"
```

---

## Verificação final

- [ ] Backend: `./mvnw test` passa sem regressão
- [ ] Frontend: `npm run typecheck` sem erros
- [ ] Backoffice: `npm run typecheck` sem erros
- [ ] Subir backend + testar `GET /api/produtos` e `GET /api/produtos?categoria=POLO` via curl/Insomnia
- [ ] Subir frontend (`npm run dev`): acessar `/produtos`, confirmar grid e filtro funcionando
- [ ] Subir backoffice (`npm run dev`): criar/editar produto com categoria, confirmar que aparece na listagem
