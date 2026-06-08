export type StatusPedido =
  | 'AGUARDANDO_PAGAMENTO'
  | 'PAGO'
  | 'SEPARANDO'
  | 'ENVIADO'
  | 'ENTREGUE'
  | 'CANCELADO'
  | 'ESTORNADO'
  | 'PARCIALMENTE_ESTORNADO'

export const STATUS_LABEL: Record<StatusPedido, string> = {
  AGUARDANDO_PAGAMENTO: 'Aguardando pagamento',
  PAGO: 'Pago',
  SEPARANDO: 'Separando',
  ENVIADO: 'Enviado',
  ENTREGUE: 'Entregue',
  CANCELADO: 'Cancelado',
  ESTORNADO: 'Estornado',
  PARCIALMENTE_ESTORNADO: 'Parcialmente estornado',
}

export type PedidoItem = {
  id: number
  skuId: number
  nomeProduto: string
  cor: string
  tamanho: string
  precoUnitario: number
  quantidade: number
}

export type Pedido = {
  id: number
  status: StatusPedido
  total: number
  valorEstornado: number
  initPoint: string | null
  criadoEm: string
  atualizadoEm: string
  dadosNf: {
    nomeCliente: string
    cpfCnpj: string
    email: string
    telefone: string
  }
  endereco: {
    logradouro: string
    numero: string
    complemento: string | null
    bairro: string
    cep: string
    cidade: string
    uf: string
  }
  itens: PedidoItem[]
}

export type PedidoResumo = {
  id: number
  status: StatusPedido
  total: number
  criadoEm: string
}
