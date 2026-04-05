import type { Metadata } from "next";
import "./globals.css";
import { BRAND_NAME, SEO_KEYWORDS } from "@/lib/constants";


export const metadata: Metadata = {
  title: `${BRAND_NAME} | Premium Party & Event Service in Ghana`,
  description:
    "Chill and Serve Ghana provides premium drinks service, chilling service, cocktail service, and professional waiters for weddings, birthdays, receptions, and private events in Ghana.",
  keywords: SEO_KEYWORDS,
  openGraph: {
    title: `${BRAND_NAME} | Premium Party & Event Service in Ghana`,
    description:
      "Elegant drinks and event support for weddings, receptions, birthdays, and private parties in Ghana.",
    siteName: BRAND_NAME,
    locale: "en_GH",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND_NAME} | Premium Party & Event Service in Ghana`,
    description:
      "Book premium drinks service, chilling support, cocktail service, and professional waiters for your next event in Ghana."
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-ivoryBrand text-charcoalBrand antialiased">{children}</body>
    </html>
  );
}
