import Image from "next/image";
import Link from "next/link";
import SectionHeading from "./section-heading";
import { WHATSAPP_LINK } from "@/lib/constants";
import { SedifexProduct } from "@/lib/types";

interface ServicesGridProps {
  products: SedifexProduct[];
}

export default function ServicesGrid({ products }: ServicesGridProps) {
  return (
    <section id="services" className="bg-ivoryBrand py-16 md:py-24">
      <div className="container mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeading
          eyebrow="Our Services"
          title="Premium Party & Event Service Packages"
          description="Beautifully presented services tailored for weddings, birthdays, receptions, and private events across Ghana."
        />

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, idx) => (
            <article
              key={`${product.id ?? product.name ?? idx}`}
              className="overflow-hidden rounded-3xl border border-charcoalBrand/5 bg-white shadow-premium"
            >
              <div className="relative h-52">
                <Image
                  src={product.imageUrl || "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=900&q=80"}
                  alt={product.imageAlt || `${product.name || "Service"} image`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="space-y-3 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emeraldBrand/90">
                  {product.category || "Event Service"}
                </p>
                <h3 className="text-xl font-semibold text-charcoalBrand">{product.name || "Custom Event Package"}</h3>
                <p className="text-sm leading-relaxed text-charcoalBrand/75">
                  {product.description || "Tailored support designed for premium guest experience."}
                </p>
                <div className="flex items-center justify-between gap-3 border-t border-charcoalBrand/10 pt-4">
                  <Link
                    href={WHATSAPP_LINK}
                    className="rounded-full border border-goldBrand/60 px-4 py-2 text-sm font-medium text-charcoalBrand transition hover:bg-goldBrand/20"
                  >
                    Request Quote
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
