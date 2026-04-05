import Link from "next/link";
import { WHATSAPP_LINK } from "@/lib/constants";
import { formatDateRange } from "@/lib/format";
import { SedifexPromo } from "@/lib/types";

interface PromoBannerProps {
  promo: SedifexPromo | null;
}

export default function PromoBanner({ promo }: PromoBannerProps) {
  if (!promo) return null;

  const title = promo.promoTitle || "Special Event Offer";
  const summary = promo.promoSummary || "Book now and secure a premium drinks and guest experience package.";
  const dateRange = formatDateRange(promo.promoStartDate, promo.promoEndDate);

  return (
    <section id="promo" className="bg-charcoalBrand py-16 text-white">
      <div className="container mx-auto max-w-5xl px-4 md:px-8">
        <div className="rounded-3xl border border-goldBrand/40 bg-gradient-to-r from-emeraldBrand/40 to-charcoalBrand p-8 shadow-premium md:p-10">
          <p className="inline-flex rounded-full border border-goldBrand/50 bg-goldBrand/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-goldBrand">
            Featured Promo
          </p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight md:text-4xl">{title}</h2>
          <p className="mt-4 max-w-3xl text-white/90">{summary}</p>
          {dateRange ? <p className="mt-4 text-sm text-goldBrand">Valid: {dateRange}</p> : null}

          <div className="mt-8">
            <Link
              href={promo.promoWebsiteUrl || WHATSAPP_LINK}
              className="inline-flex rounded-full bg-goldBrand px-6 py-3 text-sm font-semibold text-charcoalBrand transition hover:bg-goldBrand/90"
            >
              Claim this Offer
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
