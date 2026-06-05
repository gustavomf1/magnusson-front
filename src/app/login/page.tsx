import { LoginForm } from '@/components/auth/login-form'

export const metadata = { title: 'Entrar — MAGNOSSÃO' }

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-sand/20 px-4">
      <div className="w-full max-w-sm bg-white rounded-lg shadow p-8">
        <h1 className="font-cinzel text-2xl text-navy tracking-widest text-center mb-6">ENTRAR</h1>
        <LoginForm />
      </div>
    </main>
  )
}
