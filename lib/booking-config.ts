import { User, Users, Calendar, MapPin } from "lucide-react";

export type BookingCategory = "individuell" | "gruppe" | "abonnement" | "bane";

export interface CategoryConfig {
  slug: BookingCategory;
  name: string;
  description: string;
  priceRange: string;
  icon: typeof User;
  serviceCategories: string[]; // Maps to Prisma ServiceCategory enum
}

export const CATEGORIES: CategoryConfig[] = [
  {
    slug: "abonnement",
    name: "Abonnement",
    description: "Faste økter hver måned",
    priceRange: "Fra 1 600 kr/mnd",
    icon: Calendar,
    serviceCategories: ["SUBSCRIPTION"],
  },
  {
    slug: "individuell",
    name: "Individuell",
    description: "En-til-en coaching",
    priceRange: "995 - 2 500 kr",
    icon: User,
    serviceCategories: ["INDIVIDUAL"],
  },
  {
    slug: "gruppe",
    name: "Gruppe",
    description: "Tren sammen med andre",
    priceRange: "250 - 1 700 kr",
    icon: Users,
    serviceCategories: ["GROUP"],
  },
  {
    slug: "bane",
    name: "Banecoaching",
    description: "Coaching på banen",
    priceRange: "500 - 3 000 kr",
    icon: MapPin,
    serviceCategories: ["PLAYING_LESSON"],
  },
];

// Service name patterns to identify recommended
export const RECOMMENDED_PATTERNS: Record<BookingCategory, string> = {
  individuell: "Foundation Test",
  gruppe: "Flex 50 Duo",
  abonnement: "Performance",
  bane: "On-Course Par 3",
};

export function isRecommended(serviceName: string, category: BookingCategory): boolean {
  const pattern = RECOMMENDED_PATTERNS[category];
  return serviceName.toLowerCase().includes(pattern.toLowerCase());
}

export function getCategoryBySlug(slug: string): CategoryConfig | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
