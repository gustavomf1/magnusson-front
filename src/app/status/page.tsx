'use client'

import { useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api'

type Health = { status: string; db: string; time: string }

export default function StatusPage() {
  const [health, setHealth] = useState<Health | null>(null)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    apiFetch<Health>('/api/health')
      .then(setHealth)
      .catch((e) => setErro(String(e)))
  }, [])

  const ok = health?.status === 'ok' && health?.db === 'ok'

  return (
    <main style={{ padding: 32, fontFamily: 'monospace' }}>
      <h1>Status da Fundação</h1>
      <div
        style={{
          marginTop: 16,
          padding: 16,
          borderRadius: 8,
          color: '#fff',
          background: erro ? '#b91c1c' : ok ? '#15803d' : '#a16207',
        }}
      >
        {erro ? `FALHA: ${erro}` : ok ? 'OK — front + backend + banco conversando' : 'Carregando...'}
      </div>
      <pre style={{ marginTop: 16 }}>{JSON.stringify(health ?? erro, null, 2)}</pre>
    </main>
  )
}
