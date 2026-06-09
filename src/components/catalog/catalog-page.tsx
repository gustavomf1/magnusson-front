'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { ProductCard } from '@/components/catalog/product-card'
import type { Categoria, ProdutoResumo } from '@/types/product'
import { cn } from '@/lib/cn'

const CATEGORIAS: { value: Categoria; label: string }[] = [
  { value: 'POLO', label: 'Polo' },
  { value: 'CAMISA', label: 'Camisa' },
  { value: 'CALCA', label: 'Calça' },
  { value: 'SHORTS', label: 'Shorts' },
]

export function CatalogPage({ produtos }: { produtos: ProdutoResumo[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const categoriaAtiva = searchParams.get('categoria') as Categoria | null

  const produtosFiltrados = categoriaAtiva
    ? produtos.filter((p) => p.categoria === categoriaAtiva)
    : produtos

  const contagem = (cat: Categoria) => produtos.filter((p) => p.categoria === cat).length

  function selecionar(cat: Categoria | null) {
    const params = new URLSearchParams(searchParams.toString())
    if (cat) {
      params.set('categoria', cat)
    } else {
      params.delete('categoria')
    }
    router.push(`/produtos?${params.toString()}`)
  }

  return (
    <div className="flex gap-8 px-5 py-8 md:px-9 max-w-[1280px] mx-auto">
      {/* Sidebar */}
      <aside className="hidden md:block w-[120px] shrink-0">
        <p className="font-ui text-[0.6rem] font-bold tracking-caps uppercase text-navy mb-3">
          Categoria
        </p>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => selecionar(null)}
              className={cn(
                'flex items-center gap-2 font-ui text-[0.75rem] transition-colors',
                !categoriaAtiva ? 'text-navy font-semibold' : 'text-muted hover:text-navy'
              )}
            >
              <span
                className={cn(
                  'size-2.5 rounded-xs border',
                  !categoriaAtiva ? 'bg-navy border-navy' : 'border-black/20'
                )}
              />
              Todos ({produtos.length})
            </button>
          </li>
          {CATEGORIAS.map((c) => (
            <li key={c.value}>
              <button
                onClick={() => selecionar(c.value)}
                className={cn(
                  'flex items-center gap-2 font-ui text-[0.75rem] transition-colors',
                  categoriaAtiva === c.value
                    ? 'text-navy font-semibold'
                    : 'text-muted hover:text-navy'
                )}
              >
                <span
                  className={cn(
                    'size-2.5 rounded-xs border',
                    categoriaAtiva === c.value ? 'bg-navy border-navy' : 'border-black/20'
                  )}
                />
                {c.label} ({contagem(c.value)})
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Filtros mobile (pílulas) */}
      <div className="md:hidden w-full">
        <div className="flex gap-2 flex-wrap mb-6">
          <button
            onClick={() => selecionar(null)}
            className={cn(
              'px-3 py-1 rounded-full font-ui text-[0.7rem] tracking-wider uppercase border transition-colors',
              !categoriaAtiva
                ? 'bg-navy text-white border-navy'
                : 'border-black/20 text-muted hover:border-navy'
            )}
          >
            Todos
          </button>
          {CATEGORIAS.map((c) => (
            <button
              key={c.value}
              onClick={() => selecionar(c.value)}
              className={cn(
                'px-3 py-1 rounded-full font-ui text-[0.7rem] tracking-wider uppercase border transition-colors',
                categoriaAtiva === c.value
                  ? 'bg-navy text-white border-navy'
                  : 'border-black/20 text-muted hover:border-navy'
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
        <Grid produtos={produtosFiltrados} />
      </div>

      {/* Grid desktop */}
      <div className="hidden md:block flex-1">
        <p className="font-body text-[0.75rem] text-muted mb-4">
          {produtosFiltrados.length} {produtosFiltrados.length === 1 ? 'produto' : 'produtos'}
        </p>
        <Grid produtos={produtosFiltrados} />
      </div>
    </div>
  )
}

function Grid({ produtos }: { produtos: ProdutoResumo[] }) {
  if (produtos.length === 0) {
    return (
      <p className="font-editorial text-navy/40 text-lg italic py-16 text-center">
        Nenhum produto nesta categoria.
      </p>
    )
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {produtos.map((p) => (
        <ProductCard key={p.id} produto={p} />
      ))}
    </div>
  )
}
