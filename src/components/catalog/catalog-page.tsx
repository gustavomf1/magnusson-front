'use client'

import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { SearchX } from 'lucide-react'
import type { ReactNode } from 'react'
import { ProductCard } from '@/components/catalog/product-card'
import { Button, ButtonLink, Eyebrow, OncaMark } from '@/components/ui/primitives'
import type { Categoria, ProdutoResumo } from '@/types/product'
import { cn } from '@/lib/cn'

const CATEGORIAS: { value: Categoria; label: string }[] = [
  { value: 'POLO', label: 'Polo' },
  { value: 'CAMISA', label: 'Camisa' },
  { value: 'CALCA', label: 'Calça' },
  { value: 'SHORTS', label: 'Shorts' },
]

type Sort = 'relevance' | 'price-asc' | 'price-desc'

export function CatalogPage({ produtos }: { produtos: ProdutoResumo[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const categoriaAtiva = searchParams.get('categoria') as Categoria | null
  const colecaoAtiva = searchParams.get('colecao')
  const sort = (searchParams.get('sort') as Sort | null) ?? 'relevance'

  const colecoes = Array.from(
    new Set(produtos.map((p) => p.colecao).filter((c): c is string => Boolean(c)))
  )

  const produtosFiltrados = produtos
    .filter((p) => !categoriaAtiva || p.categoria === categoriaAtiva)
    .filter((p) => !colecaoAtiva || p.colecao === colecaoAtiva)

  const produtosOrdenados = [...produtosFiltrados].sort((a, b) => {
    if (sort === 'price-asc') return a.preco - b.preco
    if (sort === 'price-desc') return b.preco - a.preco
    return 0
  })

  const contagem = (cat: Categoria) => produtos.filter((p) => p.categoria === cat).length

  function updateParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(updates)) {
      if (value) params.set(key, value)
      else params.delete(key)
    }
    const query = params.toString()
    router.push(query ? `/produtos?${query}` : '/produtos')
  }

  return (
    <div className="mx-auto max-w-[1280px] px-5 py-10 md:px-9 md:py-14 lg:py-16">
      <div className="lg:grid lg:grid-cols-[256px_1fr] lg:items-start lg:gap-12">
        <aside className="mb-8 flex flex-col gap-6 lg:sticky lg:top-24 lg:mb-0 lg:gap-8">
          <div className="flex flex-wrap items-start gap-x-12 gap-y-6 lg:flex-col lg:gap-8">
            <div className="lg:w-full">
              <RailTitle>Categoria</RailTitle>
              <div className="flex flex-col gap-0.5">
                <CategoriaItem
                  label="Todos"
                  count={produtos.length}
                  active={!categoriaAtiva}
                  onClick={() => updateParams({ categoria: null })}
                />
                {CATEGORIAS.map((c) => {
                  const count = contagem(c.value)
                  return (
                    <CategoriaItem
                      key={c.value}
                      label={c.label}
                      count={count}
                      active={categoriaAtiva === c.value}
                      disabled={count === 0}
                      onClick={() => updateParams({ categoria: c.value })}
                    />
                  )
                })}
              </div>
            </div>

            {colecoes.length >= 2 && (
              <div className="lg:w-full">
                <RailTitle>Coleção</RailTitle>
                <div className="flex flex-wrap gap-2">
                  <ColecaoChip
                    active={!colecaoAtiva}
                    onClick={() => updateParams({ colecao: null })}
                  >
                    Todas
                  </ColecaoChip>
                  {colecoes.map((colecao) => (
                    <ColecaoChip
                      key={colecao}
                      active={colecaoAtiva === colecao}
                      onClick={() =>
                        updateParams({ colecao: colecaoAtiva === colecao ? null : colecao })
                      }
                    >
                      {colecao}
                    </ColecaoChip>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="hidden rounded-lg border border-black/10 bg-gradient-to-b from-white to-[#FBF8F1] p-5 text-center lg:block">
            <OncaMark size={48} className="mx-auto mb-2.5 opacity-90" />
            <p className="font-display text-sm uppercase tracking-display text-navy">
              Feito no Brasil
            </p>
            <p className="mt-1.5 font-editorial text-sm italic leading-snug text-muted">
              Algodão Pima &amp; bordado da onça em cada peça da casa.
            </p>
          </div>
        </aside>

        <div>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-black/10 pb-4">
            <p className="font-ui text-xs font-semibold uppercase tracking-caps text-muted">
              <span className="text-navy">{produtosOrdenados.length}</span>{' '}
              {produtosOrdenados.length === 1 ? 'peça' : 'peças'} na coleção
            </p>
            <div className="flex items-center gap-3">
              <label
                htmlFor="ordenar"
                className="font-ui text-[0.68rem] font-semibold uppercase tracking-caps text-muted"
              >
                Ordenar
              </label>
              <select
                id="ordenar"
                value={sort}
                onChange={(e) =>
                  updateParams({ sort: e.target.value === 'relevance' ? null : e.target.value })
                }
                className="cursor-pointer appearance-none rounded-full border border-black/15 bg-white bg-no-repeat py-2 pl-3.5 pr-8 font-ui text-[0.68rem] font-semibold uppercase tracking-wide text-black"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='1.6'><path d='M6 9l6 6 6-6'/></svg>\")",
                  backgroundPosition: 'right 0.875rem center',
                  backgroundSize: '12px',
                }}
              >
                <option value="relevance">Relevância</option>
                <option value="price-asc">Menor preço</option>
                <option value="price-desc">Maior preço</option>
              </select>
            </div>
          </div>

          {produtosOrdenados.length === 0 ? (
            <EmptyState onClear={() => updateParams({ categoria: null, colecao: null })} />
          ) : (
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {produtosOrdenados.map((p) => (
                <ProductCard key={p.id} produto={p} />
              ))}
            </div>
          )}

          <DestaqueBanner />
        </div>
      </div>
    </div>
  )
}

function RailTitle({ children }: { children: ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-2.5 font-ui text-[0.68rem] font-bold uppercase tracking-[0.24em] text-navy">
      {children}
      <span className="h-px flex-1 bg-black/10" />
    </div>
  )
}

function CategoriaItem({
  label,
  count,
  active,
  disabled,
  onClick,
}: {
  label: string
  count: number
  active: boolean
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={cn(
        'flex items-center gap-3 rounded-md border-l-[3px] px-3 py-2.5 text-left font-ui text-[0.8rem] font-semibold transition duration-150 ease-magn',
        active
          ? 'border-gold bg-navy text-gold'
          : disabled
            ? 'cursor-not-allowed border-transparent text-black/30'
            : 'border-transparent text-graphite hover:bg-navy/5'
      )}
    >
      <span
        className={cn(
          'size-2 shrink-0 rotate-45 border-[1.5px]',
          active ? 'border-gold bg-gold' : disabled ? 'border-black/15' : 'border-black/35'
        )}
      />
      <span className="flex-1">{label}</span>
      <span
        className={cn(
          'tabular-nums text-[0.7rem]',
          active ? 'text-gold-soft' : disabled ? 'text-black/20' : 'text-muted'
        )}
      >
        {count}
      </span>
    </button>
  )
}

function ColecaoChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full border px-3.5 py-1.5 font-ui text-[0.68rem] font-semibold uppercase tracking-wide transition duration-150 ease-magn',
        active
          ? 'border-navy bg-navy text-gold'
          : 'border-black/15 bg-white text-graphite hover:border-navy'
      )}
    >
      {children}
    </button>
  )
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <div className="flex size-16 items-center justify-center rounded-full border border-gold bg-gold/5">
        <SearchX className="size-6 text-gold-deep" strokeWidth={1.6} />
      </div>
      <p className="font-display text-lg uppercase tracking-display text-navy">
        Nenhuma peça encontrada
      </p>
      <p className="max-w-[360px] font-editorial text-base italic text-muted">
        Tente remover algum filtro ou explorar a coleção inteira.
      </p>
      <Button variant="primary" onClick={onClear} className="mt-1.5">
        Limpar filtros
      </Button>
    </div>
  )
}

function DestaqueBanner() {
  return (
    <div className="mt-16 grid overflow-hidden rounded-xl shadow-card-lg lg:grid-cols-[1.05fr_1fr]">
      <div className="relative min-h-[260px] lg:min-h-[360px]">
        <Image
          src="/assets/polo-gold-detail.png"
          alt=""
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col justify-center bg-gradient-to-b from-navy to-navy-deep px-8 py-12 text-offwhite md:px-12 md:py-14">
        <Eyebrow className="mb-4 text-gold">Tradição Magnossão</Eyebrow>
        <h2 className="mb-4 font-display text-3xl uppercase leading-tight tracking-display md:text-4xl">
          Bordado da onça em cada peça
        </h2>
        <p className="mb-7 max-w-[420px] font-editorial text-lg italic leading-relaxed text-[#C9CFD8]">
          Pespontos precisos, algodão Pima encorpado e a onça pintada bordada à mão — a marca que
          carrega a alma da casa em cada peça.
        </p>
        <ButtonLink href="/#historia" variant="outlineDark" className="self-start">
          Conhecer a história
        </ButtonLink>
      </div>
    </div>
  )
}
