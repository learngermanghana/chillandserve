import type { NextConfig } from "next";

const sedifexBaseUrl = process.env.SEDIFEX_API_BASE_URL;
const sedifexHostname = (() => {
  if (!sedifexBaseUrl) return null;
  try {
    return new URL(sedifexBaseUrl).hostname;
  } catch {
    return null;
  }
})();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "i.ytimg.com" },
      ...(sedifexHostname
        ? ([
            { protocol: "https", hostname: sedifexHostname },
            { protocol: "http", hostname: sedifexHostname }
          ] as const)
        : [])
    ]
  }
};

export default nextConfig;
