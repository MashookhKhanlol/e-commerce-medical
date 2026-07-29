import Medusa from "@medusajs/js-sdk";

/**
 * Shared Medusa JS SDK instance.
 *
 * Used exclusively in Server Components for read-only Store API calls.
 * No cart, session, or auth logic is used — this storefront is
 * informational only.
 *
 * Publishable API key scopes requests to the "Online Store" Sales Channel,
 * ensuring only published, publicly-available products are returned.
 */
export const sdk = new Medusa({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL!,
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
});
