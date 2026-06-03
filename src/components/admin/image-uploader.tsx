'use client'

import { useState, useRef } from 'react'
import type { ImagemDto } from '@/types/product'

type Props = {
  produtoId: number
  imagens: ImagemDto[]
  onChange: (imagens: ImagemDto[]) => void
}

export function ImageUploader({ produtoId, imagens, onChange }: Props) {
  const [uploading, setUploading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    setUploading(true)
    setErro(null)
    try {
      const presignRes = await fetch(
        `/api/admin/produtos/${produtoId}/imagens/upload-url?contentType=${encodeURIComponent(file.type)}`,
        { method: 'POST' }
      )
      if (!presignRes.ok) throw new Error('Erro ao obter URL de upload')
      const { uploadUrl, chave, url } = await presignRes.json()

      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type }
      })
      if (!uploadRes.ok) throw new Error('Erro ao fazer upload da imagem')

      const alt = file.name.replace(/\.[^/.]+$/, '')
      const confirmRes = await fetch(`/api/admin/produtos/${produtoId}/imagens/confirmar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chave, url, alt })
      })
      if (!confirmRes.ok) throw new Error('Erro ao confirmar imagem')

      const novaImagem: ImagemDto = {
        id: Date.now(),
        url,
        alt,
        ordem: imagens.length
      }
      onChange([...imagens, novaImagem])
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro desconhecido')
    } finally {
      setUploading(false)
    }
  }

  async function moverImagem(index: number, direcao: -1 | 1) {
    const novas = [...imagens]
    const alvo = index + direcao
    if (alvo < 0 || alvo >= novas.length) return
    ;[novas[index], novas[alvo]] = [novas[alvo], novas[index]]

    await fetch(`/api/admin/produtos/${produtoId}/imagens/ordem`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: novas.map(i => i.id) })
    })
    onChange(novas)
  }

  async function deletarImagem(imagemId: number) {
    await fetch(`/api/admin/produtos/${produtoId}/imagens/${imagemId}`, { method: 'DELETE' })
    onChange(imagens.filter(i => i.id !== imagemId))
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {imagens.map((img, i) => (
          <div key={img.id} className="relative group w-24 h-24">
            <img src={img.url} alt={img.alt} className="w-full h-full object-cover rounded border" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 rounded">
              <button onClick={() => moverImagem(i, -1)} disabled={i === 0}
                className="text-white text-xs px-1 disabled:opacity-30">←</button>
              <button onClick={() => deletarImagem(img.id)}
                className="text-red-300 text-xs px-1">✕</button>
              <button onClick={() => moverImagem(i, 1)} disabled={i === imagens.length - 1}
                className="text-white text-xs px-1 disabled:opacity-30">→</button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-24 h-24 border-2 border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400 hover:border-navy hover:text-navy disabled:opacity-50"
        >
          {uploading ? '...' : '+'}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ''
        }}
      />

      {erro && <p className="text-red-600 text-sm">{erro}</p>}
    </div>
  )
}
