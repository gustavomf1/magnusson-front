'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronRight, MapPin, Package, User } from 'lucide-react'
import { useCart } from '@/contexts/cart-context'
import { checkout } from '@/services/pedidos'
import { formatCurrency } from '@/lib/format'
import { cn } from '@/lib/cn'

type DadosNf = {
  nomeCliente: string
  cpfCnpj: string
  email: string
  telefone: string
}

type Endereco = {
  logradouro: string
  numero: string
  complemento: string
  bairro: string
  cep: string
  cidade: string
  uf: string
}

const EMPTY_NF: DadosNf = { nomeCliente: '', cpfCnpj: '', email: '', telefone: '' }
const EMPTY_END: Endereco = {
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cep: '',
  cidade: '',
  uf: '',
}

const STEPS = [
  { label: 'Seus dados', icon: User },
  { label: 'Endereço', icon: MapPin },
  { label: 'Revisão', icon: Package },
]

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, setOpen } = useCart()
  const [step, setStep] = useState(0)
  const [dadosNf, setDadosNf] = useState<DadosNf>(EMPTY_NF)
  const [endereco, setEndereco] = useState<Endereco>(EMPTY_END)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  if (items.length === 0 && !enviando) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-5 pt-32 pb-24 text-center">
        <p className="font-editorial text-xl italic text-graphite">Seu carrinho está vazio.</p>
        <button
          type="button"
          onClick={() => {
            setOpen(true)
            router.push('/classic')
          }}
          className="button-label inline-flex min-h-11 items-center justify-center rounded-md border border-gold bg-gold px-6 py-3 text-black shadow-foil"
        >
          Ver produtos
        </button>
      </main>
    )
  }

  async function confirmar() {
    setEnviando(true)
    setErro(null)
    try {
      const pedido = await checkout({
        itens: items.map((i) => ({ skuId: i.skuId, quantidade: i.qty })),
        dadosNf,
        endereco: {
          logradouro: endereco.logradouro,
          numero: endereco.numero,
          complemento: endereco.complemento || null,
          bairro: endereco.bairro,
          cep: endereco.cep,
          cidade: endereco.cidade,
          uf: endereco.uf,
        },
      })
      if (pedido.initPoint) {
        window.location.href = pedido.initPoint
      } else {
        router.push(`/pedidos/${pedido.id}`)
      }
    } catch {
      setErro('Não foi possível finalizar o pedido. Tente novamente.')
      setEnviando(false)
    }
  }

  return (
    <main className="min-h-[80vh] bg-offwhite px-5 pb-24 pt-32 md:px-9">
      <div className="mx-auto max-w-2xl">
        {/* Cabeçalho */}
        <h1 className="headline mb-8 text-2xl text-navy">Finalizar compra</h1>

        {/* Stepper */}
        <div className="mb-10 flex items-center gap-0">
          {STEPS.map((s, i) => {
            const Icon = s.icon
            const done = i < step
            const active = i === step
            return (
              <div key={s.label} className="flex flex-1 items-center">
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={cn(
                      'flex size-9 items-center justify-center rounded-full border-2 transition',
                      done
                        ? 'border-gold bg-gold text-black'
                        : active
                          ? 'border-navy bg-navy text-gold'
                          : 'border-black/20 bg-white text-muted'
                    )}
                  >
                    <Icon className="size-4" strokeWidth={1.5} />
                  </div>
                  <span
                    className={cn(
                      'font-ui text-[0.62rem] font-semibold uppercase tracking-[0.15em]',
                      active ? 'text-navy' : 'text-muted'
                    )}
                  >
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={cn(
                      'mb-5 h-px flex-1 transition-colors',
                      done ? 'bg-gold' : 'bg-black/15'
                    )}
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* Passo 0: Dados pessoais / NF */}
        {step === 0 && (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setStep(1)
            }}
            className="space-y-4"
          >
            <div className="rounded-xl border border-black/10 bg-white p-6 shadow-sm">
              <h2 className="mb-5 font-ui text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-navy">
                Dados para nota fiscal
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block font-ui text-xs font-semibold text-graphite">
                    Nome completo *
                  </label>
                  <input
                    required
                    value={dadosNf.nomeCliente}
                    onChange={(e) => setDadosNf((d) => ({ ...d, nomeCliente: e.target.value }))}
                    className="w-full rounded-md border border-black/15 bg-offwhite px-3 py-2.5 font-body text-sm text-black placeholder:text-muted"
                    placeholder="João da Silva"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block font-ui text-xs font-semibold text-graphite">
                    CPF ou CNPJ *
                  </label>
                  <input
                    required
                    value={dadosNf.cpfCnpj}
                    onChange={(e) => setDadosNf((d) => ({ ...d, cpfCnpj: e.target.value }))}
                    className="w-full rounded-md border border-black/15 bg-offwhite px-3 py-2.5 font-body text-sm text-black placeholder:text-muted"
                    placeholder="000.000.000-00"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block font-ui text-xs font-semibold text-graphite">
                    Telefone *
                  </label>
                  <input
                    required
                    value={dadosNf.telefone}
                    onChange={(e) => setDadosNf((d) => ({ ...d, telefone: e.target.value }))}
                    className="w-full rounded-md border border-black/15 bg-offwhite px-3 py-2.5 font-body text-sm text-black placeholder:text-muted"
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block font-ui text-xs font-semibold text-graphite">
                    E-mail *
                  </label>
                  <input
                    required
                    type="email"
                    value={dadosNf.email}
                    onChange={(e) => setDadosNf((d) => ({ ...d, email: e.target.value }))}
                    className="w-full rounded-md border border-black/15 bg-offwhite px-3 py-2.5 font-body text-sm text-black placeholder:text-muted"
                    placeholder="joao@exemplo.com"
                  />
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="button-label inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-navy px-6 py-3 text-gold transition hover:bg-navy/90"
            >
              Continuar <ChevronRight className="size-4" strokeWidth={2} />
            </button>
          </form>
        )}

        {/* Passo 1: Endereço */}
        {step === 1 && (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setStep(2)
            }}
            className="space-y-4"
          >
            <div className="rounded-xl border border-black/10 bg-white p-6 shadow-sm">
              <h2 className="mb-5 font-ui text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-navy">
                Endereço de entrega
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block font-ui text-xs font-semibold text-graphite">
                    CEP *
                  </label>
                  <input
                    required
                    value={endereco.cep}
                    onChange={(e) =>
                      setEndereco((d) => ({
                        ...d,
                        cep: e.target.value.replace(/\D/g, '').slice(0, 8),
                      }))
                    }
                    className="w-full rounded-md border border-black/15 bg-offwhite px-3 py-2.5 font-body text-sm text-black placeholder:text-muted"
                    placeholder="00000-000"
                    inputMode="numeric"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block font-ui text-xs font-semibold text-graphite">
                    Logradouro *
                  </label>
                  <input
                    required
                    value={endereco.logradouro}
                    onChange={(e) => setEndereco((d) => ({ ...d, logradouro: e.target.value }))}
                    className="w-full rounded-md border border-black/15 bg-offwhite px-3 py-2.5 font-body text-sm text-black placeholder:text-muted"
                    placeholder="Rua das Flores"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block font-ui text-xs font-semibold text-graphite">
                    Número *
                  </label>
                  <input
                    required
                    value={endereco.numero}
                    onChange={(e) => setEndereco((d) => ({ ...d, numero: e.target.value }))}
                    className="w-full rounded-md border border-black/15 bg-offwhite px-3 py-2.5 font-body text-sm text-black placeholder:text-muted"
                    placeholder="123"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block font-ui text-xs font-semibold text-graphite">
                    Complemento
                  </label>
                  <input
                    value={endereco.complemento}
                    onChange={(e) => setEndereco((d) => ({ ...d, complemento: e.target.value }))}
                    className="w-full rounded-md border border-black/15 bg-offwhite px-3 py-2.5 font-body text-sm text-black placeholder:text-muted"
                    placeholder="Apto 42"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block font-ui text-xs font-semibold text-graphite">
                    Bairro *
                  </label>
                  <input
                    required
                    value={endereco.bairro}
                    onChange={(e) => setEndereco((d) => ({ ...d, bairro: e.target.value }))}
                    className="w-full rounded-md border border-black/15 bg-offwhite px-3 py-2.5 font-body text-sm text-black placeholder:text-muted"
                    placeholder="Centro"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block font-ui text-xs font-semibold text-graphite">
                    Cidade *
                  </label>
                  <input
                    required
                    value={endereco.cidade}
                    onChange={(e) => setEndereco((d) => ({ ...d, cidade: e.target.value }))}
                    className="w-full rounded-md border border-black/15 bg-offwhite px-3 py-2.5 font-body text-sm text-black placeholder:text-muted"
                    placeholder="São Paulo"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block font-ui text-xs font-semibold text-graphite">
                    UF *
                  </label>
                  <input
                    required
                    value={endereco.uf}
                    maxLength={2}
                    onChange={(e) =>
                      setEndereco((d) => ({ ...d, uf: e.target.value.toUpperCase().slice(0, 2) }))
                    }
                    className="w-full rounded-md border border-black/15 bg-offwhite px-3 py-2.5 font-body text-sm text-black placeholder:text-muted"
                    placeholder="SP"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(0)}
                className="button-label inline-flex min-h-11 flex-1 items-center justify-center rounded-md border border-navy/30 px-6 py-3 text-navy transition hover:bg-navy/5"
              >
                Voltar
              </button>
              <button
                type="submit"
                className="button-label inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md bg-navy px-6 py-3 text-gold transition hover:bg-navy/90"
              >
                Revisar pedido <ChevronRight className="size-4" strokeWidth={2} />
              </button>
            </div>
          </form>
        )}

        {/* Passo 2: Revisão */}
        {step === 2 && (
          <div className="space-y-4">
            {/* Itens */}
            <div className="rounded-xl border border-black/10 bg-white p-6 shadow-sm">
              <h2 className="mb-4 font-ui text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-navy">
                Itens do pedido
              </h2>
              <div className="divide-y divide-black/10">
                {items.map((item) => (
                  <div key={item.skuId} className="flex items-center justify-between py-3">
                    <div>
                      <div className="font-body text-sm font-medium text-navy">{item.name}</div>
                      <div className="font-body text-xs text-muted">
                        {item.color} · Tam. {item.size} · Qtd. {item.qty}
                      </div>
                    </div>
                    <div className="font-display text-sm font-medium text-navy">
                      {formatCurrency(item.price * item.qty)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-between border-t border-black/10 pt-4">
                <span className="font-ui text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
                  Total
                </span>
                <span className="font-display text-lg font-medium text-navy">
                  {formatCurrency(subtotal)}
                </span>
              </div>
            </div>

            {/* Endereço */}
            <div className="rounded-xl border border-black/10 bg-white p-6 shadow-sm">
              <h2 className="mb-3 font-ui text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-navy">
                Entrega
              </h2>
              <p className="font-body text-sm text-graphite">
                {endereco.logradouro}, {endereco.numero}
                {endereco.complemento ? `, ${endereco.complemento}` : ''} · {endereco.bairro},{' '}
                {endereco.cidade}/{endereco.uf} · CEP {endereco.cep}
              </p>
            </div>

            {/* Dados NF */}
            <div className="rounded-xl border border-black/10 bg-white p-6 shadow-sm">
              <h2 className="mb-3 font-ui text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-navy">
                Nota fiscal
              </h2>
              <p className="font-body text-sm text-graphite">
                {dadosNf.nomeCliente} · {dadosNf.cpfCnpj} · {dadosNf.email}
              </p>
            </div>

            {erro && (
              <p className="rounded-md border border-wine/30 bg-wine/5 px-4 py-3 font-body text-sm text-wine">
                {erro}
              </p>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                disabled={enviando}
                className="button-label inline-flex min-h-11 flex-1 items-center justify-center rounded-md border border-navy/30 px-6 py-3 text-navy transition hover:bg-navy/5 disabled:opacity-50"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={confirmar}
                disabled={enviando}
                className="button-label inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md border border-gold bg-gold px-6 py-3 text-black shadow-foil transition hover:border-gold-deep hover:bg-gold-deep disabled:opacity-60"
              >
                {enviando ? 'Processando…' : 'Confirmar pedido'}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
