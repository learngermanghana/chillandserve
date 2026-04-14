# Chill and Serve Ghana Website

A production-ready, premium Next.js marketing website for **Chill and Serve Ghana**, built for elegant party and event service promotion in Ghana. It is designed for Vercel hosting and pulls dynamic content from Sedifex integration endpoints with resilient fallback content.

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Server-side data fetching with revalidation

## Environment Variables

Create a `.env.local` file in the project root:

```bash
SEDIFEX_API_BASE_URL=
SEDIFEX_STORE_ID=
SEDIFEX_INTEGRATION_API_KEY=
SEDIFEX_INTEGRATION_KEY=
NEXT_PUBLIC_SITE_URL=
```

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Run the dev server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000).

## Production Build

```bash
npm run build
npm run start
```

## Deploy to Vercel

1. Push this repository to GitHub/GitLab/Bitbucket.
2. Import the project into Vercel.
3. Set these Environment Variables in Vercel project settings:
   - `SEDIFEX_API_BASE_URL`
   - `SEDIFEX_STORE_ID`
   - `SEDIFEX_INTEGRATION_API_KEY` (preferred)
   - `SEDIFEX_INTEGRATION_KEY` (legacy fallback)
   - `SEDIFEX_CONTRACT_VERSION` (defaults to `2026-04-13`)
   - `NEXT_PUBLIC_SITE_URL`
4. Deploy.

## Sedifex Data Integration

Data is fetched server-side from:

- `GET /v1IntegrationProducts?storeId=<storeId>`
- `GET /v1IntegrationPromo?storeId=<storeId>`
- `GET /integrationGallery?storeId=<storeId>`

The app sends:

- `x-api-key: <integration_key>`
- `X-Sedifex-Contract-Version: <contract_version_header>`

Data logic is implemented in:

- `lib/sedifex.ts`

with `next: { revalidate: 60 }` for periodic freshness.

## Fallback Data Behavior

If Sedifex credentials are missing, endpoint requests fail, or payloads are incomplete:

- the homepage still renders with curated premium fallback content from `lib/fallback-data.ts`
- products are deduplicated using `id|storeId|name|price`
- gallery items are filtered by publication status and sorted by `sortOrder`

This ensures stable and reliable rendering in production environments.
