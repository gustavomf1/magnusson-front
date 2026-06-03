# MAGNOSSÃO — Design Brief Completo

**Para:** Claude Design  
**Projeto:** MAGNOSSÃO — E-commerce de moda premium brasileira  
**Data:** 2026-05-22  
**Escopo:** Vitrine pública + Painel administrativo

---

## 1. Identidade da Marca

### Essência
MAGNOSSÃO é uma marca de vestuário premium brasileira com alma nórdica. O produto principal é a Polo MAGNOSSÃO Classic — uma camisa polo de algodão pima de alta qualidade. A marca posiciona-se entre o luxo acessível e o artesanal sofisticado. Tom: discreto, confiante, atemporal.

**Tagline visual:** "Raiz nórdica. Alma brasileira."

### Personalidade Visual
- Austero mas caloroso
- Premium sem ostentação
- Editorial, não gritante
- Detalhes que revelam qualidade (não volume)

---

## 2. Sistema de Design

### Paleta de Cores

| Token | Hex | Uso |
|-------|-----|-----|
| `navy` | `#0B1F3A` | Cor primária da marca, fundos premium, header |
| `navy-deep` | `#061226` | Sombras velvet, fundo hero escuro |
| `navy-tint` | `#15315A` | Hover/elevação sobre navy |
| `gold` | `#D4AF37` | CTAs, acentos, detalhes |
| `gold-deep` | `#B89126` | Hover de botões gold, eyebrows |
| `gold-soft` | `#E6C76A` | Highlights, borda foil |
| `forest` | `#1E3A2A` | Cor de produto (variante verde) |
| `wine` | `#7A1E23` | Campanhas especiais, danger/error |
| `sand` | `#D8C7AE` | Fundos alternativos, cor de produto |
| `offwhite` | `#F8F6F0` | Fundo padrão de página |
| `white` | `#F5F5F5` | Campos limpos, cards |
| `graphite` | `#2A2A2A` | Cards escuros, footer |
| `black` | `#111111` | Texto primário |
| `muted` | `#666666` | Texto secundário/meta |

**Gradientes importantes:**
- Fundo velvet (hero navy): `radial-gradient(120% 80% at 50% 0%, rgba(212,175,55,0.06) 0%, transparent 60%), linear-gradient(180deg, #0B1F3A 0%, #061226 100%)`
- Fundo areia: `linear-gradient(180deg, #EDE2CC 0%, #D8C7AE 100%)`
- Divisória gold: linha horizontal com `linear-gradient(90deg, transparent, #D4AF37, transparent)` + diamante central

### Tipografia

| Papel | Fonte | Uso |
|-------|-------|-----|
| `display` / `rune` | **Cinzel** (serif, caps) | Wordmark, H1, H2, títulos editoriais, eyebrows de seção |
| `editorial` | **Cormorant Garamond** (serif itálico) | Parágrafos longos, citações, textos de história da marca |
| `body` | **Inter** (sans) | Corpo de texto, UI, labels de formulário |
| `ui` | **Montserrat** (sans, caps) | Botões, labels, badges, nav, tags |

**Escala tipográfica:**
- Display XL: 88px (hero headline)
- Display L: 64px
- H1: 48px
- H2: 36px
- H3: 26px
- H4: 20px
- Body: 16px
- Small: 14px
- Micro: 12px

**Letter spacing:**
- Títulos Cinzel: `0.06em`
- UI caps / eyebrows: `0.18em`
- Rune display: `0.14em`

### Bordas e Sombras

| Token | Valor |
|-------|-------|
| Border radius padrão | `6px` (botões, inputs) |
| Border radius card | `10px` |
| Border radius hero panel | `16px` |
| Shadow card | `0 1px 2px rgba(11,31,58,0.04), 0 8px 24px rgba(11,31,58,0.06)` |
| Shadow foil (gold) | `0 0 0 1px rgba(212,175,55,0.55), 0 8px 24px rgba(11,31,58,0.18)` |
| Hairline | `1px solid rgba(17,17,17,0.10)` |
| Hairline gold | `1px solid rgba(212,175,55,0.45)` |

### Motion
- Easing: `cubic-bezier(0.22, 0.61, 0.36, 1)`
- Fast: 160ms | Base: 240ms | Slow: 420ms

---

## 3. Componentes Globais — Vitrine Pública

