'use client'

import {
  Feather,
  Infinity,
  Maximize2,
  MapPin,
  Minus,
  Plus,
  Sparkles,
  Square,
  Star,
  X,
  type LucideIcon,
} from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import {
  ButtonLink,
  Eyebrow,
  Flourish,
  OncaMark,
  SectionHead,
  Selo,
} from '@/components/ui/primitives'
import { ProductCarousel } from '@/components/catalog/product-carousel'
import { cn } from '@/lib/cn'
import type { ProdutoResumo } from '@/types/product'

// Conteúdo estático de marketing da landing institucional.
// Não é dado de catálogo — a página de produto consome a API.
const product = {
  price: 249.9,
  seals: ['Algodão Pima', 'Feito no Brasil', 'Edição Premium'],
}

const sizeGuide = [
  { label: 'P', chest: 50, length: 68, shoulder: 42 },
  { label: 'M', chest: 53, length: 70, shoulder: 44 },
  { label: 'G', chest: 56, length: 72, shoulder: 46 },
  { label: 'GG', chest: 59, length: 74, shoulder: 48 },
]

const benefits: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Sparkles,
    title: 'Algodão Premium',
    body: 'Fios de algodão pima de fibra longa, toque sedoso e alta durabilidade.',
  },
  {
    icon: Feather,
    title: 'Bordado Refinado',
    body: 'Onça e wordmark bordados em fio dourado fosco, sem brilho excessivo.',
  },
  {
    icon: Square,
    title: 'Modelagem Clássica',
    body: 'Corte atemporal, ombro estruturado e comprimento equilibrado.',
  },
  {
    icon: MapPin,
    title: 'Feita no Brasil',
    body: 'Confeccionada em São Paulo com fornecedores selecionados.',
  },
  {
    icon: Infinity,
    title: 'Design Atemporal',
    body: 'Uma peça que atravessa tendências, pensada para durar décadas.',
  },
]

const details = [
  {
    label: 'POLO TRADICIONAL',
    src: '/assets/polo-tradicional-113501.png',
    alt: 'Polo MAGNOSSÃO tradicional azul marinho com detalhe da gola',
    width: 1268,
    height: 1241,
  },
  {
    label: 'POLO REI',
    src: '/assets/polo-realeza-detail.png',
    alt: 'Polo MAGNOSSÃO Rei azul marinho com acabamento dourado',
    width: 1254,
    height: 1254,
  },
  {
    label: 'POLO TRADICIONAL',
    src: '/assets/polo-tradicional-verde.png',
    alt: 'Polo MAGNOSSÃO tradicional verde floresta com detalhe da gola',
    width: 1268,
    height: 1240,
  },
  {
    label: 'POLO REI',
    src: '/assets/polo-rei-verde.png',
    alt: 'Polo MAGNOSSÃO Rei verde floresta com acabamento dourado',
    width: 1254,
    height: 1254,
  },
]

const reviews = [
  {
    quote: 'Camisa elegante, tecido muito bom e acabamento acima do esperado.',
    name: 'Rafael C.',
    city: 'São Paulo, SP',
  },
  {
    quote: 'Discreta e poderosa. Combina com terno e com jeans. Atemporal de verdade.',
    name: 'Lucas F.',
    city: 'Curitiba, PR',
  },
  {
    quote: 'O bordado da onça é o detalhe que muda tudo. Vai virar minha polo padrão.',
    name: 'Henrique B.',
    city: 'Belo Horizonte, MG',
  },
]

const faqs = [
  {
    question: 'Qual o tecido da polo?',
    answer:
      'Algodão pima de fibra longa, com fios sedosos e respiráveis. Toque premium, alta durabilidade.',
  },
  {
    question: 'Como funciona a troca?',
    answer:
      'Você tem 30 dias para trocar tamanho ou cor, sem custo, desde que a peça esteja sem uso, com etiquetas e embalagem.',
  },
  {
    question: 'Tem frete grátis?',
    answer:
      'Frete grátis acima de R$ 299,00 para todo o Brasil. A calculadora de frete está disponível na página do produto e no carrinho.',
  },
  {
    question: 'Como escolher o tamanho?',
    answer:
      'Use a tabela de medidas. Na dúvida entre dois tamanhos, escolha o menor. A peça tem modelagem clássica, não justa.',
  },
  {
    question: 'Quais formas de pagamento?',
    answer: 'Pix, cartão de crédito em até 3× sem juros, boleto e carteiras digitais.',
  },
  {
    question: 'A peça encolhe?',
    answer:
      'A modelagem é pré-encolhida. Lavar a até 30°C, sem secadora, mantém o caimento original.',
  },
]

