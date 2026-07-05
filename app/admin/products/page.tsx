"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Product {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminProducts() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Form modal
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Delete confirmation
  const [deleting, setDeleting] = useState<Product | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products");
      if (res.status === 401) { router.push("/admin/login"); return; }
      const data = await res.json();
      setProducts(data.data ?? []);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // ── Form handling ──

  function openCreate() {
    setEditing(null);
    setName("");
    setDescription("");
    setImageFile(null);
    setImagePreview(null);
    setFormError("");
    setShowForm(true);
  }

  function openEdit(p: Product) {
    setEditing(p);
    setName(p.name);
    setDescription(p.description ?? "");
    setImageFile(null);
    setImagePreview(p.image_url);
    setFormError("");
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditing(null);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(editing?.image_url ?? null);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError("");

    try {
      const form = new FormData();
      form.set("name", name);
      form.set("description", description);
      if (imageFile) form.set("image", imageFile);

      const url = editing ? `/api/admin/products/${editing.id}` : "/api/admin/products";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, { method, body: form });

      if (res.status === 401) { router.push("/admin/login"); return; }
      const data = await res.json();
      if (!res.ok) { setFormError(data.error ?? "Save failed."); return; }

      closeForm();
      fetchProducts();
    } catch {
      setFormError("Network error.");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${deleting.id}`, { method: "DELETE" });
      if (res.status === 401) { router.push("/admin/login"); return; }
      if (res.ok) {
        setDeleting(null);
        fetchProducts();
      }
    } finally {
      setDeleteLoading(false);
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
            <span className="hidden sm:block text-slate-400 text-xs">/ Products</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/admin" className="text-xs text-slate-400 hover:text-white transition-colors">
              ← Dashboard
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-lg bg-white/10 hover:bg-white/20 px-3 py-1.5 text-xs font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-navy-900">Products</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Manage the products you generate QR codes for. The image is shown to customers when they scan a code.
            </p>
          </div>
          <button
            onClick={openCreate}
            className="rounded-xl bg-brand-accent px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 transition-colors shrink-0"
          >
            + Add Product
          </button>
        </div>

        {/* Product grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-3xl bg-slate-200 animate-pulse h-64" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-3xl bg-white shadow-card border border-slate-100 p-16 text-center">
            <p className="text-slate-400 text-sm">
              No products yet.{" "}
              <button onClick={openCreate} className="text-brand-accent hover:underline font-medium">
                Add your first product.
              </button>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => (
              <div
                key={p.id}
                className="rounded-3xl bg-white shadow-card border border-slate-100 overflow-hidden flex flex-col"
              >
                <div className="relative h-44 bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
                  {p.image_url ? (
                    <Image
                      src={p.image_url}
                      alt={p.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-contain p-4"
                    />
                  ) : (
                    <div className="text-slate-300 text-xs font-medium">No image</div>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-navy-900 text-sm">{p.name}</h3>
                  {p.description && (
                    <p className="text-xs text-slate-500 mt-1 line-clamp-3">{p.description}</p>
                  )}
                  <p className="text-[10px] text-slate-400 mt-2">Added {fmtDate(p.created_at)}</p>
                  <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => openEdit(p)}
                      className="flex-1 rounded-lg bg-slate-100 hover:bg-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleting(p)}
                      className="flex-1 rounded-lg bg-red-50 hover:bg-red-100 px-3 py-2 text-xs font-semibold text-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create / edit modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/50 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-navy-900">
                {editing ? "Edit Product" : "Add Product"}
              </h2>
              <button onClick={closeForm} className="text-slate-400 hover:text-slate-600 text-xl leading-none">
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  maxLength={200}
                  placeholder="e.g. Testosterone Enanthate 250"
                  className="input-field text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Short description shown internally."
                  className="input-field text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Product Image {!editing && <span className="text-slate-400">(recommended)</span>}
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative h-24 w-24 shrink-0 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden">
                    {imagePreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={imagePreview} alt="Preview" className="h-full w-full object-contain p-2" />
                    ) : (
                      <span className="text-[10px] text-slate-300">No image</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/gif"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-xl border border-slate-200 hover:border-brand-accent hover:text-brand-accent px-4 py-2 text-xs font-semibold text-slate-600 transition-colors"
                    >
                      {imagePreview ? "Change image" : "Upload image"}
                    </button>
                    <p className="text-[10px] text-slate-400 mt-1.5">PNG, JPEG, WEBP or GIF · max 4 MB</p>
                    {editing && (
                      <p className="text-[10px] text-slate-400 mt-0.5">Leave unchanged to keep the current image.</p>
                    )}
                  </div>
                </div>
              </div>

              {formError && (
                <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2 border border-red-100">
                  {formError}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeForm}
                  className="flex-1 rounded-xl border-2 border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-xl bg-brand-accent px-4 py-2.5 text-sm font-bold text-white hover:bg-sky-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Saving…
                    </>
                  ) : editing ? (
                    "Save Changes"
                  ) : (
                    "Create Product"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl p-6">
            <h2 className="text-lg font-bold text-navy-900">Delete “{deleting.name}”?</h2>
            <p className="text-sm text-slate-500 mt-2">
              QR codes already generated for this product will keep working, but scanning them will no longer
              show its image. This cannot be undone.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setDeleting(null)}
                className="flex-1 rounded-xl border-2 border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteLoading}
                className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 px-4 py-2.5 text-sm font-bold text-white transition-colors disabled:opacity-60"
              >
                {deleteLoading ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
