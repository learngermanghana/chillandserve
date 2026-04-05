import type { Metadata } from "next";
import "./globals.css";
import { BRAND_NAME, SEO_KEYWORDS } from "@/lib/constants";
import Footer from "@/components/footer";
import SiteHeader from "@/components/site-header";

const siteUrl = "https://www.chillandserveghana.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${BRAND_NAME} | Premium Drinks, Cocktail & Event Service in Accra, Ghana`,
  description:
    "Chill and Serve Ghana is an Accra-based event drinks company serving Ghana with premium cocktail bartending, chilling service, and professional waiters for weddings, birthdays, receptions, and corporate events.",
  keywords: SEO_KEYWORDS,
  alternates: {
    canonical: "/"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1
    }
  },
  openGraph: {
    title: `${BRAND_NAME} | Accra, Ghana Event Drinks & Cocktail Service`,
    description:
      "Accra-based drinks and event service for weddings, receptions, birthdays, and corporate events across Ghana.",
    url: siteUrl,
    siteName: BRAND_NAME,
    locale: "en_GH",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND_NAME} | Event Drinks & Cocktail Service in Accra, Ghana`,
    description:
      "Book an Accra-based drinks and cocktail team for weddings, parties, and corporate events across Ghana."
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-ivoryBrand text-charcoalBrand antialiased">
        <SiteHeader />
        {children}
        <Footer />
      </body>
    </html>
  );
}
