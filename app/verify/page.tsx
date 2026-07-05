"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

type Product = {
  name: string | null;
  description: string | null;
  imageUrl: string;
};

type VerifyState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "valid"; message: string; scansCount: number; product: Product | null }
  | { status: "invalid"; message: string }
  | { status: "error"; message: string };

function formatSerial(raw: string): string {
  const clean = raw.replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 12);
  const parts = [];
  for (let i = 0; i < clean.length; i += 4) {
    parts.push(clean.slice(i, i + 4));
  }
  return parts.join("-");
}

function ProductPreview({ product }: { product: Product }) {
  return (
    <div className="flex justify-center">
      <div className="relative flex h-56 w-56 items-center justify-center">
        <div className="absolute inset-8 rounded-full bg-brand-accent/10 blur-3xl" />

        <div className="relative h-52 w-52 shrink-0">
          <Image
            src={product.imageUrl}
            alt={product.name ?? "RenewPeptides product"}
            fill
            sizes="208px"
            className="object-contain drop-shadow-2xl scale-110"
            priority
          />
        </div>
      </div>
    </div>
  );
}

function VerifyPageInner() {
  const searchParams = useSearchParams();
  const [serial, setSerial] = useState("");
  const [state, setState] = useState<VerifyState>({ status: "idle" });
  const [retryCount, setRetryCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasAutoVerified = useRef(false);

  // Pre-fill from URL and auto-verify
  useEffect(() => {
    const paramSerial = searchParams.get("serial");
    if (paramSerial && !hasAutoVerified.current) {
      const formatted = formatSerial(paramSerial);
      setSerial(formatted);
      hasAutoVerified.current = true;
      // Auto-trigger
      handleVerify(formatted);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  async function handleVerify(overrideSerial?: string) {
    const valueToVerify = (overrideSerial ?? serial).trim().toUpperCase();
    if (!valueToVerify) {
      inputRef.current?.focus();
      return;
    }

    setState({ status: "loading" });

    for (let attempt = 0; attempt <= 2; attempt++) {
      try {
        const res = await fetch("/api/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ serial: valueToVerify }),
        });

        const data = await res.json();

        if (res.status === 429) {
          setState({
            status: "error",
            message: data.error ?? "Too many requests. Please wait and try again.",
          });
          return;
        }

        if (!res.ok) {
          if (attempt < 2) {
            await delay(800 * (attempt + 1));
            continue;
          }
          setState({
            status: "error",
            message: data.error ?? "Verification failed. Please try again.",
          });
          return;
        }

        if (data.valid) {
          setState({
            status: "valid",
            message: data.message ?? "This is an authentic RenewPeptides product.",
            scansCount: data.scansCount ?? 1,
            product: data.product ?? null,
          });
        } else {
          setState({
            status: "invalid",
            message:
              data.message ??
              "This serial number was not found. The product may be counterfeit.",
          });
        }
        return;
      } catch {
        if (attempt < 2) {
          await delay(800 * (attempt + 1));
          continue;
        }
        setState({
          status: "error",
          message:
            "Could not reach the verification server. Please check your connection and try again.",
        });
      }
    }
  }

  function handleReset() {
    setSerial("");
    setState({ status: "idle" });
    setRetryCount((c) => c + 1);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatSerial(e.target.value);
    setSerial(formatted);
    if (state.status !== "idle") setState({ status: "idle" });
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleVerify();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
      {/* Page header */}
      <div className="bg-hero-gradient pt-24 pb-16">
        <div className="mx-auto max-w-xl px-4 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white/15 backdrop-blur mx-auto mb-5">
            <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 text-white" aria-hidden="true">
              <path fillRule="evenodd" clipRule="evenodd" d="M3 4.5A1.5 1.5 0 014.5 3h3a1.5 1.5 0 010 3H6v1.5a1.5 1.5 0 01-3 0v-3zm12-1.5a1.5 1.5 0 000 3h1.5V7.5a1.5 1.5 0 003 0v-3A1.5 1.5 0 0019.5 3h-4.5zM3 15a1.5 1.5 0 013 0v1.5h1.5a1.5 1.5 0 010 3h-3A1.5 1.5 0 013 18v-3zm13.5 3h1.5V16.5a1.5 1.5 0 013 0V18a1.5 1.5 0 01-1.5 1.5h-3a1.5 1.5 0 010-3z" fill="currentColor" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Verify Product</h1>
          <p className="mt-2 text-white/70 text-sm">
            Enter the serial number from your product label or scan the QR code.
          </p>
        </div>
      </div>

      {/* Verification card */}
      <div className="flex-1 mx-auto w-full max-w-xl px-4 -mt-6 pb-16">
        <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-100">
          {/* Input section */}
          {(state.status === "idle" || state.status === "loading") && (
            <div className="space-y-4">
              <label htmlFor="serial-input" className="block text-sm font-semibold text-slate-700">
                Serial Number
              </label>
              <div className="relative">
                <input
                  id="serial-input"
                  ref={inputRef}
                  type="text"
                  value={serial}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="XXXX-XXXX-XXXX"
                  maxLength={14}
                  disabled={state.status === "loading"}
                  autoComplete="off"
                  autoCapitalize="characters"
                  spellCheck={false}
                  className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50 px-5 py-4 text-center text-xl font-mono font-bold tracking-[0.2em] text-navy-900 placeholder-slate-300 transition-all duration-200 focus:border-brand-accent focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-accent/15 disabled:opacity-60"
                  aria-label="Product serial number"
                />
                {serial && state.status !== "loading" && (
                  <button
                    onClick={() => { setSerial(""); setState({ status: "idle" }); inputRef.current?.focus(); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                    aria-label="Clear serial number"
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>

              <button
                onClick={() => handleVerify()}
                disabled={state.status === "loading" || !serial.trim()}
                className="w-full rounded-2xl bg-brand-accent py-4 text-base font-bold text-white shadow-lg transition-all duration-200 hover:bg-sky-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {state.status === "loading" ? (
                  <>
                    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Verifying…
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verify Authenticity
                  </>
                )}
              </button>

              <p className="text-center text-xs text-slate-400">
                The serial number is printed on the product label below the QR code.
              </p>
            </div>
          )}

          {/* Valid result */}
          {state.status === "valid" && (
            <div className="text-center animate-fade-in-up">
              {state.product && <ProductPreview product={state.product} />}
              <div className="mx-auto mt-4 mb-4 inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700 animate-pulse">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white">
                  ✓
                </span>
                Authentic Product
              </div>

              <h2 className="text-3xl font-extrabold text-slate-900 mb-3">
                Verified Genuine
              </h2>

              <p className="mx-auto max-w-sm text-slate-600 text-sm leading-relaxed mb-3">
                {state.message}
              </p>

              <p className="text-xs text-slate-400 font-mono mb-6">
                Serial: <span className="font-bold text-slate-600">{serial}</span>
              </p>

              {/* {state.scansCount > 1 && ( 
                <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3 mb-6 text-sm text-amber-700">
                  <strong>Note:</strong> This serial has been scanned {state.scansCount} time{state.scansCount !== 1 ? "s" : ""}. If you did not scan it before, please contact us.
                </div>
              )} */}
              <div className="rounded-2xl bg-green-50 border border-green-100 px-5 py-4 mb-6 text-sm text-green-700">
                <strong>Thanks for your trust. We look forward to your next order!</strong>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleReset}
                  className="flex-1 rounded-2xl border-2 border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-colors"
                >
                  Verify Another
                </button>

                <Link
                  href="/contact"
                  className="flex-1 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors text-center"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          )}

          {/* Invalid result */}
          {state.status === "invalid" && (
            <div className="text-center animate-fade-in-up">
              <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-red-50 border-4 border-red-100 mx-auto mb-5">
                <svg viewBox="0 0 24 24" fill="none" className="h-12 w-12 text-red-500" aria-hidden="true">
                  <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 mb-3">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                Verification Failed
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
                Not Verified
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                {state.message}
              </p>
              <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-4 mb-6 text-left">
                <p className="text-xs font-semibold text-red-700 mb-2">What should you do?</p>
                <ul className="space-y-1.5">
                  {[
                    "Double-check the serial number on the label",
                    "Make sure you typed it correctly",
                    "If the issue persists, contact your seller",
                    "Report suspected counterfeits to us immediately",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-red-600">
                      <span className="mt-0.5 shrink-0">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleReset}
                  className="flex-1 rounded-2xl bg-brand-accent px-4 py-3 text-sm font-semibold text-white hover:bg-sky-700 transition-colors"
                >
                  Try Again
                </button>
                <Link
                  href="/contact"
                  className="flex-1 rounded-2xl border-2 border-red-200 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors text-center"
                >
                  Report Issue
                </Link>
              </div>
            </div>
          )}

          {/* Error state */}
          {state.status === "error" && (
            <div className="text-center animate-fade-in-up">
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-amber-50 border-4 border-amber-100 mx-auto mb-5">
                <svg viewBox="0 0 24 24" fill="none" className="h-10 w-10 text-amber-500" aria-hidden="true">
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">
                Service Unavailable
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                {state.message}
              </p>
              <button
                onClick={() => { setState({ status: "idle" }); }}
                className="rounded-2xl bg-brand-accent px-6 py-3 text-sm font-semibold text-white hover:bg-sky-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Help text */}
        <div className="mt-8 text-center space-y-2">
          <p className="text-sm text-slate-500">
            Having trouble?{" "}
            <Link href="/contact" className="text-brand-accent font-medium hover:underline">
              Contact our support team
            </Link>
          </p>
          <p className="text-xs text-slate-400">
            Verification records are logged to protect against counterfeit products.
          </p>
        </div>
      </div>
    </div>
  );
}

// Delay helper for retry logic
function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// Suspense boundary required for useSearchParams in Next.js App Router
export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="flex flex-col items-center gap-3">
            <svg className="h-8 w-8 animate-spin text-brand-accent" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <p className="text-sm text-slate-500">Loading verifier…</p>
          </div>
        </div>
      }
    >
      <VerifyPageInner />
    </Suspense>
  );
}
