import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { sdk } from "@/lib/medusa-client";
import { StockBadge } from "@/components/StockBadge";
import { ShopInfo } from "@/components/ShopInfo";
import {
  type MedusaProduct,
  getVariantPrice,
  getInventoryQuantity,
} from "@/types/medusa";

// Revalidate detail pages every 60s; n8n webhook busts sooner
export const revalidate = 60;

const PLACEHOLDER = "https://res.cloudinary.com/demo/image/upload/v1/samples/cloudinary-icon.png";

interface PageProps {
  params: { handle: string };
}

async function getProduct(handle: string): Promise<MedusaProduct | null> {
  try {
    const response = await (sdk.store.product as any).retrieve(handle, {
      fields: "+variants.inventory_quantity,+variants.prices,+categories,+images",
    });
    return response?.product ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await getProduct(params.handle);
  if (!product) return { title: "Medicine Not Found" };

  const variant = product.variants?.[0];
  const price = variant ? getVariantPrice(variant) : null;
  const category = product.categories?.[0]?.name ?? "Medicine";

  return {
    title: product.title,
    description: product.description
      ? product.description.slice(0, 155)
      : `Buy ${product.title} — ${category}. ${price ? `MRP ₹${price.toFixed(2)}.` : ""} Check stock availability online.`,
    openGraph: {
      images: product.thumbnail ? [{ url: product.thumbnail }] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const product = await getProduct(params.handle);

  if (!product) notFound();

  const variant = product.variants?.[0];
  const price = variant ? getVariantPrice(variant) : null;
  const quantity = getInventoryQuantity(product);
  const category = product.categories?.[0];
  const imageUrl = product.thumbnail ?? product.images?.[0]?.url ?? PLACEHOLDER;

  // Medicine-specific metadata stored in variant metadata by n8n sync
  const expiryDate = variant?.metadata?.expiry_date as string | undefined;
  const batchNo = variant?.metadata?.batch_no as string | undefined;

  const shopPhone = process.env.NEXT_PUBLIC_SHOP_PHONE ?? "+919999999999";

  return (
    <>
      {/* ── Breadcrumb ─────────────────────────────────────── */}
      <div style={{ background: "white", borderBottom: "1.5px solid var(--color-gray-200)", padding: "var(--space-4) 0" }}>
        <div className="container">
          <nav aria-label="Breadcrumb">
            <ol style={{ display: "flex", gap: "var(--space-2)", listStyle: "none", fontSize: "0.82rem", color: "var(--color-gray-500)" }}>
              <li><Link href="/" style={{ color: "var(--color-primary-600)" }}>Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/medicines" style={{ color: "var(--color-primary-600)" }}>Medicines</Link></li>
              {category && (
                <>
                  <li aria-hidden="true">/</li>
                  <li>
                    <Link href={`/medicines?category=${category.handle}`} style={{ color: "var(--color-primary-600)" }}>
                      {category.name}
                    </Link>
                  </li>
                </>
              )}
              <li aria-hidden="true">/</li>
              <li aria-current="page" style={{ color: "var(--color-gray-700)", fontWeight: 500 }}>
                {product.title}
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* ── Product Detail ──────────────────────────────────── */}
      <section className="section" aria-label={`${product.title} details`}>
        <div className="container">
          <div className="product-detail">
            {/* Left: Image */}
            <div className="product-detail__image-wrap">
              <Image
                src={imageUrl}
                alt={product.title}
                width={600}
                height={600}
                priority
                className="product-detail__image"
                style={{ objectFit: "contain" }}
              />
            </div>

            {/* Right: Info */}
            <div className="product-detail__info">
              {/* Category tag */}
              {category && (
                <Link
                  href={`/medicines?category=${category.handle}`}
                  className="product-detail__category"
                  aria-label={`Browse ${category.name}`}
                >
                  {category.name} →
                </Link>
              )}

              {/* Title */}
              <h1 className="product-detail__title">{product.title}</h1>

              {/* Price + Stock */}
              <div className="product-detail__price-block">
                {price !== null ? (
                  <div className="product-detail__price">
                    <sup>₹</sup>{price.toFixed(2)}
                  </div>
                ) : (
                  <div className="product-detail__price" style={{ color: "var(--color-gray-400)", fontSize: "1.25rem" }}>
                    Price on request
                  </div>
                )}
                <StockBadge quantity={quantity} />
              </div>

              {/* Medicine metadata */}
              <div className="product-detail__meta-grid">
                {variant?.sku && (
                  <div className="meta-item">
                    <p className="meta-item__label">SKU / Barcode</p>
                    <p className="meta-item__value">{variant.sku}</p>
                  </div>
                )}

                {batchNo && (
                  <div className="meta-item">
                    <p className="meta-item__label">Batch No.</p>
                    <p className="meta-item__value">{batchNo}</p>
                  </div>
                )}

                {expiryDate && (
                  <div className="meta-item">
                    <p className="meta-item__label">Expiry Date</p>
                    <p className="meta-item__value">{expiryDate}</p>
                  </div>
                )}

                <div className="meta-item">
                  <p className="meta-item__label">Availability</p>
                  <p className="meta-item__value">
                    {quantity > 0 ? `${quantity} units` : "Out of stock"}
                  </p>
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <div>
                  <h2 style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--color-gray-500)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "var(--space-2)" }}>
                    About this Medicine
                  </h2>
                  <p style={{ fontSize: "0.95rem", lineHeight: 1.7, color: "var(--color-gray-600)" }}>
                    {product.description}
                  </p>
                </div>
              )}

              {/* CTAs */}
              <div className="product-detail__ctas">
                <p style={{ fontSize: "0.82rem", color: "var(--color-gray-500)", fontWeight: 500 }}>
                  To order this medicine, contact us directly:
                </p>
                <div className="product-detail__cta-row">
                  <a
                    href={`tel:${shopPhone}`}
                    id="detail-call-btn"
                    className="btn btn--green"
                    aria-label={`Call to order ${product.title}`}
                  >
                    📞 Call to Order
                  </a>
                  <a
                    href={`https://wa.me/${process.env.NEXT_PUBLIC_SHOP_WHATSAPP ?? "919999999999"}?text=${encodeURIComponent(`Hi! I'm looking for *${product.title}*. Is it available?`)}`}
                    id="detail-whatsapp-btn"
                    className="btn cta-whatsapp"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`WhatsApp enquiry for ${product.title}`}
                  >
                    💬 WhatsApp
                  </a>
                </div>

                {category?.handle === "prescription" && (
                  <div style={{ background: "#fef3c7", border: "1.5px solid #fde68a", borderRadius: "var(--radius-lg)", padding: "var(--space-3) var(--space-4)", fontSize: "0.82rem", color: "#92400e" }}>
                    ⚠️ <strong>Prescription Required:</strong> This medicine requires a valid doctor's prescription. Please bring or WhatsApp a copy when ordering.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Shop Contact ────────────────────────────────────── */}
      <section className="section--sm" style={{ background: "var(--color-gray-50)", borderTop: "1.5px solid var(--color-gray-200)" }}>
        <div className="container">
          <h2 className="heading-3" style={{ marginBottom: "var(--space-6)" }}>
            Visit or contact us to order
          </h2>
          <ShopInfo medicineName={product.title} />
        </div>
      </section>
    </>
  );
}
