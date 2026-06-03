import type { Metadata } from "next";
import Script from "next/script";
import { Footer } from "@/components/landing-page";
import { ProductScreen } from "@/components/product-screen";
import { getProductJsonLd, product } from "@/data/product";

export const metadata: Metadata = {
  title: product.name,
  description: product.seoDescription,
  alternates: {
    canonical: "/classic"
  },
  openGraph: {
    title: product.name,
    description: product.seoDescription,
    url: "/classic",
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

export default function ClassicPage() {
  return (
    <>
      <ProductScreen />
      <Footer />
      <Script id="product-jsonld-classic" type="application/ld+json">
        {JSON.stringify(getProductJsonLd())}
      </Script>
    </>
  );
}
