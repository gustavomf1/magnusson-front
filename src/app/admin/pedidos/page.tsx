'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { atualizarStatusPedido, listarPedidosAdmin, type PaginaAdmin } from '@/services/pedidos'
import { formatCurrency } from '@/lib/format'
import { STATUS_LABEL, type PedidoResumo, type StatusPedido } from '@/types/pedido'
import { cn } from '@/lib/cn'

const TODOS_STATUS: Array<StatusPedido | ''> = [
  '',
  'AGUARDANDO_PAGAMENTO',
  'PAGO',
  'SEPARANDO',
  'ENVIADO',
  'ENTREGUE',
  'CANCELADO',
]

const STATUS_BADGE: Record<StatusPedido, string> = {
  AGUARDANDO_PAGAMENTO: 'bg-amber-100 text-amber-800',
  PAGO: 'bg-green-100 text-green-800',
  SEPARANDO: 'bg-blue-100 text-blue-800',
  ENVIADO: 'bg-indigo-100 text-indigo-800',
  ENTREGUE: 'bg-green-200 text-green-900',
  CANCELADO: 'bg-red-100 text-red-800',
}

export default function AdminPedidosPage() {
  const [filtroStatus, setFiltroStatus] = useState<StatusPedido | ''>('')
  const [pagina, setPagina] = useState(0)
  const [dados, setDados] = useState<PaginaAdmin | null>(null)
  const [alterandoId, setAlterandoId] = useState<number | null>(null)

  const carregar = useCallback(() => {
    listarPedidosAdmin({
      status: filtroStatus || undefined,
      page: pagina,
      size: 20,
    }).then(setDados)
  }, [filtroStatus, pagina])

  useEffect(() => {
    setDados(null)
    carregar()
  }, [carregar])

  async function avancarStatus(pedido: PedidoResumo) {
    const ordem: StatusPedido[] = [
      'AGUARDANDO_PAGAMENTO',
      'PAGO',
      'SEPARANDO',
      'ENVIADO',
      'ENTREGUE',
    ]
    const idx = ordem.indexOf(pedido.status)
    if (idx === -1 || idx === ordem.length - 1) return
    setAlterandoId(pedido.id)
    try {
      await atualizarStatusPedido(pedido.id, ordem[idx + 1])
      carregar()
    } finally {
      setAlterandoId(null)
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-cinzel text-xl tracking-widest text-navy">Pedidos</h1>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Status:</label>
          <select
            value={filtroStatus}
            onChange={(e) => {
              setFiltroStatus(e.target.value as StatusPedido | '')
              setPagina(0)
            }}
            className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-navy"
          >
            {TODOS_STATUS.map((s) => (
              <option key={s} value={s}>
                {s === '' ? 'Todos' : STATUS_LABEL[s as StatusPedido]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!dados ? (
        <div className="py-20 text-center text-sm text-gray-400">Carregando…</div>
      ) : dados.content.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white py-20 text-center text-sm text-gray-400">
          Nenhum pedido encontrado.
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  {['Pedido', 'Data', 'Status', 'Total', 'Ações'].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left font-ui text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-gray-500"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {dados.content.map((pedido) => (
                  <tr key={pedido.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <Link
                        href={`/pedidos/${pedido.id}`}
                        className="font-medium text-navy hover:underline"
                      >
                        #{pedido.id}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(pedido.criadoEm).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          'rounded-full px-2.5 py-1 font-ui text-[0.6rem] font-semibold uppercase tracking-[0.12em]',
                          STATUS_BADGE[pedido.status]
                        )}
                      >
                        {STATUS_LABEL[pedido.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-navy">
                      {formatCurrency(pedido.total)}
                    </td>
                    <td className="px-4 py-3">
                      {pedido.status !== 'ENTREGUE' && pedido.status !== 'CANCELADO' && (
                        <button
                          type="button"
                          disabled={alterandoId === pedido.id}
                          onClick={() => avancarStatus(pedido)}
                          className="rounded-md border border-navy/30 px-3 py-1 font-ui text-xs font-semibold text-navy transition hover:bg-navy hover:text-white disabled:opacity-50"
                        >
                          {alterandoId === pedido.id ? '…' : 'Avançar status'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          {dados.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-gray-500">
                {dados.totalElements} pedidos · página {dados.number + 1} de {dados.totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={pagina === 0}
                  onClick={() => setPagina((p) => p - 1)}
                  className="inline-flex size-8 items-center justify-center rounded-md border border-gray-200 disabled:opacity-40"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  type="button"
                  disabled={pagina >= dados.totalPages - 1}
                  onClick={() => setPagina((p) => p + 1)}
                  className="inline-flex size-8 items-center justify-center rounded-md border border-gray-200 disabled:opacity-40"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
