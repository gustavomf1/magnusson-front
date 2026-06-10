# Carrossel de produtos na home — Design

Data: 2026-06-10

## Objetivo

Na página inicial, remover a seção "Escolha sua cor" e colocar no lugar um
carrossel que vai mostrando alguns dos nossos produtos. Ao clicar em um produto,
o usuário vai para a página do produto. No header, remover a aba "Produto" e
manter apenas "Produtos".

## Decisões

- **Comportamento do carrossel:** auto-scroll contínuo + setas laterais para
  navegação manual.
- **Fundo:** escuro (`velvet-surface`), igual à seção "Escolha sua cor" atual.
- **Título:** eyebrow "Coleção Classic" + título "Nossos produtos".
- Sem novas dependências.

## Mudanças

### 1. Header (`src/components/layout/site-header.tsx`)

Remover do array `nav` a entrada `{ label: 'Produto', href: '/#produto' }`.
O `id="produto"` no Hero permanece; só some o link do menu (desktop e mobile,
ambos renderizam o mesmo array).

### 2. Landing (`src/components/marketing/landing-page.tsx`)

- Substituir `<ColorSection .../>` por `<ProductCarousel produtos={produtos} />`.
  Os produtos já chegam em `LandingPage` via props.
- Remover a função `ColorSection`. Se o cálculo de `destaque`/`preco` ficar sem
  uso após a remoção, removê-lo também (verificar outros usos antes).

### 3. Novo componente `src/components/catalog/product-carousel.tsx`

- `'use client'` (precisa de estado/refs para scroll e timer).
- Props: `{ produtos: ProdutoResumo[] }`.
- Se `produtos.length === 0`, retorna `null` (não renderiza a seção).
- Seção com `velvet-surface` + `noise-overlay`, usando `SectionHead`
  (eyebrow "Coleção Classic", título "Nossos produtos", `dark`).
- Trilho horizontal: container com `overflow-x-auto`, `scroll-smooth` e
  `scroll-snap-x`. Cada item reutiliza o `ProductCard` existente (card branco,
  já com `Link` para `/produto/${slug}` — resolve o clique → página do produto).
- Setas laterais (‹ ›) douradas que chamam `scrollBy` por aproximadamente a
  largura de um card.
- Auto-avanço lento via timer (`requestAnimationFrame` ou `setInterval`), que
  volta ao início (`scrollLeft = 0`) ao chegar no fim, criando loop.
- **Pausa** do auto-avanço ao passar o mouse (`onMouseEnter`/`onMouseLeave`) e
  enquanto o usuário interage com as setas.

## Casos de borda

- `produtos` vazio: seção não renderizada.
- Poucos produtos: carrossel funciona normalmente, apenas com menos movimento;
  se não há overflow, o auto-avanço não tem efeito visível (ok).

## Fora de escopo

- Filtro/seleção de quais produtos aparecem (usa a lista atual de `getProducts`).
- Mudanças no `ProductCard` ou na página `/produto/[slug]`.
