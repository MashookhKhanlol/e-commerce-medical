import Link from "next/link";

const shopName = process.env.NEXT_PUBLIC_SHOP_NAME ?? "MedStore Pharmacy";
const shopPhone = process.env.NEXT_PUBLIC_SHOP_PHONE ?? "+919999999999";
const shopAddress = process.env.NEXT_PUBLIC_SHOP_ADDRESS ?? "Main Street, Your City";
const shopHours = process.env.NEXT_PUBLIC_SHOP_HOURS ?? "Mon–Sat: 9am–9pm";

const CATEGORIES = [
  { name: "OTC Medicines", handle: "otc" },
  { name: "Prescription", handle: "prescription" },
  { name: "Ayurvedic", handle: "ayurvedic" },
  { name: "Wellness & Vitamins", handle: "wellness" },
  { name: "Diagnostics & Devices", handle: "diagnostics" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer__grid">
          {/* Brand Column */}
          <div>
            <div className="footer__brand-name">⚕️ {shopName}</div>
            <p className="footer__brand-text">
              Your trusted neighbourhood pharmacy. Browse our complete medicine catalogue and check real-time stock availability online.
            </p>
            <div style={{ marginTop: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <p style={{ fontSize: "0.82rem" }}>📍 {shopAddress}</p>
              <p style={{ fontSize: "0.82rem" }}>🕐 {shopHours}</p>
              <a href={`tel:${shopPhone}`} style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.8)" }}>
                📞 {shopPhone}
              </a>
            </div>
          </div>

          {/* Categories Column */}
          <div>
            <h3 className="footer__col-title">Categories</h3>
            <nav className="footer__links" aria-label="Product categories">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.handle}
                  href={`/medicines?category=${cat.handle}`}
                  className="footer__link"
                >
                  {cat.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="footer__col-title">Quick Links</h3>
            <nav className="footer__links" aria-label="Quick links">
              <Link href="/" className="footer__link">Home</Link>
              <Link href="/medicines" className="footer__link">All Medicines</Link>
              <a href={`tel:${shopPhone}`} className="footer__link">Call Shop</a>
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer__bottom">
          <p>© {year} {shopName}. All rights reserved.</p>
          <p className="footer__disclaimer">
            Prescription medicines are sold only against a valid prescription. Stock availability shown is indicative and may vary.
          </p>
        </div>
      </div>
    </footer>
  );
}
