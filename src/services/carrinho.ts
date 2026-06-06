import { apiFetch } from '@/lib/api'

export type CarrinhoItemApi = {
  id: number
  skuId: number
  nomeProduto: string
  cor: string
  tamanho: string
  preco: number
  quantidade: number
  imagemUrl: string | null
}

export function listarCarrinho(): Promise<CarrinhoItemApi[]> {
  return apiFetch<CarrinhoItemApi[]>('/api/carrinho')
}

export function adicionarAoCarrinho(skuId: number, quantidade: number): Promise<CarrinhoItemApi> {
  return apiFetch<CarrinhoItemApi>('/api/carrinho', {
    method: 'POST',
    body: JSON.stringify({ skuId, quantidade }),
  })
}

export function atualizarItemCarrinho(skuId: number, quantidade: number): Promise<CarrinhoItemApi> {
  return apiFetch<CarrinhoItemApi>(`/api/carrinho/${skuId}`, {
    method: 'PATCH',
    body: JSON.stringify({ quantidade }),
  })
}

export function removerDoCarrinho(skuId: number): Promise<void> {
  return apiFetch<void>(`/api/carrinho/${skuId}`, { method: 'DELETE' })
}

export function mergeCarrinho(
  itens: { skuId: number; quantidade: number }[]
): Promise<CarrinhoItemApi[]> {
  return apiFetch<CarrinhoItemApi[]>('/api/carrinho/merge', {
    method: 'POST',
    body: JSON.stringify({ itens }),
  })
}
