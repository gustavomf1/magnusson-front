import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { formatCurrency } from '@/lib/format'
import type { ProdutoResumo } from '@/types/product'

const CATEGORIA_LABEL: Record<string, string> = {
  POLO: 'Polo',
  CAMISA: 'Camisa',
  CALCA: 'Calça',
  SHORTS: 'Shorts',
}

export function ProductCard({ produto }: { produto: ProdutoResumo }) {
  return (
    <Link
      href={`/produto/${produto.slug}`}
      className="group block overflow-hidden rounded-lg border border-black/5 bg-white shadow-card transition duration-[240ms] ease-magn hover:-translate-y-1.5 hover:shadow-card-lg"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-sand/40">
        {produto.imagemPrincipal ? (
          <Image
            src={produto.imagemPrincipal}
            alt={produto.nome}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 400px"
            className="object-cover transition-transform duration-700 ease-magn group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-xs uppercase tracking-display text-navy/20">
              Magnossão
            </span>
          </div>
        )}
        {produto.categoria && (
          <span className="absolute left-3 top-3 rounded-full bg-navy px-2.5 py-1 font-ui text-[0.6rem] uppercase tracking-caps text-gold">
            {CATEGORIA_LABEL[produto.categoria] ?? produto.categoria}
          </span>
        )}
      </div>
      <div className="flex flex-col p-5">
        {produto.colecao && (
          <p className="mb-2 font-ui text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-gold-deep">
            Coleção {produto.colecao}
          </p>
        )}
        <p className="font-display text-lg uppercase leading-snug tracking-display text-navy line-clamp-2">
          {produto.nome}
        </p>
        <div className="mt-4 flex items-baseline justify-between border-t border-black/10 pt-4">
          <p className="font-display text-xl text-navy">{formatCurrency(produto.preco)}</p>
          <span className="inline-flex items-center gap-1.5 font-ui text-[0.6rem] font-semibold uppercase tracking-caps text-muted transition duration-150 ease-magn group-hover:text-gold-deep">
            Ver produto
            <ArrowRight
              className="size-3 transition-transform duration-150 ease-magn group-hover:translate-x-0.5"
              strokeWidth={2}
            />
          </span>
        </div>
      </div>
    </Link>
  )
}
