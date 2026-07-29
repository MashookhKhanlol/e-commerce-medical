import Link from "next/link";
import Image from "next/image";
import { StockBadge } from "./StockBadge";
import {
  type MedusaProduct,
  getVariantPrice,
  getInventoryQuantity,
} from "@/types/medusa";

interface ProductCardProps {
  product: MedusaProduct;
}

const PLACEHOLDER_IMAGE = "https://res.cloudinary.com/demo/image/upload/v1/samples/cloudinary-icon.png";

/**
 * Product card for the grid listing.
 * Entirely a Server Component — no client interactivity.
 * Links to the product detail page via /medicines/[handle].
 */
export function ProductCard({ product }: ProductCardProps) {
  const variant = product.variants[0];
  const price = variant ? getVariantPrice(variant) : null;
  const quantity = getInventoryQuantity(product);
  const category = product.categories?.[0];
  const imageUrl = product.thumbnail ?? product.images?.[0]?.url ?? PLACEHOLDER_IMAGE;

  return (
    <Link
      href={`/medicines/${product.handle}`}
      className="product-card animate-in"
      id={`product-card-${product.id}`}
      aria-label={`View ${product.title}`}
    >
      {/* Image */}
      <div className="product-card__image-wrap">
        <Image
          src={imageUrl}
          alt={product.title}
          fill
          sizes="(max-width: 480px) 50vw, (max-width: 768px) 33vw, 240px"
          className="product-card__image"
          style={{ objectFit: "contain", padding: "1rem" }}
        />
        {/* Stock badge overlaid on image */}
        <div className="product-card__badge">
          <StockBadge quantity={quantity} />
        </div>
      </div>

      {/* Info */}
      <div className="product-card__body">
        {category && (
          <span className="product-card__category">{category.name}</span>
        )}

        <h3 className="product-card__name">{product.title}</h3>

        {price !== null ? (
          <div className="product-card__price">
            ₹{price.toFixed(2)}
            <span className="product-card__price-label">MRP</span>
          </div>
        ) : (
          <div className="product-card__price" style={{ color: "var(--color-gray-400)" }}>
            Price on request
          </div>
        )}
      </div>
    </Link>
  );
}
