# MAGNOSSÃO — Spec Completo do E-Commerce

**Data:** 2026-05-22  
**Versão:** 1.0  
**Objetivo:** Documento de referência para implementação de tudo que falta na loja MAGNOSSÃO — checkout real, catálogo multi-produto, backoffice administrativo e módulo financeiro.

---

## 1. Contexto do Projeto Atual

### O que já existe (`magnossao-frontend`)

| Rota | Status |
|------|--------|
| `/` | Landing page completa — hero, benefícios, cores, história, detalhes, guia de tamanhos, reviews, FAQ, CTA, footer |
| `/classic` | Página de produto hardcoded — galeria, seletor de cor/tamanho, carrinho |
| `/produto/[slug]` | Alias da página de produto |
| `/checkout` | **Placeholder** — sem nenhuma lógica real |

### Componentes existentes

- `src/data/product.ts` — produto único hardcoded, cores, tamanhos, benefícios, reviews, FAQs
- `src/components/cart-context.tsx` — carrinho em memória React (sem persistência)
- `src/components/cart-drawer.tsx` — gaveta lateral do carrinho
- `src/components/landing-page.tsx` — landing page completa
- `src/components/product-screen.tsx` — tela de produto
- `src/components/primitives.tsx` — componentes de design system
- `src/components/site-header.tsx` — cabeçalho com carrinho

### Restrições fixas (NÃO modificar)

- Paleta de cores em `tailwind.config.ts`: `navy`, `gold`, `forest`, `sand`, `wine`
- Tipografias em `src/app/colors_and_type.css`: Cinzel, Cormorant Garamond, Inter, Montserrat
- Alias `@/*` para `./src/*`
- Stack: Next.js 15.1, React 19, TypeScript 5.7 strict, Tailwind 3.4, npm

---

## 2. Arquitetura Alvo

```
magnossao-loja/
├── magnossao-frontend/     ← Vitrine pública (existe, precisa de adições)
├── magnossao-admin/        ← Backoffice (projeto novo, Next.js separado)
└── magnossao-backend/      ← API Java (futuro — ainda não existe)
```

### Comunicação entre projetos

- **Frontend público** chama a **API Java** via `NEXT_PUBLIC_API_URL`
- **Admin** chama a mesma **API Java** via `NEXT_PUBLIC_API_URL` com JWT de admin
- **Mercado Pago** faz webhook para a API Java, que atualiza o status do pedido
- Enquanto o backend Java não existir: usar **Route Handlers do Next.js** como proxy/mock

### Variáveis de ambiente necessárias

**magnossao-frontend:**
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_MP_PUBLIC_KEY=APP_USR-...
MP_ACCESS_TOKEN=APP_USR-...          # somente server-side
NEXT_PUBLIC_BASE_URL=https://magnossao.com.br
```

**magnossao-admin:**
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
JWT_SECRET=...
NEXT_PUBLIC_BASE_URL=https://admin.magnossao.com.br
```

---

## 3. Modelo de Dados

### Product

```ts
type Product = {
  id: string                    // "polo-classic"
  slug: string                  // "classic"
  name: string                  // "Polo MAGNOSSÃO Classic"
  shortName: string
  collection: string
  description: string
  seoDescription: string
  price: number                 // em reais (249.90)
  compareAtPrice?: number       // preço riscado (promocional)
  isActive: boolean
  seals: string[]
  composition: string[]
  care: string[]
  policy: string[]
  images: ProductImage[]
  variants: ProductVariant[]
  benefits: ProductBenefit[]
  createdAt: string             // ISO 8601
  updatedAt: string
}

type ProductImage = {
  id: string
  src: string                   // URL ou path
  alt: string
  isPrimary: boolean
  order: number
}

type ProductVariant = {
  id: string
  colorName: string             // "Azul Marinho"
  colorToken: string            // "navy"
  colorHex: string              // "#0B1F3A"
  sizes: VariantSize[]
}

type VariantSize = {
  label: "P" | "M" | "G" | "GG"
  stock: number                 // 0 = esgotado
  chest: number
  length: number
  shoulder: number
}

type ProductBenefit = {
  icon: string                  // nome do ícone Lucide
  title: string
  body: string
}
```

### Order

