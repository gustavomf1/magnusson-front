import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import { Footer } from "@/components/landing-page";
import { ProductScreen } from "@/components/product-screen";
import { getProduct } from "@/lib/products";

export const revalidate = 60;

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const produto = await getProduct(slug);

  if (!produto) {
    return {};
  }

  const description = produto.descricaoSeo ?? produto.descricao ?? undefined;
  const principal = produto.imagens.find((image) => image.ordem === 0) ?? produto.imagens[0];

  return {
    title: `${produto.nome} | MAGNOSSÃO`,
    description,
    alternates: {
      canonical: `/produto/${produto.slug}`
    },
    openGraph: {
      title: produto.nome,
      description,
      url: `/produto/${produto.slug}`,
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
      url: `/produto/${produto.slug}`,
      priceCurrency: "BRL",
      price: produto.preco.toFixed(2),
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition"
    }
  };
}

export default async function ProdutoPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const produto = await getProduct(slug);

  if (!produto) {
    notFound();
  }

  return (
    <>
      <ProductScreen produto={produto} />
      <Footer />
      <Script id="product-jsonld-slug" type="application/ld+json">
        {JSON.stringify(getProductJsonLd(produto))}
      </Script>
    </>
  );
}
