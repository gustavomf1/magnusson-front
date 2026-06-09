export type StatusCupom = 'ATIVO' | 'USADO' | 'EXPIRADO' | 'CANCELADO'

export interface Cupom {
  id: number
  valor: number
  status: StatusCupom
  expiraEm: string | null
  pedidoOrigemId: number
  pedidoUsoId: number | null
  clienteNome: string
}

export interface RegraCashback {
  id: number
  produtoId: number
  produtoNome: string
  percentual: number
  prazoValidadeDias: number | null
}

export interface RegraCashbackRequest {
  percentual: number
  prazoValidadeDias: number | null
}
