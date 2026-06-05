'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { cadastro } from '@/services/auth'

export function CadastroForm() {
  const router = useRouter()
  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    cpf: '',
    telefone: '',
  })
  const [erro, setErro] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErro(null)
    setLoading(true)
    try {
      await cadastro(form)
      router.push('/login')
    } catch (err) {
      const msg = err instanceof Error ? err.message : ''
      if (msg.includes('409')) {
        setErro('Email ou CPF já cadastrado.')
      } else {
        setErro('Erro ao criar conta. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  const campos: Array<{
    name: keyof typeof form
    label: string
    type: string
    placeholder: string
  }> = [
    { name: 'nome', label: 'Nome completo', type: 'text', placeholder: 'João Silva' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'joao@exemplo.com' },
    {
      name: 'senha',
      label: 'Senha (mín. 8 caracteres)',
      type: 'password',
      placeholder: '••••••••',
    },
    { name: 'cpf', label: 'CPF', type: 'text', placeholder: '000.000.000-00' },
    { name: 'telefone', label: 'Telefone', type: 'tel', placeholder: '(11) 91234-5678' },
  ]

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {campos.map(({ name, label, type, placeholder }) => (
        <div key={name} className="flex flex-col gap-1">
          <label htmlFor={name} className="text-sm font-medium text-navy">
            {label}
          </label>
          <input
            id={name}
            name={name}
            type={type}
            required
            placeholder={placeholder}
            value={form[name]}
            onChange={handleChange}
            className="border border-sand rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
      ))}
      {erro && <p className="text-sm text-red-600">{erro}</p>}
      <button
        type="submit"
        disabled={loading}
        className="bg-navy text-white font-cinzel tracking-widest py-2 rounded hover:bg-navy/90 disabled:opacity-50"
      >
        {loading ? 'Criando conta…' : 'CRIAR CONTA'}
      </button>
      <p className="text-sm text-center text-gray-500">
        Já tem conta?{' '}
        <a href="/login" className="text-gold underline">
          Entrar
        </a>
      </p>
    </form>
  )
}
