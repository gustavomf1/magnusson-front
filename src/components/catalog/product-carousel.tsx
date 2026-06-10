'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { ProductCard } from '@/components/catalog/product-card'
import { Flourish, SectionHead } from '@/components/ui/primitives'
import type { ProdutoResumo } from '@/types/product'

// Velocidade do auto-avanço em pixels por frame (~60fps).
const AUTO_SPEED = 0.5

export function ProductCarousel({ produtos }: { produtos: ProdutoResumo[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const pausedRef = useRef(false)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    let frame = 0
    const tick = () => {
      if (!pausedRef.current && track.scrollWidth > track.clientWidth) {
        const fim = track.scrollWidth - track.clientWidth
        track.scrollLeft = track.scrollLeft >= fim - 1 ? 0 : track.scrollLeft + AUTO_SPEED
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(frame)
  }, [])

  if (produtos.length === 0) return null

  const scrollBy = (dir: 1 | -1) => {
    const track = trackRef.current
    if (!track) return
    const card = track.querySelector<HTMLElement>('[data-card]')
    const passo = card ? card.offsetWidth + 16 : track.clientWidth * 0.8
    track.scrollBy({ left: passo * dir, behavior: 'smooth' })
  }

  return (
    <section className="velvet-surface relative overflow-hidden px-5 py-20 text-offwhite md:px-9 md:py-24">
      <div className="noise-overlay" />
      <div className="relative mx-auto max-w-[1280px]">
        <SectionHead align="center" dark eyebrow="Coleção Classic" title="Nossos produtos" />
        <Flourish className="mx-auto mt-5 max-w-60" />

        <div
          className="group/carousel relative mt-12"
          onMouseEnter={() => (pausedRef.current = true)}
          onMouseLeave={() => (pausedRef.current = false)}
        >
          <button
            type="button"
            aria-label="Produtos anteriores"
            onClick={() => scrollBy(-1)}
            className="absolute -left-2 top-1/2 z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-gold/30 bg-navy/80 text-gold backdrop-blur-sm transition duration-[160ms] ease-magn hover:border-gold hover:text-offwhite md:flex"
          >
            <ChevronLeft className="size-5" strokeWidth={1.5} />
          </button>

          <div
            ref={trackRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {produtos.map((produto) => (
              <div
                key={produto.id}
                data-card
                className="w-[260px] shrink-0 snap-start sm:w-[300px]"
              >
                <ProductCard produto={produto} />
              </div>
            ))}
          </div>

          <button
            type="button"
            aria-label="Próximos produtos"
            onClick={() => scrollBy(1)}
            className="absolute -right-2 top-1/2 z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-gold/30 bg-navy/80 text-gold backdrop-blur-sm transition duration-[160ms] ease-magn hover:border-gold hover:text-offwhite md:flex"
          >
            <ChevronRight className="size-5" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </section>
  )
}
