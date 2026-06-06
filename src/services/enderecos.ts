import { apiFetch } from '@/lib/api'
import type { Endereco } from '@/types/endereco'

export type EnderecoRequest = {
  logradouro: string
  numero: string
  complemento?: string | null
  bairro: string
  cep: string
  cidade: string
  uf: string
  principal?: boolean
}

export function listarEnderecos(): Promise<Endereco[]> {
  return apiFetch<Endereco[]>('/api/enderecos')
}

export function criarEndereco(data: EnderecoRequest): Promise<Endereco> {
  return apiFetch<Endereco>('/api/enderecos', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function deletarEndereco(id: number): Promise<void> {
  return apiFetch<void>(`/api/enderecos/${id}`, { method: 'DELETE' })
}
