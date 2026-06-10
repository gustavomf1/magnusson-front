# Design: Redesign visual da página `/produtos`

**Data:** 2026-06-10
**Status:** aprovado

---

## Objetivo

Atualizar o visual da página `/produtos` (hero, sidebar de filtros, grid de cards e
banner final) para alinhar com o redesign de referência (`Produtos - Redesenho.html`,
`Catalog.jsx`, `App.jsx`), reaproveitando o design system existente
(`colors_and_type.css`, `tailwind.config.ts`, `primitives.tsx`).

Escopo: **somente `magnossao-frontend`**, restyle visual com os dados que
`ProdutoResumo` já expõe hoje (`id`, `slug`, `nome`, `nomeCurto`, `colecao`, `preco`,
`status`, `imagemPrincipal`, `categoria`). Sem mudanças de backend.

---

## Fora de escopo (anotar para o futuro)

- Swatches de cor por produto e filtro "Cor" na sidebar — `ProdutoResumo` não expõe
  cores hoje (cores existem só no detalhe do produto, via `CorDto`).
- Badges "Novo" / "Esgotado" / preço promocional ("de/por") — sem campos no DTO.
- "Adicionar rápido" / wishlist no hover do card — adicionar ao carrinho exige
  `skuId` + tamanho + cor (ver `cart-context.tsx`), não dá pra fazer a partir do card
  da listagem sem essas escolhas.

---

## Arquivos afetados

```
src/app/produtos/page.tsx                  ← hero + estrutura da página
src/components/catalog/catalog-page.tsx    ← sidebar + results bar + grid + empty state
src/components/catalog/product-card.tsx    ← redesign do card
```

Nenhum tipo novo, nenhuma chamada extra ao backend. `getProducts()` continua sem filtro,
filtragem/ordenação client-side via `useSearchParams` (padrão já usado).

---

## 1. Hero band (`page.tsx`)

Substitui o hero atual (simples, `bg-navy` + eyebrow + h1 + underline) pelo hero
editorial do mockup:

- Fundo: gradiente navy (`bg-navy` → `bg-navy-deep`), com `OncaMark` em opacidade baixa
  posicionado à direita como marca d'água (igual `.hero-onca` do mockup).
- Breadcrumb: "Início / Coleção 2026" — "Início" linka para `/`.
- `Eyebrow` "A Coleção" em gold.
- `<h1>` "Produtos" — serif display, `clamp(2.75rem, 5.5vw, 4.375rem)`, uppercase,
  `tracking-display`.
- `Flourish` (losango + linha gold).
- Parágrafo editorial em itálico (texto do mockup, mantido):
  > "Raiz nórdica, alma brasileira. Cada peça carrega a onça pintada bordada — feita
  > para atravessar tendências, não segui-las."

Reaproveita `Eyebrow`, `Flourish`, `OncaMark` de `primitives.tsx`. Sem novos componentes.

---

## 2. Sidebar de filtros (`catalog-page.tsx`)

### Layout

- `lg:` e acima: rail sticky de 256px (`lg:grid-cols-[256px_1fr]`, `lg:sticky lg:top-24`).
- Abaixo de `lg`: filtros viram uma linha horizontal acima do grid (Categoria + Coleção
  lado a lado, com wrap), card "Feito no Brasil" oculto.

### Categoria

Mantém a lógica atual (`?categoria=POLO|CAMISA|CALCA|SHORTS`, contagem por categoria,
"Todos"), restilizada:

- Título da seção "Categoria" com linha divisória à direita (estilo `RailTitle` do
  mockup).
- Cada item: marcador losango (rotacionado 45°), label, contagem `tabular-nums`.
- Ativo: fundo navy, texto/marcador gold, barra dourada de 3px à esquerda (`::before`
  via `absolute`).
- Contagem 0: item desabilitado (sem `onClick`), cor acinzentada (`text-black/30`),
  marcador com borda fraca.

### Coleção

- Pills (`CollChip` do mockup): "Todas" + cada valor distinto de `colecao` presente em
  `produtos` (calculado com `Array.from(new Set(...))`, ignorando `null`).
- **Renderiza só se houver 2+ valores distintos** — com 1 só coleção (cenário atual:
  "Classic"), a seção inteira não aparece.
- URL param `?colecao=<valor>`; ativo = fundo navy / texto gold.

### Card "Feito no Brasil"

- Estático, visível só em `lg:` e acima (oculto no fluxo mobile/tablet).
- `OncaMark` (48px) + título "Feito no Brasil" (display, navy) + texto editorial em
  itálico: "Algodão Pima & bordado da onça em cada peça da casa." — fundo gradiente
  branco → `#FBF8F1`, borda sutil, `rounded-lg`.

---

## 3. Results bar + grid + empty state (`catalog-page.tsx`)

