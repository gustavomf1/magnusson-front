'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { me, login as authLogin, logout as authLogout, type Usuario } from '@/services/auth'

type AuthContextValue = {
  usuario: Usuario | null
  loading: boolean
  login: (email: string, senha: string) => Promise<Usuario>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    me().then((u) => {
      setUsuario(u)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    function handleUnauthorized() {
      setUsuario(null)
    }
    window.addEventListener('auth:unauthorized', handleUnauthorized)
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized)
  }, [])

  async function login(email: string, senha: string) {
    const u = await authLogin(email, senha)
    setUsuario(u)
    return u
  }

  async function logout() {
    await authLogout()
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}
