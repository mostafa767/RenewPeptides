"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-lg shadow-md border-b border-slate-100"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group" aria-label="RenewPeptides Home">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-hero-gradient shadow-md group-hover:shadow-lg transition-shadow">
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-white" aria-hidden="true">
                <path
                  d="M12 2L3 7v10l9 5 9-5V7L12 2z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path d="M12 7v10M7 9.5l5 3 5-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <div className="leading-none">
              <span className={`block text-lg font-bold tracking-wide transition-colors ${scrolled ? "text-navy-900" : "text-white"}`}>
                RenewPeptides
              </span>
              <span className={`block text-[10px] font-medium tracking-[0.15em] uppercase transition-colors ${scrolled ? "text-slate-500" : "text-white/70"}`}>
                Pharmaceuticals
              </span>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-200 relative group ${
                  pathname === link.href
                    ? scrolled
                      ? "text-brand-accent"
                      : "text-sky-300"
                    : scrolled
                    ? "text-slate-700 hover:text-brand-accent"
                    : "text-white/85 hover:text-white"
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-0.5 left-0 h-0.5 transition-all duration-200 ${
                    pathname === link.href
                      ? "w-full bg-current"
                      : "w-0 group-hover:w-full bg-current"
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/verify"
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand-accent px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-sky-700 transition-all duration-200 active:scale-95"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 010 2H5v2a1 1 0 01-2 0V4zm12 0a1 1 0 00-1-1h-3a1 1 0 100 2h2v2a1 1 0 102 0V4zM3 16a1 1 0 001 1h3a1 1 0 100-2H5v-2a1 1 0 10-2 0v3zm12 1a1 1 0 001-1v-3a1 1 0 10-2 0v2h-2a1 1 0 100 2h3z" clipRule="evenodd" />
              </svg>
              Verify Product
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            className={`md:hidden flex flex-col gap-1.5 p-2 rounded-lg transition-colors ${
              scrolled ? "hover:bg-slate-100" : "hover:bg-white/10"
            }`}
          >
            <span className={`block h-0.5 w-5 rounded-full transition-all duration-300 ${
              scrolled ? "bg-slate-700" : "bg-white"
            } ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block h-0.5 w-5 rounded-full transition-all duration-300 ${
              scrolled ? "bg-slate-700" : "bg-white"
            } ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 rounded-full transition-all duration-300 ${
              scrolled ? "bg-slate-700" : "bg-white"
            } ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } bg-white border-b border-slate-100 shadow-lg`}
      >
        <div className="px-4 py-3 space-y-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "bg-sky-50 text-brand-accent"
                  : "text-slate-700 hover:bg-slate-50 hover:text-brand-accent"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/verify"
            className="flex items-center justify-center gap-2 mt-2 w-full rounded-xl bg-brand-accent px-4 py-3 text-sm font-semibold text-white"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 010 2H5v2a1 1 0 01-2 0V4zm12 0a1 1 0 00-1-1h-3a1 1 0 100 2h2v2a1 1 0 102 0V4zM3 16a1 1 0 001 1h3a1 1 0 100-2H5v-2a1 1 0 10-2 0v3zm12 1a1 1 0 001-1v-3a1 1 0 10-2 0v2h-2a1 1 0 100 2h3z" clipRule="evenodd" />
            </svg>
            Verify Product
          </Link>
        </div>
      </div>
    </header>
  );
}
