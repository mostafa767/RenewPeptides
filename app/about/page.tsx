import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about RenewPeptides Pharmaceuticals — our mission, history, and commitment to quality.",
};

const VALUES = [
  {
    icon: "🔬",
    title: "Scientific Rigor",
    desc: "Every formulation is developed and validated by our in-house team of PhD-level pharmaceutical scientists.",
  },
  {
    icon: "🛡️",
    title: "Patient Safety First",
    desc: "We maintain the industry's most stringent quality control protocols because patient safety is non-negotiable.",
  },
  {
    icon: "🌐",
    title: "Global Standards",
    desc: "Our facilities meet or exceed GMP guidelines from the FDA, EMA, and WHO simultaneously.",
  },
  {
    icon: "♻️",
    title: "Sustainable Operations",
    desc: "We operate carbon-neutral manufacturing processes and source APIs from responsibly managed suppliers.",
  },
];

const MILESTONES = [
  { year: "2014", event: "RenewPeptides Pharmaceuticals founded in Jersey City, NJ" },
  { year: "2016", event: "First GMP certification granted by state health authority" },
  { year: "2018", event: "ISO 9001:2015 certification achieved" },
  { year: "2020", event: "Launch of the RenewPeptides QR anti-counterfeit system" },
  { year: "2022", event: "1 million verified products milestone reached" },
  { year: "2024", event: "Expanded product range to 50+ pharmaceutical SKUs" },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-hero-gradient py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.15em] text-sky-300 mb-4">
            Our Story
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">
            A Decade of Pharmaceutical Integrity
          </h1>
          <p className="mt-5 text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
            RenewPeptides Pharmaceuticals was built on the principle that patients deserve certainty —
            certainty about what is in their medications, where they came from, and that
            every capsule or vial meets the same uncompromising standard.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block text-xs font-semibold uppercase tracking-[0.15em] text-brand-accent mb-3">
                Mission & Vision
              </span>
              <h2 className="section-heading">
                Why We Do What We Do
              </h2>
              <p className="mt-5 text-slate-600 leading-relaxed">
                Counterfeit medications cause approximately 1 million deaths worldwide each year.
                Behind every bottle of genuine medicine is a chain of custody, a trail of quality
                records, and a team of scientists and engineers who refused to cut corners.
              </p>
              <p className="mt-4 text-slate-600 leading-relaxed">
                RenewPeptides was founded to close the gap between pharmaceutical manufacturer and end
                patient — a gap that counterfeiters exploit. Our QR-based verification system
                gives every patient direct, real-time access to authenticity data, turning
                their smartphone into a quality inspector.
              </p>
              <div className="mt-8">
                <Link href="/verify" className="btn-primary">
                  Try the Verifier
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {VALUES.map((v) => (
                <div key={v.title} className="card p-5">
                  <div className="text-3xl mb-3">{v.icon}</div>
                  <h3 className="text-sm font-bold text-navy-900 mb-1.5">{v.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-semibold uppercase tracking-[0.15em] text-brand-accent mb-3">
              Our Journey
            </span>
            <h2 className="section-heading">Milestones That Define Us</h2>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 -translate-x-1/2" aria-hidden="true" />

            <div className="space-y-8">
              {MILESTONES.map((m, i) => (
                <div
                  key={m.year}
                  className={`relative flex items-center gap-6 ${
                    i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
                  }`}
                >
                  {/* Dot */}
                  <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 h-4 w-4 rounded-full bg-brand-accent ring-4 ring-sky-100 z-10" aria-hidden="true" />

                  {/* Content */}
                  <div
                    className={`ml-12 sm:ml-0 sm:w-1/2 ${
                      i % 2 === 0 ? "sm:pr-12 sm:text-right" : "sm:pl-12"
                    }`}
                  >
                    <div className="card p-4 inline-block text-left">
                      <span className="text-xs font-bold text-brand-accent">{m.year}</span>
                      <p className="text-sm text-slate-700 font-medium mt-0.5">{m.event}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-semibold uppercase tracking-[0.15em] text-brand-accent mb-3">
              Leadership
            </span>
            <h2 className="section-heading">The People Behind RenewPeptides</h2>
            <p className="section-subheading max-w-xl mx-auto">
              Our leadership team brings together expertise in pharmaceutical science,
              regulatory affairs, manufacturing engineering, and supply-chain integrity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { name: "Dr. Sarah Mitchell", role: "Chief Executive Officer", initials: "SM", color: "from-sky-500 to-blue-600" },
              { name: "Dr. James Okafor", role: "Chief Scientific Officer", initials: "JO", color: "from-violet-500 to-purple-600" },
              { name: "Lisa Chen", role: "VP of Quality Assurance", initials: "LC", color: "from-emerald-500 to-teal-600" },
            ].map((person) => (
              <div key={person.name} className="card p-6 text-center">
                <div
                  className={`h-20 w-20 rounded-full bg-gradient-to-br ${person.color} flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold shadow-lg`}
                >
                  {person.initials}
                </div>
                <h3 className="text-base font-bold text-navy-900">{person.name}</h3>
                <p className="text-sm text-slate-500 mt-1">{person.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-hero-gradient">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Ready to verify your RenewPeptides product?
          </h2>
          <p className="text-white/70 mb-8">
            It takes 10 seconds and requires nothing more than your phone.
          </p>
          <Link href="/verify" className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-bold text-navy-800 shadow-xl hover:shadow-2xl transition-all">
            Verify Authenticity
          </Link>
        </div>
      </section>
    </>
  );
}
