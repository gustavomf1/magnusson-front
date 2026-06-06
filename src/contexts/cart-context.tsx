'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useAuth } from '@/contexts/auth-context'
import {
  listarCarrinho,
  adicionarAoCarrinho,
  atualizarItemCarrinho,
  removerDoCarrinho,
  mergeCarrinho,
  type CarrinhoItemApi,
} from '@/services/carrinho'

const STORAGE_KEY = '@magnossao/cart'

export type CartItem = {
  skuId: number
  name: string
  color: string
  size: string
  qty: number
  price: number
  image: string
}

export type AddItemPayload = {
  skuId: number
  name: string
  color: string
  size: string
  qty: number
  price: number
  image: string
}

type CartContextValue = {
  items: CartItem[]
  isOpen: boolean
  setOpen: (open: boolean) => void
  addItem: (payload: AddItemPayload) => void
  updateQty: (skuId: number, qty: number) => void
  removeItem: (skuId: number) => void
  subtotal: number
  count: number
}

function loadFromStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as CartItem[]) : []
  } catch {
    return []
  }
}

function saveToStorage(items: CartItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    /* sem acesso ao localStorage */
  }
}

function fromApi(api: CarrinhoItemApi): CartItem {
  return {
    skuId: api.skuId,
    name: api.nomeProduto,
    color: api.cor,
    size: api.tamanho,
    qty: api.quantidade,
    price: api.preco,
    image: api.imagemUrl ?? '',
  }
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const { usuario, loading } = useAuth()
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setOpen] = useState(false)
  // undefined = not yet initialized
  const prevUsuarioRef = useRef<typeof usuario | undefined>(undefined)

  useEffect(() => {
    if (loading) return

    const prev = prevUsuarioRef.current
    prevUsuarioRef.current = usuario

    if (prev === undefined) {
      // Carregamento inicial
      if (usuario) {
        listarCarrinho().then((api) => setItems(api.map(fromApi)))
      } else {
        setItems(loadFromStorage())
      }
      return
    }

    if (!prev && usuario) {
      // Login: faz merge do carrinho local com a API
      const local = items
      const mergeOuCarregar =
        local.length > 0
          ? mergeCarrinho(local.map((i) => ({ skuId: i.skuId, quantidade: i.qty })))
          : listarCarrinho()

      mergeOuCarregar
        .then((api) => {
          setItems(api.map(fromApi))
          saveToStorage([])
        })
        .catch(() => {
          listarCarrinho().then((api) => setItems(api.map(fromApi)))
        })
      return
    }

    if (prev && !usuario) {
      // Logout: limpa o estado em memória
      setItems([])
    }
  }, [usuario, loading]) // eslint-disable-line react-hooks/exhaustive-deps

  // Persiste no localStorage enquanto visitante
  useEffect(() => {
    if (!loading && !usuario) {
      saveToStorage(items)
    }
  }, [items, usuario, loading])

  const addItem = (payload: AddItemPayload) => {
    setItems((current) => {
      const existing = current.find((i) => i.skuId === payload.skuId)
      const next = existing
        ? current.map((i) => (i.skuId === payload.skuId ? { ...i, qty: i.qty + payload.qty } : i))
        : [...current, { ...payload }]

      if (usuario) {
        adicionarAoCarrinho(payload.skuId, payload.qty)
          .then((api) => setItems((c) => c.map((i) => (i.skuId === api.skuId ? fromApi(api) : i))))
          .catch(() => {})
      }

      return next
    })
    setOpen(true)
  }

  const updateQty = (skuId: number, qty: number) => {
    const safeQty = Math.max(1, qty)
    setItems((current) => current.map((i) => (i.skuId === skuId ? { ...i, qty: safeQty } : i)))
    if (usuario) {
      atualizarItemCarrinho(skuId, safeQty).catch(() => {})
    }
  }

  const removeItem = (skuId: number) => {
    setItems((current) => current.filter((i) => i.skuId !== skuId))
    if (usuario) {
      removerDoCarrinho(skuId).catch(() => {})
    }
  }

  const value = useMemo<CartContextValue>(() => {
    const subtotal = items.reduce((acc, i) => acc + i.price * i.qty, 0)
    const count = items.reduce((acc, i) => acc + i.qty, 0)
    return { items, isOpen, setOpen, addItem, updateQty, removeItem, subtotal, count }
  }, [items, isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart deve ser usado dentro de CartProvider.')
  return context
}
