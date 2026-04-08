const DEFAULT_SITE_URL = "https://chillandserveghana.com";

export function getSiteUrl(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const rawUrl = configuredUrl && configuredUrl.length > 0 ? configuredUrl : DEFAULT_SITE_URL;

  return rawUrl.replace(/\/+$/, "");
}
