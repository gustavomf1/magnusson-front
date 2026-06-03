import Image from "next/image";
import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "premium" | "outline" | "outlineDark" | "ghost";

const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    "border-transparent bg-navy text-offwhite hover:bg-navy-tint hover:shadow-[inset_0_0_0_1px_rgba(212,175,55,0.62)]",
  premium:
    "border-gold bg-gold text-black shadow-foil hover:border-gold-deep hover:bg-gold-deep",
  outline:
    "border-navy bg-transparent text-navy hover:bg-navy hover:text-offwhite",
  outlineDark:
    "border-gold bg-transparent text-gold hover:bg-gold hover:text-black",
  ghost: "border-transparent bg-transparent text-offwhite hover:text-gold"
};

export function Button({
  children,
  className,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
}) {
  return (
    <button
      className={cn(
        "button-label inline-flex min-h-11 items-center justify-center gap-2 rounded-md border px-6 py-3 transition duration-[240ms] ease-magn active:scale-[0.98]",
        buttonVariants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  children,
  href,
  className,
  variant = "primary"
}: {
  children: ReactNode;
  href: string;
  className?: string;
  variant?: ButtonVariant;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "button-label inline-flex min-h-11 items-center justify-center gap-2 rounded-md border px-6 py-3 transition duration-[240ms] ease-magn active:scale-[0.98]",
        buttonVariants[variant],
        className
      )}
    >
      {children}
    </Link>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("eyebrow", className)}>{children}</div>;
}

export function Flourish({
  className,
  color = "bg-gold",
  label
}: {
  className?: string;
  color?: string;
  label?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3 text-gold", className)}>
      <span className={cn("h-px flex-1 opacity-60", color)} />
      {label ? (
        <span className="flex items-center gap-3 font-display text-[0.68rem] uppercase tracking-[0.32em]">
          <span className={cn("size-1.5 rotate-45", color)} />
          {label}
          <span className={cn("size-1.5 rotate-45", color)} />
        </span>
      ) : (
        <span className={cn("size-2 rotate-45", color)} />
      )}
      <span className={cn("h-px flex-1 opacity-60", color)} />
    </div>
  );
}

export function OncaMark({ className, size = 48 }: { className?: string; size?: number }) {
  return (
    <Image
      src="/assets/onca-logo-gold.png"
      alt="Onça MAGNOSSÃO"
      width={size}
      height={size}
      className={cn("object-contain", className)}
    />
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-display text-[1.05rem] font-bold uppercase leading-none tracking-[0.18em] text-gold",
        className
      )}
    >
      MAGNOSSÃO
    </span>
  );
}

export function SectionHead({
  eyebrow,
  title,
  sub,
  align = "left",
  dark = false
}: {
  eyebrow?: string;
  title: ReactNode;
  sub?: ReactNode;
  align?: "left" | "center";
  dark?: boolean;
}) {
  return (
    <div
      className={cn(
        align === "center" && "text-center",
        dark ? "text-offwhite" : "text-black"
      )}
    >
      {eyebrow ? <Eyebrow className={cn("mb-3", dark && "text-gold")}>{eyebrow}</Eyebrow> : null}
      <h2 className="headline text-[clamp(1.75rem,4vw,2.5rem)]">{title}</h2>
      {sub ? (
        <p
          className={cn(
            "mt-4 font-editorial text-lg italic leading-relaxed md:text-xl",
            align === "center" && "mx-auto max-w-2xl",
            dark ? "text-[#C9CFD8]" : "text-graphite"
          )}
        >
          {sub}
        </p>
      ) : null}
    </div>
  );
}

export function Selo({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-3 py-1.5 font-ui text-[0.62rem] font-semibold uppercase tracking-[0.18em]",
        dark
          ? "border-gold/75 bg-navy/50 text-gold"
          : "border-gold/60 bg-transparent text-gold-deep"
      )}
    >
      {children}
    </span>
  );
}