### 3.1 Header / Site Header
- Fundo: navy `#0B1F3A`
- Logo "MAGNOSSÃO" em Cinzel, dourado, letter-spacing `0.18em`, uppercase
- Nav links: Montserrat small caps, branco
- Ícone de carrinho à direita com badge numérico (count de itens) em gold
- Sticky no scroll, sutil blur/transparência ao scrollar

### 3.2 Cart Drawer (Gaveta do Carrinho)
- Abre pela direita como overlay
- Header da gaveta: "Seu Carrinho" em Cinzel + botão fechar
- Lista de itens: miniatura do produto, nome, cor, tamanho, quantidade (stepper), preço
- Subtotal em destaque (Cinzel, tamanho H3)
- Botão CTA gold "Finalizar Pedido" — largura total, Montserrat caps
- Botão secundário "Continuar Comprando"
- Estado vazio: ícone + mensagem + link para catálogo

### 3.3 Footer
- Fundo graphite `#2A2A2A`
- Coluna 1: Logo + tagline editorial em Cormorant Garamond itálico
- Coluna 2: Links (Coleção, Sobre, Contato, Política de Privacidade)
- Coluna 3: Redes sociais (Instagram principalmente)
- Rodapé: copyright + "Feito com cuidado no Brasil"
- Divisória gold hairline no topo

---

## 4. Vitrine Pública — Telas

### 4.1 Landing Page — `/`
**Já existe mas serve de referência visual**

Seções (de cima para baixo):
1. **Hero** — fundo velvet navy, headline Cinzel 88px em offwhite, subtítulo Cormorant Garamond itálico, botão CTA gold "Ver Produto"
2. **Benefícios** — fundo offwhite, 4 colunas com ícone + título + descrição (ícones Lucide)
3. **Cores** — swatches dos produtos disponíveis
4. **História da Marca** — fundo areia, texto editorial longo, imagem de produto
5. **Detalhes do Produto** — foto grande + lista de detalhes (composição, acabamento)
6. **Guia de Tamanhos** — tabela P/M/G/GG com medidas em cm
7. **Reviews** — depoimentos de clientes com estrelas e foto/avatar
8. **FAQ** — accordion de perguntas frequentes
9. **CTA Final** — fundo navy, headline + botão gold

---

### 4.2 Página de Produto — `/produto/[slug]`

**Layout:** 2 colunas (desktop), stack (mobile)

**Coluna Esquerda — Galeria:**
- Imagem principal grande
- Thumbnails horizontais abaixo (mínimo 4-6 fotos)
- Troca de imagem ao clicar no thumb
- Zoom ao hover (desktop)

**Coluna Direita — Compra:**
- Eyebrow: coleção (Montserrat caps, gold-deep)
- Nome do produto: Cinzel H1
- Preço: Cinzel H3 — quando há preço promocional, exibir o original riscado em muted + novo preço em gold
- Selos/certificações: chips pequenos (ex: "Algodão Pima", "Feito no Brasil")
- **Seletor de cor:** botões com círculo colorido + nome. Estado: selecionado (borda gold + check), hover, esgotado (risco diagonal)
- **Seletor de tamanho:** P | M | G | GG em buttons. Estado: selecionado (fundo navy, texto gold), disponível, esgotado (cinza, cursor not-allowed)
- **Calculadora de frete:** campo CEP + botão "Calcular" → exibe opções inline (nome do método, prazo, preço)
- Botão CTA "Adicionar ao Carrinho" — gold, largura total, Montserrat caps 14px
- Seção expansível "Composição & Cuidados"
- Seção expansível "Troca e Devolução"

**Estados a projetar:**
- Tamanho não selecionado ao tentar adicionar → shake + mensagem de erro inline
- Adicionando ao carrinho → loading no botão → sucesso (drawer abre)
- CEP inválido → erro inline
- Frete calculado → lista de opções com rádio

---

### 4.3 Catálogo — `/colecao`

**Layout:** Grid 3 colunas (desktop), 2 (tablet), 1 (mobile)

**Card de Produto:**
- Imagem quadrada ou 4:5 com hover suave (leve zoom)
- Tag de coleção (eyebrow)
- Nome do produto (Cinzel H4)
- Preço (Cinzel)
- Selos rápidos abaixo do preço
- Botão "Ver produto" aparece no hover

**Filtros (lateral ou topo):**
- Por coleção
- Por cor (swatches)
- Ordenação: relevância, menor preço, maior preço, novidades

