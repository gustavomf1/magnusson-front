import { CadastroForm } from '@/components/auth/cadastro-form'

export const metadata = { title: 'Criar conta — MAGNOSSÃO' }

export default function CadastroPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-sand/20 px-4 py-12">
      <div className="w-full max-w-sm bg-white rounded-lg shadow p-8">
        <h1 className="font-cinzel text-2xl text-navy tracking-widest text-center mb-6">
          CRIAR CONTA
        </h1>
        <CadastroForm />
      </div>
    </main>
  )
}
