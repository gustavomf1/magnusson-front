import { apiFetch } from '@/lib/api'
import type { StatusPedido } from '@/types/pedido'

export type EstornoRequest = {
  pedidoItemId: number
  quantidade: number
}

export type Estorno = {
  id: number
  pedidoId: number
  pedidoItemId: number
  skuId: number
  quantidade: number
  valor: number
  mpRefundId: string
  statusPedido: StatusPedido
  criadoEm: string
}

export function estornarItem(pedidoId: number, data: EstornoRequest): Promise<Estorno> {
  return apiFetch<Estorno>(`/api/admin/pedidos/${pedidoId}/estorno`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}
