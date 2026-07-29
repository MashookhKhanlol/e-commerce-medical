import { getStockStatus, type StockStatus } from "@/types/medusa";

interface StockBadgeProps {
  quantity: number;
  className?: string;
}

const LABELS: Record<StockStatus, string> = {
  in:  "In Stock",
  low: "Only {qty} left",
  out: "Out of Stock",
};

/**
 * Displays a coloured pill badge indicating stock availability.
 *
 * - Green  → in stock (quantity > 5)
 * - Amber  → low stock (1–5 remaining) with pulsing dot
 * - Red    → out of stock (quantity === 0)
 */
export function StockBadge({ quantity, className = "" }: StockBadgeProps) {
  const status = getStockStatus(quantity);

  const label =
    status === "low"
      ? `Only ${quantity} left`
      : LABELS[status];

  return (
    <span
      className={`badge badge--${status} ${className}`}
      aria-label={`Stock status: ${label}`}
    >
      {label}
    </span>
  );
}
