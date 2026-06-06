import { apiFetch } from '@/lib/api'
import type { Pedido, PedidoResumo } from '@/types/pedido'

export type CheckoutRequest = {
  itens: { skuId: number; quantidade: number }[]
  dadosNf: {
    nomeCliente: string
    cpfCnpj: string
    email: string
    telefone: string
  }
  endereco: {
    logradouro: string
    numero: string
    complemento?: string | null
    bairro: string
    cep: string
    cidade: string
    uf: string
  }
}

export function checkout(data: CheckoutRequest): Promise<Pedido> {
  return apiFetch<Pedido>('/api/pedidos', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function buscarPedido(id: number): Promise<Pedido> {
  return apiFetch<Pedido>(`/api/pedidos/${id}`)
}

export function historicoPedidos(): Promise<PedidoResumo[]> {
  return apiFetch<PedidoResumo[]>('/api/pedidos')
}

export type PaginaAdmin = {
  content: PedidoResumo[]
  totalPages: number
  totalElements: number
  number: number
}

export function listarPedidosAdmin(params?: {
  status?: string
  page?: number
  size?: number
}): Promise<PaginaAdmin> {
  const qs = new URLSearchParams()
  if (params?.status) qs.set('status', params.status)
  if (params?.page !== undefined) qs.set('page', String(params.page))
  if (params?.size !== undefined) qs.set('size', String(params.size))
  const query = qs.toString()
  return apiFetch<PaginaAdmin>(`/api/admin/pedidos${query ? '?' + query : ''}`)
}

export function atualizarStatusPedido(id: number, status: string): Promise<Pedido> {
  return apiFetch<Pedido>(`/api/admin/pedidos/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}
