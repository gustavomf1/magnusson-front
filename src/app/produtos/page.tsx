import { Suspense } from 'react'
import type { Metadata } from 'next'
import { Footer } from '@/components/marketing/landing-page'
import { SiteHeader } from '@/components/layout/site-header'
import { CatalogPage } from '@/components/catalog/catalog-page'
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
        <div className="bg-navy pt-[76px]">
          <div className="max-w-[1280px] mx-auto px-5 md:px-9 py-10">
            <p className="font-ui text-[0.65rem] tracking-caps uppercase text-gold mb-3">
              Coleção 2026
            </p>
            <h1 className="font-display text-3xl text-white tracking-display">Produtos</h1>
            <div className="w-10 h-px bg-gold mt-4" />
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
