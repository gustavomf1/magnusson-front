export const metadata = { title: 'Admin — MAGNOSSÃO' }

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-navy text-white px-6 py-4 flex items-center justify-between">
        <span className="font-cinzel text-lg tracking-widest">MAGNOSSÃO · ADMIN</span>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