```ts
type Order = {
  id: string
  orderNumber: string           // "MGN-2026-00001"
  status: OrderStatus
  customer: OrderCustomer
  items: OrderItem[]
  shipping: OrderShipping
  payment: OrderPayment
  subtotal: number
  shippingPrice: number
  discount: number
  total: number
  notes?: string
  createdAt: string
  updatedAt: string
}

type OrderStatus =
  | "pending"       // aguardando pagamento
  | "paid"          // pago
  | "processing"    // em preparação
  | "shipped"       // enviado
  | "delivered"     // entregue
  | "cancelled"     // cancelado
  | "refunded"      // reembolsado

type OrderCustomer = {
  name: string
  email: string
  phone: string
  cpf: string
}

type OrderItem = {
  productId: string
  productName: string
  productSlug: string
  color: string
  colorHex: string
  size: string
  qty: number
  unitPrice: number
  subtotal: number
  imageUrl: string
}

type OrderShipping = {
  cep: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  method: string               // "PAC" | "SEDEX" | "Jadlog"
  estimatedDays: number
  price: number
  trackingCode?: string
  shippedAt?: string
}

type OrderPayment = {
  method: "pix" | "credit_card" | "boleto"
  status: "pending" | "approved" | "rejected" | "refunded"
  mercadoPagoId?: string
  mercadoPagoPreferenceId?: string
  pixQrCode?: string
  pixQrCodeBase64?: string
  boletoUrl?: string
  boletoBarcode?: string
  paidAt?: string
  installments?: number        // para cartão
  cardLastFour?: string
}
```

### Customer

```ts
type Customer = {
  id: string
  name: string
  email: string
  phone: string
  cpf: string
  addresses: CustomerAddress[]
  orderCount: number
  totalSpent: number
  createdAt: string
}

type CustomerAddress = {
  id: string
  label: string                // "Casa", "Trabalho"
  cep: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  isDefault: boolean
}
```

### AdminUser

```ts
type AdminUser = {
  id: string
  name: string
  email: string
  passwordHash: string         // bcrypt, armazenado apenas no backend
  role: "superadmin" | "admin" | "operator"
  isActive: boolean
  lastLoginAt?: string
  createdAt: string
}
```

---

## 4. API Contracts (Java Backend)

Base URL: `http://localhost:8080/api`

### Autenticação

```
POST /admin/auth/login
  body: { email, password }
  response: { token: string, user: AdminUser }

POST /admin/auth/logout
  header: Authorization: Bearer <token>
  response: 200

GET /admin/auth/me
  header: Authorization: Bearer <token>
  response: AdminUser
```

### Produtos (público)

```
GET /products
  query: ?isActive=true&collection=...
  response: Product[]

GET /products/:slug
  response: Product
```

### Produtos (admin)

```
GET /admin/products
  header: Authorization
  query: ?page=1&limit=20&search=...&isActive=true|false
  response: { data: Product[], total, page, limit }

POST /admin/products
  header: Authorization
  body: Omit<Product, 'id'|'createdAt'|'updatedAt'>
  response: Product

PUT /admin/products/:id
  header: Authorization
  body: Partial<Product>
  response: Product

DELETE /admin/products/:id
  header: Authorization
  response: 204

POST /admin/products/:id/images
  header: Authorization, Content-Type: multipart/form-data
  body: FormData { file: File, alt: string, isPrimary?: boolean }
  response: ProductImage

DELETE /admin/products/:id/images/:imageId
  header: Authorization
  response: 204

PATCH /admin/products/:id/variants/:variantId/sizes/:sizeLabel/stock
  header: Authorization
  body: { stock: number }
  response: VariantSize
```

### Pedidos (público — checkout)

```
POST /orders
  body: {
    customer: OrderCustomer,
    items: Array<{ productId, variantId, size, qty }>,
    shipping: Omit<OrderShipping, 'trackingCode'|'shippedAt'>,
    payment: { method: 'pix'|'credit_card'|'boleto', installments?, cardToken? }
  }
  response: {
    order: Order,
    paymentData: {
      // PIX:
      pixQrCode?: string,
      pixQrCodeBase64?: string,
      pixExpiresAt?: string,
      // Boleto:
      boletoUrl?: string,
      boletoBarcode?: string,
      // Cartão:
      status?: 'approved'|'rejected'
    }
  }

GET /orders/:orderNumber
  query: ?email=... (autenticação simples por email)
  response: Order
```

