import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import { Footer } from "@/components/landing-page";
import { ProductScreen } from "@/components/product-screen";
import { getProductJsonLd, product } from "@/data/product";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return [{ slug: product.slug }];
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;

  if (slug !== product.slug) {
    return {};
  }

  return {
    title: product.name,
    description: product.seoDescription,
    alternates: {
      canonical: "/classic"
    },
    openGraph: {
      title: product.name,
      description: product.seoDescription,
      url: `/produto/${product.slug}`,
      images: [
        {
          url: "/assets/polo-classic.png",
          width: 1254,
          height: 1254,
          alt: product.name
        }
      ]
    }
  };
}

export default async function ProdutoPage({ params }: ProductPageProps) {
  const { slug } = await params;

  if (slug !== product.slug) {
    notFound();
  }

  return (
    <>
      <ProductScreen />
      <Footer />
      <Script id="product-jsonld-slug" type="application/ld+json">
        {JSON.stringify(getProductJsonLd())}
      </Script>
    </>
  );
}
