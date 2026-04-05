import Hero from "@/components/hero";
import PromoBanner from "@/components/promo-banner";
import ServicesGrid from "@/components/services-grid";
import GalleryGrid from "@/components/gallery-grid";
import { getHeroImage, getHomePageData } from "@/lib/sedifex";

export default async function HomePage() {
  const { products, promo, gallery } = await getHomePageData();
  const heroImage = getHeroImage(gallery, products);

  return (
    <main>
      <Hero promo={promo} heroImage={heroImage} />
      <ServicesGrid products={products.slice(0, 6)} />
      <PromoBanner promo={promo} />
      <GalleryGrid items={gallery} />
    </main>
  );
}
