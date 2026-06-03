'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ImageUploader } from './image-uploader'
import type { Produto, ImagemDto, CorDto, TamanhoDto } from '@/types/product'

type Props = {
  produto?: Produto
}

type FormState = {
  slug: string; nome: string; nomeCurto: string; colecao: string
  preco: string; descricao: string; descricaoSeo: string
}

export function ProductForm({ produto }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const [form, setForm] = useState<FormState>({
    slug: produto?.slug ?? '',
    nome: produto?.nome ?? '',
    nomeCurto: produto?.nomeCurto ?? '',
    colecao: produto?.colecao ?? '',
    preco: produto?.preco?.toString() ?? '',
    descricao: produto?.descricao ?? '',
    descricaoSeo: produto?.descricaoSeo ?? ''
  })

  const [imagens, setImagens] = useState<ImagemDto[]>(produto?.imagens ?? [])
  const [cores, setCores] = useState<CorDto[]>(produto?.cores ?? [])
  const [tamanhos, setTamanhos] = useState<TamanhoDto[]>(produto?.tamanhos ?? [])
  const [skusGerados, setSkusGerados] = useState(produto?.skus?.length ?? 0)

  const [novaCor, setNovaCor] = useState({ nome: '', token: '', hex: '#000000' })
  const [novoTamanho, setNovoTamanho] = useState({ label: 'M', peito: '', comprimento: '', ombro: '' })

  const produtoId = produto?.id

  function set(field: keyof FormState, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function salvar() {
    setSaving(true)
    setErro(null)
    try {
      const body = {
        slug: form.slug, nome: form.nome, nomeCurto: form.nomeCurto,
        colecao: form.colecao, preco: parseFloat(form.preco),
        descricao: form.descricao, descricaoSeo: form.descricaoSeo
      }
      const url = produtoId ? `/api/admin/produtos/${produtoId}` : '/api/admin/produtos'
      const method = produtoId ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
      })
      if (!res.ok) throw new Error('Erro ao salvar produto')
      const salvo = await res.json()
      router.push(`/admin/produtos/${salvo.id}`)
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro')
    } finally {
      setSaving(false)
    }
  }

  async function adicionarCor() {
    if (!produtoId || !novaCor.nome || !novaCor.token) return
    const res = await fetch(`/api/admin/produtos/${produtoId}/cores`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novaCor)
    })
    if (!res.ok) return
    const cor = await res.json()
    setCores(prev => [...prev, cor])
    setNovaCor({ nome: '', token: '', hex: '#000000' })
  }

  async function deletarCor(corId: number) {
    if (!produtoId) return
    await fetch(`/api/admin/produtos/${produtoId}/cores/${corId}`, { method: 'DELETE' })
    setCores(prev => prev.filter(c => c.id !== corId))
  }

  async function adicionarTamanho() {
    if (!produtoId || !novoTamanho.label) return
    const res = await fetch(`/api/admin/produtos/${produtoId}/tamanhos`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        label: novoTamanho.label,
        peito: novoTamanho.peito ? parseInt(novoTamanho.peito) : null,
        comprimento: novoTamanho.comprimento ? parseInt(novoTamanho.comprimento) : null,
        ombro: novoTamanho.ombro ? parseInt(novoTamanho.ombro) : null
      })
    })
    if (!res.ok) return
    const tam = await res.json()
    setTamanhos(prev => [...prev, tam])
    setNovoTamanho({ label: 'M', peito: '', comprimento: '', ombro: '' })
  }

  async function deletarTamanho(tamanhoId: number) {
    if (!produtoId) return
    await fetch(`/api/admin/produtos/${produtoId}/tamanhos/${tamanhoId}`, { method: 'DELETE' })
    setTamanhos(prev => prev.filter(t => t.id !== tamanhoId))
  }

  async function gerarSkus() {
    if (!produtoId) return
    const res = await fetch(`/api/admin/produtos/${produtoId}/skus/gerar`, { method: 'POST' })
    if (!res.ok) return
    const novos = await res.json()
    setSkusGerados(prev => prev + novos.length)
  }

  const inputClass = 'w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-navy'
  const labelClass = 'block text-xs font-medium text-gray-600 mb-1 uppercase tracking-wider'

  return (
    <div className="space-y-8">
      <section>
        <h2 className="font-cinzel text-lg text-navy mb-4">Dados básicos</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className={labelClass}>Nome</label>
            <input className={inputClass} value={form.nome} onChange={e => set('nome', e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Nome curto</label>
            <input className={inputClass} value={form.nomeCurto} onChange={e => set('nomeCurto', e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Slug</label>
            <input className={inputClass} value={form.slug} onChange={e => set('slug', e.target.value)}
              disabled={!!produtoId} />
          </div>
          <div>
            <label className={labelClass}>Coleção</label>
            <input className={inputClass} value={form.colecao} onChange={e => set('colecao', e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Preço (R$)</label>
            <input className={inputClass} type="number" step="0.01" value={form.preco}
              onChange={e => set('preco', e.target.value)} />
          </div>
          <div className="col-span-2">
            <label className={labelClass}>Descrição</label>
            <textarea className={inputClass} rows={4} value={form.descricao}
              onChange={e => set('descricao', e.target.value)} />
          </div>
          <div className="col-span-2">
            <label className={labelClass}>Descrição SEO</label>
            <textarea className={inputClass} rows={2} value={form.descricaoSeo}
              onChange={e => set('descricaoSeo', e.target.value)} />
          </div>
        </div>
        <button onClick={salvar} disabled={saving}
          className="mt-4 bg-navy text-white px-6 py-2 text-sm tracking-wider disabled:opacity-50">
          {saving ? 'Salvando...' : produtoId ? 'Atualizar' : 'Criar produto'}
        </button>
        {erro && <p className="mt-2 text-red-600 text-sm">{erro}</p>}
        {!produtoId && (
          <p className="mt-2 text-xs text-gray-500">Salve o produto primeiro para gerenciar imagens, cores e tamanhos.</p>
        )}
      </section>

      {produtoId && (
        <>
          <section>
            <h2 className="font-cinzel text-lg text-navy mb-4">Imagens</h2>
            <ImageUploader produtoId={produtoId} imagens={imagens} onChange={setImagens} />
          </section>

          <section>
            <h2 className="font-cinzel text-lg text-navy mb-4">Cores</h2>
            <div className="flex flex-wrap gap-2 mb-3">
              {cores.map(c => (
                <div key={c.id} className="flex items-center gap-2 border px-3 py-1 text-sm">
                  <span className="w-4 h-4 rounded-full inline-block border" style={{ background: c.hex }} />
                  {c.nome}
                  <button onClick={() => deletarCor(c.id)} className="text-gray-400 hover:text-red-500">✕</button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 items-end">
              <div>
                <label className={labelClass}>Nome</label>
                <input className="border px-2 py-1 text-sm w-28" value={novaCor.nome}
                  onChange={e => setNovaCor(p => ({ ...p, nome: e.target.value }))} />
              </div>
              <div>
                <label className={labelClass}>Token</label>
                <input className="border px-2 py-1 text-sm w-20" value={novaCor.token}
                  onChange={e => setNovaCor(p => ({ ...p, token: e.target.value }))} />
              </div>
              <div>
                <label className={labelClass}>Hex</label>
                <input type="color" className="h-9 w-12 border" value={novaCor.hex}
                  onChange={e => setNovaCor(p => ({ ...p, hex: e.target.value }))} />
              </div>
              <button onClick={adicionarCor}
                className="bg-gray-800 text-white px-3 py-1 text-sm h-9">+ Cor</button>
            </div>
          </section>

          <section>
            <h2 className="font-cinzel text-lg text-navy mb-4">Tamanhos</h2>
            <div className="flex flex-wrap gap-2 mb-3">
              {tamanhos.map(t => (
                <div key={t.id} className="flex items-center gap-2 border px-3 py-1 text-sm">
                  {t.label}
                  <button onClick={() => deletarTamanho(t.id)} className="text-gray-400 hover:text-red-500">✕</button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 items-end">
              <div>
                <label className={labelClass}>Label</label>
                <select className="border px-2 py-1 text-sm" value={novoTamanho.label}
                  onChange={e => setNovoTamanho(p => ({ ...p, label: e.target.value }))}>
                  {['P','M','G','GG'].map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Peito</label>
                <input className="border px-2 py-1 text-sm w-16" type="number" value={novoTamanho.peito}
                  onChange={e => setNovoTamanho(p => ({ ...p, peito: e.target.value }))} />
              </div>
              <div>
                <label className={labelClass}>Comprimento</label>
                <input className="border px-2 py-1 text-sm w-20" type="number" value={novoTamanho.comprimento}
                  onChange={e => setNovoTamanho(p => ({ ...p, comprimento: e.target.value }))} />
              </div>
              <div>
                <label className={labelClass}>Ombro</label>
                <input className="border px-2 py-1 text-sm w-16" type="number" value={novoTamanho.ombro}
                  onChange={e => setNovoTamanho(p => ({ ...p, ombro: e.target.value }))} />
              </div>
              <button onClick={adicionarTamanho}
                className="bg-gray-800 text-white px-3 py-1 text-sm h-9">+ Tamanho</button>
            </div>
          </section>

          <section>
            <h2 className="font-cinzel text-lg text-navy mb-4">SKUs</h2>
            <p className="text-sm text-gray-600 mb-3">
              SKUs gerados: <strong>{skusGerados}</strong> (combinações cor × tamanho)
            </p>
            <button onClick={gerarSkus}
              className="border border-navy text-navy px-4 py-2 text-sm hover:bg-navy hover:text-white">
              Gerar SKUs das cores × tamanhos
            </button>
          </section>
        </>
      )}
    </div>
  )
}
