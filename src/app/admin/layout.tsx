'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { usuario, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!usuario || usuario.role !== 'ADMIN')) {
      router.replace('/login')
    }
  }, [usuario, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <span className="text-navy font-cinzel tracking-widest text-sm">Verificando acesso…</span>
      </div>
    )
  }

  if (!usuario || usuario.role !== 'ADMIN') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-navy text-white px-6 py-4 flex items-center justify-between">
        <span className="font-cinzel text-lg tracking-widest">MAGNOSSÃO · ADMIN</span>
        <span className="text-sm text-white/70">{usuario.nome}</span>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
