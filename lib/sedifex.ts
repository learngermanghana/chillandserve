import { FALLBACK_HERO_IMAGE } from "./constants";
import { fallbackGallery, fallbackProducts, fallbackPromo } from "./fallback-data";
import { HomePageData, SedifexGalleryItem, SedifexProduct, SedifexPromo } from "./types";

const REVALIDATE_SECONDS = 60;

function getEnv() {
  return {
    baseUrl: process.env.SEDIFEX_API_BASE_URL,
    storeId: process.env.SEDIFEX_STORE_ID,
    integrationKey: process.env.SEDIFEX_INTEGRATION_KEY
  };
}

function cleanBaseUrl(baseUrl: string): string {
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
}

function normalizeArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (value && typeof value === "object") {
    const maybeArray = (value as { data?: unknown; items?: unknown; products?: unknown; gallery?: unknown }).data ??
      (value as { data?: unknown; items?: unknown; products?: unknown; gallery?: unknown }).items ??
      (value as { data?: unknown; items?: unknown; products?: unknown; gallery?: unknown }).products ??
      (value as { data?: unknown; items?: unknown; products?: unknown; gallery?: unknown }).gallery;
    if (Array.isArray(maybeArray)) return maybeArray as T[];
  }
  return [];
}

async function fetchSedifexEndpoint(path: string): Promise<unknown> {
  const { baseUrl, integrationKey } = getEnv();

  if (!baseUrl || !integrationKey) {
    throw new Error("Missing Sedifex environment configuration.");
  }

  const response = await fetch(`${cleanBaseUrl(baseUrl)}${path}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${integrationKey}`,
      Accept: "application/json"
    },
    next: { revalidate: REVALIDATE_SECONDS }
  });

  if (!response.ok) {
    throw new Error(`Sedifex fetch failed: ${response.status}`);
  }

  return (await response.json()) as unknown;
}

function normalizePromo(value: unknown): SedifexPromo | null {
  if (!value || typeof value !== "object") return null;

  const queue: unknown[] = [value];
  const visited = new Set<unknown>();

  while (queue.length) {
    const current = queue.shift();
    if (!current || visited.has(current)) continue;
    visited.add(current);

    if (Array.isArray(current)) {
      queue.push(...current);
      continue;
    }

    if (typeof current !== "object") continue;

    const record = current as Record<string, unknown>;
    const promoTitle = typeof record.promoTitle === "string" ? record.promoTitle : typeof record.promo_title === "string" ? record.promo_title : undefined;
    const promoSummary =
      typeof record.promoSummary === "string" ? record.promoSummary : typeof record.promo_summary === "string" ? record.promo_summary : undefined;
    const promoStartDate =
      typeof record.promoStartDate === "string"
        ? record.promoStartDate
        : typeof record.promo_start_date === "string"
          ? record.promo_start_date
          : undefined;
    const promoEndDate =
      typeof record.promoEndDate === "string"
        ? record.promoEndDate
        : typeof record.promo_end_date === "string"
          ? record.promo_end_date
          : undefined;
    const promoSlug = typeof record.promoSlug === "string" ? record.promoSlug : typeof record.promo_slug === "string" ? record.promo_slug : undefined;
    const promoWebsiteUrl =
      typeof record.promoWebsiteUrl === "string"
        ? record.promoWebsiteUrl
        : typeof record.promo_website_url === "string"
          ? record.promo_website_url
          : undefined;
    const promoYoutubeChannelId =
      typeof record.promoYoutubeChannelId === "string"
        ? record.promoYoutubeChannelId
        : typeof record.promo_youtube_channel_id === "string"
          ? record.promo_youtube_channel_id
          : undefined;
    const displayName =
      typeof record.displayName === "string" ? record.displayName : typeof record.display_name === "string" ? record.display_name : undefined;
    const name = typeof record.name === "string" ? record.name : undefined;
    const hasPromoFields = Boolean(
      promoTitle || promoSummary || promoStartDate || promoEndDate || promoSlug || promoWebsiteUrl || promoYoutubeChannelId
    );

    if (hasPromoFields) {
      return {
        promoTitle,
        promoSummary,
        promoStartDate,
        promoEndDate,
        promoSlug,
        promoWebsiteUrl,
        promoYoutubeChannelId,
        displayName,
        name
      };
    }

    for (const nestedValue of Object.values(record)) {
      if (nestedValue && typeof nestedValue === "object") {
        queue.push(nestedValue);
      }
    }
  }

  return null;
}

function dedupeProducts(products: SedifexProduct[]): SedifexProduct[] {
  const seen = new Set<string>();

  return products.filter((product) => {
    const key = `${product.id ?? ""}|${product.storeId ?? ""}|${product.name ?? ""}|${product.price ?? ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function normalizeGallery(gallery: SedifexGalleryItem[]): SedifexGalleryItem[] {
  return gallery
    .filter((item) => item.url)
    .filter((item) => (typeof item.isPublished === "boolean" ? item.isPublished : true))
    .sort((a, b) => (a.sortOrder ?? Number.MAX_SAFE_INTEGER) - (b.sortOrder ?? Number.MAX_SAFE_INTEGER));
}

export async function getHomePageData(): Promise<HomePageData> {
  const { storeId } = getEnv();

  if (!storeId) {
    return {
      products: fallbackProducts,
      promo: fallbackPromo,
      gallery: fallbackGallery,
      usingFallback: true
    };
  }

  const encodedStoreId = encodeURIComponent(storeId);

  try {
    const [productsResponse, promoResponse, galleryResponse] = await Promise.all([
      fetchSedifexEndpoint(`/integrationProducts?storeId=${encodedStoreId}`),
      fetchSedifexEndpoint(`/integrationPromo?storeId=${encodedStoreId}`),
      fetchSedifexEndpoint(`/integrationGallery?storeId=${encodedStoreId}`)
    ]);

    const products = dedupeProducts(normalizeArray<SedifexProduct>(productsResponse));
    const promo = normalizePromo(promoResponse);
    const gallery = normalizeGallery(normalizeArray<SedifexGalleryItem>(galleryResponse));

    return {
      products: products.length ? products : fallbackProducts,
      promo: promo ?? fallbackPromo,
      gallery: gallery.length ? gallery : fallbackGallery,
      usingFallback: !(products.length && promo && gallery.length)
    };
  } catch {
    return {
      products: fallbackProducts,
      promo: fallbackPromo,
      gallery: fallbackGallery,
      usingFallback: true
    };
  }
}

export function getHeroImage(
  gallery: SedifexGalleryItem[],
  products: SedifexProduct[]
): { src: string; alt: string } {
  const galleryFirst = gallery.find((item) => item.url);
  if (galleryFirst?.url) {
    return {
      src: galleryFirst.url,
      alt: galleryFirst.alt ?? "Elegant party service setup by Chill and Serve Ghana"
    };
  }

  const productFirst = products.find((item) => item.imageUrl);
  if (productFirst?.imageUrl) {
    return {
      src: productFirst.imageUrl,
      alt: productFirst.imageAlt ?? "Premium drinks service by Chill and Serve Ghana"
    };
  }

  return {
    src: FALLBACK_HERO_IMAGE,
    alt: "Premium event drinks and hospitality service in Ghana"
  };
}

export function groupProductsByCategory(products: SedifexProduct[]): Record<string, SedifexProduct[]> {
  return products.reduce<Record<string, SedifexProduct[]>>((acc, product) => {
    const category = product.category?.trim() || "Featured Services";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {});
}
