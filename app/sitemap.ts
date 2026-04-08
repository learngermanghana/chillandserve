import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

const routes = ["", "/services", "/gallery", "/contact", "/request-quote"];

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const lastModified = new Date();

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8
  }));
}
