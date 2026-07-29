import type { Metadata } from "next";
import { Suspense } from "react";
import { sdk } from "@/lib/medusa-client";
import { ProductCard } from "@/components/ProductCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { SearchBar } from "@/components/SearchBar";
import { type MedusaProduct } from "@/types/medusa";

// Revalidate listing page every 60s; n8n webhook busts sooner after sync
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Browse Medicines",
  description: "Browse our complete medicine catalogue. Filter by category, search by name, and check real-time stock availability.",
};

// ── Static category definitions (handles match Medusa category handles) ──
const CATEGORIES = [
  { id: "otc",          name: "OTC Medicines",       handle: "otc" },
  { id: "prescription", name: "Prescription",         handle: "prescription" },
  { id: "ayurvedic",    name: "Ayurvedic",            handle: "ayurvedic" },
  { id: "wellness",     name: "Wellness & Vitamins",  handle: "wellness" },
  { id: "diagnostics",  name: "Diagnostics & Devices",handle: "diagnostics" },
  { id: "baby-mother",  name: "Baby & Mother Care",   handle: "baby-mother" },
  { id: "personal-care",name: "Personal Care",        handle: "personal-care" },
];

interface PageProps {
  searchParams: {
    category?: string;
    q?: string;
    instock?: string;
  };
}

async function getProducts(
  category?: string,
  query?: string
): Promise<MedusaProduct[]> {
  try {
    const params: Record<string, unknown> = {
      limit: 100,
    };

    if (query) {
      params.q = query;
    }

    // Medusa v2 Store API filter by category handle
    if (category) {
      params.category_handle = [category];
    }

    const response = await sdk.store.product.list(params as any);
    return (response as any).products ?? [];
  } catch (err) {
    console.error("[Medicines listing] Failed to fetch products:", err);
    return [];
  }
}

export default async function MedicinesPage({ searchParams }: PageProps) {
  const { category, q, instock } = searchParams;

  const products = await getProducts(category, q);

  // Optionally filter to in-stock only if ?instock=1
  const filteredProducts =
    instock === "1"
      ? products.filter((p) => {
          const qty = p.variants?.[0]?.inventory_quantity ?? 0;
          return qty > 0;
        })
      : products;

  const activeCategory = CATEGORIES.find((c) => c.handle === category);

  const pageTitle = activeCategory
    ? activeCategory.name
    : q
    ? `Results for "${q}"`
    : "All Medicines";

  return (
    <>
      {/* ── Page Header ─────────────────────────────────────── */}
      <div style={{ background: "white", borderBottom: "1.5px solid var(--color-gray-200)", padding: "var(--space-8) 0" }}>
        <div className="container">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" style={{ marginBottom: "var(--space-4)" }}>
            <ol style={{ display: "flex", gap: "var(--space-2)", listStyle: "none", fontSize: "0.82rem", color: "var(--color-gray-500)" }}>
              <li><a href="/" style={{ color: "var(--color-primary-600)" }}>Home</a></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" style={{ color: "var(--color-gray-700)", fontWeight: 500 }}>Medicines</li>
              {activeCategory && (
                <>
                  <li aria-hidden="true">/</li>
                  <li aria-current="page">{activeCategory.name}</li>
                </>
              )}
            </ol>
          </nav>

          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "var(--space-4)" }}>
            <div>
              <h1 className="heading-2">{pageTitle}</h1>
              <p style={{ color: "var(--color-gray-500)", fontSize: "0.9rem", marginTop: "var(--space-1)" }}>
                {filteredProducts.length} medicine{filteredProducts.length !== 1 ? "s" : ""} found
              </p>
            </div>

            {/* Search — client island */}
            <Suspense fallback={null}>
              <SearchBar initialQuery={q} />
            </Suspense>
          </div>

          {/* Quick filter chips */}
          <div className="filter-pills" style={{ marginTop: "var(--space-4)" }}>
            <a
              href="/medicines"
              id="filter-pill-all"
              className={`filter-pill ${!category && !instock ? "filter-pill--active" : ""}`}
            >
              All
            </a>
            <a
              href={`/medicines?${category ? `category=${category}&` : ""}instock=1`}
              id="filter-pill-instock"
              className={`filter-pill ${instock === "1" ? "filter-pill--active" : ""}`}
            >
              ✅ In Stock Only
            </a>
          </div>
        </div>
      </div>

      {/* ── Main Listing Layout ──────────────────────────────── */}
      <div className="section--sm">
        <div className="container">
          <div className="listing-layout">
            {/* Sidebar — category filters */}
            <CategoryFilter categories={CATEGORIES} activeCategory={category} />

            {/* Products grid */}
            <div>
              {filteredProducts.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state__icon">🔍</div>
                  <h2 className="empty-state__title">No medicines found</h2>
                  <p className="empty-state__text">
                    Try a different search term or browse a different category.
                  </p>
                  <a href="/medicines" className="btn btn--green" style={{ marginTop: "var(--space-6)", display: "inline-flex" }}>
                    Browse All Medicines
                  </a>
                </div>
              ) : (
                <div className="product-grid">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
