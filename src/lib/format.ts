export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value);
}

export function productPath(slug: string) {
  return slug === "classic" ? "/classic" : `/produto/${slug}`;
}
