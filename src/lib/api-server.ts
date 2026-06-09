import { cookies } from 'next/headers'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'

export async function apiFetchServer<T>(path: string, init?: RequestInit): Promise<T> {
  const cookieStore = await cookies()
  const cookieHeader = cookieStore.toString()

  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      ...init?.headers,
    },
  })
  if (!res.ok) {
    throw new Error(`API ${res.status} em ${path}`)
  }
  if (res.status === 204 || res.headers.get('content-length') === '0') {
    return undefined as T
  }
  return res.json() as Promise<T>
}