**Estado vazio:** ilustração + "Nenhum produto encontrado com esses filtros"

---

### 4.4 Checkout — `/checkout`

Barra de progresso no topo com 3 etapas: **Identificação → Entrega → Pagamento**

**Layout:** 2 colunas (formulário esquerda + resumo do pedido direita — sticky)

**Resumo do Pedido (coluna direita, sticky):**
- Miniatura + nome + cor + tamanho + qtd de cada item
- Subtotal
- Frete (aparece após etapa 2)
- **Total** em destaque (Cinzel H3)

---

#### Etapa 1 — Identificação

Campos:
- Nome completo
- Email
- Telefone (com máscara: `(99) 99999-9999`)
- CPF (com máscara: `999.999.999-99` + validação de dígitos)

Botão: "Continuar para Entrega" → gold, CTA primário

**Estados:** campo com erro (borda wine + mensagem abaixo), campo válido (borda green sutil), loading ao avançar

---

#### Etapa 2 — Entrega

Campos:
- CEP (máscara `99999-999`) + botão "Buscar"
  - Loading enquanto busca
  - Erro: "CEP não encontrado"
  - Sucesso: auto-preenche logradouro, bairro, cidade, estado
- Logradouro (auto-preenchido, editável)
- Número
- Complemento (opcional)
- Bairro (auto-preenchido, editável)
- Cidade (auto-preenchido, read-only)
- Estado (auto-preenchido, read-only)

**Opções de Frete** (aparecem automaticamente após CEP válido):
- Cards de seleção: logo da transportadora, nome do método, prazo estimado, preço
- Estado: selecionado (borda gold + check), hover, loading skeleton enquanto calcula
- Ex: "PAC — Correios · 8 dias úteis · R$ 19,90"
- Ex: "SEDEX — Correios · 3 dias úteis · R$ 34,90"

Botão: "Continuar para Pagamento" → habilitado somente se frete selecionado

---

#### Etapa 3 — Pagamento

**Tabs de método:** PIX | Cartão de Crédito | Boleto

**Tab PIX:**
- QR Code centralizado (imagem, ~200×200px)
- Código copia-e-cola em monospace com botão "Copiar"
- Contador regressivo de expiração: "Expira em 29:47" (vermelho quando < 5min)
- Instrução: "Abra o app do seu banco e escaneie o QR Code"
- Badge "Aprovação imediata"

**Tab Cartão de Crédito:**
- Brick do Mercado Pago embutido (hosted, PCI-compliant) — componente externo estilizado para combinar com a paleta
- Seletor de parcelas (dropdown): "1× R$ 249,90 sem juros", "2× R$ 124,95 sem juros", etc.

**Tab Boleto:**
- Código de barras (imagem ou representação visual)
- Código numérico com botão "Copiar"
- Botão "Imprimir boleto"
- Aviso: "Vence em 3 dias úteis. Após pagamento, o pedido é confirmado em até 2 dias."

Botão: "Confirmar Pedido" → gold, largura total

---

### 4.5 Confirmação — `/checkout/confirmacao/[orderNumber]`

**Layout:** Centralizado, max-width 640px

**Topo:**
- Ícone de sucesso grande (check em círculo gold ou animado)
- Headline: "Pedido Recebido!" (Cinzel H1)
- Número do pedido em destaque: "MGN-2026-00001" (Montserrat mono)

**Cards de informação:**
- Resumo dos itens comprados (compacto)
- Endereço de entrega
- Método de pagamento + status

**Instruções por método:**
- **PIX:** "Aguardando pagamento... seu pedido será confirmado assim que identificarmos o PIX." + spinner + opção de ver QR code novamente
- **Boleto:** "Seu boleto vence em 3 dias. Após pagamento, confirmamos em até 2 dias úteis." + botão "Ver boleto"
- **Cartão aprovado:** "Pagamento aprovado! Seu pedido entrou em produção." badge verde
- **Cartão recusado:** "Pagamento não aprovado. Tente outro cartão ou método." badge vermelho

**CTA:** "Acompanhar meu pedido" → link para `/pedido/[orderNumber]`

---

### 4.6 Acompanhamento de Pedido — `/pedido/[orderNumber]`

**Tela de entrada (não autenticado):**
- Card centralizado: campos "Número do pedido" + "Email usado no pedido" + botão "Buscar"
- Erro: "Pedido não encontrado para esse email"

**Tela do pedido (autenticado):**

