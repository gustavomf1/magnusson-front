export type Endereco = {
  id: number
  logradouro: string
  numero: string
  complemento: string | null
  bairro: string
  cep: string
  cidade: string
  uf: string
  principal: boolean
}
