'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { CheckCircle, Clock, Package, Truck, XCircle } from 'lucide-react'
import { buscarPedido } from '@/services/pedidos'
import { formatCurrency } from '@/lib/format'
import { STATUS_LABEL, type Pedido } from '@/types/pedido'
import { cn } from '@/lib/cn'

const STATUS_ICON = {
  AGUARDANDO_PAGAMENTO: Clock,
  PAGO: CheckCircle,
  SEPARANDO: Package,
  ENVIADO: Truck,
  ENTREGUE: CheckCircle,
  CANCELADO: XCircle,
}

const STATUS_COLOR = {
  AGUARDANDO_PAGAMENTO: 'text-gold-deep',
  PAGO: 'text-forest',
  SEPARANDO: 'text-navy',
  ENVIADO: 'text-navy',
  ENTREGUE: 'text-forest',
  CANCELADO: 'text-wine',
}

export default function PedidoPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [pedido, setPedido] = useState<Pedido | null>(null)
  const [erro, setErro] = useState(false)

  useEffect(() => {
    buscarPedido(Number(params.id))
      .then(setPedido)
      .catch(() => setErro(true))
  }, [params.id])

  if (erro) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-5 pt-32">
        <p className="font-editorial text-xl italic text-graphite">Pedido não encontrado.</p>
        <button
          type="button"
          onClick={() => router.push('/')}
          className="button-label inline-flex min-h-11 items-center justify-center rounded-md border border-navy px-6 py-3 text-navy"
        >
          Voltar ao início
        </button>
      </main>
    )
  }

  if (!pedido) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center pt-32">
        <span className="font-ui text-sm tracking-widest text-muted">Carregando…</span>
      </main>
    )
  }

  const Icon = STATUS_ICON[pedido.status]
  const colorClass = STATUS_COLOR[pedido.status]

  return (
    <main className="min-h-[80vh] bg-offwhite px-5 pb-24 pt-32 md:px-9">
      <div className="mx-auto max-w-2xl space-y-5">
        {/* Cabeçalho */}
        <div className="rounded-xl border border-black/10 bg-white p-6 shadow-sm">
          <div className="mb-1 font-ui text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">
            Pedido #{pedido.id}
          </div>
          <div
            className={cn(
              'mb-3 flex items-center gap-2 font-display text-xl font-medium',
              colorClass
            )}
          >
            <Icon className="size-5" strokeWidth={1.5} />
            {STATUS_LABEL[pedido.status]}
          </div>
          <div className="font-body text-xs text-muted">
            Realizado em{' '}
            {new Date(pedido.criadoEm).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </div>
        </div>

        {/* Itens */}
        <div className="rounded-xl border border-black/10 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-ui text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-navy">
            Itens
          </h2>
          <div className="divide-y divide-black/10">
            {pedido.itens.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-3">
                <div>
                  <div className="font-body text-sm font-medium text-navy">{item.nomeProduto}</div>
                  <div className="font-body text-xs text-muted">
                    {item.cor} · Tam. {item.tamanho} · Qtd. {item.quantidade}
                  </div>
                </div>
                <div className="font-display text-sm font-medium text-navy">
                  {formatCurrency(item.precoUnitario * item.quantidade)}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between border-t border-black/10 pt-4">
            <span className="font-ui text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
              Total
            </span>
            <span className="font-display text-lg font-medium text-navy">
              {formatCurrency(pedido.total)}
            </span>
          </div>
        </div>

        {/* Entrega */}
        <div className="rounded-xl border border-black/10 bg-white p-6 shadow-sm">
          <h2 className="mb-3 font-ui text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-navy">
            Entrega
          </h2>
          <p className="font-body text-sm text-graphite">
            {pedido.endereco.logradouro}, {pedido.endereco.numero}
            {pedido.endereco.complemento ? `, ${pedido.endereco.complemento}` : ''} ·{' '}
            {pedido.endereco.bairro}, {pedido.endereco.cidade}/{pedido.endereco.uf} · CEP{' '}
            {pedido.endereco.cep}
          </p>
        </div>

        {/* NF */}
        <div className="rounded-xl border border-black/10 bg-white p-6 shadow-sm">
          <h2 className="mb-3 font-ui text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-navy">
            Nota fiscal
          </h2>
          <p className="font-body text-sm text-graphite">
            {pedido.dadosNf.nomeCliente} · {pedido.dadosNf.cpfCnpj} · {pedido.dadosNf.email}
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push('/minha-conta/pedidos')}
          className="button-label inline-flex min-h-11 w-full items-center justify-center rounded-md border border-navy/30 px-6 py-3 text-navy transition hover:bg-navy/5"
        >
          Ver todos os pedidos
        </button>
      </div>
    </main>
  )
}