### Results bar

- Esquerda: "**N** peça(s) na coleção" — `N` = `produtosFiltrados.length`, singular/plural
  ajustado, número em navy, resto em `text-fg-3`/uppercase/tracking-caps.
- Direita: label "Ordenar" + `<select>` nativo restilizado (pill, seta custom via
  `background-image` SVG inline, igual mockup) com opções:
  - `relevance` → "Relevância" (ordem da API, default)
  - `price-asc` → "Menor preço"
  - `price-desc` → "Maior preço"
- Novo URL param `?sort=`.
- Borda inferior (`border-b border-divider`) separando da grid.

### Grid

- `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7`.
- Aplica filtro de categoria (existente) + filtro de coleção (novo) + ordenação por
  `sort` antes de renderizar.

### Empty state

Quando `produtosFiltrados.length === 0`:

- Centralizado, `grid-column: 1 / -1`.
- Anel circular com ícone `SearchX` (lucide), borda gold.
- Título "Nenhuma peça encontrada" (display, navy).
- Texto "Tente remover algum filtro ou explorar a coleção inteira." (editorial itálico).
- Botão "Limpar filtros" (`Button variant="primary"`) — limpa `categoria` e `colecao`
  da URL (mantém `sort`).

---

## 4. Card redesign (`product-card.tsx`)

Card inteiro continua um `<Link href="/produto/[slug]">`.

- **Media**: `aspect-[4/5]` (era `4/3`), `overflow-hidden`, imagem com
  `group-hover:scale-105` e transição `700ms`. Placeholder sem imagem: mantém o
  wordmark "MAGNOSSÃO" centralizado, ajustado pro novo aspect ratio.
- **Badge de categoria**: pill `top-3 left-3`, fundo navy / texto gold, `rounded-full`,
  `text-[10px]` uppercase `tracking-caps` (versão arredondada do badge atual).
- **Corpo** (`p-5`/`p-6`):
  - "Coleção {colecao}" — eyebrow `text-[9.5px]` uppercase, `tracking-[0.22em]`,
    `text-gold-deep` — só renderiza se `colecao` existir.
  - Nome do produto — `font-display`, `text-[1.2rem]`, uppercase, `tracking-display`,
    `text-navy`, `line-clamp-2` (substitui o `line-clamp-1` atual em `font-ui`).
  - Linha divisória (`border-t border-divider`) acima do rodapé.
  - Rodapé: preço à esquerda (`font-display text-xl text-navy`), "Ver produto →" à
    direita (`text-fg-3`, vira `text-gold-deep` no hover do card, seta desliza
    `translate-x-1`).
- **Hover do card**: `translateY(-6px)` + `shadow-card-lg` (substitui o
  `hover:shadow-card-lg` simples atual — adiciona o lift).

---

## 5. Banner final (`catalog-page.tsx`, após o grid)

Reaproveita o layout split do "destaque" do mockup, mas com conteúdo editorial
genérico de marca (não uma coleção "Premium" inexistente):

- `grid-cols-1 lg:grid-cols-[1.05fr_1fr]`, `rounded-xl`, `overflow-hidden`,
  `shadow-card-lg`, `mt-16`.
- Painel esquerdo: imagem `assets/polo-gold-detail.png` (`object-cover`,
  `min-h-[260px] lg:min-h-[360px]`).
- Painel direito: fundo gradiente navy → navy-deep, padding generoso, texto offwhite:
  - `Eyebrow` "Tradição Magnossão" (gold).
  - Título "Bordado da onça em cada peça" (display, uppercase).
  - Parágrafo editorial itálico sobre Algodão Pima / feito no Brasil / bordado da onça.
  - `ButtonLink` "Conhecer a história" → `/#historia` (`variant="outlineDark"`).
- Mobile (`< lg`): empilha verticalmente, imagem em cima.

---

## Responsivo — resumo

| Breakpoint     | Sidebar                                               | Grid      | Banner                     |
| -------------- | ----------------------------------------------------- | --------- | -------------------------- |
| `< sm` (640px) | linha horizontal de filtros, "Feito no Brasil" oculto | 1 coluna  | empilhado (imagem em cima) |
| `sm`–`lg`      | linha horizontal de filtros, "Feito no Brasil" oculto | 2 colunas | empilhado                  |
| `≥ lg`         | rail sticky 256px, todos os blocos visíveis           | 3 colunas | lado a lado                |

Hero usa `clamp()` para o tamanho do `<h1>`, sem breakpoints adicionais.

---

## Testes / verificação

- `npm run typecheck` limpo.
- Navegação manual: filtro de categoria, ordenação por preço, empty state (filtrar
  categoria sem produtos), hover dos cards, responsivo (mobile/tablet/desktop) via
  Playwright.
