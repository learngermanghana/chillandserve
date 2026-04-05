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

  const response = await fetch(`${baseUrl}${path}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${integrationKey}`
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

  if (Array.isArray(value)) {
    return (value[0] as SedifexPromo | undefined) ?? null;
  }

  const source = value as {
    promo?: unknown;
    data?: unknown;
    item?: unknown;
    profile?: unknown;
  };
  const candidate = source.promo ?? source.data ?? source.item ?? source.profile ?? value;

  if (candidate && typeof candidate === "object" && !Array.isArray(candidate)) {
    return candidate as SedifexPromo;
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

  try {
    const [productsResponse, promoResponse, galleryResponse] = await Promise.all([
      fetchSedifexEndpoint(`/integrationProducts?storeId=${storeId}`),
      fetchSedifexEndpoint(`/integrationPromo?storeId=${storeId}`),
      fetchSedifexEndpoint(`/integrationGallery?storeId=${storeId}`)
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