### Pedidos (admin)

```
GET /admin/orders
  header: Authorization
  query: ?page&limit&status&startDate&endDate&search
  response: { data: Order[], total, page, limit }

GET /admin/orders/:id
  header: Authorization
  response: Order

PATCH /admin/orders/:id/status
  header: Authorization
  body: { status: OrderStatus, trackingCode?: string }
  response: Order

POST /admin/orders/:id/refund
  header: Authorization
  body: { reason: string, amount?: number }
  response: Order
```

### Clientes (admin)

```
GET /admin/customers
  header: Authorization
  query: ?page&limit&search
  response: { data: Customer[], total, page, limit }

GET /admin/customers/:id
  header: Authorization
  response: Customer & { orders: Order[] }
```

### Financeiro (admin)

```
GET /admin/financial/summary
  header: Authorization
  query: ?startDate&endDate
  response: {
    grossRevenue: number,
    netRevenue: number,       // após taxas do gateway
    gatewayFees: number,
    refunds: number,
    orderCount: number,
    avgTicket: number,
    pixCount: number,
    creditCardCount: number,
    boletoCount: number
  }

GET /admin/financial/transactions
  header: Authorization
  query: ?page&limit&startDate&endDate&type
  response: {
    data: FinancialTransaction[],
    total, page, limit
  }

GET /admin/financial/export
  header: Authorization
  query: ?startDate&endDate&format=csv|xlsx
  response: File download
```

### Frete e CEP

```
GET /shipping/calculate
  query: ?cep=&productId=&qty=
  response: ShippingOption[]

type ShippingOption = {
  id: string
  name: string           // "PAC", "SEDEX", "Jadlog"
  price: number
  estimatedDays: number
}
```

### Webhook Mercado Pago

```
POST /webhooks/mercadopago
  header: X-Signature (verificar com MP_SECRET)
  body: MercadoPagoNotification
  response: 200
```

---

## 5. O que adicionar ao `magnossao-frontend`

### 5.1 Dados — de hardcoded para API

**Arquivo:** `src/lib/api.ts`  
Criar funções wrapper para consumir a API:

```ts
export async function getProduct(slug: string): Promise<Product>
export async function listProducts(): Promise<Product[]>
export async function createOrder(payload: CreateOrderPayload): Promise<CreateOrderResponse>
export async function getOrder(orderNumber: string, email: string): Promise<Order>
export async function calculateShipping(cep: string, productId: string, qty: number): Promise<ShippingOption[]>
```

- `src/data/product.ts` deve continuar existindo como **fallback estático** para quando não há backend
- A página de produto deve tentar buscar da API e cair no fallback se não houver API

### 5.2 Persistência do carrinho

**Arquivo:** `src/components/cart-context.tsx`  
- Persistir `items` em `localStorage` com `useEffect`
- Restaurar ao montar o provider
- Limpar após checkout bem-sucedido

### 5.3 Checkout real — `/checkout`

**Arquivo:** `src/app/checkout/page.tsx` e componentes em `src/components/checkout/`

Fluxo em 3 etapas com barra de progresso:

#### Etapa 1 — Identificação
Campos: nome completo, email, telefone (máscara), CPF (máscara + validação)

#### Etapa 2 — Entrega
- Campo CEP com máscara
- Botão "Buscar CEP" → chama `https://viacep.com.br/ws/{cep}/json/`
- Auto-preenchimento: logradouro, bairro, cidade, estado
- Campos manuais: número, complemento
- Após CEP válido → chama `GET /shipping/calculate` automaticamente → exibe opções de frete inline
- Usuário seleciona opção de entrega (obrigatório para avançar)
- Total atualizado exibe: subtotal + frete selecionado

