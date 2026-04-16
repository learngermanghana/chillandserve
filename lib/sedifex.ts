import { FALLBACK_HERO_IMAGE } from "./constants";
import { fallbackGallery, fallbackProducts, fallbackPromo } from "./fallback-data";
import { HomePageData, SedifexGalleryItem, SedifexProduct, SedifexPromo } from "./types";

const PRODUCTS_REVALIDATE_SECONDS = 30;
const PROMO_REVALIDATE_SECONDS = 60;
const GALLERY_REVALIDATE_SECONDS = 60;
const DEFAULT_CONTRACT_VERSION = "2026-04-13";

function getEnv() {
  return {
    baseUrl: process.env.SEDIFEX_API_BASE_URL,
    storeId: process.env.SEDIFEX_STORE_ID,
    integrationKey: process.env.SEDIFEX_INTEGRATION_API_KEY ?? process.env.SEDIFEX_INTEGRATION_KEY,
    contractVersion: process.env.SEDIFEX_CONTRACT_VERSION ?? DEFAULT_CONTRACT_VERSION
  };
}

function cleanBaseUrl(baseUrl: string): string {
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
}

function normalizeAssetUrl(value: string | undefined): string | undefined {
  if (!value) return undefined;

  const trimmedValue = value.trim();
  if (!trimmedValue) return undefined;

  if (/^https?:\/\//i.test(trimmedValue)) return trimmedValue;
  if (trimmedValue.startsWith("//")) return `https:${trimmedValue}`;

  const { baseUrl } = getEnv();
  if (!baseUrl) return trimmedValue;

  try {
    return new URL(trimmedValue, `${cleanBaseUrl(baseUrl)}/`).toString();
  } catch {
    return trimmedValue;
  }
}

function normalizeArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (value && typeof value === "object") {
    const maybeArray =
      (
        value as {
          data?: unknown;
          items?: unknown;
          products?: unknown;
          gallery?: unknown;
          services?: unknown;
          records?: unknown;
          rows?: unknown;
          result?: unknown;
          topSelling?: unknown;
        }
      ).data ??
      (
        value as {
          data?: unknown;
          items?: unknown;
          products?: unknown;
          gallery?: unknown;
          services?: unknown;
          records?: unknown;
          rows?: unknown;
          result?: unknown;
          topSelling?: unknown;
        }
      ).items ??
      (
        value as {
          data?: unknown;
          items?: unknown;
          products?: unknown;
          gallery?: unknown;
          services?: unknown;
          records?: unknown;
          rows?: unknown;
          result?: unknown;
          topSelling?: unknown;
        }
      ).products ??
      (
        value as {
          data?: unknown;
          items?: unknown;
          products?: unknown;
          gallery?: unknown;
          services?: unknown;
          records?: unknown;
          rows?: unknown;
          result?: unknown;
          topSelling?: unknown;
        }
      ).services ??
      (
        value as {
          data?: unknown;
          items?: unknown;
          products?: unknown;
          gallery?: unknown;
          services?: unknown;
          records?: unknown;
          rows?: unknown;
          result?: unknown;
          topSelling?: unknown;
        }
      ).gallery ??
      (
        value as {
          data?: unknown;
          items?: unknown;
          products?: unknown;
          gallery?: unknown;
          services?: unknown;
          records?: unknown;
          rows?: unknown;
          result?: unknown;
          topSelling?: unknown;
        }
      ).records ??
      (
        value as {
          data?: unknown;
          items?: unknown;
          products?: unknown;
          gallery?: unknown;
          services?: unknown;
          records?: unknown;
          rows?: unknown;
          result?: unknown;
          topSelling?: unknown;
        }
      ).rows ??
      (
        value as {
          data?: unknown;
          items?: unknown;
          products?: unknown;
          gallery?: unknown;
          services?: unknown;
          records?: unknown;
          rows?: unknown;
          result?: unknown;
          topSelling?: unknown;
        }
      ).topSelling ??
      (
        value as {
          data?: unknown;
          items?: unknown;
          products?: unknown;
          gallery?: unknown;
          services?: unknown;
          records?: unknown;
          rows?: unknown;
          result?: unknown;
          topSelling?: unknown;
        }
      ).result;
    if (Array.isArray(maybeArray)) return maybeArray as T[];
  }
  return [];
}