**Timeline visual (vertical, lado esquerdo):**
Cada etapa tem: ícone circular, título, data/hora (quando disponível)
```
● Pedido realizado          (sempre preenchido)
● Pagamento confirmado      (verde quando pago)
○ Em preparação             (cinza quando não atingido)
○ Enviado                   (cinza)
○ Entregue                  (cinza)
```
Etapas cancelado/reembolsado: vermelhos, substituem o fluxo normal.

**Coluna direita:**
- Resumo dos itens
- Endereço de entrega
- Método de pagamento
- Código de rastreamento (quando disponível): clicável → abre Correios/transportadora

---

## 5. Painel Administrativo — `magnossao-admin`

### Identidade do Admin
Diferente da vitrine: funcional, denso em dados, sem fontes de display. Usa **Inter** para tudo. Mesmas cores de marca aplicadas de forma sobria.

**Palette admin:**
- Fundo de página: `#F8F8F8` (quase branco)
- Sidebar: navy `#0B1F3A`
- Acentos: gold `#D4AF37`
- Cards: branco `#FFFFFF` com sombra leve
- Texto: `#111111` primário, `#666666` muted

---

### 5.0 Layout Global do Admin

**Sidebar (esquerda, fixa):**
- Fundo navy
- Logo MAGNOSSÃO no topo em gold
- Itens de navegação com ícone Lucide + label:
  - Dashboard (ícone: LayoutDashboard)
  - Produtos (ícone: ShirtIcon ou Package)
  - Pedidos (ícone: ShoppingBag)
  - Clientes (ícone: Users)
  - Financeiro (ícone: BarChart2)
  - Configurações (ícone: Settings)
- Item ativo: fundo `rgba(212,175,55,0.15)`, borda esquerda gold 3px, texto gold
- Hover: fundo `rgba(255,255,255,0.08)`
- Avatar + nome do usuário no rodapé da sidebar + botão de logout

**Header do admin (topo, fixo):**
- Fundo branco
- Título da página atual (Inter semibold)
- Breadcrumb
- Notificações (sino com badge)
- Avatar do usuário

---

### 5.1 Login — `/login`

- Tela centralizada, fundo navy `#0B1F3A` com gradiente velvet
- Card branco centralizado: logo MAGNOSSÃO + "Painel Administrativo"
- Campos: Email + Senha + botão "Entrar"
- Estado de erro: "Email ou senha incorretos" — mensagem em wine
- Loading: spinner no botão durante a requisição

---

### 5.2 Dashboard — `/`

**Cards KPI (linha no topo, 4 cards):**

| Card | Valor | Ícone |
|------|-------|-------|
| Receita Hoje | R$ X.XXX,XX | TrendingUp |
| Receita Este Mês | R$ X.XXX,XX | Calendar |
| Pedidos Hoje | N pedidos | ShoppingBag |
| Ticket Médio | R$ XXX,XX | Tag |

Cada card: fundo branco, sombra card, ícone em gold, valor em Inter bold 28px, label small muted, variação vs. ontem (↑ verde / ↓ vermelho).

**Gráfico de Vendas (2/3 da largura):**
- Barras diárias — últimos 30 dias
- Receita bruta (navy) × líquida (gold)
- Legenda + tooltip ao hover
- Biblioteca: Recharts

**Tabela de Últimos Pedidos (abaixo do gráfico):**
- Colunas: Nº, Data, Cliente, Status (badge colorido), Valor
- Últimos 10 pedidos
- Link "Ver todos os pedidos" no rodapé

**Alertas de Estoque Baixo (1/3 da largura, ao lado do gráfico):**
- Card com header vermelho/laranja "Estoque Baixo"
- Lista: foto thumb + nome do produto + variante + quantidade restante
- Botão "Gerenciar" → link para edição do produto
- Threshold: `stock < 5`

---

### 5.3 Produtos — `/produtos`

**Barra de ações:**
- Busca por nome (input com ícone Search)
- Filtro: Todos | Ativos | Inativos (toggle/tabs)
- Botão "Novo Produto" → gold, direita

**Tabela de produtos:**

| Coluna | Descrição |
|--------|-----------|
| Imagem | Thumbnail 48×48, rounded |
| Nome | Cinzel ou Inter semibold + coleção em muted abaixo |
| Preço | R$ XXX,XX + preço promocional riscado se houver |
| Variantes | Swatches de cor miniatura |
| Estoque total | Número com alerta se baixo |
| Status | Badge "Ativo" verde / "Inativo" cinza |
| Ações | Editar (lápis), Ativar/Desativar (toggle), Excluir (lixo) |

