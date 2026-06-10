# Fotos por cor — design

**Data:** 2026-06-10
**Status:** Aprovado para planejamento

## Problema

Hoje as fotos do produto pertencem ao **produto** (`ProdutoImagem.produto_id`). A galeria
da loja mostra todas as fotos do produto independentemente da cor selecionada, e o
swatch de cor é puramente visual. Queremos que cada **cor** tenha suas próprias fotos:
ao trocar a cor na loja, a galeria troca; no backoffice, o upload é por cor.

## Decisões

- **Modelo:** 100% por cor. Toda foto pertence a uma cor. Não existe mais foto "solta"
  no produto.
- **Fonte única:** a coleção canônica de imagens passa a viver na cor
  (`ProdutoCor.imagens`). `Produto.imagens` é removido.
- **API/tipos:** aninhado na cor — `CorDto.imagens: ImagemDto[]`; `ProdutoResponse`
  perde o campo `imagens`.
- **Dados atuais:** banco descartável (dev). Mesmo assim a migração faz backfill
  defensivo para manter o seed `V4` válido e o Flyway limpo.
- **Validação de publicação:** muda de "produto com ≥1 imagem" para
  **"cada cor com ≥1 foto"**.

## Estado atual (referência)

- `ProdutoImagem` (entity): `produto` (ManyToOne), `url`, `alt`, `ordem`, `storageChave`.
- `ProdutoCor` (entity): `produto`, `nome`, `token`, `hex`. Sem imagens.
- `Produto.imagens`: `@OneToMany @OrderBy("ordem ASC")`.
- Fluxo de upload: `POST /imagens/upload-url?contentType=` → PUT presigned no storage →
  `POST /imagens/confirmar {chave,url,alt}`.
- Endpoints (`AdminProdutoController`): `upload-url`, `confirmar`, `DELETE .../imagens/{id}`,
  `PUT .../imagens/ordem {ids}`, `POST .../cores`, `DELETE .../cores/{corId}`.
- `ProdutoService.gerarResumo`: `imagemPrincipal = p.getImagens().getFirst().getUrl()`.
- Loja `product-screen.tsx`: `images = produto.imagens` ordenadas; swatch só seleciona cor.
- Backoffice `product-form.tsx`: seções **Imagens** (ImageUploader, nível produto) e
  **Cores** separadas. `image-uploader.tsx` chama os endpoints acima.
- Schema gerido por **Flyway**, `spring.jpa.hibernate.ddl-auto: validate` → entidade
  precisa bater com o schema; toda mudança de schema exige migração nova.

## Mudanças por camada

### 1. Migração — `src/main/resources/db/migration/V11__imagem_por_cor.sql` (novo, Postgres)

```sql
ALTER TABLE produto_imagem ADD COLUMN cor_id BIGINT;

-- backfill: cada imagem vai para a 1ª cor do seu produto
UPDATE produto_imagem pi
SET cor_id = (
  SELECT pc.id FROM produto_cor pc
  WHERE pc.produto_id = pi.produto_id
  ORDER BY pc.id LIMIT 1
);

-- remove imagens cujo produto não tem nenhuma cor
DELETE FROM produto_imagem WHERE cor_id IS NULL;

ALTER TABLE produto_imagem
  ADD CONSTRAINT fk_produto_imagem_cor
  FOREIGN KEY (cor_id) REFERENCES produto_cor (id) ON DELETE CASCADE;

ALTER TABLE produto_imagem ALTER COLUMN cor_id SET NOT NULL;
```

### 2. Entidades

- **`ProdutoImagem`**: adicionar
  `@ManyToOne(fetch = LAZY) @JoinColumn(name = "cor_id", nullable = false) private ProdutoCor cor;`
  Manter `produto` (escopo/ownership e path `/produtos/{id}/...`). `ordem` passa a ser
  relativa à cor.
- **`ProdutoCor`**: adicionar
  `@OneToMany(mappedBy = "cor", cascade = ALL, orphanRemoval = true) @OrderBy("ordem ASC") private List<ProdutoImagem> imagens = new ArrayList<>();`
- **`Produto`**: remover o campo `imagens` e seu `@OneToMany`.

