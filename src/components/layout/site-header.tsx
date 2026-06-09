'use client'

import { Menu, ShoppingBag, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useCart } from '@/contexts/cart-context'
import { ButtonLink, Wordmark } from '@/components/ui/primitives'
import { cn } from '@/lib/cn'

const nav = [
  { label: 'Produtos', href: '/produtos' },
  { label: 'Produto', href: '/#produto' },
  { label: 'História', href: '/#historia' },
  { label: 'Tamanhos', href: '/#tamanhos' },
  { label: 'Avaliações', href: '/#avaliacoes' },
  { label: 'FAQ', href: '/#faq' },
]

export function SiteHeader() {
  const pathname = usePathname()
  const { count, setOpen } = useCart()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const forceSolid = pathname !== '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const solid = forceSolid || scrolled || menuOpen

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b transition duration-[240ms] ease-magn',
        solid
          ? 'border-gold/25 bg-navy/90 text-offwhite shadow-[0_1px_0_rgba(212,175,55,0.18)] backdrop-blur-xl'
          : 'border-transparent bg-transparent text-offwhite'
      )}
    >
      <div className="mx-auto grid h-[76px] max-w-[1280px] grid-cols-[1fr_auto] items-center gap-5 px-5 md:grid-cols-[180px_1fr_auto] md:px-9">
        <Link href="/" aria-label="MAGNOSSÃO página inicial" className="inline-flex items-center">
          <Wordmark />
        </Link>

        <nav className="hidden items-center justify-center gap-7 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-ui text-[0.68rem] font-medium uppercase tracking-[0.2em] opacity-85 transition duration-[160ms] ease-magn hover:text-gold hover:underline hover:underline-offset-8"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-3 md:gap-4">
          <button
            type="button"
            aria-label={`Abrir carrinho com ${count} ${count === 1 ? 'item' : 'itens'}`}
            onClick={() => setOpen(true)}
            className="button-label inline-flex min-h-10 items-center gap-2 rounded-md border border-transparent px-2 text-[0.68rem] text-inherit transition duration-[160ms] ease-magn hover:text-gold md:px-0"
          >
            <ShoppingBag className="size-[18px]" strokeWidth={1.5} />
            <span className="hidden md:inline">Carrinho · {count}</span>
            <span className="md:hidden">{count}</span>
          </button>

          <ButtonLink
            href="/classic"
            variant="premium"
            className="hidden min-h-10 px-5 py-2 text-[0.68rem] md:inline-flex"
          >
            Comprar agora
          </ButtonLink>

          <button
            type="button"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex size-10 items-center justify-center rounded-md border border-gold/30 text-gold md:hidden"
          >
            {menuOpen ? (
              <X className="size-5" strokeWidth={1.5} />
            ) : (
              <Menu className="size-5" strokeWidth={1.5} />
            )}
          </button>
        </div>
      </div>

      <div
        className={cn(
          'grid overflow-hidden transition-[grid-template-rows] duration-[240ms] ease-magn md:hidden',
          menuOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        )}
      >
        <nav className="min-h-0 border-t border-gold/20 px-5">
          <div className="flex flex-col py-3">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-ui text-xs font-semibold uppercase tracking-[0.2em] text-offwhite/85 transition duration-[160ms] ease-magn hover:text-gold"
              >
                <span className="block border-b border-white/10 py-4">{item.label}</span>
              </Link>
            ))}
            <ButtonLink href="/classic" variant="premium" className="mt-4 w-full">
              Comprar agora
            </ButtonLink>
          </div>
        </nav>
      </div>
    </header>
  )
}
