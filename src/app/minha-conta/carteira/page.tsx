'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { getCarteira } from '@/services/cashback'
import { formatCurrency } from '@/lib/format'
import type { Cupom } from '@/types/cupom'

function diasParaExpirar(expiraEm: string | null): number | null {
  if (!expiraEm) return null
  const diff = new Date(expiraEm).getTime() - Date.now()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function CardCupomAtivo({ cupom }: { cupom: Cupom }) {
  const dias = diasParaExpirar(cupom.expiraEm)
  const venceLogo = dias !== null && dias <= 3
  return (
    <div
      className={`rounded-lg border-2 p-4 ${
        venceLogo ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'border-[#1E3A2A] bg-[#1E3A2A]/5'
      }`}
    >
      <strong className="text-lg text-navy">{formatCurrency(cupom.valor)} de desconto</strong>
      <p className="mt-1 text-sm text-graphite">
        Ganho na compra do Pedido #{cupom.pedidoOrigemId}
        {dias !== null && (
          <>
            {' · '}
            {venceLogo ? (
              <span className="text-[#B89126]">
                ⚠ Vence em {dias <= 0 ? 'breve' : `${dias} dia(s)`}
              </span>
            ) : (
              `Vence em ${dias} dias`
            )}
          </>
        )}
        {cupom.expiraEm === null && ' · Sem expiração'}
      </p>
    </div>
  )
}

function CardCupomInativo({ cupom }: { cupom: Cupom }) {
  const descricao =
    cupom.status === 'USADO'
      ? `usado no Pedido #${cupom.pedidoUsoId}`
      : cupom.status === 'CANCELADO'
        ? 'cancelado (item de origem foi estornado)'
        : 'expirado'
  return (
    <div className="rounded-lg border border-black/20 p-4 opacity-60">
      <strong className="text-navy">{formatCurrency(cupom.valor)} de desconto</strong>
      <span className="text-sm text-graphite"> — {descricao}</span>
    </div>
  )
}

export default function CarteiraPage() {
  const { usuario, loading } = useAuth()
  const router = useRouter()
  const [cupons, setCupons] = useState<Cupom[]>([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    if (!loading && !usuario) {
      router.replace('/login')
    }
  }, [loading, usuario, router])

  useEffect(() => {
    if (!usuario) return
    getCarteira()
      .then(setCupons)
      .finally(() => setCarregando(false))
  }, [usuario])

  if (loading || carregando) return <p className="px-6 py-10">Carregando...</p>
  if (!usuario) return null

  const ativos = cupons.filter((c) => c.status === 'ATIVO')
  const inativos = cupons.filter((c) => c.status !== 'ATIVO')

  return (
    <div className="space-y-8 px-6 py-10">
      <h1 className="font-display text-2xl text-navy">Minha carteira de cupons</h1>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Ativos</h2>
        <div className="mt-3 space-y-3">
          {ativos.map((cupom) => (
            <CardCupomAtivo key={cupom.id} cupom={cupom} />
          ))}
          {ativos.length === 0 && (
            <p className="text-sm text-muted">Você ainda não tem cupons ativos.</p>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
          Usados / expirados
        </h2>
        <div className="mt-3 space-y-3">
          {inativos.map((cupom) => (
            <CardCupomInativo key={cupom.id} cupom={cupom} />
          ))}
          {inativos.length === 0 && (
            <p className="text-sm text-muted">Nenhum cupom usado ou expirado ainda.</p>
          )}
        </div>
      </section>
    </div>
  )
}
