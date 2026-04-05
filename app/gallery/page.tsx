import GalleryGrid from "@/components/gallery-grid";
import { getHomePageData } from "@/lib/sedifex";

export default async function GalleryPage() {
  const { gallery } = await getHomePageData();

  return (
    <main>
      <GalleryGrid items={gallery} />
    </main>
  );
}
