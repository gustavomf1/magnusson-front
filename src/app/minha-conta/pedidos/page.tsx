'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { historicoPedidos } from '@/services/pedidos'
import { formatCurrency } from '@/lib/format'
import { STATUS_LABEL, type PedidoResumo } from '@/types/pedido'
import { useAuth } from '@/contexts/auth-context'

export default function MeusPedidosPage() {
  const { usuario, loading } = useAuth()
  const router = useRouter()
  const [pedidos, setPedidos] = useState<PedidoResumo[]>([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    if (loading) return
    if (!usuario) {
      router.replace('/login')
      return
    }
    historicoPedidos()
      .then((data) => setPedidos(data))
      .finally(() => setCarregando(false))
  }, [usuario, loading, router])

  if (loading || carregando) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center pt-32">
        <span className="font-ui text-sm tracking-widest text-muted">Carregando…</span>
      </main>
    )
  }

  return (
    <main className="min-h-[80vh] bg-offwhite px-5 pb-24 pt-32 md:px-9">
      <div className="mx-auto max-w-2xl">
        <h1 className="headline mb-8 text-2xl text-navy">Meus pedidos</h1>

        {pedidos.length === 0 ? (
          <div className="rounded-xl border border-black/10 bg-white p-10 text-center shadow-sm">
            <p className="font-editorial text-lg italic text-graphite">
              Você ainda não fez nenhum pedido.
            </p>
            <Link
              href="/classic"
              className="button-label mt-6 inline-flex min-h-11 items-center justify-center rounded-md border border-gold bg-gold px-6 py-3 text-black shadow-foil transition hover:border-gold-deep hover:bg-gold-deep"
            >
              Ver produtos
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {pedidos.map((pedido) => (
              <Link
                key={pedido.id}
                href={`/pedidos/${pedido.id}`}
                className="flex items-center justify-between rounded-xl border border-black/10 bg-white p-5 shadow-sm transition hover:border-gold/50 hover:shadow-md"
              >
                <div>
                  <div className="font-ui text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-muted">
                    Pedido #{pedido.id}
                  </div>
                  <div className="mt-1 font-body text-sm font-medium text-navy">
                    {STATUS_LABEL[pedido.status]}
                  </div>
                  <div className="mt-0.5 font-body text-xs text-muted">
                    {new Date(pedido.criadoEm).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="font-display text-base font-medium text-navy">
                    {formatCurrency(pedido.total)}
                  </div>
                  <ChevronRight className="size-4 text-muted" strokeWidth={1.5} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
