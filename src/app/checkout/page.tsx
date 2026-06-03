import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/marketing/landing-page";
import { ButtonLink, Eyebrow, Flourish, OncaMark } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Placeholder de checkout da MAGNOSSÃO para a primeira versão do frontend."
};

export default function CheckoutPage() {
  return (
    <>
      <main className="velvet-surface relative min-h-[72vh] overflow-hidden px-5 pb-24 pt-36 text-offwhite md:px-9">
        <div className="noise-overlay" />
        <section className="relative mx-auto max-w-2xl text-center">
          <OncaMark size={70} className="mx-auto mb-6" />
          <Eyebrow className="mb-4 text-gold">Checkout</Eyebrow>
          <h1 className="headline mb-6 text-[clamp(2.2rem,6vw,3.5rem)] text-offwhite">
            Pagamento em breve.
          </h1>
          <Flourish className="mx-auto mb-8 max-w-64" />
          <p className="mx-auto mb-9 max-w-xl font-editorial text-[1.35rem] italic leading-relaxed text-[#C9CFD8]">
            Esta etapa será conectada ao backend Java quando o fluxo de pagamento entrar no projeto.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <ButtonLink href="/classic" variant="premium">
              Voltar ao produto
            </ButtonLink>
            <Link
              href="/"
              className="button-label inline-flex min-h-11 items-center justify-center rounded-md border border-gold px-6 py-3 text-gold transition duration-[240ms] ease-magn hover:bg-gold hover:text-black"
            >
              Página inicial
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
