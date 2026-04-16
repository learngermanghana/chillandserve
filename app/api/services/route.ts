import { NextResponse } from "next/server";

const DEFAULT_CONTRACT_VERSION = "2026-04-13";

type IntegrationService = {
  id: string;
  name: string;
};

function getEnv() {
  return {
    baseUrl: process.env.SEDIFEX_API_BASE_URL,
    storeId: process.env.SEDIFEX_STORE_ID,
    integrationKey: process.env.SEDIFEX_INTEGRATION_API_KEY ?? process.env.SEDIFEX_INTEGRATION_KEY,
    contractVersion: process.env.SEDIFEX_CONTRACT_VERSION ?? DEFAULT_CONTRACT_VERSION
  };
}

function cleanBaseUrl(baseUrl: string): string {
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
}

function normalizeServices(value: unknown): IntegrationService[] {
  const rows = Array.isArray(value)
    ? value
    : value && typeof value === "object"
      ? ((value as { data?: unknown; items?: unknown; services?: unknown; products?: unknown; records?: unknown; rows?: unknown; result?: unknown })
          .data ??
        (value as { data?: unknown; items?: unknown; services?: unknown; products?: unknown; records?: unknown; rows?: unknown; result?: unknown })
          .items ??
        (value as { data?: unknown; items?: unknown; services?: unknown; products?: unknown; records?: unknown; rows?: unknown; result?: unknown })
          .services ??
        (value as { data?: unknown; items?: unknown; services?: unknown; products?: unknown; records?: unknown; rows?: unknown; result?: unknown })
          .products ??
        (value as { data?: unknown; items?: unknown; services?: unknown; products?: unknown; records?: unknown; rows?: unknown; result?: unknown })
          .records ??
        (value as { data?: unknown; items?: unknown; services?: unknown; products?: unknown; records?: unknown; rows?: unknown; result?: unknown })
          .rows ??
        (value as { data?: unknown; items?: unknown; services?: unknown; products?: unknown; records?: unknown; rows?: unknown; result?: unknown })
          .result)
      : [];

  if (!Array.isArray(rows)) return [];

  return rows
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const row = item as { id?: unknown; serviceId?: unknown; name?: unknown; serviceName?: unknown };
      const id = typeof row.id === "string" ? row.id : typeof row.serviceId === "string" ? row.serviceId : undefined;
      const name = typeof row.name === "string" ? row.name : typeof row.serviceName === "string" ? row.serviceName : undefined;

      if (!id || !name) return null;
      return { id, name };
    })
    .filter((service): service is IntegrationService => service !== null);
}

export async function GET() {
  const { baseUrl, storeId, integrationKey, contractVersion } = getEnv();

  if (!baseUrl || !storeId || !integrationKey) {
    return NextResponse.json({ error: "Missing Sedifex environment configuration." }, { status: 400 });
  }

  const endpoint = `${cleanBaseUrl(baseUrl)}/v1IntegrationProducts?storeId=${encodeURIComponent(storeId)}`;

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "x-api-key": integrationKey,
        "X-Sedifex-Contract-Version": contractVersion,
        Accept: "application/json"
      },
      cache: "no-store"
    });

    const requestId = response.headers.get("x-sedifex-request-id") ?? undefined;
    const data = (await response.json().catch(() => null)) as unknown;

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Failed to fetch services.",
          status: response.status,
          requestId
        },
        { status: response.status }
      );
    }

    return NextResponse.json(
      {
        services: normalizeServices(data),
        requestId
      },
      {
        headers: requestId ? { "x-sedifex-request-id": requestId } : undefined
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch services."
      },
      { status: 502 }
    );
  }
}