export function LandingPage({ produtos = [] }: { produtos?: ProdutoResumo[] }) {
  return (
    <>
      <Hero />
      <Benefits />
      <ProductCarousel produtos={produtos} />
      <Story />
      <DetailGrid />
      <SizeGuide />
      <Reviews />
      <FAQ />
      <FinalCTA />
      <Footer />
    </>
  )
}

function Hero() {
  return (
    <section
      id="produto"
      className="velvet-surface relative -mt-[76px] min-h-[720px] overflow-hidden pt-[76px] text-offwhite"
    >
      <div className="noise-overlay" />
      <div className="relative mx-auto grid max-w-[1280px] items-center gap-12 px-5 py-16 md:grid-cols-2 md:gap-20 md:px-9 md:py-24 lg:py-28">
        <div className="fade-up max-w-xl">
          <Eyebrow className="mb-6 text-gold">Coleção Classic · 2026</Eyebrow>
          <h1 className="headline mb-6 text-[clamp(3.1rem,8vw,4.75rem)] text-offwhite">
            Vista
            <br />
            presença.
          </h1>
          <div className="mb-7 max-w-[450px]">
            <Flourish className="mb-6" />
            <p className="font-editorial text-[1.35rem] italic leading-snug text-[#C9CFD8]">
              Raiz nórdica. Alma brasileira.
              <br />
              Uma polo feita para quem valoriza presença, origem e elegância.
            </p>
          </div>
          <div className="flex flex-wrap gap-3.5">
            <ButtonLink href="/classic" variant="premium">
              Comprar agora
            </ButtonLink>
            <ButtonLink href="#historia" variant="outlineDark">
              Conhecer a história
            </ButtonLink>
          </div>
        </div>

        <div
          className="fade-up relative mx-auto w-full max-w-[560px]"
          style={{ animationDelay: '80ms' }}
        >
          <div className="absolute -inset-4 rounded-xl border border-gold/30 md:-inset-7" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-navy shadow-dark">
            <Image
              src="/assets/polo-classic.png"
              alt="Polo MAGNOSSÃO Classic azul marinho"
              fill
              priority
              sizes="(min-width: 1024px) 520px, 92vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-4 right-0 flex items-center gap-3 rounded-lg bg-offwhite px-4 py-3 shadow-dark md:-right-4">
            <OncaMark size={36} />
            <div>
              <div className="headline text-xs text-navy">Polo Classic</div>
              <div className="mt-1 font-body text-[0.7rem] text-muted">
                Azul Marinho · Algodão Pima
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Benefits() {
  return (
    <section className="bg-offwhite px-5 py-20 md:px-9 md:py-24">
      <div className="mx-auto max-w-[1280px]">
        <SectionHead align="center" eyebrow="Por que MAGNOSSÃO" title="Cada detalhe foi pensado" />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {benefits.map((item) => {
            const Icon = item.icon

            return (
              <article
                key={item.title}
                className="rounded-lg border border-black/5 border-t-2 border-t-gold bg-white p-6 text-center shadow-[0_1px_0_rgba(17,17,17,0.03)]"
              >
                <Icon className="mx-auto size-7 text-gold-deep" strokeWidth={1.5} />
                <h3 className="headline mt-4 text-sm text-navy">{item.title}</h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-muted">{item.body}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function Story() {
  return (
    <section id="historia" className="bg-sand px-5 py-20 md:px-9 md:py-28">
      <div className="mx-auto grid max-w-[1100px] items-center gap-12 md:grid-cols-[1fr_1.1fr] md:gap-20">
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl shadow-card-lg">
          <Image
            src="/assets/polo-gold-detail.png"
            alt="Detalhe dourado da Polo MAGNOSSÃO"
            fill
            sizes="(min-width: 1024px) 470px, 92vw"
            className="object-cover"
          />
        </div>
        <div>
          <OncaMark size={48} className="mb-5" />
          <Eyebrow className="mb-4">Nossa História</Eyebrow>
          <h2 className="headline mb-6 text-[clamp(2rem,5vw,2.75rem)] text-navy">
            Raiz nórdica.
            <br />
            Alma brasileira.
          </h2>
          <Flourish color="bg-navy" className="mb-7 max-w-[260px] text-navy" />
          <p className="mb-5 font-editorial text-[1.35rem] italic leading-relaxed text-graphite">
            MAGNOSSÃO nasce do encontro entre uma raiz nórdica e uma alma brasileira.
          </p>
          <p className="mb-7 font-body text-[0.95rem] leading-loose text-graphite">
            Uma marca criada para traduzir força, sofisticação e autenticidade em peças clássicas e
            atemporais. Cada polo carrega a runa Fehu, símbolo de prosperidade, e o bordado discreto
            da onça pintada, presença do cerrado brasileiro.
          </p>
          <ButtonLink href="/classic" variant="outline">
            Ver detalhes
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}

function DetailGrid() {
  const [selectedDetail, setSelectedDetail] = useState<(typeof details)[number] | null>(null)

  useEffect(() => {
    if (!selectedDetail) {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedDetail(null)
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [selectedDetail])

  return (
    <section className="bg-offwhite px-5 py-20 md:px-9 md:py-24">
      <div className="mx-auto max-w-[1280px]">
        <SectionHead
          align="center"
          eyebrow="Detalhes da peça"
          title="Olhe de perto"
          sub="Tudo o que distingue uma polo MAGNOSSÃO."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {details.map((detail) => (
            <article key={detail.src}>
              <button
                type="button"
                aria-label={`Ampliar ${detail.label}`}
                onClick={() => setSelectedDetail(detail)}
                className="group relative block aspect-square w-full overflow-hidden rounded-lg border border-gold/25 bg-navy text-left shadow-[0_1px_0_rgba(17,17,17,0.03)] transition duration-[240ms] ease-magn hover:border-gold/70 focus-visible:border-gold"
              >
                <Image
                  src={detail.src}
                  alt={detail.alt}
                  fill
                  sizes="(min-width: 1024px) 290px, (min-width: 640px) 45vw, 92vw"
                  className="object-cover transition duration-[600ms] ease-magn group-hover:scale-[1.03]"
                />
                <span className="absolute right-3 top-3 inline-flex size-9 items-center justify-center rounded-md border border-gold/35 bg-black/60 text-gold opacity-0 transition duration-[160ms] ease-magn group-hover:opacity-100 group-focus-visible:opacity-100">
                  <Maximize2 className="size-4" strokeWidth={1.5} />
                </span>
              </button>
              <h3 className="mt-3 font-ui text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
                {detail.label}
              </h3>
            </article>
          ))}
        </div>
      </div>

      {selectedDetail ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selectedDetail.label}
          className="fixed inset-0 z-[120] bg-black/88 text-offwhite"
          onClick={() => setSelectedDetail(null)}
        >
          <div className="fixed right-4 top-4 z-[130] flex items-center gap-3 md:right-8 md:top-8">
            <div className="hidden font-ui text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-gold md:block">
              {selectedDetail.label}
            </div>
            <button
              type="button"
              aria-label="Fechar imagem ampliada"
              onClick={() => setSelectedDetail(null)}
              className="inline-flex size-11 items-center justify-center rounded-md border border-gold/45 bg-navy/80 text-gold transition duration-[160ms] ease-magn hover:bg-gold hover:text-black"
            >
              <X className="size-5" strokeWidth={1.5} />
            </button>
          </div>

          <div className="h-full overflow-auto p-5 pt-20 md:p-10 md:pt-24">
            <div className="mx-auto w-max" onClick={(event) => event.stopPropagation()}>
              <Image
                src={selectedDetail.src}
                alt={selectedDetail.alt}
                width={selectedDetail.width}
                height={selectedDetail.height}
                sizes={`${selectedDetail.width}px`}
                className="h-auto max-w-none rounded-lg border border-gold/25 shadow-dark"
              />
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}

function SizeGuide() {
  return (
    <section id="tamanhos" className="bg-offwhite px-5 pb-20 md:px-9 md:pb-24">
      <div className="mx-auto max-w-[920px]">
        <SectionHead align="center" eyebrow="Guia de medidas" title="Encontre o seu tamanho" />
        <div className="mt-9 overflow-x-auto rounded-lg bg-white p-4 shadow-card md:p-7">
          <table className="w-full min-w-[620px] border-collapse font-body">
            <thead>
              <tr className="border-b border-gold">
                {['Tamanho', 'Peito (cm)', 'Comprimento (cm)', 'Ombro (cm)'].map((head) => (
                  <th
                    key={head}
                    className="px-4 py-3 text-left font-ui text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-muted"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sizeGuide.map((row, index) => (
                <tr
                  key={row.label}
                  className={cn(index < sizeGuide.length - 1 && 'border-b border-black/10')}
                >
                  <td className="px-4 py-4 font-display text-base font-semibold tracking-[0.14em] text-navy">
                    {row.label}
                  </td>
                  <td className="px-4 py-4 text-graphite">{row.chest}</td>
                  <td className="px-4 py-4 text-graphite">{row.length}</td>
                  <td className="px-4 py-4 text-graphite">{row.shoulder}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

function Reviews() {
  return (
    <section
      id="avaliacoes"
      className="graphite-surface relative px-5 py-20 text-offwhite md:px-9 md:py-24"
    >
      <div className="noise-overlay" />
      <div className="relative mx-auto max-w-[1280px]">
        <SectionHead align="center" dark eyebrow="Avaliações" title="Quem veste, recomenda" />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {reviews.map((review) => (
            <article
              key={review.name}
              className="rounded-lg border border-gold/25 bg-navy/35 p-7 md:p-8"
            >
              <div className="mb-5 flex gap-1 text-gold">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="size-4 fill-current" strokeWidth={1.5} />
                ))}
              </div>
              <p className="mb-6 font-editorial text-xl italic leading-relaxed">"{review.quote}"</p>
              <div className="font-ui text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-gold">
                {review.name}
              </div>
              <div className="mt-1 font-body text-xs text-[#8A93A0]">{review.city}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function FAQ() {
  const [open, setOpen] = useState(0)

  return (
    <section id="faq" className="bg-offwhite px-5 py-20 md:px-9 md:py-24">
      <div className="mx-auto max-w-[860px]">
        <SectionHead align="center" eyebrow="Perguntas frequentes" title="FAQ" />
        <div className="mt-10">
          {faqs.map((item, index) => {
            const isOpen = open === index

            return (
              <div key={item.question} className="border-b border-black/10">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between gap-4 py-6 text-left"
                >
                  <span className="headline text-[clamp(0.9rem,2vw,1rem)] text-navy">
                    {item.question}
                  </span>
                  {isOpen ? (
                    <Minus className="size-5 shrink-0 text-gold-deep" strokeWidth={1.5} />
                  ) : (
                    <Plus className="size-5 shrink-0 text-gold-deep" strokeWidth={1.5} />
                  )}
                </button>
                <div
                  className={cn(
                    'grid transition-[grid-template-rows] duration-[240ms] ease-magn',
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  )}
                >
                  <div className="min-h-0 overflow-hidden">
                    <p className="max-w-2xl pb-6 font-body text-[0.95rem] leading-relaxed text-graphite">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function FinalCTA() {
  return (
    <section className="velvet-surface relative overflow-hidden px-5 py-24 text-center text-offwhite md:px-9 md:py-28">
      <div className="noise-overlay" />
      <div className="relative mx-auto max-w-3xl">
        <OncaMark size={70} className="mx-auto mb-6" />
        <Flourish className="mx-auto mb-8 max-w-60" />
        <h2 className="headline mb-6 text-[clamp(2.2rem,6vw,3.25rem)] text-offwhite">
          Vista uma peça
          <br />
          com origem.
        </h2>
        <p className="mx-auto mb-10 max-w-xl font-editorial text-[1.35rem] italic text-[#C9CFD8]">
          Força em silêncio. Elegância em cada detalhe.
        </p>
        <ButtonLink href="/classic" variant="premium" className="px-10 py-4">
          Comprar agora
        </ButtonLink>
      </div>
    </section>
  )
}

export function Footer() {
  const columns = [
    {
      title: 'Produto',
      items: ['Coleção Classic', 'Edição Premium', 'Guia de medidas', 'Cuidados'],
    },
    {
      title: 'Atendimento',
      items: ['Política de troca', 'Política de privacidade', 'Termos de uso', 'FAQ'],
    },
    { title: 'Contato', items: ['contato@magnossao.com', 'Instagram', 'São Paulo, Brasil'] },
  ]

  return (
    <footer className="bg-black px-5 py-16 text-[#C9CFD8] md:px-9">
      <div className="mx-auto max-w-[1280px]">
        <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr_1fr] md:gap-14">
          <div>
            <div className="mb-4 font-display text-xl font-bold uppercase tracking-[0.18em] text-gold">
              MAGNOSSÃO
            </div>
            <p className="max-w-sm font-editorial text-base italic leading-relaxed text-[#8A93A0]">
              Raiz nórdica. Alma brasileira. Polos premium feitas para quem valoriza presença.
            </p>
            <div className="mt-5 flex gap-2">
              {product.seals.map((seal) => (
                <Selo key={seal} dark>
                  {seal}
                </Selo>
              ))}
            </div>
          </div>
          {columns.map((column) => (
            <div key={column.title}>
              <div className="mb-4 font-ui text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-gold">
                {column.title}
              </div>
              <ul className="space-y-2.5">
                {column.items.map((item) => (
                  <li key={item} className="font-body text-sm text-[#C9CFD8]">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col gap-3 border-t border-gold/25 pt-6 font-ui text-[0.62rem] uppercase tracking-[0.18em] text-[#8A93A0] md:flex-row md:items-center md:justify-between">
          <div>© MAGNOSSÃO 2026</div>
          <div>CNPJ 00.000.000/0001-00 · Feito no Brasil</div>
        </div>
      </div>
    </footer>
  )
}
