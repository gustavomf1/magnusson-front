'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'

export function LoginForm() {
  const { login } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErro(null)
    setLoading(true)
    try {
      const u = await login(email, senha)
      router.push(u.role === 'ADMIN' ? '/admin' : '/')
    } catch {
      setErro('Email ou senha incorretos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium text-navy">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-sand rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="senha" className="text-sm font-medium text-navy">
          Senha
        </label>
        <input
          id="senha"
          type="password"
          required
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="border border-sand rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
        />
      </div>
      {erro && <p className="text-sm text-red-600">{erro}</p>}
      <button
        type="submit"
        disabled={loading}
        className="bg-navy text-white font-cinzel tracking-widest py-2 rounded hover:bg-navy/90 disabled:opacity-50"
      >
        {loading ? 'Entrando…' : 'ENTRAR'}
      </button>
      <p className="text-sm text-center text-gray-500">
        Não tem conta?{' '}
        <a href="/cadastro" className="text-gold underline">
          Cadastre-se
        </a>
      </p>
    </form>
  )
}
