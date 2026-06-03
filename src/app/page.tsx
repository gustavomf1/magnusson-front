import type { Metadata } from "next";
import { LandingPage } from "@/components/landing-page";
import { getProducts } from "@/lib/products";
import type { ProdutoResumo } from "@/types/product";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "MAGNOSSÃO | Vista presença",
  description:
    "Landing page da Polo MAGNOSSÃO Classic, uma peça premium brasileira feita para atravessar tendências."
};

export default async function Home() {
  let produtos: ProdutoResumo[] = [];

  try {
    produtos = await getProducts();
  } catch {
    produtos = [];
  }

  return <LandingPage produtos={produtos} />;
}
