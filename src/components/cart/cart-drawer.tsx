"use client";

import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/contexts/cart-context";
import { Button, OncaMark, Eyebrow } from "@/components/ui/primitives";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/cn";

const freeShipping = 299;

export function CartDrawer() {
  const { items, isOpen, setOpen, subtotal, updateQty, removeItem } = useCart();
  const remaining = Math.max(0, freeShipping - subtotal);
  const progress = Math.min(100, (subtotal / freeShipping) * 100);

  return (
    <>
      <div
        onClick={() => setOpen(false)}
        className={cn(
          "fixed inset-0 z-[90] bg-navy/55 transition-opacity duration-[240ms] ease-magn",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />

      <aside
        aria-label="Carrinho"
        className={cn(
          "fixed bottom-0 right-0 top-0 z-[100] flex w-full max-w-[460px] flex-col bg-offwhite shadow-card-lg transition-transform duration-[320ms] ease-magn",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-black/10 px-6 py-6 md:px-7">
          <div>
            <Eyebrow className="mb-1">Seu carrinho</Eyebrow>
            <div className="headline text-xl text-navy">
              {items.length} {items.length === 1 ? "item" : "itens"}
            </div>
          </div>
          <button
            type="button"
            aria-label="Fechar carrinho"
            onClick={() => setOpen(false)}
            className="inline-flex size-10 items-center justify-center rounded-md text-navy transition duration-[160ms] ease-magn hover:bg-black/5"
          >
            <X className="size-5" strokeWidth={1.5} />
          </button>
        </div>

        {items.length > 0 ? (
          <div className="border-b border-black/10 bg-gold/10 px-6 py-4 md:px-7">
            <p className="mb-2 font-body text-sm text-graphite">
              {remaining > 0 ? (
                <>
                  Faltam <strong className="font-semibold text-navy">{formatCurrency(remaining)}</strong> para
                  frete grátis.
                </>
              ) : (
                <span className="font-semibold text-gold-deep">Você ganhou frete grátis.</span>
              )}
            </p>
            <div className="h-1 rounded-full bg-navy/10">
              <div
                className="h-full rounded-full bg-gold transition-[width] duration-[320ms] ease-magn"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : null}

        <div className="flex-1 overflow-y-auto px-6 py-2 md:px-7">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-20 text-center text-muted">
              <OncaMark size={58} className="mb-5 opacity-40" />
              <p className="font-editorial text-lg italic">Seu carrinho ainda está vazio.</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 border-b border-black/10 py-5">
                <div className="relative h-[104px] w-20 flex-shrink-0 overflow-hidden rounded-md bg-navy">
                  <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="headline text-[0.8rem] text-navy">{item.name}</div>
                  <div className="mt-1 font-body text-xs text-muted">
                    {item.color} · Tam. {item.size}
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="flex items-center rounded-md border border-black/15">
                      <button
                        type="button"
                        aria-label="Diminuir quantidade"
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        className="inline-flex size-8 items-center justify-center"
                      >
                        <Minus className="size-3.5" strokeWidth={1.5} />
                      </button>
                      <span className="min-w-7 text-center font-ui text-xs font-semibold">{item.qty}</span>
                      <button
                        type="button"
                        aria-label="Aumentar quantidade"
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        className="inline-flex size-8 items-center justify-center"
                      >
                        <Plus className="size-3.5" strokeWidth={1.5} />
                      </button>
                    </div>
                    <div className="font-display text-base font-medium text-navy">
                      {formatCurrency(item.price * item.qty)}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="mt-3 inline-flex items-center gap-2 font-ui text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted transition duration-[160ms] ease-magn hover:text-wine"
                  >
                    <Trash2 className="size-3.5" strokeWidth={1.5} />
                    Remover
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-black/10 bg-white px-6 py-6 md:px-7">
          <div className="mb-5 flex items-baseline justify-between gap-4">
            <div className="font-ui text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-muted">
              Subtotal
            </div>
            <div className="font-display text-2xl font-medium text-navy">{formatCurrency(subtotal)}</div>
          </div>
          {items.length > 0 ? (
            <Link
              href="/checkout"
              onClick={() => setOpen(false)}
              className="button-label inline-flex min-h-11 w-full items-center justify-center rounded-md border border-gold bg-gold px-6 py-3 text-black shadow-foil transition duration-[240ms] ease-magn hover:border-gold-deep hover:bg-gold-deep active:scale-[0.98]"
            >
              Finalizar compra
            </Link>
          ) : (
            <Button type="button" variant="primary" className="w-full" onClick={() => setOpen(false)}>
              Continuar navegando
            </Button>
          )}
          <div className="mt-3 flex items-center justify-center gap-2 font-body text-xs text-muted">
            <ShoppingBag className="size-3.5" strokeWidth={1.5} />
            Pix · Cartão em até 3× · Boleto
          </div>
        </div>
      </aside>
    </>
  );
}
