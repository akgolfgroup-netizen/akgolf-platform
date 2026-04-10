export type BookingCategory = "individuell" | "gruppe" | "abonnement" | "bane";

export type IconName = "user" | "users" | "calendar" | "map-pin";

export interface CategoryConfig {
  slug: BookingCategory;
  name: string;
  description: string;
  priceRange: string;
  iconName: IconName;
  serviceCategories: string[]; // Maps to Prisma ServiceCategory enum
}

export const CATEGORIES: CategoryConfig[] = [
  {
    slug: "abonnement",
    name: "Abonnement",
    description: "Faste økter hver måned",
    priceRange: "Fra 1 600 kr/mnd",
    iconName: "calendar",
    serviceCategories: ["SUBSCRIPTION"],
  },
  {
    slug: "individuell",
    name: "Individuell",
    description: "En-til-en coaching",
    priceRange: "995 - 2 500 kr",
    iconName: "user",
    serviceCategories: ["INDIVIDUAL"],
  },
  {
    slug: "gruppe",
    name: "Gruppe",
    description: "Tren sammen med andre",
    priceRange: "250 - 1 700 kr",
    iconName: "users",
    serviceCategories: ["GROUP"],
  },
  {
    slug: "bane",
    name: "Banecoaching",
    description: "Coaching på banen",
    priceRange: "500 - 3 000 kr",
    iconName: "map-pin",
    serviceCategories: ["PLAYING_LESSON"],
  },
];

// Service name patterns to identify recommended
export const RECOMMENDED_PATTERNS: Record<BookingCategory, string> = {
  individuell: "Foundation Test",
  gruppe: "Flex 50 Duo",
  abonnement: "Performance",
  bane: "Banecoaching 9 hull",
};

export function isRecommended(serviceName: string, category: BookingCategory): boolean {
  const pattern = RECOMMENDED_PATTERNS[category];
  return serviceName.toLowerCase().includes(pattern.toLowerCase());
}

export function getCategoryBySlug(slug: string): CategoryConfig | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
