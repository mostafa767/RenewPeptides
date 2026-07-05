"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Product {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
}

interface Stats {
  totalSerials: number;
  totalScans: number;
  usedSerials: number;
  generatedToday: number;
  scansToday: number;
  recentBatches: { id: string; label: string | null; count: number; created_at: string }[];
}

interface SerialRow {
  id: string;
  serial: string;
  batch_id: string | null;
  batch_label: string | null;
  is_used: boolean;
  created_at: string;
  scans_count: number;
  last_scanned_at: string | null;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number): string {
  return new Intl.NumberFormat().format(n);
}

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Components ───────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string | number;
  sub?: string;
  color: string;
}) {
  return (
    <div className={`rounded-2xl p-6 text-white bg-gradient-to-br ${color} shadow-lg`}>
      <p className="text-xs font-semibold uppercase tracking-wide opacity-75 mb-1">{label}</p>
      <p className="text-4xl font-extrabold">{typeof value === "number" ? fmt(value) : value}</p>
      {sub && <p className="text-xs opacity-60 mt-1">{sub}</p>}
    </div>
  );
}

// Searchable product dropdown for the generate form.
function ProductSelect({
  products,
  value,
  onChange,
}: {
  products: Product[];
  value: string;
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const selected = products.find((p) => p.id === value) ?? null;

  const filtered = search.trim()
    ? products.filter((p) => p.name.toLowerCase().includes(search.trim().toLowerCase()))
    : products;

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="input-field text-sm flex items-center justify-between gap-2 text-left"
      >
        <span className={selected ? "text-navy-900 truncate" : "text-slate-400"}>
          {selected ? selected.name : "Select a product…"}
        </span>
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-30 mt-1 w-full rounded-xl border border-slate-200 bg-white shadow-xl overflow-hidden">
          <div className="p-2 border-b border-slate-100">
            <input
              autoFocus
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products…"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/15"
            />
          </div>
          <div className="max-h-56 overflow-y-auto">
            {products.length === 0 ? (
              <p className="px-4 py-6 text-center text-xs text-slate-400">
                No products yet.{" "}
                <a href="/admin/products" className="text-brand-accent hover:underline font-medium">
                  Add one first.
                </a>
              </p>
            ) : filtered.length === 0 ? (
              <p className="px-4 py-6 text-center text-xs text-slate-400">No matches.</p>
            ) : (
              filtered.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => { onChange(p.id); setOpen(false); setSearch(""); }}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-slate-50 transition-colors ${
                    p.id === value ? "bg-brand-accent/5" : ""
                  }`}
                >
                  <span className="relative h-9 w-9 shrink-0 rounded-lg bg-slate-100 overflow-hidden flex items-center justify-center">
                    {p.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.image_url} alt="" className="h-full w-full object-contain p-1" />
                    ) : (
                      <span className="text-[9px] text-slate-300">—</span>
                    )}
                  </span>
                  <span className="text-sm text-navy-900 truncate">{p.name}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const router = useRouter();

  // Stats
  const [stats, setStats] = useState<Stats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Serials table
  const [serials, setSerials] = useState<SerialRow[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 50, total: 0, pages: 1 });
  const [tableLoading, setTableLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedBatch, setSelectedBatch] = useState<string>("");

  // Products (for the generate form's selector)
  const [products, setProducts] = useState<Product[]>([]);

  // Generate modal
  const [showGenerate, setShowGenerate] = useState(false);
  const [genCount, setGenCount] = useState(100);
  const [genLabel, setGenLabel] = useState("");
  const [genProductId, setGenProductId] = useState("");
  const [genLoading, setGenLoading] = useState(false);
  const [genResult, setGenResult] = useState<{ batchId: string; count: number } | null>(null);
  const [genError, setGenError] = useState("");

  // Batch download
  const [selectedSerials, setSelectedSerials] = useState<Set<string>>(new Set());
  const [batchDownloadLoading, setBatchDownloadLoading] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  // ── Data fetching ──

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (res.status === 401) { router.push("/admin/login"); return; }
      const data = await res.json();
      setStats(data);
    } catch {
      // silent
    } finally {
      setStatsLoading(false);
    }
  }, [router]);

  const fetchSerials = useCallback(
    async (page = 1) => {
      setTableLoading(true);
      try {
        const params = new URLSearchParams({ page: String(page), limit: "50" });
        if (search) params.set("search", search);
        if (selectedBatch) params.set("batchId", selectedBatch);
        const res = await fetch(`/api/admin/serials?${params}`);
        if (res.status === 401) { router.push("/admin/login"); return; }
        const data = await res.json();
        setSerials(data.data);
        setPagination(data.pagination);
      } catch {
        // silent
      } finally {
        setTableLoading(false);
      }
    },
    [search, selectedBatch, router]
  );

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/products");
      if (res.status === 401) { router.push("/admin/login"); return; }
      const data = await res.json();
      setProducts(data.data ?? []);
    } catch {
      // silent
    }
  }, [router]);

  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => { fetchSerials(1); }, [fetchSerials]);
  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // ── Actions ──

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();

    if (!genProductId) {
      setGenError("Please select a product before generating codes.");
      return;
    }

    setGenLoading(true);
    setGenError("");
    setGenResult(null);

    try {
      const res = await fetch("/api/generate-serials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count: genCount, label: genLabel, productId: genProductId }),
      });
      const data = await res.json();
      if (!res.ok) { setGenError(data.error ?? "Generation failed."); return; }
      setGenResult({ batchId: data.batchId, count: data.count });
      fetchStats();
      fetchSerials(1);
    } catch {
      setGenError("Network error.");
    } finally {
      setGenLoading(false);
    }
  }

  async function downloadIndividualQr(serial: string) {
    const res = await fetch(`/api/admin/qr/${encodeURIComponent(serial)}`);
    if (!res.ok) return;
    const blob = await res.blob();
    downloadBlob(blob, `RenewPeptides-${serial}.png`);
  }

  async function downloadBatchQr(batchIdOverride?: string) {
    setBatchDownloadLoading(true);
    try {
      const body = batchIdOverride
        ? { batchId: batchIdOverride }
        : { serials: Array.from(selectedSerials) };

      const res = await fetch("/api/admin/qr/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) return;
      const blob = await res.blob();
      downloadBlob(blob, `RenewPeptides-QR-Batch-${Date.now()}.zip`);
    } finally {
      setBatchDownloadLoading(false);
    }
  }

  function toggleSerial(serial: string) {
    setSelectedSerials((prev) => {
      const next = new Set(prev);
      if (next.has(serial)) next.delete(serial);
      else next.add(serial);
      return next;
    });
  }

  function toggleAll() {
    if (selectAll) {
      setSelectedSerials(new Set());
      setSelectAll(false);
    } else {
      setSelectedSerials(new Set(serials.map((s) => s.serial)));
      setSelectAll(true);
    }
  }

  // ── Render ──

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Admin navbar */}
      <header className="bg-navy-900 text-white shadow-xl sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-14 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-accent">
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-white" aria-hidden="true">
                <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="font-bold text-sm">RenewPeptides Admin</span>
            <span className="hidden sm:block text-slate-400 text-xs">/ Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/admin/products" className="text-xs text-slate-400 hover:text-white transition-colors">
              Products
            </a>
            <a href="/" target="_blank" rel="noopener" className="text-xs text-slate-400 hover:text-white transition-colors hidden sm:block">
              View Site ↗
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-lg bg-white/10 hover:bg-white/20 px-3 py-1.5 text-xs font-medium transition-colors"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stats */}
        <section>
          <h1 className="text-xl font-bold text-navy-900 mb-5">Overview</h1>
          {statsLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="rounded-2xl bg-slate-200 animate-pulse h-28" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <StatCard label="Total Serials" value={stats?.totalSerials ?? 0} color="from-navy-700 to-navy-600" />
              <StatCard label="Total Scans" value={stats?.totalScans ?? 0} color="from-sky-600 to-sky-500" />
              <StatCard label="Verified (Used)" value={stats?.usedSerials ?? 0} color="from-emerald-600 to-emerald-500" />
              <StatCard label="Generated Today" value={stats?.generatedToday ?? 0} color="from-violet-600 to-violet-500" />
              <StatCard label="Scans Today" value={stats?.scansToday ?? 0} color="from-amber-500 to-amber-400" />
            </div>
          )}
        </section>

        {/* Generate serials */}
        <section className="rounded-3xl bg-white shadow-card border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-navy-900">Generate Serial Numbers</h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Create a new batch of QR codes to print on products.
              </p>
            </div>
            <button
              onClick={() => { setShowGenerate(!showGenerate); setGenResult(null); setGenError(""); }}
              className="rounded-xl bg-brand-accent px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 transition-colors"
            >
              {showGenerate ? "Cancel" : "+ New Batch"}
            </button>
          </div>

          {showGenerate && (
            <form onSubmit={handleGenerate} className="mt-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Product <span className="text-red-400">*</span>
                </label>
                <ProductSelect products={products} value={genProductId} onChange={setGenProductId} />
                <p className="text-[10px] text-slate-400 mt-1">
                  The product image customers see when they scan these codes.{" "}
                  <a href="/admin/products" className="text-brand-accent hover:underline">Manage products</a>
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Number of Serials <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10000}
                    value={genCount}
                    onChange={(e) => setGenCount(Number(e.target.value))}
                    required
                    className="input-field text-sm"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Max 10,000 per batch</p>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Batch Label (optional)
                  </label>
                  <input
                    type="text"
                    value={genLabel}
                    onChange={(e) => setGenLabel(e.target.value)}
                    placeholder="e.g. Testosterone Batch #12 — April 2025"
                    maxLength={128}
                    className="input-field text-sm"
                  />
                </div>
              </div>

              {genError && (
                <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2 border border-red-100">
                  {genError}
                </p>
              )}

              {genResult && (
                <div className="rounded-xl bg-green-50 border border-green-100 p-4 flex items-start gap-3">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-green-500 shrink-0 mt-0.5" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-green-800">
                      Successfully generated {fmt(genResult.count)} serial numbers!
                    </p>
                    <p className="text-xs text-green-600 mt-0.5">
                      Batch ID: <code className="font-mono">{genResult.batchId}</code>
                    </p>
                    <button
                      type="button"
                      onClick={() => downloadBatchQr(genResult.batchId)}
                      disabled={batchDownloadLoading}
                      className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-green-600 hover:bg-green-700 px-3 py-1.5 text-xs font-semibold text-white transition-colors disabled:opacity-60"
                    >
                      {batchDownloadLoading ? (
                        <>
                          <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                          </svg>
                          Preparing ZIP…
                        </>
                      ) : (
                        <>
                          <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          Download All QR Codes (.zip)
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={genLoading || !genProductId}
                  className="rounded-xl bg-brand-accent px-5 py-2.5 text-sm font-bold text-white hover:bg-sky-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {genLoading ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Generating…
                    </>
                  ) : (
                    `Generate ${fmt(genCount)} Serials`
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Recent batches */}
          {stats?.recentBatches && stats.recentBatches.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">Recent Batches</h3>
              <div className="space-y-2">
                {stats.recentBatches.map((b) => (
                  <div key={b.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-700">
                        {b.label ?? <span className="text-slate-400">Untitled Batch</span>}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {fmt(b.count)} serials · {fmtDate(b.created_at)}
                      </p>
                    </div>
                    <button
                      onClick={() => downloadBatchQr(b.id)}
                      disabled={batchDownloadLoading}
                      className="flex items-center gap-1.5 rounded-lg bg-white border border-slate-200 hover:border-brand-accent hover:text-brand-accent px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors disabled:opacity-60"
                    >
                      <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      Download ZIP
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Serials table */}
        <section className="rounded-3xl bg-white shadow-card border border-slate-100 overflow-hidden">
          {/* Table header */}
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-navy-900">All Serial Numbers</h2>
              <p className="text-sm text-slate-500 mt-0.5">
                {fmt(pagination.total)} total · Page {pagination.page} of {pagination.pages}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <input
                type="search"
                placeholder="Search serials…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field text-sm py-2 w-full sm:w-48"
              />
              {selectedSerials.size > 0 && (
                <button
                  onClick={() => downloadBatchQr()}
                  disabled={batchDownloadLoading}
                  className="flex items-center gap-1.5 rounded-xl bg-brand-accent px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 transition-colors disabled:opacity-60"
                >
                  <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Download {selectedSerials.size} QR{selectedSerials.size !== 1 ? "s" : ""}
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="pl-5 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={toggleAll}
                      className="rounded border-slate-300 text-brand-accent"
                      aria-label="Select all"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Serial</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Batch</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Scans</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Last Scanned</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Created</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">QR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {tableLoading ? (
                  [...Array(8)].map((_, i) => (
                    <tr key={i}>
                      {[...Array(8)].map((_, j) => (
                        <td key={j} className="px-4 py-3">
                          <div className="h-4 bg-slate-100 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : serials.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-16 text-center text-slate-400 text-sm">
                      No serial numbers found.{" "}
                      <button
                        onClick={() => setShowGenerate(true)}
                        className="text-brand-accent hover:underline font-medium"
                      >
                        Generate some.
                      </button>
                    </td>
                  </tr>
                ) : (
                  serials.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                      <td className="pl-5 py-3">
                        <input
                          type="checkbox"
                          checked={selectedSerials.has(row.serial)}
                          onChange={() => toggleSerial(row.serial)}
                          className="rounded border-slate-300 text-brand-accent"
                          aria-label={`Select ${row.serial}`}
                        />
                      </td>
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-navy-800 whitespace-nowrap">
                        {row.serial}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                            row.is_used
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${row.is_used ? "bg-green-500" : "bg-slate-400"}`} />
                          {row.is_used ? "Scanned" : "Unused"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500 max-w-[120px] truncate">
                        {row.batch_label ?? <span className="text-slate-300">—</span>}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-700 font-semibold">
                        {fmt(row.scans_count)}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                        {fmtDate(row.last_scanned_at)}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                        {fmtDate(row.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => downloadIndividualQr(row.serial)}
                          title="Download QR Code"
                          className="flex items-center justify-center h-7 w-7 rounded-lg bg-slate-100 hover:bg-brand-accent hover:text-white text-slate-500 transition-colors"
                        >
                          <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="p-4 border-t border-slate-100 flex items-center justify-between">
              <p className="text-xs text-slate-500">
                Showing {Math.min((pagination.page - 1) * pagination.limit + 1, pagination.total)}–
                {Math.min(pagination.page * pagination.limit, pagination.total)} of {fmt(pagination.total)}
              </p>
              <div className="flex gap-2">
                <button
                  disabled={pagination.page <= 1 || tableLoading}
                  onClick={() => fetchSerials(pagination.page - 1)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-brand-accent hover:text-brand-accent disabled:opacity-40 transition-colors"
                >
                  ← Prev
                </button>
                <button
                  disabled={pagination.page >= pagination.pages || tableLoading}
                  onClick={() => fetchSerials(pagination.page + 1)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-brand-accent hover:text-brand-accent disabled:opacity-40 transition-colors"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