function getFetchConfig(path: string): { revalidate: number } {
  if (path.startsWith("/v1IntegrationProducts")) {
    return { revalidate: PRODUCTS_REVALIDATE_SECONDS };
  }

  if (path.startsWith("/v1IntegrationPromo") || path.startsWith("/integrationGallery")) {
    return { revalidate: PROMO_REVALIDATE_SECONDS };
  }

  return { revalidate: GALLERY_REVALIDATE_SECONDS };
}

async function fetchSedifexEndpoint(path: string): Promise<unknown> {
  const { baseUrl, integrationKey, contractVersion } = getEnv();

  if (!baseUrl || !integrationKey) {
    throw new Error("Missing Sedifex environment configuration.");
  }

  const response = await fetch(`${cleanBaseUrl(baseUrl)}${path}`, {
    method: "GET",
    headers: {
      "x-api-key": integrationKey,
      "X-Sedifex-Contract-Version": contractVersion,
      Accept: "application/json"
    },
    next: getFetchConfig(path)
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
    const pickString = (...keys: string[]): string | undefined => {
      for (const key of keys) {
        if (typeof record[key] === "string") return record[key] as string;
      }
      return undefined;
    };

    const promoTitle = pickString("promoTitle", "promo_title", "title", "name");
    const promoSummary = pickString("promoSummary", "promo_summary", "summary", "description");
    const promoStartDate = pickString("promoStartDate", "promo_start_date", "startDate", "start_date");
    const promoEndDate = pickString("promoEndDate", "promo_end_date", "endDate", "end_date");
    const promoImageUrl = pickString("promoImageUrl", "promo_image_url", "imageUrl", "image_url", "image");
    const nestedImage = record.image;
    const nestedPromoImage = record.promoImage;
    const nestedImageUrl =
      typeof nestedImage === "object" && nestedImage && "url" in nestedImage && typeof nestedImage.url === "string"
        ? nestedImage.url
        : typeof nestedPromoImage === "object" && nestedPromoImage && "url" in nestedPromoImage && typeof nestedPromoImage.url === "string"
          ? nestedPromoImage.url
          : undefined;
    const promoImageAlt = pickString("promoImageAlt", "promo_image_alt", "imageAlt", "image_alt");
    const promoSlug = pickString("promoSlug", "promo_slug", "slug");
    const promoWebsiteUrl = pickString("promoWebsiteUrl", "promo_website_url", "websiteUrl", "website_url", "url");
    const promoYoutubeChannelId = pickString(
      "promoYoutubeChannelId",
      "promo_youtube_channel_id",
      "youtubeChannelId",
      "youtube_channel_id"
    );
    const displayName =
      typeof record.displayName === "string" ? record.displayName : typeof record.display_name === "string" ? record.display_name : undefined;
    const name = typeof record.name === "string" ? record.name : undefined;
    const hasPromoFields = Boolean(
      promoTitle || promoSummary || promoStartDate || promoEndDate || promoImageUrl || nestedImageUrl || promoSlug || promoWebsiteUrl
    );

    if (hasPromoFields) {
      return {
        promoTitle,
        promoSummary,
        promoStartDate,
        promoEndDate,
        promoImageUrl: normalizeAssetUrl(promoImageUrl ?? nestedImageUrl),
        promoImageAlt,
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

function pickImageUrl(value: Record<string, unknown>): string | undefined {
  const fromString = ["imageUrl", "image_url", "image", "url", "photo", "photoUrl", "photo_url"].find(
    (key) => typeof value[key] === "string"
  );
  if (fromString) return value[fromString] as string;

  const nested = value.image;
  if (nested && typeof nested === "object" && "url" in nested && typeof nested.url === "string") {
    return nested.url;
  }
  return undefined;
}

function normalizeProducts(products: SedifexProduct[]): SedifexProduct[] {
  return products.map((product) => {
    const source = product as unknown as Record<string, unknown>;
    const normalizedImageUrl = normalizeAssetUrl(product.imageUrl ?? pickImageUrl(source));
    const normalizedImageUrls =
      Array.isArray(product.imageUrls) && product.imageUrls.length
        ? product.imageUrls
        : Array.isArray(source.imageUrls)
          ? (source.imageUrls as string[])
          : Array.isArray(source.image_urls)
            ? (source.image_urls as string[])
            : normalizedImageUrl
              ? [normalizedImageUrl]
              : [];
    const mappedImageUrls = normalizedImageUrls
      .map((imageUrl) => normalizeAssetUrl(imageUrl))
      .filter((imageUrl): imageUrl is string => Boolean(imageUrl));
    const normalizedImageAlt =
      product.imageAlt ??
      (typeof source.imageAlt === "string"
        ? source.imageAlt
        : typeof source.image_alt === "string"
          ? source.image_alt
          : typeof source.alt === "string"
            ? source.alt
            : undefined);

    return {
      ...product,
      itemType: product.itemType ?? (typeof source.item_type === "string" ? source.item_type : undefined),
      imageUrl: normalizedImageUrl,
      imageUrls: mappedImageUrls,
      imageAlt: normalizedImageAlt
    };
  });
}

function dedupeProducts(products: SedifexProduct[]): SedifexProduct[] {
  const seen = new Set<string>();

  return products.filter((product) => {
    const key = `${product.id ?? ""}|${product.updatedAt ?? ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function normalizeGallery(gallery: SedifexGalleryItem[]): SedifexGalleryItem[] {
  return gallery
    .map((item) => {
      const source = item as unknown as Record<string, unknown>;
      return {
        ...item,
        url: normalizeAssetUrl(item.url ?? pickImageUrl(source)),
        alt:
          item.alt ??
          (typeof source.imageAlt === "string"
            ? source.imageAlt
            : typeof source.image_alt === "string"
              ? source.image_alt
              : typeof source.altText === "string"
                ? source.altText
                : typeof source.alt_text === "string"
                  ? source.alt_text
                  : undefined)
      };
    })
    .filter((item) => item.url)
    .filter((item) =>
      typeof item.isPublished === "boolean"
        ? item.isPublished
        : typeof (item as unknown as Record<string, unknown>).published === "boolean"
          ? Boolean((item as unknown as Record<string, unknown>).published)
          : true
    )
    .sort((a, b) => (a.sortOrder ?? Number.MAX_SAFE_INTEGER) - (b.sortOrder ?? Number.MAX_SAFE_INTEGER));
}

function filterServiceProducts(products: SedifexProduct[]): SedifexProduct[] {
  const serviceProducts = products.filter((product) => {
    const itemType = product.itemType?.toLowerCase();
    return !itemType || itemType === "service";
  });

  return serviceProducts.length ? serviceProducts : products;
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
      fetchSedifexEndpoint(`/v1IntegrationProducts?storeId=${encodedStoreId}`),
      fetchSedifexEndpoint(`/v1IntegrationPromo?storeId=${encodedStoreId}`),
      fetchSedifexEndpoint(`/integrationGallery?storeId=${encodedStoreId}`)
    ]);

    const products = filterServiceProducts(dedupeProducts(normalizeProducts(normalizeArray<SedifexProduct>(productsResponse))));
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
  products: SedifexProduct[],
  promo?: SedifexPromo | null
): { src: string; alt: string } {
  if (promo?.promoImageUrl) {
    return {
      src: promo.promoImageUrl,
      alt: promo.promoImageAlt ?? "Featured event offer image from Chill and Serve Ghana"
    };
  }

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
