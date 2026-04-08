import Hero from "@/components/hero";
import PromoBanner from "@/components/promo-banner";
import ServicesGrid from "@/components/services-grid";
import GalleryGrid from "@/components/gallery-grid";
import LatestVideosColumn from "@/components/latest-videos-column";
import { getHeroImage, getHomePageData } from "@/lib/sedifex";
import { getLatestYouTubeVideos } from "@/lib/youtube";

export default async function HomePage() {
  const { products, promo, gallery } = await getHomePageData();
  const heroImage = getHeroImage(gallery, products);
  const latestVideos = await getLatestYouTubeVideos(promo?.promoYoutubeChannelId);

  return (
    <main>
      <Hero promo={promo} heroImage={heroImage} />
      <ServicesGrid products={products.slice(0, 6)} />
      <LatestVideosColumn videos={latestVideos} channelId={promo?.promoYoutubeChannelId} />
      <PromoBanner promo={promo} />
      <GalleryGrid items={gallery} />
    </main>
  );
}
