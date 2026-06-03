# MAGNOSSÃO Frontend

Primeira versão do frontend da MAGNOSSÃO, marca premium brasileira de polos.

Raiz nórdica. Alma brasileira.

## Stack

- Next.js com React e TypeScript
- Tailwind CSS
- lucide-react para iconografia
- `next/image` para imagens otimizadas
- Conteúdo hardcoded em `src/data/product.ts`
- Carrinho com estado local, sem backend

O backend de pagamento pode ser conectado depois por API Java sem mudar a estrutura visual atual.

## Como rodar

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

Rotas principais:

- `/` landing page completa
- `/classic` página de produto
- `/produto/classic` alias da página de produto
- `/checkout` placeholder do checkout

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run typecheck
```

## Assets e design system

Os assets oficiais foram copiados para `public/assets`.

Os tokens de marca foram importados em `src/app/colors_and_type.css` e também mapeados no `tailwind.config.ts` com os nomes da paleta:

- `navy`
- `gold`
- `forest`
- `sand`
- `wine`
- `graphite`
- `offwhite`

## SEO

Implementado:

- Metadata global
- Metadata da página de produto
- Open Graph image
- Twitter card
- Structured data de `Organization`
- Structured data de `Product`

## Diferenças do protótipo

- O protótipo usava roteamento simulado em um único `App.jsx`; esta versão usa rotas reais do Next.js.
- A seção de cores usa a foto oficial com as cinco variantes e swatches clicáveis. Não havia assets isolados para cada cor, então não foram inventadas novas fotos.
- O carrinho agrega itens iguais por cor e tamanho para ficar mais próximo de uma loja real.
- O checkout é apenas um placeholder, conforme o escopo.
- O deploy Vercel e o repositório GitHub dependem de credenciais externas. A aplicação está pronta para subir assim que o repositório remoto for criado.

## Deploy Vercel

Depois de publicar o repo no GitHub, importe o projeto na Vercel com as configurações padrão para Next.js.

Build command:

```bash
npm run build
```

Output:

```bash
.next
```
