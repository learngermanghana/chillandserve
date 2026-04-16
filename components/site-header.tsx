"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BRAND_NAME } from "@/lib/constants";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/booking", label: "Booking" },
  { href: "/contact", label: "Contact" },
  { href: "/request-quote", label: "Request a Quote" }
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-charcoalBrand/10 bg-ivoryBrand/95 backdrop-blur">
      <div className="container mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <Link href="/" className="max-w-[70%] text-base font-semibold leading-tight text-charcoalBrand sm:text-lg md:max-w-none md:text-xl">
          {BRAND_NAME}
        </Link>

        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-md border border-charcoalBrand/20 p-2 text-charcoalBrand transition hover:bg-charcoalBrand/5 md:hidden"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-site-navigation"
          aria-label="Toggle navigation menu"
        >
          <span className="sr-only">Toggle navigation menu</span>
          {isMenuOpen ? "✕" : "☰"}
        </button>

        <nav className="hidden items-center gap-2 text-sm md:flex md:gap-4 md:text-base">
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

      {isMenuOpen ? (
        <nav id="mobile-site-navigation" className="border-t border-charcoalBrand/10 bg-ivoryBrand px-4 py-3 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-emeraldBrand text-white"
                      : "text-charcoalBrand/90 hover:bg-charcoalBrand/5"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
