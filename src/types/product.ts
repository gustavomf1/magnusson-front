export type Categoria = 'POLO' | 'CAMISA' | 'CALCA' | 'SHORTS'

export type ImagemDto = {
  id: number
  url: string
  alt: string
  ordem: number
}

export type CorDto = {
  id: number
  nome: string
  token: string
  hex: string
}

export type TamanhoDto = {
  id: number
  label: 'P' | 'M' | 'G' | 'GG'
  peito: number | null
  comprimento: number | null
  ombro: number | null
}

export type SkuDto = {
  id: number
  corId: number
  tamanhoId: number
  codigo: string
  ativo: boolean
  disponivel: boolean
}

export type SkuEstoque = {
  id: number
  produtoNome: string
  corNome: string
  tamanhoLabel: string
  codigo: string
  quantidade: number
  disponivel: boolean
}

export type BeneficioDto = {
  id: number
  iconeNome: string
  titulo: string
  corpo: string
  ordem: number
}

export type DetalheDto = {
  id: number
  label: string | null
  urlImagem: string
  alt: string | null
  ordem: number
}

export type ReviewDto = {
  id: number
  citacao: string
  nome: string | null
  cidade: string | null
}

export type FaqDto = {
  id: number
  pergunta: string
  resposta: string
  ordem: number
}

export type ProdutoResumo = {
  id: number
  slug: string
  nome: string
  nomeCurto: string | null
  colecao: string | null
  preco: number
  status: 'RASCUNHO' | 'PUBLICADO' | 'ARQUIVADO'
  imagemPrincipal: string | null
  categoria: Categoria | null
}

export type Produto = {
  id: number
  slug: string
  nome: string
  nomeCurto: string | null
  colecao: string | null
  preco: number
  descricao: string | null
  descricaoSeo: string | null
  status: 'RASCUNHO' | 'PUBLICADO' | 'ARQUIVADO'
  categoria: Categoria | null
  imagens: ImagemDto[]
  cores: CorDto[]
  tamanhos: TamanhoDto[]
  skus: SkuDto[]
  beneficios: BeneficioDto[]
  detalhes: DetalheDto[]
  reviews: ReviewDto[]
  faqs: FaqDto[]
  regraCashback: { percentual: number; prazoValidadeDias: number | null } | null
}
