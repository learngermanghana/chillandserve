export interface SedifexProduct {
  id?: string;
  storeId?: string;
  name?: string;
  category?: string;
  description?: string;
  price?: number | string;
  stockCount?: number;
  itemType?: string;
  imageUrl?: string;
  imageAlt?: string;
  updatedAt?: string;
}

export interface SedifexPromo {
  promoTitle?: string;
  promoSummary?: string;
  promoStartDate?: string;
  promoEndDate?: string;
  promoSlug?: string;
  promoWebsiteUrl?: string;
  displayName?: string;
  name?: string;
}

export interface SedifexGalleryItem {
  url?: string;
  alt?: string;
  caption?: string;
  sortOrder?: number;
  isPublished?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface HomePageData {
  products: SedifexProduct[];
  promo: SedifexPromo | null;
  gallery: SedifexGalleryItem[];
  usingFallback: boolean;
}