Linha hover: fundo `#F8F8F8`, ações aparecem

**Modal de confirmação de exclusão:**
- "Tem certeza? Essa ação não pode ser desfeita."
- Botão "Cancelar" + "Excluir" vermelho

---

### 5.4 Criar/Editar Produto — `/produtos/novo` e `/produtos/[id]`

**Layout:** Abas no topo + botão "Salvar" fixo no header

#### Aba 1 — Informações Gerais

Campos:
- Nome do produto (input large)
- Nome curto
- Slug (auto-gerado, editável — fundo acinzentado com ícone de link)
- Coleção (input ou select)
- Descrição (textarea, 4 linhas)
- Descrição SEO (textarea, contador de caracteres — vermelho quando > 160)
- Preço (input currency, R$)
- Preço promocional (input currency, opcional)
- Seals/tags editáveis (chips com botão ×, input para adicionar)
- Toggle: Produto ativo/inativo

#### Aba 2 — Imagens

- Área de drag-and-drop centralizada (ícone Upload + "Arraste imagens ou clique para selecionar")
- Grid de imagens carregadas: preview 120×120, botão ×, estrela para marcar como principal
- Imagem principal marcada: borda gold + badge "Principal"
- Handles de reordenação (drag-and-drop)
- Formatos aceitos: JPG, PNG, WebP | Máx 5MB/arquivo
- Erro de arquivo grande: toast vermelho

#### Aba 3 — Variantes e Estoque

Para cada cor (linha/card):
- Swatch de cor (circle, colorpicker)
- Nome da cor (ex: "Azul Marinho")
- Token de cor (select: navy | black | white | forest | sand | wine)
- Hex (input color)
- Grid de tamanhos P / M / G / GG, cada um com:
  - Input de estoque numérico
  - Alerta visual: 0 = vermelho, 1-4 = laranja/amarelo, 5+ = normal
- Botão "Adicionar cor" (+ novo bloco)
- Botão "Remover cor" (lixo, com confirmação)

#### Aba 4 — Detalhes

Listas editáveis (cada uma com botão + para adicionar item e × para remover):
- **Composição** (ex: "100% Algodão Pima Peruano")
- **Cuidados** (ex: "Lavar à máquina, água fria")
- **Política** (ex: "Troca em até 30 dias")
- **Benefícios** — cada item tem:
  - Select de ícone Lucide (com preview do ícone)
  - Título
  - Descrição curta

#### Aba 5 — Guia de Tamanhos

Tabela editável com linhas P / M / G / GG e colunas:
- Peito (cm)
- Comprimento (cm)
- Ombro (cm)

Inputs numéricos diretamente na célula da tabela.

---

### 5.5 Pedidos — `/pedidos`

**Filtros (linha acima da tabela):**
- Busca por nº do pedido ou email
- Status: dropdown multi-select
- Método de pagamento: Todos | PIX | Cartão | Boleto
- Período: range de datas
- Botão "Exportar CSV"

**Tabela de pedidos:**

| Coluna | Descrição |
|--------|-----------|
| Nº do Pedido | MGN-2026-XXXXX, monospace |
| Data | DD/MM/YYYY HH:mm |
| Cliente | Nome + email em muted |
| Status | Badge colorido |
| Pagamento | Ícone do método (PIX, cartão, boleto) |
| Valor | R$ XXX,XX (bold) |
| Ações | Botão "Ver" |

**Cores dos badges de status:**

| Status | Cor |
|--------|-----|
| pending | Amarelo `#F59E0B` / fundo `#FFFBEB` |
| paid | Verde-claro `#10B981` / fundo `#ECFDF5` |
| processing | Azul `#3B82F6` / fundo `#EFF6FF` |
| shipped | Azul-escuro `#1E40AF` / fundo `#DBEAFE` |
| delivered | Verde `#059669` / fundo `#D1FAE5` |
| cancelled | Vermelho `#EF4444` / fundo `#FEF2F2` |
| refunded | Cinza `#6B7280` / fundo `#F9FAFB` |

---

### 5.6 Detalhe do Pedido — `/pedidos/[id]`

**Layout:** 2 colunas (principal 2/3 + sidebar 1/3)

**Coluna principal:**

