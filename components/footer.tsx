import Link from "next/link";
import { BRAND_NAME, SOCIAL_LINKS } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-charcoalBrand py-10 text-white">
      <div className="container mx-auto flex max-w-7xl flex-col gap-6 px-4 md:flex-row md:items-center md:justify-between md:px-8">
        <div>
          <p className="text-lg font-semibold">{BRAND_NAME}</p>
          <p className="mt-2 text-sm text-white/70">© {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.</p>
          <p className="mt-1 text-sm text-white/70">Developed by Xenom IT Solutions, founders of Sedifex and Falowen App.</p>
        </div>

        <nav className="flex flex-wrap gap-4 text-sm text-white/90">
          <Link href="/" className="hover:text-goldBrand">
            Home
          </Link>
          <Link href="/services" className="hover:text-goldBrand">
            Services
          </Link>
          <Link href="/gallery" className="hover:text-goldBrand">
            Gallery
          </Link>
          <Link href="/contact" className="hover:text-goldBrand">
            Contact
          </Link>
        </nav>

        <div className="flex gap-4 text-sm">
          <Link href={SOCIAL_LINKS.facebook} className="hover:text-goldBrand">
            Facebook
          </Link>
          <Link href={SOCIAL_LINKS.instagram} className="hover:text-goldBrand">
            Instagram
          </Link>
          <Link href={SOCIAL_LINKS.youtube} className="hover:text-goldBrand">
            YouTube
          </Link>
        </div>
      </div>
    </footer>
  );
}
