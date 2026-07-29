/**
 * Lightweight Medusa Store API types.
 * These mirror the shapes returned by @medusajs/js-sdk v2 Store API.
 * Only fields we actually use in the storefront are typed here.
 */

export interface MedusaImage {
  id: string;
  url: string;
}

export interface MedusaProductCategory {
  id: string;
  name: string;
  handle: string;
  description?: string;
}

export interface MedusaMoneyAmount {
  id: string;
  amount: number;
  currency_code: string;
}

export interface MedusaProductVariant {
  id: string;
  title: string;
  sku: string | null;
  inventory_quantity: number;
  prices: MedusaMoneyAmount[];
  metadata?: {
    expiry_date?: string;
    batch_no?: string;
    [key: string]: unknown;
  };
}

export interface MedusaProduct {
  id: string;
  title: string;
  handle: string;
  description: string | null;
  status: "published" | "draft";
  thumbnail: string | null;
  images: MedusaImage[];
  variants: MedusaProductVariant[];
  categories: MedusaProductCategory[];
  metadata?: {
    [key: string]: unknown;
  };
  created_at: string;
  updated_at: string;
}

export interface MedusaProductListResponse {
  products: MedusaProduct[];
  count: number;
  offset: number;
  limit: number;
}

export interface MedusaProductResponse {
  product: MedusaProduct;
}

// ─── Helpers ─────────────────────────────────────────────────────

/**
 * Returns the cheapest/first MRP for a variant in INR (paise → rupees).
 */
export function getVariantPrice(variant: MedusaProductVariant): number | null {
  const inr = variant.prices.find((p) => p.currency_code === "inr");
  if (!inr) return null;
  return inr.amount / 100; // Medusa stores amounts in paise
}

/**
 * Returns the total available inventory across all location levels
 * for the first variant (single-variant medicine products).
 */
export function getInventoryQuantity(product: MedusaProduct): number {
  if (!product.variants.length) return 0;
  return product.variants[0].inventory_quantity ?? 0;
}

/**
 * Stock status derived from quantity.
 * "in"   → green badge
 * "low"  → amber badge (≤5 remaining)
 * "out"  → red badge
 */
export type StockStatus = "in" | "low" | "out";

export function getStockStatus(quantity: number): StockStatus {
  if (quantity === 0) return "out";
  if (quantity <= 5) return "low";
  return "in";
}
