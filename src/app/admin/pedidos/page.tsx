'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  atualizarStatusPedido,
  buscarPedido,
  listarPedidosAdmin,
  type PaginaAdmin,
} from '@/services/pedidos'
import { estornarItem } from '@/services/estornos'
import { formatCurrency } from '@/lib/format'
import { STATUS_LABEL, type Pedido, type PedidoResumo, type StatusPedido } from '@/types/pedido'
import { cn } from '@/lib/cn'

const TODOS_STATUS: Array<StatusPedido | ''> = [
  '',
  'AGUARDANDO_PAGAMENTO',
  'PAGO',
  'SEPARANDO',
  'ENVIADO',
  'ENTREGUE',
  'CANCELADO',
  'ESTORNADO',
  'PARCIALMENTE_ESTORNADO',
]

const STATUS_BADGE: Record<StatusPedido, string> = {
  AGUARDANDO_PAGAMENTO: 'bg-amber-100 text-amber-800',
  PAGO: 'bg-green-100 text-green-800',
  SEPARANDO: 'bg-blue-100 text-blue-800',
  ENVIADO: 'bg-indigo-100 text-indigo-800',
  ENTREGUE: 'bg-green-200 text-green-900',
  CANCELADO: 'bg-red-100 text-red-800',
  ESTORNADO: 'bg-red-100 text-red-800',
  PARCIALMENTE_ESTORNADO: 'bg-orange-100 text-orange-800',
}

export default function AdminPedidosPage() {
  const [filtroStatus, setFiltroStatus] = useState<StatusPedido | ''>('')
  const [pagina, setPagina] = useState(0)
  const [dados, setDados] = useState<PaginaAdmin | null>(null)
  const [alterandoId, setAlterandoId] = useState<number | null>(null)
  const [estornoPedido, setEstornoPedido] = useState<Pedido | null>(null)
  const [estornoItemId, setEstornoItemId] = useState<number | null>(null)
  const [estornoQtd, setEstornoQtd] = useState(1)
  const [estornoEnviando, setEstornoEnviando] = useState(false)
  const [estornoErro, setEstornoErro] = useState<string | null>(null)

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

  async function abrirEstorno(pedidoId: number) {
    const detalhe = await buscarPedido(pedidoId)
    setEstornoPedido(detalhe)
    setEstornoItemId(detalhe.itens[0]?.id ?? null)
    setEstornoQtd(1)
    setEstornoErro(null)
  }

  function fecharEstorno() {
    setEstornoPedido(null)
    setEstornoItemId(null)
    setEstornoErro(null)
  }

  async function confirmarEstorno() {
    if (!estornoPedido || estornoItemId === null) return
    setEstornoEnviando(true)
    setEstornoErro(null)
    try {
      await estornarItem(estornoPedido.id, {
        pedidoItemId: estornoItemId,
        quantidade: estornoQtd,
      })
      fecharEstorno()
      carregar()
    } catch {
      setEstornoErro(
        'Não foi possível concluir o estorno. Verifique a quantidade e tente novamente.'
      )
    } finally {
      setEstornoEnviando(false)
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
                      <div className="flex flex-wrap gap-2">
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
                        {(pedido.status === 'PAGO' ||
                          pedido.status === 'PARCIALMENTE_ESTORNADO') && (
                          <button
                            type="button"
                            onClick={() => abrirEstorno(pedido.id)}
                            className="rounded-md border border-wine/40 px-3 py-1 font-ui text-xs font-semibold text-wine transition hover:bg-wine hover:text-white"
                          >
                            Estornar item
                          </button>
                        )}
                      </div>
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

      {estornoPedido && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="mb-1 font-cinzel text-base tracking-widest text-navy">
              Estornar item — Pedido #{estornoPedido.id}
            </h2>
            <p className="mb-4 font-body text-xs text-muted">
              Já estornado: {formatCurrency(estornoPedido.valorEstornado)} de{' '}
              {formatCurrency(estornoPedido.total)}
            </p>

            <label className="mb-1 block font-ui text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-gray-500">
              Item
            </label>
            <select
              value={estornoItemId ?? ''}
              onChange={(e) => setEstornoItemId(Number(e.target.value))}
              className="mb-4 w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-navy"
            >
              {estornoPedido.itens.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nomeProduto} · {item.cor}/{item.tamanho} · qtd. {item.quantidade} ·{' '}
                  {formatCurrency(item.precoUnitario)}
                </option>
              ))}
            </select>

            <label className="mb-1 block font-ui text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-gray-500">
              Quantidade a estornar
            </label>
            <input
              type="number"
              min={1}
              value={estornoQtd}
              onChange={(e) => setEstornoQtd(Number(e.target.value))}
              className="mb-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-navy"
            />

            {estornoErro && <p className="mb-2 font-body text-xs text-wine">{estornoErro}</p>}

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={fecharEstorno}
                className="rounded-md border border-gray-200 px-4 py-2 font-ui text-xs font-semibold text-gray-600 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={estornoEnviando || estornoItemId === null}
                onClick={confirmarEstorno}
                className="rounded-md border border-wine bg-wine px-4 py-2 font-ui text-xs font-semibold text-white transition hover:bg-wine/90 disabled:opacity-50"
              >
                {estornoEnviando ? 'Estornando…' : 'Confirmar estorno'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
