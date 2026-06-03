import type { Metadata } from 'next'
import Script from 'next/script'
import { CartDrawer } from '@/components/cart-drawer'
import { CartProvider } from '@/components/cart-context'
import { SiteHeader } from '@/components/site-header'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://magnossao.com.br'),
  title: {
    default: 'MAGNOSSÃO | Polos premium brasileiras',
    template: '%s | MAGNOSSÃO',
  },
  description:
    'Polos premium brasileiras com raiz nórdica, alma brasileira e acabamento atemporal.',
  openGraph: {
    title: 'MAGNOSSÃO | Polos premium brasileiras',
    description:
      'Vista presença. Raiz nórdica. Alma brasileira. Uma polo feita para atravessar tendências.',
    url: 'https://magnossao.com.br',
    siteName: 'MAGNOSSÃO',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: '/assets/polo-classic.png',
        width: 1254,
        height: 1254,
        alt: 'Polo MAGNOSSÃO Classic',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MAGNOSSÃO | Polos premium brasileiras',
    description: 'Força em silêncio. Elegância em cada detalhe.',
    images: ['/assets/polo-classic.png'],
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <CartProvider>
          <SiteHeader />
          {children}
          <CartDrawer />
        </CartProvider>
        <Script id="organization-jsonld" type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'MAGNOSSÃO',
            url: 'https://magnossao.com.br',
            logo: 'https://magnossao.com.br/assets/onca-logo-gold.png',
          })}
        </Script>
      </body>
    </html>
  )
}
