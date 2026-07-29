const shopPhone = process.env.NEXT_PUBLIC_SHOP_PHONE ?? "+919999999999";
const shopWhatsApp = process.env.NEXT_PUBLIC_SHOP_WHATSAPP ?? "919999999999";
const shopAddress = process.env.NEXT_PUBLIC_SHOP_ADDRESS ?? "Main Street, Your City";
const shopHours = process.env.NEXT_PUBLIC_SHOP_HOURS ?? "Mon–Sat: 9am–9pm";
const shopName = process.env.NEXT_PUBLIC_SHOP_NAME ?? "MedStore Pharmacy";

interface ShopInfoProps {
  medicineName?: string;
}

/**
 * Contact card shown on product detail page and homepage.
 * When medicineName is provided, the WhatsApp link pre-fills
 * a message about that specific medicine.
 */
export function ShopInfo({ medicineName }: ShopInfoProps) {
  const whatsAppMessage = medicineName
    ? `Hi! I'm looking for *${medicineName}*. Is it currently available?`
    : `Hi! I'd like to enquire about medicine availability.`;

  const whatsAppUrl = `https://wa.me/${shopWhatsApp}?text=${encodeURIComponent(whatsAppMessage)}`;

  return (
    <div className="shop-card" id="shop-contact-card">
      {/* Info column */}
      <div className="shop-card__info">
        <div className="shop-card__detail">
          <div className="shop-card__icon" aria-hidden="true">📍</div>
          <div>
            <p style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--color-gray-800)", marginBottom: "2px" }}>
              {shopName}
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--color-gray-500)" }}>{shopAddress}</p>
          </div>
        </div>

        <div className="shop-card__detail">
          <div className="shop-card__icon" aria-hidden="true">🕐</div>
          <div>
            <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--color-gray-800)", marginBottom: "2px" }}>
              Store Hours
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--color-gray-500)" }}>{shopHours}</p>
          </div>
        </div>

        <div className="shop-card__detail">
          <div className="shop-card__icon" aria-hidden="true">📞</div>
          <div>
            <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--color-gray-800)", marginBottom: "2px" }}>
              Phone
            </p>
            <a
              href={`tel:${shopPhone}`}
              style={{ fontSize: "0.85rem", color: "var(--color-primary-600)", fontWeight: 500 }}
            >
              {shopPhone}
            </a>
          </div>
        </div>
      </div>

      {/* Action column */}
      <div className="shop-card__actions">
        <a
          href={`tel:${shopPhone}`}
          id="shop-info-call-btn"
          className="btn btn--green"
          style={{ textAlign: "center", justifyContent: "center" }}
          aria-label={`Call ${shopName}`}
        >
          📞 Call to Order
        </a>

        <a
          href={whatsAppUrl}
          id="shop-info-whatsapp-btn"
          className="btn cta-whatsapp"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textAlign: "center", justifyContent: "center" }}
          aria-label="Chat on WhatsApp"
        >
          💬 WhatsApp Us
        </a>

        <p style={{ fontSize: "0.72rem", color: "var(--color-gray-400)", textAlign: "center", lineHeight: 1.5 }}>
          Call or WhatsApp to place an order. We deliver locally or you can pick up from the store.
        </p>
      </div>
    </div>
  );
}
