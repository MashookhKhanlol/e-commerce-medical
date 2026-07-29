# MedStore Platform

A read-only pharmacy storefront (Next.js 14) powered by MedusaJS v2 as a commerce backend, with automated stock sync from Google Sheets via n8n.

## Stack

| Layer | Technology |
|---|---|
| Storefront | Next.js 14 (App Router, Server Components) |
| Backend | MedusaJS v2 |
| Database | PostgreSQL 16 |
| Cache / Events | Redis 7 |
| Image Storage | Cloudinary (via `@tsc_tech/medusa-plugin-cloudinary`) |
| Stock Sync | Google Sheets → n8n → Medusa Admin API |
| Deployment | Docker Compose on DigitalOcean VPS |
| Routing | Cloudflare Tunnel → `flowcrafted.me` subdomains |

## URLs

| Service | URL |
|---|---|
| Storefront | `https://medstore.flowcrafted.me` |
| Medusa API | `https://api.medstore.flowcrafted.me` |
| Medusa Admin | `https://admin.medstore.flowcrafted.me/app` |

## Project Structure

```
medstore-platform/
├── docker-compose.yml          # Production compose
├── docker-compose.dev.yml      # Dev override (hot reload, exposed ports)
├── .env.example                # Root env template
├── medusa-backend/             # MedusaJS v2 backend
│   ├── Dockerfile
│   ├── docker-entrypoint.sh   # Runs migrations then starts Medusa
│   ├── medusa-config.ts       # Cloudinary, Inventory, Stock Location modules
│   ├── package.json
│   └── .env.example
├── nextjs-storefront/          # Customer-facing read-only site
│   ├── Dockerfile
│   ├── next.config.js
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx       # Homepage
│   │   │   ├── medicines/page.tsx          # Listing with search + filters
│   │   │   ├── medicines/[handle]/page.tsx # Product detail
│   │   │   └── api/revalidate/route.ts     # ISR invalidation webhook
│   │   ├── components/        # ProductCard, StockBadge, SearchBar etc.
│   │   ├── lib/medusa-client.ts
│   │   └── types/medusa.ts
│   └── .env.local.example
├── n8n-workflows/
│   └── stock-sync.json        # Importable n8n workflow
├── cloudflared/
│   └── config.example.yml     # Ingress rules to add to existing cloudflared config
└── .github/workflows/
    └── deploy.yml             # CI/CD: build → GHCR → SSH deploy to VPS
```

## Quick Start (Development)

```bash
# 1. Clone and copy env files
cp medusa-backend/.env.example medusa-backend/.env
cp nextjs-storefront/.env.local.example nextjs-storefront/.env.local

# 2. Fill in your values in both .env files

# 3. Start dev stack (hot reload, ports exposed)
docker compose -f docker-compose.yml -f docker-compose.dev.yml up

# 4. Create your super-admin user (first time only)
docker exec -it medusa-backend npx medusa user -e admin@example.com -p yourpassword

# 5. Open Medusa Admin at http://localhost:9000/app
# 6. Open Storefront at http://localhost:3000
```

## First-Time Medusa Setup (via Admin UI)

After first boot, do these once:

1. **Stock Location** → Settings → Stock Locations → Add
2. **Sales Channel** → Settings → Sales Channels → Add ("Online Store")
3. **Publishable API Key** → Settings → Publishable API Keys → Add (link to "Online Store")
4. **Admin API Key** → Settings → API Keys → Add (for n8n sync)
5. **Region** → Settings → Regions → Add (India, INR)
6. **Categories** → Add: OTC, Prescription, Ayurvedic, Wellness, Diagnostics, Baby & Mother, Personal Care
7. **Invite Shop Owner** → Settings → Users → Invite User

## n8n Sync Setup

1. Import `n8n-workflows/stock-sync.json` into your n8n instance
2. Create credentials: Google Sheets (service account) + Medusa Admin API Key (header auth)
3. Set n8n variables: `MEDUSA_BACKEND_URL`, `STOREFRONT_URL`, `MEDUSA_STOCK_LOCATION_ID`, `MEDUSA_INDIA_REGION_ID`, `SPREADSHEET_ID`, `REVALIDATE_SECRET`
4. Replace `REPLACE_WITH_CREDENTIAL_ID` placeholders in the workflow with real credential IDs
5. Activate the workflow — runs every 15 minutes

## Google Sheet Template

| A: SKU | B: Medicine Name | C: Category | D: Quantity | E: MRP (₹) | F: Expiry Date | G: Batch No | H: Notes |
|---|---|---|---|---|---|---|---|
| MED001 | Paracetamol 500mg | OTC | 150 | 12.50 | 12/2026 | B2024-001 | |

Valid categories: `OTC`, `Prescription`, `Ayurvedic`, `Wellness`, `Diagnostics`, `Baby`, `Personal`

## CI/CD

Push to `main` → GitHub Actions builds both images → pushes to GHCR → SSH into VPS → `docker compose pull && up`.

GitHub Secrets required: `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`, `NEXT_PUBLIC_MEDUSA_BACKEND_URL`, `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`, `NEXT_PUBLIC_SHOP_NAME`, `NEXT_PUBLIC_SHOP_PHONE`, `NEXT_PUBLIC_SHOP_WHATSAPP`, `NEXT_PUBLIC_SHOP_ADDRESS`, `NEXT_PUBLIC_SHOP_HOURS`
