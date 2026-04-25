import Link from "next/link";

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
  { href: "/verify", label: "Verify Product" },
];

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-white">
      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-accent">
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-white" aria-hidden="true">
                  <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                  <path d="M12 7v10M7 9.5l5 3 5-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <span className="block text-lg font-bold tracking-wide">RenewPeptides</span>
                <span className="block text-[10px] font-medium tracking-[0.15em] uppercase text-white/50">
                  Pharmaceuticals
                </span>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Delivering pharmaceutical-grade products you can trust. Every RenewPeptides product carries
              a unique QR verification code — scan it to confirm authenticity instantly.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href="mailto:info@renewpeptides-us.com"
                className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0" aria-hidden="true">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                info@renewpeptides-us.com
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400 mb-5">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <span className="h-px w-3 bg-slate-600 group-hover:bg-brand-accent group-hover:w-5 transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Verify CTA */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400 mb-5">
              Product Authenticity
            </h3>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">
              Scan the QR code on your RenewPeptides product or enter your serial number below.
            </p>
            <Link
              href="/verify"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 transition-colors"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 010 2H5v2a1 1 0 01-2 0V4zm12 0a1 1 0 00-1-1h-3a1 1 0 100 2h2v2a1 1 0 102 0V4zM3 16a1 1 0 001 1h3a1 1 0 100-2H5v-2a1 1 0 10-2 0v3zm12 1a1 1 0 001-1v-3a1 1 0 10-2 0v2h-2a1 1 0 100 2h3z" clipRule="evenodd" />
              </svg>
              Verify Now
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} RenewPeptides Pharmaceuticals. All rights reserved.
          </p>
          <div className="flex gap-6">
            <span className="text-xs text-slate-500">Privacy Policy</span>
            <span className="text-xs text-slate-500">Terms of Use</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
