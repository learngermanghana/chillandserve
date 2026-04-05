import Image from "next/image";
import SectionHeading from "./section-heading";
import { SedifexGalleryItem } from "@/lib/types";

interface GalleryGridProps {
  items: SedifexGalleryItem[];
}

export default function GalleryGrid({ items }: GalleryGridProps) {
  return (
    <section id="gallery" className="bg-ivoryBrand py-16 md:py-24">
      <div className="container mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeading
          eyebrow="Gallery"
          title="Moments from Stylish Events We Have Served"
          description="A glimpse of elegant setups, refined service, and memorable guest experiences."
          align="center"
        />

        <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {items.map((item, idx) => (
            <figure key={`${item.url ?? idx}-${idx}`} className="group mb-4 overflow-hidden rounded-2xl bg-white shadow-premium">
              <div className="relative min-h-60 w-full">
                <Image
                  src={item.url || "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1000&q=80"}
                  alt={item.alt || "Elegant drinks service setup for an event in Ghana"}
                  width={900}
                  height={700}
                  className="h-auto w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                />
              </div>
              {item.caption ? <figcaption className="px-4 py-3 text-sm text-charcoalBrand/80">{item.caption}</figcaption> : null}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
