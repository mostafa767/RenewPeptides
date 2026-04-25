"use client";

import { useState } from "react";

const CONTACT_INFO = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
        <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    label: "Address",
    value: "123 Pharmaceutical Ave, Jersey City, NJ 07302, USA",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    label: "Email",
    value: "info@renewpeptides-us.com",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
        <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    label: "Phone",
    value: "+1 (201) 555-0174",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    label: "Business Hours",
    value: "Monday – Friday, 9 AM – 5 PM EST",
  },
];

type FormState = "idle" | "submitting" | "success" | "error";

export default function ContactPage() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormState("submitting");
    // Simulate send (replace with real email API integration)
    await new Promise((r) => setTimeout(r, 1200));
    setFormState("success");
  }

  return (
    <>
      {/* Header */}
      <section className="bg-hero-gradient py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.15em] text-sky-300 mb-4">
            Get in Touch
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
            Contact Us
          </h1>
          <p className="mt-5 text-lg text-white/70 max-w-xl mx-auto">
            Questions about a product, authenticity concerns, or business inquiries —
            our team responds within one business day.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Contact info */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-navy-900 mb-2">Our Offices</h2>
                <p className="text-sm text-slate-500 leading-relaxed">
                  We are headquartered in Jersey City, NJ, with distribution
                  centers serving North America and Europe.
                </p>
              </div>

              <div className="space-y-4">
                {CONTACT_INFO.map((info) => (
                  <div
                    key={info.label}
                    className="flex items-start gap-4 rounded-2xl bg-white p-4 shadow-sm border border-slate-100"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-brand-accent">
                      {info.icon}
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-0.5">
                        {info.label}
                      </p>
                      <p className="text-sm text-slate-700 font-medium">{info.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Report counterfeit */}
              <div className="rounded-2xl bg-red-50 border border-red-100 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-red-500 shrink-0" aria-hidden="true">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <h3 className="text-sm font-bold text-red-700">Report a Counterfeit</h3>
                </div>
                <p className="text-xs text-red-600 leading-relaxed">
                  If your verification failed or you suspect a counterfeit RenewPeptides product,
                  please contact us immediately. Include your serial number and purchase details.
                </p>
              </div>
            </div>

            {/* Contact form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-3xl shadow-card border border-slate-100 p-8">
                {formState === "success" ? (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-green-50 border-4 border-green-100 mx-auto mb-5">
                      <svg viewBox="0 0 24 24" fill="none" className="h-10 w-10 text-green-500" aria-hidden="true">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-navy-900 mb-2">Message Sent!</h3>
                    <p className="text-slate-500 text-sm">
                      Thank you for reaching out. Our team will get back to you within one business day.
                    </p>
                    <button
                      onClick={() => { setFormState("idle"); setForm({ name: "", email: "", subject: "", message: "" }); }}
                      className="mt-6 text-sm font-medium text-brand-accent hover:underline"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <h2 className="text-xl font-bold text-navy-900 mb-6">Send Us a Message</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1.5">
                          Full Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={form.name}
                          onChange={handleChange}
                          required
                          placeholder="John Smith"
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">
                          Email Address <span className="text-red-400">*</span>
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          required
                          placeholder="john@example.com"
                          className="input-field"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Subject <span className="text-red-400">*</span>
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        required
                        className="input-field"
                      >
                        <option value="">Select a subject…</option>
                        <option value="product-inquiry">Product Inquiry</option>
                        <option value="verification-issue">Verification Issue</option>
                        <option value="counterfeit-report">Report Counterfeit</option>
                        <option value="order-inquiry">Order Inquiry</option>
                        <option value="partnership">Business / Partnership</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Message <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        value={form.message}
                        onChange={handleChange}
                        required
                        placeholder="Tell us how we can help…"
                        className="input-field resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={formState === "submitting"}
                      className="w-full rounded-2xl bg-brand-accent py-4 text-sm font-bold text-white shadow-lg hover:bg-sky-700 transition-all duration-200 active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {formState === "submitting" ? (
                        <>
                          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                          </svg>
                          Sending…
                        </>
                      ) : (
                        "Send Message"
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
