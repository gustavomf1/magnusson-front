import {
  Feather,
  Infinity,
  MapPin,
  Sparkles,
  Square,
  type LucideIcon
} from "lucide-react";

export type ProductColor = {
  name: string;
  token: "navy" | "black" | "white" | "forest" | "sand";
  hex: string;
};

export type ProductSize = {
  label: "P" | "M" | "G" | "GG";
  chest: number;
  length: number;
  shoulder: number;
};

export type Benefit = {
  icon: LucideIcon;
  title: string;
  body: string;
};

export const product = {
  id: "polo-classic",
  slug: "classic",
  name: "Polo MAGNOSSÃO Classic",
  shortName: "Polo Classic",
  collection: "Coleção Classic",
  price: 249.9,
  installment: "3× de R$ 83,30 sem juros",
  pix: "Pix · 5% de desconto",
  description:
    "A Polo MAGNOSSÃO Classic combina elegância nórdica, acabamento premium e identidade brasileira. Produzida em tecido confortável, com bordado discreto da onça na gola e assinatura MAGNOSSÃO no peito.",
  seoDescription:
    "Polo premium brasileira em algodão pima, com bordado dourado da onça e assinatura MAGNOSSÃO. Raiz nórdica. Alma brasileira.",
  images: [
    {
      src: "/assets/polo-classic.png",
      alt: "Polo MAGNOSSÃO Classic azul marinho em fundo escuro"
    },
    {
      src: "/assets/polo-classic-front.png",
      alt: "Cinco cores da Polo MAGNOSSÃO Classic vistas de frente"
    },
    {
      src: "/assets/polo-classic-back.png",
      alt: "Cinco cores da Polo MAGNOSSÃO Classic vistas de costas"
    },
    {
      src: "/assets/polo-classic-flat.png",
      alt: "Polo MAGNOSSÃO Classic azul marinho centralizada"
    },
    {
      src: "/assets/polo-gold-detail.png",
      alt: "Detalhe da gola e do bordado dourado da Polo MAGNOSSÃO"
    }
  ],
  seals: ["Algodão Pima", "Feito no Brasil", "Edição Premium"],
  composition: ["100% algodão pima", "Fios de fibra longa", "Pré-encolhido"],
  care: ["Lavar a até 30°C", "Não usar secadora", "Passar a vapor"],
  policy: ["Troca em 30 dias", "Devolução grátis", "Garantia de 1 ano"]
};

export const colors: ProductColor[] = [
  { name: "Azul Marinho", token: "navy", hex: "#0B1F3A" },
  { name: "Preto", token: "black", hex: "#111111" },
  { name: "Branco", token: "white", hex: "#F5F5F5" },
  { name: "Verde Floresta", token: "forest", hex: "#1E3A2A" },
  { name: "Bege Areia", token: "sand", hex: "#D8C7AE" }
];

export const sizes: ProductSize[] = [
  { label: "P", chest: 50, length: 68, shoulder: 42 },
  { label: "M", chest: 53, length: 70, shoulder: 44 },
  { label: "G", chest: 56, length: 72, shoulder: 46 },
  { label: "GG", chest: 59, length: 74, shoulder: 48 }
];

export const benefits: Benefit[] = [
  {
    icon: Sparkles,
    title: "Algodão Premium",
    body: "Fios de algodão pima de fibra longa, toque sedoso e alta durabilidade."
  },
  {
    icon: Feather,
    title: "Bordado Refinado",
    body: "Onça e wordmark bordados em fio dourado fosco, sem brilho excessivo."
  },
  {
    icon: Square,
    title: "Modelagem Clássica",
    body: "Corte atemporal, ombro estruturado e comprimento equilibrado."
  },
  {
    icon: MapPin,
    title: "Feita no Brasil",
    body: "Confeccionada em São Paulo com fornecedores selecionados."
  },
  {
    icon: Infinity,
    title: "Design Atemporal",
    body: "Uma peça que atravessa tendências, pensada para durar décadas."
  }
];

export const sizeGuide = sizes;

export const details = [
  {
    label: "POLO TRADICIONAL",
    src: "/assets/polo-tradicional-113501.png",
    alt: "Polo MAGNOSSÃO tradicional azul marinho com detalhe da gola",
    width: 1268,
    height: 1241
  },
  {
    label: "POLO REI",
    src: "/assets/polo-realeza-detail.png",
    alt: "Polo MAGNOSSÃO Rei azul marinho com acabamento dourado",
    width: 1254,
    height: 1254
  },
  {
    label: "POLO TRADICIONAL",
    src: "/assets/polo-tradicional-verde.png",
    alt: "Polo MAGNOSSÃO tradicional verde floresta com detalhe da gola",
    width: 1268,
    height: 1240
  },
  {
    label: "POLO REI",
    src: "/assets/polo-rei-verde.png",
    alt: "Polo MAGNOSSÃO Rei verde floresta com acabamento dourado",
    width: 1254,
    height: 1254
  }
];

export const reviews = [
  {
    quote: "Camisa elegante, tecido muito bom e acabamento acima do esperado.",
    name: "Rafael C.",
    city: "São Paulo, SP"
  },
  {
    quote: "Discreta e poderosa. Combina com terno e com jeans. Atemporal de verdade.",
    name: "Lucas F.",
    city: "Curitiba, PR"
  },
  {
    quote: "O bordado da onça é o detalhe que muda tudo. Vai virar minha polo padrão.",
    name: "Henrique B.",
    city: "Belo Horizonte, MG"
  }
];

export const faqs = [
  {
    question: "Qual o tecido da polo?",
    answer:
      "Algodão pima de fibra longa, com fios sedosos e respiráveis. Toque premium, alta durabilidade."
  },
  {
    question: "Como funciona a troca?",
    answer:
      "Você tem 30 dias para trocar tamanho ou cor, sem custo, desde que a peça esteja sem uso, com etiquetas e embalagem."
  },
  {
    question: "Tem frete grátis?",
    answer:
      "Frete grátis acima de R$ 299,00 para todo o Brasil. A calculadora de frete está disponível na página do produto e no carrinho."
  },
  {
    question: "Como escolher o tamanho?",
    answer:
      "Use a tabela de medidas. Na dúvida entre dois tamanhos, escolha o menor. A peça tem modelagem clássica, não justa."
  },
  {
    question: "Quais formas de pagamento?",
    answer: "Pix, cartão de crédito em até 3× sem juros, boleto e carteiras digitais."
  },
  {
    question: "A peça encolhe?",
    answer:
      "A modelagem é pré-encolhida. Lavar a até 30°C, sem secadora, mantém o caimento original."
  }
];

export function getProductJsonLd(baseUrl = "https://magnossao.com.br") {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images.map((image) => `${baseUrl}${image.src}`),
    description: product.seoDescription,
    brand: {
      "@type": "Brand",
      name: "MAGNOSSÃO"
    },
    sku: "MAGN-CLASSIC-001",
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/classic`,
      priceCurrency: "BRL",
      price: product.price.toFixed(2),
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition"
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      reviewCount: reviews.length.toString()
    }
  };
}
