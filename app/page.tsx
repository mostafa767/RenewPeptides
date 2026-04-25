import Link from "next/link";

const PRODUCTS = [
  {
    name: "RenewPeptides Testosterone Enanthate",
    category: "Hormonal Preparations",
    description:
      "Pharmaceutical-grade testosterone enanthate for hormone replacement therapy, manufactured under ISO 9001 quality standards.",
    badge: "Most Popular",
    icon: "💊",
  },
  {
    name: "RenewPeptides Anastrozole",
    category: "Aromatase Inhibitors",
    description:
      "Precision-dosed anastrozole tablets for aromatase inhibition, ensuring consistent therapeutic plasma levels.",
    badge: null,
    icon: "🔬",
  },
  {
    name: "RenewPeptides Metformin HCl",
    category: "Metabolic Agents",
    description:
      "High-purity metformin hydrochloride for glycemic control, manufactured to USP/BP pharmacopeial standards.",
    badge: "New",
    icon: "🧬",
  },
  {
    name: "RenewPeptides Clomiphene Citrate",
    category: "Selective Modulators",
    description:
      "Pharmaceutical-grade clomiphene citrate, precisely compounded for reliable clinical outcomes.",
    badge: null,
    icon: "⚗️",
  },
];

const STATS = [
  { value: "10+", label: "Years of Excellence" },
  { value: "50+", label: "Product SKUs" },
  { value: "1M+", label: "Verified Products" },
  { value: "30+", label: "Countries Served" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Scan the QR Code",
    description:
      "Every RenewPeptides product has a unique QR code label printed on the packaging. Open your phone camera and scan it.",
  },
  {
    step: "02",
    title: "Instant Verification",
    description:
      "You are redirected to our secure verification portal. The serial number is auto-filled and checked against our database in real time.",
  },
  {
    step: "03",
    title: "Confirmed Authentic",
    description:
      "A clear green confirmation tells you your product is genuine. If anything looks wrong, contact us immediately.",
  },
];

const TRUST_BADGES = [
  { icon: "🏭", title: "GMP Certified", desc: "Good Manufacturing Practice" },
  { icon: "📋", title: "ISO 9001", desc: "Quality Management System" },
  { icon: "🔒", title: "Secure QR", desc: "Cryptographic Serial Numbers" },
  { icon: "⚡", title: "Real-time Check", desc: "Instant Database Verification" },
];