### 3. DTOs (response/request)

- `CorDto` → `record CorDto(Long id, String nome, String token, String hex, List<ImagemDto> imagens)`.
- `ImagemDto`: inalterado (`id, url, alt, ordem`).
- `ProdutoResponse`: remover o parâmetro `List<ImagemDto> imagens`.
- `ImagemConfirmacaoRequest` → adicionar `Long corId`.

### 4. `ProdutoService`

- `mapImagens` ao montar `CorDto`: `c.getImagens().stream().map(...).toList()`.
- Remover o mapeamento de `imagens` em `ProdutoResponse`.
- `gerarResumo` / `imagemPrincipal`: primeira foto da primeira cor —
  `p.getCores().stream().findFirst().flatMap(c -> c.getImagens().stream().findFirst()).map(ProdutoImagem::getUrl).orElse(null)`.
- `confirmarImagem(produtoId, corId, chave, url, alt)`: localizar a cor no produto
  (validar que pertence), `ordem = max(ordem da cor) + 1`, setar `produto` e `cor`.
- `deletarImagem`: busca a imagem nas cores do produto (não mais em `p.getImagens()`).
- `reordenarImagens(produtoId, ids)`: ids pertencem a **uma** cor; setar `ordem` pelo índice.
- Validação de pendências: substituir "pelo menos uma imagem" por
  **"cada cor precisa de pelo menos uma foto"** (itera cores; lista cores sem foto).

### 5. Controller — `AdminProdutoController`

- `POST /{id}/imagens/upload-url`: inalterado.
- `POST /{id}/imagens/confirmar`: passa a usar `req.corId()` no service.
- `DELETE /{id}/imagens/{imagemId}`, `PUT /{id}/imagens/ordem`: assinatura igual,
  comportamento escopado à cor (via service).
- Deletar cor (`DELETE /{id}/cores/{corId}`): já remove as fotos via cascade/orphanRemoval.

### 6. Tipos frontend (loja `src/types/product.ts` e backoffice `src/types/product.ts`)

- `CorDto` → adicionar `imagens: ImagemDto[]`.
- `Produto` → remover `imagens: ImagemDto[]`.

### 7. Loja — `product-screen.tsx`

- `const selectedCor = colors.find(...)` (já existe).
- `const images = (selectedCor?.imagens ?? []).slice().sort((a,b) => a.ordem - b.ordem)`.
- Resetar `activeImage` para 0 ao trocar de cor (efeito ou key na galeria).
- `addToCart`: `image: images[0]?.url ?? ''` (já usa `images[0]`, agora da cor).

### 8. Backoffice — `product-form.tsx` + `image-uploader.tsx`

- Remover a seção "Imagens" de nível produto e o estado `imagens`/`setImagens`.
- Na seção "Cores", cada cor renderiza seu próprio `ImageUploader`, recebendo `corId`
  e as imagens daquela cor; `onChange` atualiza `cor.imagens` dentro do estado `cores`.
- `image-uploader.tsx`:
  - Props ganham `corId: number`.
  - `confirmar`: body inclui `corId`.
  - `moverImagem`/reordenar: envia apenas os ids daquela cor.
- Checklist de pendências: trocar "Pelo menos 1 foto" por
  **"Cada cor com pelo menos 1 foto"** (todas as cores precisam ter `imagens.length > 0`).

## Critérios de aceite

1. No backoffice, é possível subir/remover/reordenar fotos **por cor**; cores diferentes
   têm galerias independentes.
2. Na loja, trocar o swatch de cor troca a galeria exibida e volta para a 1ª foto.
3. O card de catálogo usa a 1ª foto da 1ª cor como `imagemPrincipal`.
4. Publicar exige que **toda** cor tenha ≥1 foto; o checklist reflete isso.
5. Deletar uma cor remove suas fotos.
6. `npm run typecheck` (loja e backoffice) e o build do backend passam.

## Fora de escopo

- Reordenar cores.
- Foto "principal" por cor além da ordem (a 1ª da ordem já é a principal).
- Limpeza de objetos órfãos no storage ao deletar (comportamento atual mantido).
