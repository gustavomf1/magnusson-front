import { notFound } from 'next/navigation'
import { apiFetch } from '@/lib/api'
import type { Produto } from '@/types/product'
import { ProductForm } from '@/components/admin/product-form'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ id: string }> }

export default async function EditarProdutoPage({ params }: Props) {
  const { id } = await params
  let produto: Produto
  try {
    produto = await apiFetch<Produto>(`/api/admin/produtos/${id}`)
  } catch {
    notFound()
  }

  return (
    <div>
      <h1 className="font-cinzel text-2xl text-navy mb-6">Editar: {produto.nome}</h1>
      <ProductForm produto={produto} />
    </div>
  )
}
