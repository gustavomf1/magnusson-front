# CLAUDE.md

Este arquivo fornece orientações ao Claude Code (claude.ai/code) ao trabalhar neste repositório.

## Stack

Next.js 15.1 · React 19 · TypeScript 5.7 (strict) · Tailwind CSS 3.4 · npm

## Comandos

```bash
npm run dev        # servidor de desenvolvimento
npm run build      # build de produção
npm run typecheck  # verificação de tipos TypeScript (sem emitir arquivos)
```

## Alias de importação

Use `@/*` para importar de `./src/*`:

```ts
import { cn } from '@/lib/cn'
import { products } from '@/data/product'
```

## Sistema de design — não alterar

As cores e tipografias da marca são fixas e não devem ser modificadas:
- Paleta definida em `tailwind.config.ts` (navy, gold, forest, sand, wine)
- Fontes definidas em `src/app/colors_and_type.css` (Cinzel, Cormorant Garamond, Inter, Montserrat)

## Backend Java (planejado)

Checkout e carrinho são intencionalmente só UI por enquanto. O backend Java ainda não existe — não simule chamadas de API nem adicione lógica de pagamento real.

## Commits

Use Conventional Commits: `feat:`, `fix:`, `chore:`, `refactor:`, etc.
