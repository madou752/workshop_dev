import type { ProductCategory } from "@/types/product";

export interface Collection {
  label: string;
  /** One line, for tiles and menus. */
  blurb: string;
  /** A short paragraph for the collection page. */
  intro: string;
  /** Mood image, from client/public. */
  image: string;
}

export const collections: Record<ProductCategory, Collection> = {
  desert: {
    label: "Air du Désert",
    blurb: "Sec, ancien, imperturbable.",
    intro:
      "Des dunes du Sahara au sel de l'Atacama, un air presque sans eau, chauffé par le jour et refroidi par la nuit. Le silence y a une texture.",
    image: "/aube_dy_sahara.jpg",
  },
  city: {
    label: "Air Urbain",
    blurb: "L'énergie des capitales, à l'aube.",
    intro:
      "Paris avant le réveil, Shibuya à minuit, la Cinquième Avenue en pleine course. Nous captons les villes à l'instant où elles ont le plus de caractère.",
    image: "/shibuya.jpg",
  },
  nature: {
    label: "Air Sauvage",
    blurb: "Forêts, cascades et sommets.",
    intro:
      "La canopée après l'averse, la brume des grandes chutes, les nuages qui traversent la forêt. Un air vivant, dense, que l'on ne trouve qu'au bout du monde.",
    image: "/iguazu (2).jpg",
  },
};

export const collectionSlugs = Object.keys(collections) as ProductCategory[];

export const categoryLabel = Object.fromEntries(
  collectionSlugs.map((c) => [c, collections[c].label]),
) as Record<ProductCategory, string>;