1. **Cabeçalho:** Nº do pedido + data + badge de status
2. **Itens do pedido:** tabela com thumb, nome, cor, tamanho, qtd, preço unitário, subtotal
3. **Timeline de status (vertical):** mesmo visual da vitrine mas mais compacto
4. **Informações de envio:** endereço completo + método + prazo + código de rastreamento (input editável inline)
5. **Informações de pagamento:** método, ID Mercado Pago, data do pagamento, parcelas (se cartão)

**Sidebar de ações:**

- **Card de ações:**
  - Dropdown "Atualizar status" (exibe apenas próximos status válidos)
  - Input "Código de rastreamento" (aparece quando status → shipped)
  - Botão "Salvar alterações" gold
  - Botão "Iniciar reembolso" — outline vermelho, apenas se status = paid/processing

- **Card do cliente:**
  - Nome, email, telefone, CPF mascarado
  - Link "Ver perfil do cliente"

**Modal de reembolso:**
- Select: Motivo (Defeito de fabricação / Desistência / Troca / Outro)
- Radio: Reembolso total vs. parcial
- Se parcial: input de valor
- Aviso amarelo: "O prazo de estorno depende da operadora do cartão (até 10 dias úteis)"
- Botões: Cancelar + Confirmar Reembolso (vermelho)

---

### 5.7 Clientes — `/clientes`

**Barra:** busca por nome/email + ordenação (total gasto, data de cadastro)

**Tabela:**

| Coluna | Descrição |
|--------|-----------|
| Nome | Nome + email muted |
| Telefone | Formatado |
| Pedidos | N pedidos |
| Total Gasto | R$ XXX,XX |
| Cadastro | DD/MM/YYYY |
| Ações | Botão "Ver" |

---

### 5.8 Detalhe do Cliente — `/clientes/[id]`

**Layout:** 2 colunas

**Coluna principal:**
- Histórico de pedidos: tabela compacta (nº, data, status badge, valor) com link para cada pedido

**Sidebar:**
- Avatar com inicial do nome
- Nome completo, email, telefone, CPF mascarado (Inter)
- Cards de métricas: total de pedidos, total gasto, ticket médio, data do último pedido
- Endereços salvos (lista com label "Casa", "Trabalho", etc.)

---

### 5.9 Financeiro — `/financeiro`

**Filtro de período (topo):**
- Chips rápidos: Hoje | Esta semana | Este mês | Último mês | Personalizado
- Range picker de datas (quando "Personalizado")

**Cards de resumo (grid 3×2):**

| Card | Descrição | Ícone |
|------|-----------|-------|
| Receita Bruta | Soma dos pedidos pagos | DollarSign |
| Taxas do Gateway | PIX 1%, Cartão 4.49%, Boleto 3.49% | Percent |
| Receita Líquida | Bruta − Taxas | TrendingUp |
| Reembolsos | Total devolvido no período | RefreshCw |
| Lucro Estimado | Líquida − Reembolsos | Award |
| Nº de Pedidos | Total de pedidos pagos | ShoppingBag |

Destaque especial para "Receita Líquida" e "Lucro Estimado".

**Gráfico de receita:**
- Barras agrupadas: Bruta (navy) × Líquida (gold)
- Toggle: por dia / por semana / por mês
- Recharts, tooltip detalhado

**Mix de pagamento:**
- Pie chart: PIX (gold) | Cartão (navy) | Boleto (sand)
- Tabela abaixo: método, quantidade, receita, % do total

**Tabela de transações:**

| Coluna | Descrição |
|--------|-----------|
| Data | DD/MM HH:mm |
| Pedido | MGN-2026-XXXXX |
| Cliente | Nome |
| Método | Ícone + texto |
| Valor Bruto | R$ XXX,XX |
| Taxa | R$ X,XX |
| Valor Líquido | R$ XXX,XX |
| Status | Badge |

Botão "Exportar CSV/XLSX" — gold, canto superior direito da tabela.

---

### 5.10 Configurações — `/configuracoes`

Seções em accordion ou abas verticais:

**Dados da Loja:**
- Nome da loja, CNPJ, endereço comercial
- Email de contato, telefone, Instagram, site
- Botão "Salvar"

**Usuários Admin:**
- Tabela: nome, email, role (badge), status, último login
- Botão "Convidar usuário" → modal com email + select de role
- Roles: Superadmin (roxo), Admin (navy), Operador (cinza)
- Ações por linha: Desativar, Excluir (apenas superadmin pode fazer isso)

