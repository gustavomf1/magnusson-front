'use client'

import { useEffect, useState } from 'react'
import { getEstoque, atualizarEstoque } from '@/services/estoque'
import type { SkuEstoque } from '@/types/product'
import { cn } from '@/lib/cn'

export default function EstoquePage() {
  const [itens, setItens] = useState<SkuEstoque[]>([])
  const [filtroNome, setFiltroNome] = useState('')
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'disponivel' | 'esgotado'>('todos')
  const [editando, setEditando] = useState<{
    skuId: number
    valor: string
  } | null>(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    getEstoque().then((data) => {
      setItens(data)
      setCarregando(false)
    })
  }, [])

  const itensFiltrados = itens.filter((item) => {
    const nomeOk = item.produtoNome.toLowerCase().includes(filtroNome.toLowerCase())
    const statusOk =
      filtroStatus === 'todos' ||
      (filtroStatus === 'disponivel' && item.disponivel) ||
      (filtroStatus === 'esgotado' && !item.disponivel)
    return nomeOk && statusOk
  })

  async function salvarQuantidade(skuId: number) {
    if (!editando || editando.skuId !== skuId) return
    const quantidade = parseInt(editando.valor, 10)
    if (isNaN(quantidade) || quantidade < 0) {
      setEditando(null)
      return
    }
    const atualizado = await atualizarEstoque(skuId, quantidade)
    setItens((prev) => prev.map((i) => (i.id === skuId ? atualizado : i)))
    setEditando(null)
  }

  return (
    <div className="p-8">
      <h1 className="headline mb-6 text-2xl text-navy">Estoque</h1>

      <div className="mb-4 flex flex-wrap gap-3">
        <input
          value={filtroNome}
          onChange={(e) => setFiltroNome(e.target.value)}
          placeholder="Buscar produto..."
          className="min-h-10 rounded-md border border-black/15 bg-white px-3 font-body text-sm focus:outline-none focus:ring-1 focus:ring-gold"
        />
        <select
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value as typeof filtroStatus)}
          className="min-h-10 rounded-md border border-black/15 bg-white px-3 font-body text-sm focus:outline-none focus:ring-1 focus:ring-gold"
        >
          <option value="todos">Todos</option>
          <option value="disponivel">Disponível</option>
          <option value="esgotado">Esgotado</option>
        </select>
      </div>

      {carregando ? (
        <p className="font-body text-sm text-muted">Carregando...</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-black/10 bg-white">
          <table className="w-full font-body text-sm">
            <thead>
              <tr className="border-b border-black/10 bg-sand/40 text-left font-ui text-[0.65rem] font-semibold uppercase tracking-widest text-muted">
                <th className="px-4 py-3">Produto</th>
                <th className="px-4 py-3">Cor</th>
                <th className="px-4 py-3">Tamanho</th>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Quantidade</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {itensFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted">
                    Nenhum SKU encontrado.
                  </td>
                </tr>
              ) : (
                itensFiltrados.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-black/5 last:border-0 hover:bg-sand/20"
                  >
                    <td className="px-4 py-3 font-medium text-navy">{item.produtoNome}</td>
                    <td className="px-4 py-3">{item.corNome}</td>
                    <td className="px-4 py-3">{item.tamanhoLabel}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted">{item.codigo}</td>
                    <td className="px-4 py-3">
                      {editando?.skuId === item.id ? (
                        <input
                          autoFocus
                          type="number"
                          min={0}
                          value={editando.valor}
                          onChange={(e) =>
                            setEditando({
                              skuId: item.id,
                              valor: e.target.value,
                            })
                          }
                          onBlur={() => salvarQuantidade(item.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') salvarQuantidade(item.id)
                            if (e.key === 'Escape') setEditando(null)
                          }}
                          className="w-20 rounded border border-gold px-2 py-1 text-center font-semibold focus:outline-none"
                        />
                      ) : (
                        <button
                          type="button"
                          title="Clique para editar"
                          onClick={() =>
                            setEditando({
                              skuId: item.id,
                              valor: String(item.quantidade),
                            })
                          }
                          className="min-w-[3rem] rounded border border-transparent px-2 py-1 text-center font-semibold hover:border-black/20"
                        >
                          {item.quantidade}
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full px-2 py-0.5 font-ui text-[0.6rem] font-semibold uppercase tracking-wider',
                          item.disponivel
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        )}
                      >
                        {item.disponivel ? 'Disponível' : 'Esgotado'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
