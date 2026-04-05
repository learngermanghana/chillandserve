import Image from "next/image";
import Link from "next/link";
import { BRAND_NAME, PHONE_DISPLAY, PHONE_LINK, WHATSAPP_LINK } from "@/lib/constants";
import { formatDateRange } from "@/lib/format";
import { SedifexPromo } from "@/lib/types";

interface HeroProps {
  promo: SedifexPromo | null;
  heroImage: { src: string; alt: string };
}

export default function Hero({ promo, heroImage }: HeroProps) {
  const promoDate = formatDateRange(promo?.promoStartDate, promo?.promoEndDate);
  const headline = promo?.promoTitle || "Premium Drinks & Event Service for Ghana's Best Celebrations";
  const summary =
    promo?.promoSummary ||
    "From weddings to private parties, Chill and Serve Ghana delivers stylish drinks service, chilling support, and refined guest experience.";

  return (
    <section id="home" className="relative overflow-hidden bg-ivoryBrand">
      <div className="absolute inset-0 bg-gradient-to-br from-emeraldBrand/5 via-transparent to-goldBrand/5" />
      <div className="container mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-2 md:px-8 md:py-24">
        <div className="relative z-10 flex flex-col justify-center">
          <p className="mb-4 inline-flex w-fit rounded-full bg-emeraldBrand/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emeraldBrand">
            {promo?.displayName || promo?.name || BRAND_NAME}
          </p>
          <h1 className="text-4xl font-bold leading-tight text-charcoalBrand md:text-5xl">{headline}</h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-charcoalBrand/80 md:text-lg">{summary}</p>

          {promoDate ? (
            <p className="mt-5 inline-flex w-fit rounded-full border border-goldBrand/60 bg-goldBrand/15 px-3 py-1 text-sm text-charcoalBrand">
              Limited Promo: {promoDate}
            </p>
          ) : null}

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href={WHATSAPP_LINK}
              className="rounded-full bg-emeraldBrand px-6 py-3 text-sm font-semibold text-white shadow-premium transition hover:bg-emeraldBrand/90"
            >
              Book on WhatsApp
            </Link>
            <Link
              href={PHONE_LINK}
              className="rounded-full border border-emeraldBrand/30 bg-white px-6 py-3 text-sm font-semibold text-emeraldBrand transition hover:border-emeraldBrand hover:bg-emeraldBrand/5"
            >
              Call {PHONE_DISPLAY}
            </Link>
          </div>
        </div>

        <div className="relative h-[320px] overflow-hidden rounded-3xl shadow-premium md:h-[520px]">
          <Image
            src={heroImage.src}
            alt={heroImage.alt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoalBrand/50 via-transparent to-transparent" />
        </div>
      </div>
    </section>
  );
}
