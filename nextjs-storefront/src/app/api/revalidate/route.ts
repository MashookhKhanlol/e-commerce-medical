import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/revalidate
 *
 * Called by n8n as the final step of every Google Sheets → Medusa sync.
 * Busts ISR cache for all storefront pages so new stock data is visible
 * within seconds of a sync completing — no full rebuild needed.
 *
 * Auth: header x-revalidate-secret must match env REVALIDATE_SECRET.
 *
 * n8n HTTP Request node config:
 *   Method:  POST
 *   URL:     https://medstore.flowcrafted.me/api/revalidate
 *   Headers: x-revalidate-secret → {{ $vars.REVALIDATE_SECRET }}
 */
export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-revalidate-secret");

  if (!process.env.REVALIDATE_SECRET) {
    console.error("[Revalidate] REVALIDATE_SECRET env var is not set");
    return NextResponse.json(
      { error: "Server misconfiguration" },
      { status: 500 }
    );
  }

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json(
      { error: "Unauthorized — invalid secret" },
      { status: 401 }
    );
  }

  try {
    // Revalidate all storefront paths that depend on product/inventory data
    revalidatePath("/", "layout");          // Homepage + layout
    revalidatePath("/medicines");           // Listing page
    revalidatePath("/medicines/[handle]", "page"); // All detail pages

    console.log(`[Revalidate] Cache busted at ${new Date().toISOString()}`);

    return NextResponse.json({
      revalidated: true,
      timestamp: new Date().toISOString(),
      paths: ["/", "/medicines", "/medicines/[handle]"],
    });
  } catch (err) {
    console.error("[Revalidate] Failed:", err);
    return NextResponse.json(
      { error: "Revalidation failed", detail: String(err) },
      { status: 500 }
    );
  }
}

// Only POST is allowed on this route
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST." },
    { status: 405 }
  );
}
