import Link from 'next/link'
import { Suspense } from 'react'
import type { Metadata } from 'next'
import { Footer } from '@/components/marketing/landing-page'
import { SiteHeader } from '@/components/layout/site-header'
import { CatalogPage } from '@/components/catalog/catalog-page'
import { Eyebrow, Flourish, OncaMark } from '@/components/ui/primitives'
import { getProducts } from '@/services/products'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Produtos | MAGNOSSÃO',
  description: 'Conheça a coleção completa Magnossão — polos, camisas, calças e mais.',
}

export default async function ProdutosPage() {
  const produtos = await getProducts()
  const publicados = produtos.filter((p) => p.status === 'PUBLICADO')

  return (
    <>
      <SiteHeader />
      <main>
        <div className="relative overflow-hidden border-b border-gold/30 bg-gradient-to-b from-navy to-navy-deep pt-[76px] text-offwhite">
          <OncaMark
            size={440}
            className="pointer-events-none absolute right-[-60px] top-1/2 hidden -translate-y-1/2 opacity-10 md:block"
          />
          <div className="relative mx-auto max-w-[1280px] px-5 py-16 md:px-9 md:py-20">
            <div className="mb-6 flex items-center gap-2.5 font-ui text-[0.68rem] uppercase tracking-caps text-[#8A93A0]">
              <Link href="/" className="transition duration-150 ease-magn hover:text-gold">
                Início
              </Link>
              <span className="text-gold/40">/</span>
              <span className="text-gold">Coleção 2026</span>
            </div>
            <Eyebrow className="mb-4 text-gold">A Coleção</Eyebrow>
            <h1 className="font-display text-[clamp(2.75rem,5.5vw,4.375rem)] uppercase leading-none tracking-display">
              Produtos
            </h1>
            <Flourish className="my-6 max-w-[300px]" />
            <p className="max-w-[560px] font-editorial text-xl italic leading-relaxed text-[#C9CFD8]">
              Raiz nórdica, alma brasileira. Cada peça carrega a onça pintada bordada — feita para
              atravessar tendências, não segui-las.
            </p>
          </div>
        </div>
        <Suspense>
          <CatalogPage produtos={publicados} />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