#### Etapa 3 — Pagamento
- Tabs: PIX | Cartão de Crédito | Boleto
- **PIX:** mostrar QR code (imagem base64) + código copia-e-cola + contador regressivo de expiração
- **Cartão:** usar [Mercado Pago SDK JS](https://www.mercadopago.com.br/developers/pt/docs/checkout-bricks/card-payment-brick/introduction) — Brick de cartão (PCI-compliant, hospedado pelo MP)
- **Boleto:** mostrar código de barras + botão "Imprimir boleto"

#### Página de confirmação — `/checkout/confirmacao/[orderNumber]`
- Número do pedido
- Resumo dos itens
- Status do pagamento
- Instruções específicas por método (PIX: aguardar confirmação; Boleto: prazo de 3 dias; Cartão: aprovado/reprovado)
- Link "Acompanhar pedido" → `/pedido/[orderNumber]`

### 5.4 Acompanhamento de pedido — `/pedido/[orderNumber]`

- Input de email + número do pedido para autenticar
- Timeline de status visual (pendente → pago → em preparação → enviado → entregue)
- Dados do pedido: itens, endereço, forma de pagamento
- Código de rastreamento quando disponível (link Correios/Jadlog)

### 5.5 Catálogo multi-produto (quando houver mais de um produto)

**Arquivo:** `src/app/colecao/page.tsx`  
- Grid de produtos com imagem, nome, preço
- Filtro por coleção/cor
- Links para `/produto/[slug]`

### 5.6 Calculadora de frete inline

No `product-screen.tsx`:  
- Campo CEP + botão "Calcular frete"
- Exibe opções abaixo antes mesmo de ir ao checkout

---

## 6. `magnossao-admin` — Novo Projeto

### Stack

```
Next.js 15.1 · React 19 · TypeScript 5.7 (strict) · Tailwind CSS 3.4 · npm
```

**Criar com:**
```bash
npx create-next-app@latest magnossao-admin \
  --typescript --tailwind --eslint --app --src-dir \
  --import-alias "@/*"
```

**Design do admin:** funcional e limpo — fundo claro (`#F8F8F8`), sidebar escura (`#0B1F3A` navy), acentos em gold. Diferente da vitrine mas usa as mesmas cores de marca. Não usar fontes de display da vitrine no admin — usar Inter para tudo.

**Dependências adicionais:**
```bash
npm install recharts @tanstack/react-table date-fns zod react-hook-form
npm install lucide-react clsx
```

### Estrutura de rotas

```
src/app/
├── (auth)/
│   └── login/page.tsx
└── (dashboard)/
    ├── layout.tsx              ← Sidebar + header, protegido por middleware
    ├── page.tsx                ← Dashboard principal
    ├── produtos/
    │   ├── page.tsx            ← Lista de produtos
    │   ├── novo/page.tsx       ← Criar produto
    │   └── [id]/page.tsx       ← Editar produto
    ├── pedidos/
    │   ├── page.tsx            ← Lista de pedidos
    │   └── [id]/page.tsx       ← Detalhe do pedido
    ├── clientes/
    │   ├── page.tsx            ← Lista de clientes
    │   └── [id]/page.tsx       ← Detalhe do cliente
    ├── financeiro/
    │   └── page.tsx            ← Dashboard financeiro
    └── configuracoes/
        └── page.tsx            ← Configurações da loja
```

### Middleware de autenticação

`src/middleware.ts` — intercepta todas as rotas de `(dashboard)`, verifica JWT no cookie `admin_token`. Redireciona para `/login` se inválido ou expirado.

```ts
// pseudocódigo
export function middleware(request: NextRequest) {
  const token = request.cookies.get('admin_token')
  if (!token || !verifyJwt(token.value)) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}
export const config = { matcher: ['/((?!login|_next|favicon).*)'] }
```

### 6.1 Login — `/login`

- Formulário: email + senha
- POST `/admin/auth/login` → recebe JWT → salva em cookie httpOnly
- Redirect para `/` (dashboard)
- Exibir erro "Credenciais inválidas" se 401
- Design: tela centralizada com logo MAGNOSSÃO, fundo navy

### 6.2 Dashboard — `/`

**Cards de KPI (topo):**
| Card | Valor |
|------|-------|
| Receita hoje | R$ X,XX |
| Receita este mês | R$ X,XX |
| Pedidos hoje | N |
| Ticket médio | R$ X,XX |

**Gráfico de vendas:** linha ou barras — últimos 30 dias — receita diária (Recharts)

**Tabela de últimos pedidos:** últimos 10, com colunas: número, cliente, status badge, valor, data

**Alertas de estoque baixo:** produtos com qualquer variante com `stock < 5` — card de alerta vermelho com link para editar

### 6.3 Produtos — `/produtos`

#### Lista
- Tabela com: imagem thumb, nome, coleção, preço, variantes ativas, estoque total, status (ativo/inativo)
- Busca por nome
- Filtro por status (ativo/inativo)
- Botão "Novo produto"
- Ação por linha: editar, ativar/desativar, excluir (com confirmação)

#### Criar/Editar produto — `/produtos/novo` e `/produtos/[id]`

Formulário em abas:

**Aba 1 — Informações gerais:**
- Nome, nome curto, slug (auto-gerado do nome, editável)
- Coleção
- Descrição (textarea)
- Descrição SEO (textarea, limite 160 chars)
- Preço, preço promocional (opcional)
- Seals (tags editáveis: "Algodão Pima", "Feito no Brasil", etc.)
- Status (ativo/inativo)

**Aba 2 — Imagens:**
- Upload múltiplo (arrastar e soltar + clique)
- Preview das imagens carregadas
- Marcar imagem principal (será usada no card do produto)
- Reordenar por drag-and-drop
- Deletar imagem individual
- Aceitar: JPG, PNG, WebP — máximo 5MB por arquivo

**Aba 3 — Variantes e estoque:**
- Cada variante = uma cor
- Campos por variante: nome da cor, token de cor (navy|black|white|forest|sand|wine), hex
- Por variante, estoque por tamanho (P, M, G, GG)
- Botão "Adicionar cor"
- Botão "Remover cor"
- Alertas visuais para estoque zerado ou abaixo de 5

**Aba 4 — Detalhes:**
- Composição (lista editável: "100% algodão pima", etc.)
- Cuidados (lista editável)
- Política (lista editável)
- Benefícios (lista: ícone Lucide + título + corpo)

**Aba 5 — Guia de tamanhos:**
- Tabela P/M/G/GG com peito, comprimento, ombro (em cm)

### 6.4 Pedidos — `/pedidos`

#### Lista
- Colunas: número, data, cliente, status badge colorido, método de pagamento, valor total
- Filtros: status, método de pagamento, data (range picker), busca por número/email
- Paginação
- Exportar CSV (range de datas)

**Cores dos status badges:**
| Status | Cor |
|--------|-----|
| pending | amarelo |
| paid | verde-claro |
| processing | azul |
| shipped | azul-escuro |
| delivered | verde |
| cancelled | vermelho |
| refunded | cinza |

#### Detalhe do pedido — `/pedidos/[id]`

Layout em duas colunas:

**Coluna principal:**
- Resumo dos itens (imagem thumb, nome, cor, tamanho, qtd, preço)
- Timeline de status (visual, vertical)
- Informações de envio: endereço, método, código de rastreamento (editável)
- Informações de pagamento: método, ID Mercado Pago, data de pagamento

**Coluna lateral:**
- Card de ações: botão "Atualizar status" (dropdown com próximos status válidos)
- Input de código de rastreamento (aparece ao mover para "shipped")
- Botão "Iniciar reembolso" (apenas para pedidos pagos)
- Card com dados do cliente + link para o perfil

**Modal de reembolso:**
- Motivo (select: defeito, troca, desistência, outro)
- Valor (total ou parcial)
- Confirmação com texto de aviso sobre prazo Mercado Pago

### 6.5 Clientes — `/clientes`

#### Lista
- Colunas: nome, email, telefone, total de pedidos, total gasto, data de cadastro
- Busca por nome/email
- Ordenação por total gasto ou data

#### Detalhe do cliente — `/clientes/[id]`
- Dados pessoais: nome, email, telefone, CPF mascarado
- Endereços salvos
- Histórico de pedidos (tabela compacta com link para cada pedido)
- Métricas: total de pedidos, total gasto, ticket médio, último pedido

### 6.6 Financeiro — `/financeiro`

#### Filtro de período
- Atalhos: Hoje, Esta semana, Este mês, Último mês, Personalizado
- Date range picker personalizado

#### Cards de resumo
| Card | Descrição |
|------|-----------|
| Receita bruta | Soma dos totais dos pedidos pagos |
| Taxas do gateway | Estimativa: 4.49% cartão, 1% PIX, 3.49% boleto |
| Receita líquida | Bruta − Taxas |
| Reembolsos | Total devolvido |
| Lucro estimado | Receita líquida − Reembolsos |
| Nº de pedidos | Total de pedidos pagos no período |
| Ticket médio | Receita bruta / Nº pedidos |

#### Gráfico de receita
- Barras agrupadas: receita bruta × líquida por dia/semana/mês
- Toggle de granularidade

#### Mix de pagamento
- Pie chart: % PIX vs Cartão vs Boleto
- Tabela: método, quantidade, receita, % do total

#### Tabela de transações
- Colunas: data, número pedido, cliente, método, valor bruto, taxa, valor líquido, status
- Paginação
- Botão exportar CSV/XLSX com range de datas

### 6.7 Configurações — `/configuracoes`

**Seção — Dados da loja:**
- Nome, CNPJ, endereço comercial
- Email de contato, telefone
- Instagram, site

**Seção — Usuários admin:**
- Lista de usuários com role e status
- Botão "Convidar usuário" (envia email com link de definição de senha)
- Roles: superadmin (acesso total), admin (sem financeiro), operator (apenas pedidos)
- Desativar/excluir usuário

**Seção — Integrações:**
- Mercado Pago: public key + access token (mascarado) + botão testar conexão
- ViaCEP: automático (sem configuração)
- Melhor Envio: token API (para cálculo de frete futuro)

**Seção — Regras de frete:**
- Frete grátis acima de R$ X (padrão: R$ 299,00)
- Faixas manuais de frete por CEP/região (caso não use API de frete)

---

## 7. Fluxo Completo de Checkout (step-by-step)

```
1. Usuário clica "Finalizar pedido" no cart-drawer
   → Navega para /checkout

2. /checkout — Etapa 1: Identificação
   → Preenche nome, email, telefone, CPF
   → Validação client-side com Zod + react-hook-form
   → Clica "Continuar"

3. /checkout — Etapa 2: Entrega
   → Digita CEP → fetch viacep.com.br → auto-fill logradouro/bairro/cidade/estado
   → Preenche número e complemento
   → CEP válido dispara GET /shipping/calculate automaticamente
   → Exibe opções inline: PAC (R$ 19,90 · 8 dias), SEDEX (R$ 34,90 · 3 dias)
   → Seleciona opção de entrega (obrigatório para avançar)
   → Clica "Continuar"

4. /checkout — Etapa 3: Pagamento
   → Escolhe método:
     [PIX] → POST /orders → exibe QR code, espera webhook confirmar pagamento
     [Cartão] → Carrega MP Brick → preenche dados → POST /orders com cardToken
     [Boleto] → POST /orders → exibe código de barras
   → Clica "Confirmar pedido"

5. /checkout/confirmacao/[orderNumber]
   → Exibe resumo + instruções do método de pagamento
   → Polling (a cada 5s por PIX) para verificar se status mudou para "paid"
   → Link para /pedido/[orderNumber]

6. /pedido/[orderNumber] (público)
   → Cliente informa email + número do pedido
   → Exibe timeline de status
   → Exibe código de rastreamento quando disponível
```

---

## 8. Integração Mercado Pago

### PIX

```ts
// Server-side (Route Handler ou Java API)
const payment = await mp.payment.create({
  transaction_amount: order.total,
  payment_method_id: 'pix',
  payer: { email: order.customer.email },
  notification_url: `${BASE_URL}/webhooks/mercadopago`
})
// Retornar:
// payment.point_of_interaction.transaction_data.qr_code
// payment.point_of_interaction.transaction_data.qr_code_base64
```

### Cartão de crédito

```ts
// Client-side: carregar SDK do MP
// Usar CardPayment Brick — PCI-compliant
// O Brick retorna um cardToken
// Enviar cardToken + installments para o backend

// Server-side:
const payment = await mp.payment.create({
  transaction_amount: order.total,
  token: cardToken,
  installments,
  payment_method_id,
  payer: { email, identification: { type: 'CPF', number: cpf } },
  notification_url: `${BASE_URL}/webhooks/mercadopago`
})
```

### Boleto

```ts
const payment = await mp.payment.create({
  transaction_amount: order.total,
  payment_method_id: 'bolbradesco', // ou 'pec'
  payer: { email, first_name, last_name, identification: { type: 'CPF', number: cpf } },
  notification_url: `${BASE_URL}/webhooks/mercadopago`
})
// Retornar: payment.transaction_details.external_resource_url (URL do boleto)
// payment.barcode.content (código de barras)
```

### Webhook

```ts
// POST /webhooks/mercadopago
// Verificar assinatura com x-signature header
// Se type === 'payment' e data.status === 'approved':
//   Buscar pedido pelo mercadoPagoId
//   Atualizar status do pedido para 'paid'
//   Reduzir estoque das variantes compradas
//   Enviar email de confirmação ao cliente
```

### Taxas estimadas Mercado Pago (2026)

| Método | Taxa |
|--------|------|
| PIX | ~1.0% |
| Cartão à vista | ~4.49% |
| Cartão parcelado 2-3x sem juros (vendedor absorve) | ~5.49% |
| Boleto | ~3.49% + R$ 3,49 fixo |

---

## 9. Emails Transacionais

Integrar com **Resend** (`npm install resend`) ou similar.

| Evento | Email enviado |
|--------|--------------|
| Pedido criado (PIX/Boleto) | Confirmação + instrução de pagamento |
| Pagamento aprovado | Confirmação de pagamento + resumo do pedido |
| Pedido enviado | Código de rastreamento + prazo estimado |
| Pedido entregue | Confirmação de entrega + link para avaliação |
| Reembolso iniciado | Aviso de reembolso + prazo |

Templates: React Email ou HTML simples, com identidade visual MAGNOSSÃO (cores navy/gold).

---

## 10. Checklist de Implementação Sugerida

### Fase 1 — Checkout funcional (frontend)
- [ ] Converter carrinho para persistência em localStorage
- [ ] Criar `src/lib/api.ts` com funções de chamada à API
- [ ] Implementar fluxo de checkout em 4 etapas
- [ ] Integração ViaCEP para auto-preenchimento de endereço
- [ ] Criar página `/checkout/confirmacao/[orderNumber]`
- [ ] Criar página `/pedido/[orderNumber]`

### Fase 2 — Backend mínimo (Route Handlers Next.js como proxy)
- [ ] `POST /api/orders` — cria pedido no banco (SQLite/JSON local) e chama MP
- [ ] `GET /api/orders/[orderNumber]` — retorna pedido por número
- [ ] `GET /api/shipping/calculate` — retorna opções mockadas por enquanto
- [ ] `POST /api/webhooks/mercadopago` — atualiza status do pedido

### Fase 3 — Admin básico
- [ ] Setup do projeto `magnossao-admin`
- [ ] Login com email + senha + JWT
- [ ] Dashboard com KPIs básicos
- [ ] Gestão de pedidos (lista + detalhe + atualizar status)

### Fase 4 — Admin completo
- [ ] Gestão de produtos com upload de imagens
- [ ] Controle de estoque por variante
- [ ] Gestão de clientes
- [ ] Dashboard financeiro completo
- [ ] Exportação CSV

### Fase 5 — Polimento e produção
- [ ] Emails transacionais (Resend)
- [ ] Cálculo de frete real (Melhor Envio API)
- [ ] Migrar Route Handlers para Java backend
- [ ] SEO e Performance (Core Web Vitals)
- [ ] Monitoramento de erros (Sentry)

---

## 11. Notas Importantes

1. **Backend Java não existe ainda** — implemente tudo que precisar de lógica server-side como Route Handlers Next.js em `/app/api/*`. Quando o Java API existir, troque apenas o `NEXT_PUBLIC_API_URL`.

2. **Não alterar cores nem tipografias** — paleta `tailwind.config.ts` e fontes `colors_and_type.css` são fixas.

3. **PIX precisa de webhook** — em desenvolvimento local, usar ngrok ou similar para expor o webhook do MP.

4. **Estoque é crítico** — ao confirmar pagamento (webhook), decrementar estoque atomicamente. Se estoque zero, rejeitar pedido antes de criar preferência no MP.

5. **CPF é obrigatório** pelo Mercado Pago para emissão de boleto e PIX acima de R$ 500.

6. **LGPD** — dados de clientes (CPF, email, telefone) são dados pessoais. Adicionar política de privacidade real, não apenas placeholder no footer.

7. **Admin separado** — o projeto `magnossao-admin` deve ter seu próprio `package.json`, `tailwind.config.ts` (pode compartilhar as mesmas cores mas com tema admin), e `next.config.ts`.

8. **Segurança** — tokens JWT do admin nunca no `localStorage`, sempre em cookies `httpOnly; Secure; SameSite=Strict`.
