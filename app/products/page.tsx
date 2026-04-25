import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse the full RenewPeptides pharmaceutical product range.",
};

const CATEGORIES = [
  "All",
  "Hormonal Preparations",
  "Aromatase Inhibitors",
  "Peptides",
  "Metabolic Agents",
  "Selective Modulators",
  "Vitamins & Supplements",
];

const PRODUCTS = [
  {
    id: 1,
    name: "Testosterone Enanthate 250",
    category: "Hormonal Preparations",
    strength: "250 mg/mL",
    form: "Injectable Solution",
    volume: "10 mL vial",
    description:
      "Long-acting testosterone ester for hormone replacement therapy. Manufactured under strict GMP conditions with every vial individually serialized.",
    features: ["GMP Certified", "Individually Serialized", "Third-Party Tested"],
    badge: "Best Seller",
  },
  {
    id: 2,
    name: "Testosterone Propionate 100",
    category: "Hormonal Preparations",
    strength: "100 mg/mL",
    form: "Injectable Solution",
    volume: "10 mL vial",
    description:
      "Short-acting testosterone ester offering rapid onset of action. Ideal for customized hormone replacement protocols.",
    features: ["GMP Certified", "Rapid Onset", "Bacteriostatic Water Used"],
    badge: null,
  },
  {
    id: 3,
    name: "Anastrozole 1mg",
    category: "Aromatase Inhibitors",
    strength: "1 mg",
    form: "Oral Tablet",
    volume: "100 tablets",
    description:
      "Potent and selective non-steroidal aromatase inhibitor. Precision tablet compression ensures uniform drug release.",
    features: ["Uniform Release Profile", "Tablet Film-Coated", "Blister Pack"],
    badge: null,
  },
  {
    id: 4,
    name: "Letrozole 2.5mg",
    category: "Aromatase Inhibitors",
    strength: "2.5 mg",
    form: "Oral Tablet",
    volume: "100 tablets",
    description:
      "Third-generation aromatase inhibitor with high selectivity. Each batch tested for content uniformity.",
    features: ["High Selectivity", "Content Uniformity Tested", "Tamper-Evident Seal"],
    badge: null,
  },
  {
    id: 5,
    name: "Metformin HCl 500mg",
    category: "Metabolic Agents",
    strength: "500 mg",
    form: "Oral Tablet",
    volume: "60 tablets",
    description:
      "Pharmaceutical-grade metformin hydrochloride for glycemic control. USP/BP compliant with extensive dissolution testing.",
    features: ["USP/BP Compliant", "Dissolution Tested", "Child-Resistant Cap"],
    badge: "New",
  },
  {
    id: 6,
    name: "Clomiphene Citrate 50mg",
    category: "Selective Modulators",
    strength: "50 mg",
    form: "Oral Tablet",
    volume: "30 tablets",
    description:
      "Selective estrogen receptor modulator for endogenous testosterone stimulation. Precisely compounded for reliable outcomes.",
    features: ["Precise Dosing", "High-Purity API", "Individual Blister"],
    badge: null,
  },
  {
    id: 7,
    name: "HGH Fragment 176-191",
    category: "Peptides",
    strength: "2 mg",
    form: "Lyophilized Powder",
    volume: "Vial",
    description:
      "Synthetic peptide analogue of growth hormone for research applications. Lyophilized under aseptic conditions.",
    features: ["Aseptic Processing", "≥99% Purity by HPLC", "Cold Chain Shipping"],
    badge: null,
  },
  {
    id: 8,
    name: "Vitamin D3 + K2",
    category: "Vitamins & Supplements",
    strength: "5000 IU / 200 mcg",
    form: "Softgel Capsule",
    volume: "120 capsules",
    description:
      "Pharmaceutical-grade vitamin D3 paired with MK-7 K2 for optimal co-absorption. Cold-pressed from premium lanolin source.",
    features: ["MK-7 Form of K2", "Non-GMO", "Third-Party Verified"],
    badge: null,
  },
];

export default function ProductsPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-hero-gradient py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.15em] text-sky-300 mb-4">
            Product Catalog
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
            Pharmaceutical-Grade Products
          </h1>
          <p className="mt-5 text-lg text-white/70 max-w-2xl mx-auto">
            Every RenewPeptides product is manufactured to pharmacopeial standards,
            independently tested, and individually serialized with a QR verification code.
          </p>
        </div>
      </section>

      {/* Products grid */}
      <section className="py-20 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Category pills (static — client filter would be added in production) */}
          <div className="flex flex-wrap gap-2 mb-10">
            {CATEGORIES.map((cat) => (
              <span
                key={cat}
                className={`inline-block rounded-full px-4 py-1.5 text-sm font-medium cursor-default transition-colors ${
                  cat === "All"
                    ? "bg-brand-accent text-white"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-brand-accent hover:text-brand-accent"
                }`}
              >
                {cat}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRODUCTS.map((p) => (
              <div
                key={p.id}
                className="card p-5 flex flex-col group"
              >
                {/* Icon placeholder */}
                <div className="h-32 rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center mb-4 group-hover:from-sky-50 group-hover:to-blue-50 transition-colors border border-slate-100">
                  <div className="text-center">
                    <div className="text-3xl mb-1">💊</div>
                    <span className="text-xs text-slate-400 font-medium">{p.form}</span>
                  </div>
                </div>

                <div className="flex items-start justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    {p.category}
                  </span>
                  {p.badge && (
                    <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-bold text-brand-accent">
                      {p.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-navy-900 leading-snug mb-1">
                  {p.name}
                </h3>
                <div className="flex gap-2 text-xs text-slate-500 mb-3">
                  <span>{p.strength}</span>
                  <span>·</span>
                  <span>{p.volume}</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed flex-1 mb-4">
                  {p.description}
                </p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {p.features.map((f) => (
                    <span
                      key={f}
                      className="inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600"
                    >
                      {f}
                    </span>
                  ))}
                </div>

                <Link
                  href="/verify"
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 hover:bg-brand-accent hover:text-white py-2.5 text-xs font-semibold text-slate-600 transition-all duration-200 mt-auto"
                >
                  <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 010 2H5v2a1 1 0 01-2 0V4zm12 0a1 1 0 00-1-1h-3a1 1 0 100 2h2v2a1 1 0 102 0V4zM3 16a1 1 0 001 1h3a1 1 0 100-2H5v-2a1 1 0 10-2 0v3zm12 1a1 1 0 001-1v-3a1 1 0 10-2 0v2h-2a1 1 0 100 2h3z" clipRule="evenodd" />
                  </svg>
                  Verify Authenticity
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality callout */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-2xl font-bold text-navy-900 mb-3">
            Every product is individually serialized
          </h2>
          <p className="text-slate-600 mb-6 max-w-xl mx-auto">
            Before your RenewPeptides product ships, it receives a cryptographically secure serial number
            embedded in a QR code printed directly on the label. Scan it and verify instantly.
          </p>
          <Link href="/verify" className="btn-primary">
            Verify a Product
          </Link>
        </div>
      </section>
    </>
  );
}
