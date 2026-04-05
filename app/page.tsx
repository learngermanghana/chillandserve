import ContactCta from "@/components/contact-cta";
import Footer from "@/components/footer";
import GalleryGrid from "@/components/gallery-grid";
import GroupedServices from "@/components/grouped-services";
import Hero from "@/components/hero";
import PromoBanner from "@/components/promo-banner";
import ServicesGrid from "@/components/services-grid";
import { getHeroImage, getHomePageData, groupProductsByCategory } from "@/lib/sedifex";

export default async function HomePage() {
  const { products, promo, gallery } = await getHomePageData();
  const groupedProducts = groupProductsByCategory(products);
  const heroImage = getHeroImage(gallery, products);

  return (
    <main>
      <Hero promo={promo} heroImage={heroImage} />
      <ServicesGrid products={products} />
      <GroupedServices groups={groupedProducts} />
      <PromoBanner promo={promo} />
      <GalleryGrid items={gallery} />
      <ContactCta />
      <Footer />
    </main>
  );
}
