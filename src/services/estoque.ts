import { apiFetch } from '@/lib/api'
import type { SkuEstoque } from '@/types/product'

export async function getEstoque(): Promise<SkuEstoque[]> {
  return apiFetch<SkuEstoque[]>('/api/admin/estoque')
}

export async function atualizarEstoque(skuId: number, quantidade: number): Promise<SkuEstoque> {
  return apiFetch<SkuEstoque>(`/api/admin/skus/${skuId}/estoque`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantidade }),
  })
}
