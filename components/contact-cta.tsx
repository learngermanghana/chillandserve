import Link from "next/link";
import {
  EMAIL_LINK,
  EMAIL_TEXT,
  PHONE_DISPLAY,
  PHONE_LINK,
  SOCIAL_LINKS,
  WHATSAPP_LINK
} from "@/lib/constants";

const buttonClass =
  "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition";

export default function ContactCta() {
  return (
    <section id="contact" className="bg-white py-16 md:py-24">
      <div className="container mx-auto max-w-6xl px-4 md:px-8">
        <div className="rounded-3xl border border-charcoalBrand/10 bg-ivoryBrand p-8 shadow-premium md:p-12">
          <h2 className="text-3xl font-semibold text-charcoalBrand md:text-4xl">Ready to Book Your Event Service?</h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-charcoalBrand/80">
            Contact Chill and Serve Ghana for weddings, receptions, birthdays, and private events. We deliver premium drinks, chilling,
            and guest support tailored to your occasion.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={WHATSAPP_LINK} className={`${buttonClass} bg-emeraldBrand text-white hover:bg-emeraldBrand/90`}>
              Book on WhatsApp
            </Link>
            <Link href={PHONE_LINK} className={`${buttonClass} border border-emeraldBrand/40 text-emeraldBrand hover:bg-emeraldBrand/5`}>
              Call {PHONE_DISPLAY}
            </Link>
            <Link href={EMAIL_LINK} className={`${buttonClass} border border-charcoalBrand/20 text-charcoalBrand hover:bg-charcoalBrand/5`}>
              Email Us
            </Link>
          </div>

          <div className="mt-8 grid gap-3 text-sm text-charcoalBrand/80 sm:grid-cols-2 md:grid-cols-4">
            <p>
              <span className="font-semibold text-charcoalBrand">Phone:</span> {PHONE_DISPLAY}
            </p>
            <p>
              <span className="font-semibold text-charcoalBrand">Email:</span> {EMAIL_TEXT}
            </p>
            <Link href={SOCIAL_LINKS.facebook} className="hover:text-emeraldBrand">
              Facebook
            </Link>
            <div className="flex gap-4">
              <Link href={SOCIAL_LINKS.instagram} className="hover:text-emeraldBrand">
                Instagram
              </Link>
              <Link href={SOCIAL_LINKS.youtube} className="hover:text-emeraldBrand">
                YouTube
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
