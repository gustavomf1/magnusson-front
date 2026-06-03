"use client";

import { Minus, Plus, Ruler, ShoppingBag, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useCart } from "@/components/cart-context";
import { Button, Eyebrow, Flourish, Selo } from "@/components/primitives";
import { colors, product, sizes } from "@/data/product";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/cn";

type ShippingQuote = {
  standard: string;
  express: string;
};

export function ProductScreen() {
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(colors[0].name);
  const [selectedSize, setSelectedSize] = useState("M");
  const [qty, setQty] = useState(1);
  const [cep, setCep] = useState("");
  const [shipping, setShipping] = useState<ShippingQuote | null>(null);
  const { addItem } = useCart();

  const active = product.images[activeImage];

  const canCalculate = useMemo(() => cep.replace(/\D/g, "").length >= 8, [cep]);

  const addToCart = () => {
    addItem({
      color: selectedColor,
      size: selectedSize,
      qty
    });
  };

  const calculateShipping = () => {
    if (!canCalculate) {
      setShipping({
        standard: "Informe um CEP com 8 dígitos.",
        express: "A entrega expressa aparece após um CEP válido."
      });
      return;
    }

    setShipping({
      standard: "5 a 8 dias úteis · R$ 19,90",
      express: "2 a 4 dias úteis · R$ 34,90"
    });
  };

  return (
    <main className="bg-offwhite px-5 pb-24 pt-32 md:px-9 md:pt-36">
      <section className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-navy shadow-card-lg">
            <Image
              src={active.src}
              alt={active.alt}
              fill
              priority
              sizes="(min-width: 1024px) 610px, 92vw"
              className="object-cover"
            />
          </div>
          <div className="mt-3 grid grid-cols-5 gap-2.5">
            {product.images.map((image, index) => (
              <button
                key={image.src}
                type="button"
                onClick={() => setActiveImage(index)}
                aria-label={`Ver imagem ${index + 1}`}
                className={cn(
                  "relative aspect-square overflow-hidden rounded-md border-2 bg-navy transition duration-[160ms] ease-magn",
                  index === activeImage ? "border-gold" : "border-transparent hover:border-gold/60"
                )}
              >
                <Image src={image.src} alt="" fill sizes="120px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="lg:pt-2">
          <Eyebrow className="mb-4">{product.collection}</Eyebrow>
          <h1 className="headline mb-4 text-[clamp(2rem,5vw,2.65rem)] text-navy">{product.name}</h1>

          <div className="mb-5 flex flex-wrap gap-2">
            {product.seals.map((seal) => (
              <Selo key={seal}>{seal}</Selo>
            ))}
          </div>

          <div className="mb-1 flex flex-wrap items-baseline gap-3">
            <div className="font-display text-[2.1rem] font-medium text-navy">
              {formatCurrency(product.price)}
            </div>
            <div className="font-body text-sm text-muted">ou {product.installment}</div>
          </div>
          <div className="mb-7 font-ui text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-gold-deep">
            {product.pix}
          </div>

          <Flourish className="mb-7" />

          <div className="mb-6">
            <div className="mb-3 font-ui text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-muted">
              Cor · <span className="text-navy">{selectedColor}</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {colors.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setSelectedColor(color.name)}
                  aria-label={`Selecionar cor ${color.name}`}
                  title={color.name}
                  className={cn(
                    "size-9 rounded-full border transition duration-[160ms] ease-magn",
                    selectedColor === color.name
                      ? "border-gold shadow-[0_0_0_2px_var(--magn-gold),inset_0_0_0_1px_rgba(0,0,0,0.1)]"
                      : "border-black/15 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]"
                  )}
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </div>
          </div>

          <div className="mb-6">
            <div className="mb-3 flex items-baseline justify-between gap-4">
              <div className="font-ui text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-muted">
                Tamanho · <span className="text-navy">{selectedSize}</span>
              </div>
              <Link
                href="/#tamanhos"
                className="inline-flex items-center gap-1.5 font-ui text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-gold-deep transition duration-[160ms] ease-magn hover:underline hover:underline-offset-4"
              >
                <Ruler className="size-3.5" strokeWidth={1.5} />
                Guia de medidas
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size.label}
                  type="button"
                  onClick={() => setSelectedSize(size.label)}
                  className={cn(
                    "flex size-[50px] items-center justify-center rounded-md border font-ui text-sm font-semibold transition duration-[160ms] ease-magn",
                    selectedSize === size.label
                      ? "border-navy bg-navy text-gold"
                      : "border-black/15 text-black hover:border-navy"
                  )}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6 flex flex-wrap items-center gap-3">
            <div className="font-ui text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-muted">
              Quantidade
            </div>
            <div className="flex items-center rounded-md border border-black/15">
              <button
                type="button"
                aria-label="Diminuir quantidade"
                onClick={() => setQty((value) => Math.max(1, value - 1))}
                className="inline-flex size-11 items-center justify-center"
              >
                <Minus className="size-4" strokeWidth={1.5} />
              </button>
              <span className="min-w-8 text-center font-ui font-semibold">{qty}</span>
              <button
                type="button"
                aria-label="Aumentar quantidade"
                onClick={() => setQty((value) => value + 1)}
                className="inline-flex size-11 items-center justify-center"
              >
                <Plus className="size-4" strokeWidth={1.5} />
              </button>
            </div>
          </div>

          <div className="mb-8 grid gap-3 sm:grid-cols-2">
            <Button type="button" variant="primary" className="w-full" onClick={addToCart}>
              <ShoppingBag className="size-4" strokeWidth={1.5} />
              Comprar agora
            </Button>
            <Button type="button" variant="premium" className="w-full" onClick={addToCart}>
              Adicionar ao carrinho
            </Button>
          </div>

          <div className="rounded-lg bg-white p-5 shadow-[var(--shadow-hairline)] md:p-6">
            <div className="mb-4 flex items-center gap-3">
              <Truck className="size-[18px] text-gold-deep" strokeWidth={1.5} />
              <div className="font-ui text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-navy">
                Calcule o frete
              </div>
            </div>
            <div className="flex gap-2">
              <input
                value={cep}
                onChange={(event) => setCep(event.target.value)}
                inputMode="numeric"
                placeholder="00000-000"
                aria-label="CEP"
                className="min-h-11 flex-1 rounded-md border border-black/15 bg-offwhite px-3 font-body text-sm text-black placeholder:text-muted"
              />
              <Button type="button" variant="primary" className="px-4" onClick={calculateShipping}>
                Calcular
              </Button>
            </div>
            {shipping ? (
              <div className="mt-4 space-y-1.5 font-body text-sm leading-relaxed text-graphite">
                <div>Entrega padrão · {shipping.standard}</div>
                <div>Entrega expressa · {shipping.express}</div>
                <div className="pt-1 font-semibold text-gold-deep">Frete grátis acima de R$ 299,00</div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-[920px]">
        <Flourish label="Sobre a peça" className="mb-9" />
        <p className="mx-auto mb-10 max-w-3xl text-center font-editorial text-[1.35rem] italic leading-relaxed text-graphite">
          {product.description}
        </p>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            { title: "Composição", items: product.composition },
            { title: "Cuidados", items: product.care },
            { title: "Política", items: product.policy }
          ].map((block) => (
            <div key={block.title}>
              <h2 className="mb-3 font-ui text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-gold-deep">
                {block.title}
              </h2>
              <ul className="space-y-2 font-body text-sm text-graphite">
                {block.items.map((item) => (
                  <li key={item}>· {item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
