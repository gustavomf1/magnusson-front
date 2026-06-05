import { apiFetch } from '@/lib/api'

export type Usuario = {
  id: number
  nome: string
  email: string
  role: 'CLIENT' | 'ADMIN'
}

export async function me(): Promise<Usuario | null> {
  try {
    return await apiFetch<Usuario>('/api/auth/me')
  } catch {
    return null
  }
}

export async function login(email: string, senha: string): Promise<Usuario> {
  return apiFetch<Usuario>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, senha }),
  })
}

export async function logout(): Promise<void> {
  await apiFetch<void>('/api/auth/logout', { method: 'POST' })
}

export async function cadastro(data: {
  nome: string
  email: string
  senha: string
  cpf: string
  telefone: string
}): Promise<Usuario> {
  return apiFetch<Usuario>('/api/auth/cadastro', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}