**Integrações:**
- Card Mercado Pago: public key + access token mascarado (••••) + botão "Testar conexão" + status (verde/vermelho)
- Card ViaCEP: "Automático — nenhuma configuração necessária" + badge verde "Ativo"
- Card Melhor Envio: token API + botão "Salvar"

**Regras de Frete:**
- Toggle: "Frete grátis acima de R$" + input de valor (padrão R$ 299,00)
- Tabela de faixas manuais (opcional): faixa de CEP, método, preço

---

## 6. Fluxos Chave

### 6.1 Fluxo de Compra Completo

```
Landing / Catálogo
     ↓
Página de Produto
→ Seleciona cor e tamanho
→ Adiciona ao carrinho → Cart Drawer abre
     ↓
Cart Drawer → "Finalizar Pedido"
     ↓
Checkout — Etapa 1: Identificação (nome, email, tel, CPF)
     ↓
Checkout — Etapa 2: Entrega (CEP → auto-fill → calcula frete → seleciona opção)
     ↓
Checkout — Etapa 3: Pagamento (PIX | Cartão | Boleto)
→ Confirma pedido
     ↓
Confirmação do Pedido (instruções por método)
     ↓
Acompanhamento do Pedido (timeline de status)
```

### 6.2 Fluxo Admin — Gerenciar Pedido

```
Dashboard (alerta de pedido novo)
     ↓
Lista de Pedidos
     ↓
Detalhe do Pedido
→ Atualiza status para "processing"
→ Prepara produto
→ Atualiza para "shipped" + insere código de rastreamento
     ↓
Cliente recebe notificação
     ↓
Status → "delivered" (manual ou automático)
```

---

## 7. Estados Críticos a Projetar

### Por Tela

| Tela | Estados |
|------|---------|
| Toda tela de lista (admin) | Loading skeleton, vazio (empty state com ícone + mensagem), erro de API |
| Formulários | Campo inválido (borda wine + mensagem), campo válido, loading no submit, erro de API |
| Produto | Tamanho esgotado (botão desabilitado + tooltip), produto inativo |
| Checkout etapa 2 | CEP não encontrado, frete carregando, nenhuma opção de frete disponível |
| Checkout PIX | QR carregando, QR expirado (pedir novo), aguardando pagamento (polling) |
| Checkout cartão | Cartão recusado, cartão inválido (erro do Brick MP) |
| Confirmação | Polling de status PIX (animated spinner), pagamento confirmado (transição de estado) |
| Detalhe pedido admin | Confirmação antes de mudar status, feedback de sucesso/erro ao salvar |

### Estados Globais

- **Toast notifications:** sucesso (green), erro (red/wine), aviso (gold), info (navy) — aparecem no canto superior direito, auto-dismiss em 4s
- **Loading global:** skeleton loaders (não spinners) para listas e tabelas
- **Erro de rede:** banner inline ou toast "Sem conexão — tentando reconectar"
- **Empty state:** cada lista vazia tem ícone ilustrativo + mensagem contextual + CTA (ex: "Nenhum produto cadastrado — Criar primeiro produto")

---

## 8. Notas para o Design

1. **Vitrine pública:** premium e emocional. Use espaços generosos, tipografia grande, fotos dominantes. Navy e gold são os protagonistas.

2. **Admin:** funcional e limpo. Densidade de informação moderada. Inter para tudo. Mesmas cores mas em uso mais sóbrio.

3. **Mobile first na vitrine:** checkout e página de produto devem funcionar perfeitamente no celular. Cart drawer ocupa 90% da tela no mobile.

4. **Acessibilidade:** contraste suficiente em todos os estados. Gold sobre navy tem contraste adequado. Gold sobre branco: atenção (pode ter contraste insuficiente para texto pequeno — usar gold-deep ou navy sobre gold).

5. **Consistência de bordas:** vitrine usa bordas mais arredondadas para sentir premium. Admin usa bordas menores (4-6px) para sensação mais técnica.

6. **Ícones:** biblioteca Lucide React em todo o projeto (vitrine e admin).

7. **O produto existe em 4-5 cores:** navy, forest, wine, sand, black. Os seletores de cor devem sempre mostrar o hex real da cor.

8. **Divisória dourada:** elemento de identidade visual — usar para separar seções importantes na vitrine (linha horizontal com diamante central em gold).
