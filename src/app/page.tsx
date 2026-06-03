import type { Metadata } from "next";
import { LandingPage } from "@/components/landing-page";

export const metadata: Metadata = {
  title: "MAGNOSSÃO | Vista presença",
  description:
    "Landing page da Polo MAGNOSSÃO Classic, uma peça premium brasileira feita para atravessar tendências."
};

export default function Home() {
  return <LandingPage />;
}
