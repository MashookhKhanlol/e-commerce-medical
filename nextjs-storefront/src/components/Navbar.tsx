import Link from "next/link";

const CATEGORIES = [
  { name: "OTC", handle: "otc", icon: "💊" },
  { name: "Prescription", handle: "prescription", icon: "📋" },
  { name: "Ayurvedic", handle: "ayurvedic", icon: "🌿" },
  { name: "Wellness", handle: "wellness", icon: "✨" },
  { name: "Diagnostics", handle: "diagnostics", icon: "🩺" },
  { name: "Baby & Mother", handle: "baby-mother", icon: "👶" },
  { name: "Personal Care", handle: "personal-care", icon: "🧴" },
];

const shopName = process.env.NEXT_PUBLIC_SHOP_NAME ?? "MedStore";
const shopPhone = process.env.NEXT_PUBLIC_SHOP_PHONE ?? "+919999999999";
const shopAddress = process.env.NEXT_PUBLIC_SHOP_ADDRESS ?? "Main Street, Your City";
const shopHours = process.env.NEXT_PUBLIC_SHOP_HOURS ?? "Mon–Sat: 9am–9pm";

export function Navbar() {
  return (
    <header className="navbar" role="banner">
      <div className="container">
        <div className="navbar__inner">
          {/* Logo */}
          <Link href="/" className="navbar__logo" aria-label={`${shopName} Home`}>
            <div className="navbar__logo-icon" aria-hidden="true">⚕️</div>
            <span>{shopName}</span>
          </Link>

          {/* Navigation */}
          <nav className="navbar__nav" aria-label="Primary navigation">
            <Link href="/" className="navbar__link">Home</Link>
            <Link href="/medicines" className="navbar__link">Medicines</Link>
            {CATEGORIES.slice(0, 3).map((cat) => (
              <Link
                key={cat.handle}
                href={`/medicines?category=${cat.handle}`}
                className="navbar__link"
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <a
            href={`tel:${shopPhone}`}
            className="navbar__cta"
            id="navbar-call-cta"
            aria-label={`Call ${shopName}`}
          >
            📞 Call Us
          </a>
        </div>
      </div>
    </header>
  );
}
