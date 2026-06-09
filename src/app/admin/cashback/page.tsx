'use client'

import { useEffect, useState } from 'react'
import { getRegrasCashback, removerRegraCashback, getCuponsAdmin } from '@/services/cashback'
import { formatCurrency } from '@/lib/format'
import type { RegraCashback, Cupom } from '@/types/cupom'

export default function AdminCashbackPage() {
  const [regras, setRegras] = useState<RegraCashback[]>([])
  const [cupons, setCupons] = useState<Cupom[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([getRegrasCashback(), getCuponsAdmin()])
      .then(([regrasResp, cuponsResp]) => {
        setRegras(regrasResp)
        setCupons(cuponsResp)
      })
      .catch(() => setErro('Não foi possível carregar os dados de cashback.'))
      .finally(() => setCarregando(false))
  }, [])

  async function remover(produtoId: number) {
    if (!confirm('Remover a regra de cashback deste produto?')) return
    await removerRegraCashback(produtoId)
    setRegras((atual) => atual.filter((r) => r.produtoId !== produtoId))
  }

  if (carregando) return <p className="px-6 py-10 font-body text-sm text-muted">Carregando...</p>
  if (erro) return <p className="px-6 py-10 font-body text-sm text-wine">{erro}</p>

  return (
    <div className="space-y-10 p-8">
      <section>
        <h1 className="font-cinzel text-2xl text-navy mb-2">Regras de cashback</h1>
        <p className="text-sm text-muted">
          Configurado por produto na aba de edição em <code>/admin/produtos</code>. Aqui você pode
          revisar e remover regras existentes.
        </p>
        <div className="mt-6 overflow-hidden rounded-lg border border-black/10 bg-white">
          <table className="w-full font-body text-sm">
            <thead>
              <tr className="border-b border-black/10 bg-sand/40 text-left font-ui text-[0.65rem] font-semibold uppercase tracking-widest text-muted">
                <th className="px-4 py-3">Produto</th>
                <th className="px-4 py-3">Percentual</th>
                <th className="px-4 py-3">Validade</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {regras.map((regra) => (
                <tr
                  key={regra.id}
                  className="border-b border-black/5 last:border-0 hover:bg-sand/20"
                >
                  <td className="px-4 py-3 font-medium text-navy">{regra.produtoNome}</td>
                  <td className="px-4 py-3">{regra.percentual}%</td>
                  <td className="px-4 py-3">
                    {regra.prazoValidadeDias ? `${regra.prazoValidadeDias} dias` : 'Sem expiração'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => remover(regra.produtoId)}
                      className="text-wine underline text-sm hover:opacity-75"
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
              {regras.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-muted">
                    Nenhuma regra de cashback configurada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="font-cinzel text-xl text-navy mb-2">Cupons emitidos</h2>
        <div className="mt-6 overflow-hidden rounded-lg border border-black/10 bg-white">
          <table className="w-full font-body text-sm">
            <thead>
              <tr className="border-b border-black/10 bg-sand/40 text-left font-ui text-[0.65rem] font-semibold uppercase tracking-widest text-muted">
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Valor</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Validade</th>
                <th className="px-4 py-3">Pedido de origem</th>
                <th className="px-4 py-3">Usado no pedido</th>
              </tr>
            </thead>
            <tbody>
              {cupons.map((cupom) => (
                <tr
                  key={cupom.id}
                  className="border-b border-black/5 last:border-0 hover:bg-sand/20"
                >
                  <td className="px-4 py-3 font-medium text-navy">{cupom.clienteNome}</td>
                  <td className="px-4 py-3">{formatCurrency(cupom.valor)}</td>
                  <td className="px-4 py-3">{cupom.status}</td>
                  <td className="px-4 py-3">
                    {cupom.expiraEm
                      ? new Date(cupom.expiraEm).toLocaleDateString('pt-BR')
                      : 'Sem expiração'}
                  </td>
                  <td className="px-4 py-3">#{cupom.pedidoOrigemId}</td>
                  <td className="px-4 py-3">{cupom.pedidoUsoId ? `#${cupom.pedidoUsoId}` : '—'}</td>
                </tr>
              ))}
              {cupons.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted">
                    Nenhum cupom emitido até o momento.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
