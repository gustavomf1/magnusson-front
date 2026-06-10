# Spec — Ver/Editar/Inativar produto + listagem com filtros e paginação

Data: 2026-06-10
Status: aprovado para planejamento

## Contexto

A gestão de produtos no backoffice hoje funciona assim:

- A home do admin (`magnossao-backoffice/src/app/(admin)/page.tsx`) lista **todos** os
  produtos via `GET /api/admin/produtos`, que retorna uma `List` completa, **sem
  paginação nem filtro**. Cada linha tem só um link "Editar" → `/produtos/[id]`.
- `/produtos/[id]` renderiza o `ProductForm` **já em modo de edição direto**.
- O `ProductForm` (`src/components/admin/product-form.tsx`) já salva dados básicos,
  cores, tamanhos, SKUs, **cashback** e publica/despublica. Não há ação de
  "inativar/arquivar" exposta (só "Voltar para rascunho").
- O backend já tem `StatusProduto { RASCUNHO, PUBLICADO, ARQUIVADO }` e o endpoint
  `PATCH /api/admin/produtos/{id}/status`. A loja pública (`ProdutoService.listarPublicados`
  e `buscarPorSlug`) já só mostra produtos `PUBLICADO` — ou seja, "sumir da prateleira"
  já é tecnicamente possível arquivando o produto.

## Objetivo

1. Abrir a ficha do produto em **modo visualização** (só-leitura), com botão para
   **habilitar a edição**.
2. Permitir **inativar** um produto (tirá-lo da prateleira) e reativá-lo.
3. Adicionar **filtros** (status, busca por nome, categoria) e **paginação server-side**
   na listagem de produtos do admin.

## Decisões tomadas

- **Inativar = `ARQUIVADO`** (reusa o status existente). Sem migration, sem novo status.
  Reativar manda o produto de volta para `RASCUNHO`, para o admin revisar antes de
  republicar pelo fluxo de requisitos atual.
- **Detalhe abre em só-leitura** com botão "Habilitar edição". Produto **novo** abre
  já em edição.
- **Filtros**: status, busca por nome/slug, e categoria.
- **Paginação server-side** (Spring) com **page size 20**, ordenado por nome.
- A ação de **inativar fica no detalhe** do produto (não na linha da listagem).
- **Front da loja não muda** — `ARQUIVADO` já é escondido.

## Mudanças por camada

### Backend (`magnossao-backend`)

**Listagem admin paginada e filtrada**

- `ProdutoRepository`: passa a `extends JpaSpecificationExecutor<Produto>` para combinar
  filtros opcionais. (Mantém os métodos derivados existentes usados pela loja pública.)
- `ProdutoService`: substitui `listarTodos()` por
  `listarAdmin(StatusProduto status, Categoria categoria, String busca, Pageable pageable)`,
  que monta uma `Specification` com os filtros não-nulos:
  - `status` igual (quando informado);
  - `categoria` igual (quando informada);
  - `busca`: `nome` **ou** `slug` contendo o termo, case-insensitive (quando não-vazia).
  - Retorna `PaginaResponse<ProdutoResumoResponse>` (mapeando via `toResumo`).
- Novo DTO `dto/response/PaginaResponse<T>(List<T> conteudo, int pagina, int totalPaginas, long totalItens)`.
  Evita serializar o `Page` do Spring diretamente (formato instável entre versões).
- `AdminProdutoController#listarTodos` → `listar(...)`:
  - `@RequestParam(required=false) StatusProduto status`
  - `@RequestParam(required=false) Categoria categoria`
  - `@RequestParam(required=false) String busca`
  - `@RequestParam(defaultValue="0") int page`
  - `@RequestParam(defaultValue="20") int size`
  - Monta `PageRequest.of(page, size, Sort.by("nome").ascending())`.
  - Retorna `PaginaResponse<ProdutoResumoResponse>`.

**Inativar / reativar**

- Sem endpoint novo: usa `PATCH /{id}/status`.
  - Inativar → `ARQUIVADO`.
  - Reativar → `RASCUNHO`.
- Conferir que `ProdutoService.mudarStatus` aceita `ARQUIVADO` sem exigir os requisitos
  de publicação (a validação atual só roda para `PUBLICADO`).

**Testes**

