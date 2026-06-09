# Design: Catálogo de Produtos — Página /produtos

**Data:** 2026-06-09  
**Status:** aprovado

---

## Objetivo

Criar a página pública `/produtos` no `magnossao-frontend` onde clientes navegam e filtram produtos por categoria. Inclui mudanças no backend (novo campo `categoria`) e no backoffice (formulário de produto).

---

## Escopo

Três repositórios são tocados:

| Repo                   | O que muda                                                                         |
| ---------------------- | ---------------------------------------------------------------------------------- |
| `magnossao-backend`    | Enum `Categoria`, migration, entidade, DTOs, endpoint com filtro                   |
| `magnossao-frontend`   | Tipo `ProdutoResumo`, página `/produtos`, componente `CatalogPage`, link no header |
| `magnossao-backoffice` | Tipo `Produto`, `ProductForm` com select de categoria, coluna na listagem          |

---

## Backend

### Enum `Categoria`

```java
public enum Categoria { POLO, CAMISA, CALCA, SHORTS }
```

### Migration Flyway

```sql
ALTER TABLE produto ADD COLUMN categoria VARCHAR(50);
```

Nullable — produtos existentes ficam sem categoria e aparecem apenas em "Todos".

### Entidade e DTOs

- `Produto` ganha campo `Categoria categoria` (nullable)
- `ProdutoResumo` (response DTO) expõe `categoria: Categoria | null`
- `ProdutoRequest` (create/update DTO) aceita `categoria: Categoria | null`

### Endpoint

`GET /api/produtos?categoria=POLO` — parâmetro opcional. Sem parâmetro retorna todos os publicados (comportamento atual preservado).

---

## Frontend — `/produtos`

### Estratégia de dados

- `page.tsx` é Server Component com `export const revalidate = 60`
- Chama `getProducts()` (sem filtro) e passa lista para Client Component
- Filtragem acontece no client via `useSearchParams` — sem nova chamada ao backend por clique

### URL

`/produtos?categoria=POLO` — URL compartilhável e indexável.

### Componentes

```
src/app/produtos/page.tsx          ← Server Component (ISR 60s)
src/components/catalog/catalog-page.tsx  ← Client Component (sidebar + grid)
src/components/catalog/product-card.tsx  ← card individual
```

### Layout (aprovado)

- Header navy com hero título "Produtos"
- Sidebar esquerda (110px): label "CATEGORIA", lista com contagem por categoria, item ativo marcado
- Grid 3 colunas com cards compactos: foto 80px altura, badge de categoria, nome, preço gold
- Clique no card → `/produto/[slug]`
- **Mobile:** sidebar vira pílulas horizontais no topo, grid 1 coluna

### Tipo atualizado

```typescript
// src/types/product.ts
export type Categoria = 'POLO' | 'CAMISA' | 'CALCA' | 'SHORTS'

export type ProdutoResumo = {
  id: number
  slug: string
  nome: string
  nomeCurto: string | null
  colecao: string | null
  preco: number
  status: 'RASCUNHO' | 'PUBLICADO' | 'ARQUIVADO'
  imagemPrincipal: string | null
  categoria: Categoria | null // ← novo
}
```

### Link no header

`site-header.tsx` ganha link "Produtos" apontando para `/produtos`.

---

## Backoffice

### Tipo atualizado

`src/types/product.ts` no backoffice ganha `Categoria` e o campo `categoria` em `Produto` e `ProdutoResumo`.

### ProductForm

- Novo campo `categoria` (select `<select>` nativo ou primitivo existente) na seção de informações básicas, após `colecao`
- Opções: `—` (null), Polo, Camisa, Calça, Shorts
- Enviado no payload de create/update

### Listagem de produtos (`/`)

- Coluna "Categoria" na tabela, exibida com badge de cor ou texto, após "Status"

---

## O que não está no escopo

- Filtro por preço ou cor (futuro)
- Paginação (catálogo pequeno, não necessário agora)
- SEO por categoria (`/produtos/polo`) — URL param é suficiente por enquanto
