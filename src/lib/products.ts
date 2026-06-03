import { apiFetch } from '@/lib/api'
import type { Produto, ProdutoResumo } from '@/types/product'

export async function getProducts(): Promise<ProdutoResumo[]> {
  return apiFetch<ProdutoResumo[]>('/api/produtos')
}

export async function getProduct(slug: string): Promise<Produto | null> {
  try {
    return await apiFetch<Produto>(`/api/produtos/${slug}`)
  } catch {
    return null
  }
}
