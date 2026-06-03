import Link from 'next/link'
import { apiFetch } from '@/lib/api'
import type { ProdutoResumo } from '@/types/product'

export const dynamic = 'force-dynamic'

const STATUS_LABEL: Record<string, string> = {
  RASCUNHO: 'Rascunho',
  PUBLICADO: 'Publicado',
  ARQUIVADO: 'Arquivado'
}

const STATUS_COLOR: Record<string, string> = {
  RASCUNHO: 'bg-yellow-100 text-yellow-800',
  PUBLICADO: 'bg-green-100 text-green-800',
  ARQUIVADO: 'bg-gray-100 text-gray-600'
}

export default async function AdminPage() {
  const produtos = await apiFetch<ProdutoResumo[]>('/api/admin/produtos')

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-cinzel text-2xl text-navy">Produtos</h1>
        <Link
          href="/admin/produtos/novo"
          className="bg-navy text-white px-4 py-2 text-sm tracking-wider hover:bg-navy/90"
        >
          + Novo Produto
        </Link>
      </div>

      <div className="bg-white shadow-sm rounded">
        {produtos.length === 0 && (
          <p className="p-6 text-gray-500 text-sm">Nenhum produto cadastrado.</p>
        )}
        {produtos.map(p => (
          <div key={p.id} className="flex items-center justify-between px-6 py-4 border-b last:border-0">
            <div className="flex items-center gap-4">
              {p.imagemPrincipal && (
                <img src={p.imagemPrincipal} alt={p.nome} className="w-12 h-12 object-cover rounded" />
              )}
              <div>
                <p className="font-medium text-navy">{p.nome}</p>
                <p className="text-sm text-gray-500">R$ {p.preco.toFixed(2).replace('.', ',')}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className={`text-xs px-2 py-1 rounded ${STATUS_COLOR[p.status]}`}>
                {STATUS_LABEL[p.status]}
              </span>
              <Link
                href={`/admin/produtos/${p.id}`}
                className="text-sm text-navy underline hover:no-underline"
              >
                Editar
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