export default function HomePage() {
  return (
    <>
      {/* ─── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-hero-gradient">
        {/* Decorative shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-sky-600/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-blue-900/30 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-navy-800/20 blur-3xl" />
        </div>

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-32 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-4 py-1.5 text-xs font-semibold text-sky-200 ring-1 ring-white/20 mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse" />
            Trusted by healthcare professionals worldwide
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight max-w-5xl mx-auto">
            Pharmaceutical Quality{" "}
            <span className="text-gradient">You Can Verify</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            Every RenewPeptides product ships with a cryptographically secured QR code.
            Scan it and confirm authenticity in seconds — no app required.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/verify"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-accent px-8 py-4 text-base font-bold text-white shadow-xl hover:bg-sky-700 transition-all duration-200 active:scale-95"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 010 2H5v2a1 1 0 01-2 0V4zm12 0a1 1 0 00-1-1h-3a1 1 0 100 2h2v2a1 1 0 102 0V4zM3 16a1 1 0 001 1h3a1 1 0 100-2H5v-2a1 1 0 10-2 0v3zm12 1a1 1 0 001-1v-3a1 1 0 10-2 0v2h-2a1 1 0 100 2h3z" clipRule="evenodd" />
              </svg>
              Verify Your Product
            </Link>
            <Link
              href="/products"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-white/25 px-8 py-4 text-base font-semibold text-white hover:border-white/50 hover:bg-white/10 transition-all duration-200 active:scale-95"
            >
              Explore Products
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>

          {/* Scroll indicator */}
          <div className="mt-20 flex flex-col items-center gap-2 text-white/30 animate-bounce">
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </section>

      {/* ─── Stats strip ──────────────────────────────────────────────────── */}
      <section className="bg-navy-800 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-extrabold text-white">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-slate-400 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Trust badges ─────────────────────────────────────────────────── */}
      <section className="bg-slate-50 py-14 border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {TRUST_BADGES.map((badge) => (
              <div
                key={badge.title}
                className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-sm border border-slate-100"
              >
                <span className="text-2xl shrink-0">{badge.icon}</span>
                <div>
                  <div className="text-sm font-semibold text-navy-900">
                    {badge.title}
                  </div>
                  <div className="text-xs text-slate-500">{badge.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Products ─────────────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-semibold uppercase tracking-[0.15em] text-brand-accent mb-3">
              Product Range
            </span>
            <h2 className="section-heading">Pharmaceutical Excellence in Every Vial</h2>
            <p className="section-subheading max-w-2xl mx-auto">
              Our product line covers a broad range of therapeutic areas — all manufactured
              to the highest pharmacopeial standards and individually serialized.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRODUCTS.map((product) => (
              <div key={product.name} className="card p-6 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-2xl">
                    {product.icon}
                  </div>
                  {product.badge && (
                    <span className="inline-block rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-semibold text-brand-accent">
                      {product.badge}
                    </span>
                  )}
                </div>
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
                  {product.category}
                </span>
                <h3 className="text-base font-bold text-navy-900 mb-2 leading-snug">
                  {product.name}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed flex-1">
                  {product.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/products" className="btn-outline">
              View All Products
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── How Verification Works ───────────────────────────────────────── */}
      <section className="py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-semibold uppercase tracking-[0.15em] text-brand-accent mb-3">
              Anti-Counterfeit System
            </span>
            <h2 className="section-heading">How Product Verification Works</h2>
            <p className="section-subheading max-w-2xl mx-auto">
              Protecting patients from counterfeit medications is our top priority.
              Our three-step process takes less than 10 seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line (desktop) */}
            <div
              className="absolute top-10 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-brand-accent/20 via-brand-accent to-brand-accent/20 hidden md:block"
              aria-hidden="true"
            />

            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.step} className="relative flex flex-col items-center text-center">
                <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-hero-gradient text-white shadow-lg mb-6 z-10">
                  <span className="text-3xl font-extrabold opacity-20 absolute">{step.step}</span>
                  <span className="text-lg font-bold relative z-10">{i + 1}</span>
                </div>
                <h3 className="text-lg font-bold text-navy-900 mb-3">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed max-w-xs">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/verify"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-accent px-8 py-4 text-base font-bold text-white shadow-lg hover:bg-sky-700 transition-all duration-200"
            >
              Try the Verifier Now
            </Link>
          </div>
        </div>
      </section>

      {/* ─── About snippet ────────────────────────────────────────────────── */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Text */}
            <div>
              <span className="inline-block text-xs font-semibold uppercase tracking-[0.15em] text-brand-accent mb-3">
                Our Mission
              </span>
              <h2 className="section-heading">
                Built on Science. Backed by Integrity.
              </h2>
              <p className="mt-4 text-slate-600 leading-relaxed">
                RenewPeptides Pharmaceuticals was founded on the belief that every patient deserves
                access to medications they can trust — medications whose purity, potency, and
                provenance are beyond question.
              </p>
              <p className="mt-4 text-slate-600 leading-relaxed">
                Our state-of-the-art manufacturing facilities are GMP-certified and operate
                under continuous quality audits. Each batch is independently tested before
                release, and every individual unit is assigned a unique cryptographic serial
                number traceable back to production.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-green-500 shrink-0" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  GMP Certified Manufacturing
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-green-500 shrink-0" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Independent Batch Testing
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-green-500 shrink-0" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Full Chain of Custody Tracking
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-green-500 shrink-0" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  ISO 9001 Quality Management
                </div>
              </div>
              <div className="mt-8">
                <Link href="/about" className="btn-outline">
                  Our Full Story
                </Link>
              </div>
            </div>

            {/* Visual card */}
            <div className="relative">
              <div className="rounded-3xl bg-hero-gradient p-10 text-white shadow-2xl">
                <div className="absolute top-6 right-6 w-24 h-24 rounded-full bg-white/5" aria-hidden="true" />
                <div className="absolute bottom-6 left-6 w-16 h-16 rounded-full bg-white/5" aria-hidden="true" />
                <div className="relative">
                  <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-white/15 mb-6">
                    <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7 text-white" aria-hidden="true">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">
                    Zero-Compromise Quality
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed mb-6">
                    Every product line undergoes a minimum of 14 quality checkpoints from
                    raw-material intake to final packaging seal.
                  </p>
                  <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/15">
                    {[
                      { n: "99.9%", l: "Purity Standard" },
                      { n: "14", l: "QC Checkpoints" },
                      { n: "24/7", l: "Lab Monitoring" },
                    ].map((item) => (
                      <div key={item.l} className="text-center">
                        <div className="text-xl font-extrabold">{item.n}</div>
                        <div className="text-xs text-white/50 mt-0.5">{item.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ───────────────────────────────────────────────────── */}
      <section className="relative py-20 bg-hero-gradient overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-sky-500/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-blue-800/20 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Got a RenewPeptides product? Verify it now.
          </h2>
          <p className="text-white/70 mb-8 text-lg">
            It takes 10 seconds. Your health is worth it.
          </p>
          <Link
            href="/verify"
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-bold text-navy-800 shadow-xl hover:shadow-2xl transition-all duration-200 active:scale-95"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-brand-accent" aria-hidden="true">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 010 2H5v2a1 1 0 01-2 0V4zm12 0a1 1 0 00-1-1h-3a1 1 0 100 2h2v2a1 1 0 102 0V4zM3 16a1 1 0 001 1h3a1 1 0 100-2H5v-2a1 1 0 10-2 0v3zm12 1a1 1 0 001-1v-3a1 1 0 10-2 0v2h-2a1 1 0 100 2h3z" clipRule="evenodd" />
            </svg>
            Verify Product Authenticity
          </Link>
        </div>
      </section>
    </>
  );
}
