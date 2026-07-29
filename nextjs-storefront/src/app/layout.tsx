import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const shopName = process.env.NEXT_PUBLIC_SHOP_NAME ?? "MedStore Pharmacy";

export const metadata: Metadata = {
  title: {
    default: shopName,
    template: `%s | ${shopName}`,
  },
  description: `Browse medicines and check real-time stock availability at ${shopName}. View prices, categories, and availability online.`,
  keywords: ["pharmacy", "medicine", "medical store", "online medicine availability"],
  openGraph: {
    type: "website",
    siteName: shopName,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
