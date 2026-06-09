import Image from 'next/image'
import Link from 'next/link'
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
      className="group block rounded-md overflow-hidden bg-white shadow-card hover:shadow-card-lg transition-shadow duration-200 ease-magn"
    >
      <div className="relative aspect-[4/3] bg-sand/40 overflow-hidden">
        {produto.imagemPrincipal ? (
          <Image
            src={produto.imagemPrincipal}
            alt={produto.nome}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 400px"
            className="object-cover group-hover:scale-[1.03] transition-transform duration-300 ease-magn"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-xs tracking-display text-navy/20 uppercase">
              Magnossão
            </span>
          </div>
        )}
        {produto.categoria && (
          <span className="absolute top-2 left-2 bg-navy text-gold font-ui text-[0.6rem] tracking-caps uppercase px-2 py-0.5 rounded-xs">
            {CATEGORIA_LABEL[produto.categoria] ?? produto.categoria}
          </span>
        )}
      </div>
      <div className="px-3 py-2.5">
        <p className="font-ui text-[0.75rem] font-semibold text-navy leading-snug line-clamp-1">
          {produto.nome}
        </p>
        {produto.colecao && (
          <p className="font-body text-[0.68rem] text-muted mt-0.5">{produto.colecao}</p>
        )}
        <p className="font-ui text-[0.8rem] font-bold text-gold mt-1">
          {formatCurrency(produto.preco)}
        </p>
      </div>
    </Link>
  )
}
