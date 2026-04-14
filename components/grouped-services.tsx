import Link from "next/link";
import SectionHeading from "./section-heading";
import { WHATSAPP_LINK } from "@/lib/constants";
import { SedifexProduct } from "@/lib/types";

interface GroupedServicesProps {
  groups: Record<string, SedifexProduct[]>;
}

export default function GroupedServices({ groups }: GroupedServicesProps) {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeading
          eyebrow="By Category"
          title="Quick Overview of Our Event Solutions"
          description="Scan services by category and discover the perfect fit for your celebration."
        />

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(groups).map(([category, items]) => (
            <article key={category} className="rounded-3xl border border-charcoalBrand/10 bg-ivoryBrand/50 p-6">
              <h3 className="text-xl font-semibold text-charcoalBrand">{category}</h3>
              <ul className="mt-4 space-y-4">
                {items.slice(0, 4).map((item, idx) => (
                  <li key={`${item.id ?? item.name ?? idx}`} className="border-b border-charcoalBrand/10 pb-3 last:border-none">
                    <p className="font-medium text-charcoalBrand">{item.name || "Signature Service"}</p>
                    <p className="mt-1 text-sm text-charcoalBrand/70">
                      {item.description?.slice(0, 88) || "Premium support for elegant event hosting."}
                    </p>
                    <Link
                      href={WHATSAPP_LINK}
                      className="mt-2 inline-flex rounded-full border border-goldBrand/60 px-3 py-1 text-xs font-medium text-charcoalBrand transition hover:bg-goldBrand/20"
                    >
                      Request Quote
                    </Link>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
