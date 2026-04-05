"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BRAND_NAME } from "@/lib/constants";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" }
];

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-charcoalBrand/10 bg-ivoryBrand/95 backdrop-blur">
      <div className="container mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <Link href="/" className="text-lg font-semibold text-charcoalBrand md:text-xl">
          {BRAND_NAME}
        </Link>

        <nav className="flex items-center gap-2 text-sm md:gap-4 md:text-base">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3 py-1.5 transition ${
                  isActive
                    ? "bg-emeraldBrand text-white"
                    : "text-charcoalBrand/80 hover:bg-charcoalBrand/5 hover:text-charcoalBrand"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
