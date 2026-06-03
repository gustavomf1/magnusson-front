import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import { Footer } from "@/components/marketing/landing-page";
import { ProductScreen } from "@/components/catalog/product-screen";
import { getProduct } from "@/services/products";

export const revalidate = 60;

const SLUG = "classic";

export async function generateMetadata(): Promise<Metadata> {
  const produto = await getProduct(SLUG);

  if (!produto) {
    return {};
  }

  const description = produto.descricaoSeo ?? produto.descricao ?? undefined;
  const principal = produto.imagens.find((image) => image.ordem === 0) ?? produto.imagens[0];

  return {
    title: produto.nome,
    description,
    alternates: {
      canonical: "/classic"
    },
    openGraph: {
      title: produto.nome,
      description,
      url: "/classic",
      images: principal
        ? [
            {
              url: principal.url,
              alt: principal.alt
            }
          ]
        : undefined
    }
  };
}

function getProductJsonLd(produto: NonNullable<Awaited<ReturnType<typeof getProduct>>>) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: produto.nome,
    image: produto.imagens.map((image) => image.url),
    description: produto.descricaoSeo ?? produto.descricao ?? undefined,
    brand: {
      "@type": "Brand",
      name: "MAGNOSSÃO"
    },
    offers: {
      "@type": "Offer",
      url: "/classic",
      priceCurrency: "BRL",
      price: produto.preco.toFixed(2),
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition"
    },
    aggregateRating:
      produto.reviews.length > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: "5",
            reviewCount: produto.reviews.length.toString()
          }
        : undefined
  };
}

export default async function ClassicPage() {
  const produto = await getProduct(SLUG);

  if (!produto) {
    notFound();
  }

  return (
    <>
      <ProductScreen produto={produto} />
      <Footer />
      <Script id="product-jsonld-classic" type="application/ld+json">
        {JSON.stringify(getProductJsonLd(produto))}
      </Script>
    </>
  );
}
