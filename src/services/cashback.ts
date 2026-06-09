import { apiFetch } from '@/lib/api'
import type { Cupom, RegraCashback, RegraCashbackRequest } from '@/types/cupom'

export function getCarteira() {
  return apiFetch<Cupom[]>('/api/cashback/carteira')
}

export function getRegrasCashback() {
  return apiFetch<RegraCashback[]>('/api/admin/cashback/regras')
}

export function salvarRegraCashback(produtoId: number, request: RegraCashbackRequest) {
  return apiFetch<RegraCashback>(`/api/admin/cashback/regras/${produtoId}`, {
    method: 'PUT',
    body: JSON.stringify(request),
  })
}

export function removerRegraCashback(produtoId: number) {
  return apiFetch<void>(`/api/admin/cashback/regras/${produtoId}`, {
    method: 'DELETE',
  })
}

export function getCuponsAdmin() {
  return apiFetch<Cupom[]>('/api/admin/cashback/cupons')
}
