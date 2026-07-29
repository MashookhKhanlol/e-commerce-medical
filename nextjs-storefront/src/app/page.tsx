import type { Metadata } from "next";
import Link from "next/link";
import { sdk } from "@/lib/medusa-client";
import { ProductCard } from "@/components/ProductCard";
import { ShopInfo } from "@/components/ShopInfo";
import { type MedusaProduct } from "@/types/medusa";

// Revalidate homepage every hour; n8n revalidation webhook will bust this sooner
export const revalidate = 3600;

const shopName = process.env.NEXT_PUBLIC_SHOP_NAME ?? "MedStore Pharmacy";
const shopPhone = process.env.NEXT_PUBLIC_SHOP_PHONE ?? "+919999999999";
const shopWhatsApp = process.env.NEXT_PUBLIC_SHOP_WHATSAPP ?? "919999999999";

export const metadata: Metadata = {
  title: `${shopName} — Browse Medicines Online`,
  description: `Check real-time stock and prices at ${shopName}. Browse OTC, prescription, Ayurvedic, and wellness products.`,
};

const CATEGORIES = [
  { name: "OTC Medicines",       handle: "otc",           icon: "💊", color: "#ecfdf5" },
  { name: "Prescription",        handle: "prescription",  icon: "📋", color: "#eff6ff" },
  { name: "Ayurvedic",           handle: "ayurvedic",     icon: "🌿", color: "#f0fdf4" },
  { name: "Wellness & Vitamins", handle: "wellness",      icon: "✨", color: "#fefce8" },
  { name: "Diagnostics",         handle: "diagnostics",   icon: "🩺", color: "#fff1f2" },
  { name: "Baby & Mother",       handle: "baby-mother",   icon: "👶", color: "#fdf4ff" },
  { name: "Personal Care",       handle: "personal-care", icon: "🧴", color: "#fff7ed" },
];

async function getFeaturedProducts(): Promise<MedusaProduct[]> {
  try {
    const response = await sdk.store.product.list({
      limit: 8,
      // Only show published products on homepage
    } as any);
    return (response as any).products ?? [];
  } catch (err) {
    console.error("[Homepage] Failed to fetch products:", err);
    return [];
  }
}

export default async function HomePage() {
  const products = await getFeaturedProducts();

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="hero" aria-label="Welcome">
        <div className="container">
          <div className="hero__content">
            <div className="hero__tag">
              <span>✅</span>
              <span>Real-Time Stock Availability</span>
            </div>

            <h1 className="hero__title">
              Your Trusted<br />
              <span>Neighbourhood<br />Pharmacy</span>
            </h1>

            <p className="hero__subtitle">
              Browse our complete medicine catalogue with live stock levels and pricing. No more calling to check availability — see it all online, then order with a single WhatsApp.
            </p>

            <div className="hero__actions">
              <Link href="/medicines" className="btn btn--primary btn--lg" id="hero-browse-btn">
                Browse Medicines →
              </Link>
              <a
                href={`https://wa.me/${shopWhatsApp}`}
                className="btn btn--secondary btn--lg"
                id="hero-whatsapp-btn"
                target="_blank"
                rel="noopener noreferrer"
              >
                💬 WhatsApp Us
              </a>
            </div>

            <div className="hero__meta">
              <div className="hero__meta-item">
                <span>💊</span>
                <span>1000+ medicines in stock</span>
              </div>
              <div className="hero__meta-item">
                <span>🔄</span>
                <span>Stock updated every 15 min</span>
              </div>
              <div className="hero__meta-item">
                <span>📍</span>
                <span>Local pickup & delivery</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories ─────────────────────────────────────── */}
      <section className="section" aria-labelledby="categories-heading">
        <div className="container">
          <div className="section-header">
            <div>
              <p className="section-header__eyebrow">Shop by Category</p>
              <h2 className="heading-2" id="categories-heading">
                What are you looking for?
              </h2>
            </div>
            <Link href="/medicines" className="btn btn--ghost btn--sm" id="categories-view-all-btn">
              View All →
            </Link>
          </div>

          <div className="category-grid">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.handle}
                href={`/medicines?category=${cat.handle}`}
                className="category-card"
                id={`category-tile-${cat.handle}`}
                aria-label={`Browse ${cat.name}`}
              >
                <div
                  className="category-card__icon"
                  style={{ background: cat.color }}
                >
                  {cat.icon}
                </div>
                <span className="category-card__name">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ──────────────────────────────── */}
      {products.length > 0 && (
        <section
          className="section"
          style={{ background: "white", borderTop: "1.5px solid var(--color-gray-200)", borderBottom: "1.5px solid var(--color-gray-200)" }}
          aria-labelledby="featured-heading"
        >
          <div className="container">
            <div className="section-header">
              <div>
                <p className="section-header__eyebrow">Available Now</p>
                <h2 className="heading-2" id="featured-heading">
                  Featured Medicines
                </h2>
              </div>
              <Link href="/medicines" className="btn btn--ghost btn--sm" id="featured-view-all-btn">
                See All →
              </Link>
            </div>

            <div className="product-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Contact / Shop Info ────────────────────────────── */}
      <section className="section" aria-labelledby="contact-heading">
        <div className="container">
          <div className="section-header" style={{ marginBottom: "var(--space-6)" }}>
            <div>
              <p className="section-header__eyebrow">Visit or Contact Us</p>
              <h2 className="heading-2" id="contact-heading">
                Ready to order?
              </h2>
            </div>
          </div>
          <ShopInfo />
        </div>
      </section>

      {/* ── Trust Signals ─────────────────────────────────── */}
      <section className="section--sm" style={{ background: "var(--color-primary-800)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--space-6)", textAlign: "center" }}>
            {[
              { icon: "🔄", title: "Live Stock", desc: "Updated every 15 minutes" },
              { icon: "💯", title: "Genuine Medicines", desc: "Sourced from verified distributors" },
              { icon: "🤝", title: "Trusted Since 2010", desc: "Serving our community" },
              { icon: "🚚", title: "Local Delivery", desc: "Same-day delivery available" },
            ].map((item) => (
              <div key={item.title} style={{ color: "white" }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{item.icon}</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, marginBottom: "0.25rem" }}>{item.title}</h3>
                <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.7)" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