- Atualizar/adicionar testes em
  `src/test/java/com/magnossao/controller/AdminProdutoControllerTest.java` cobrindo:
  - listagem sem filtro (paginada);
  - filtro por status;
  - busca por nome;
  - filtro por categoria;
  - formato da `PaginaResponse` (conteudo/pagina/totalPaginas/totalItens).

### Backoffice (`magnossao-backoffice`)

**Tipos** (`src/types/product.ts`)

- Adicionar `export type Pagina<T> = { conteudo: T[]; pagina: number; totalPaginas: number; totalItens: number }`.

**Service** (`src/services/products.ts`)

- `getProdutosAdmin(params: { status?: string; categoria?: string; busca?: string; page?: number; size?: number }): Promise<Pagina<ProdutoResumo>>`
  montando a querystring para `/api/admin/produtos`.
- Reusar `mudarStatusProduto` para inativar (`ARQUIVADO`) e reativar (`RASCUNHO`).

**Listagem** (`src/app/(admin)/page.tsx`, server component)

- Lê `searchParams` (`status`, `busca`, `categoria`, `page`) — em Next 15 é `Promise`, então `await`.
- Busca a página via `apiFetchServer<Pagina<ProdutoResumo>>(...)` com a querystring.
- Barra de filtros como **client component** novo (ex.: `src/components/admin/product-filters.tsx`)
  que empurra os filtros para a URL via `useRouter().push` / `useSearchParams`:
  - select de status (Todos / Rascunho / Publicado / Arquivado);
  - campo de busca (nome/slug), com debounce ou submit;
  - select de categoria (Todas / Polo / Camisa / Calça / Shorts).
- Ação de linha "Editar" vira ícone de **olho** ("Ver") → `/produtos/[id]`.
- Rodapé com **paginação**: "Anterior" / "Próxima" (desabilitados nos limites) e
  "Página X de Y", preservando os filtros atuais na URL.
- Contador do topo passa a refletir `totalItens`.

**Detalhe / `ProductForm`** (`src/components/admin/product-form.tsx`)

- Novo estado `modo: 'view' | 'edit'`. Inicial:
  - produto existente (`produto?.id`) → `'view'`;
  - produto novo → `'edit'`.
- Topo do form: botão **"Habilitar edição"** (ícone lápis) em modo view;
  **"Cancelar edição"** em modo edit.
- Modo view:
  - envolver os campos/seções num `<fieldset disabled={modo === 'view'}>` para travar
    todos os inputs nativamente;
  - esconder os botões de ação (Atualizar, +Adicionar cor/tamanho, Gerar SKUs,
    Salvar cashback, Publicar/Inativar) quando em view.
- Seção **Publicação** ganha ações de status conforme o status atual:
  - `RASCUNHO`: "Publicar" (já existe) + "Inativar" (→ `ARQUIVADO`).
  - `PUBLICADO`: "Voltar para rascunho" (já existe) + "Inativar" (→ `ARQUIVADO`).
  - `ARQUIVADO`: "Reativar" (→ `RASCUNHO`).
- Salvar básico, cores, tamanhos, SKUs e **cashback** permanecem iguais — só visíveis/
  habilitados em modo edição.

### Front da loja (`magnossao-frontend`)

- **Sem mudança de código.** Verificar na etapa final que produtos `ARQUIVADO` não
  aparecem na listagem pública nem são acessíveis por slug (comportamento atual de
  `listarPublicados` e `buscarPorSlug`).

## Critérios de aceite

- [ ] `GET /api/admin/produtos` aceita `status`, `categoria`, `busca`, `page`, `size` e
      retorna `PaginaResponse` ordenado por nome.
- [ ] Filtrar por status/categoria/busca na listagem do admin funciona e reflete na URL.
- [ ] Paginação navega entre páginas preservando filtros.
- [ ] Abrir um produto existente mostra a ficha **só-leitura**; "Habilitar edição"
      libera todos os campos e ações.
- [ ] "Inativar" arquiva o produto; ele some da loja pública; "Reativar" o devolve
      para rascunho.
- [ ] Cashback e demais salvamentos continuam funcionando em modo edição.
- [ ] `npm run typecheck` (backoffice) e testes do backend passam.

## Fora de escopo

- Novo status `INATIVO` distinto de `ARQUIVADO`.
- Ação de inativar direto na linha da listagem.
- Exclusão definitiva (hard delete) de produtos.
- Mudanças no front da loja além da verificação de que arquivados ficam ocultos.
