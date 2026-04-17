import { NextRequest, NextResponse } from "next/server";
import { IntegrationBooking } from "@/lib/types";

const DEFAULT_CONTRACT_VERSION = "2026-04-13";
const MAX_GET_RETRIES = 3;

type BookingRequestBody = {
  serviceId?: string;
  slotId?: string;
  slotID?: string;
  slot_id?: string;
  customer?: {
    name?: string;
    phone?: string;
    email?: string;
  };
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  serviceName?: string;
  bookingDate?: string;
  bookingTime?: string;
  branchLocationId?: string;
  branchLocationName?: string;
  eventLocation?: string;
  customerStayLocation?: string;
  paymentMethod?: string;
  paymentAmount?: number;
  preferredBranch?: string;
  depositAmount?: number;
  quantity?: number;
  notes?: string;
  attributes?: Record<string, unknown>;
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

function normalizeBookings(value: unknown): IntegrationBooking[] {
  if (Array.isArray(value)) return value as IntegrationBooking[];
  if (value && typeof value === "object") {
    const payload = value as {
      data?: unknown;
      items?: unknown;
      bookings?: unknown;
      records?: unknown;
      rows?: unknown;
      result?: unknown;
    };

    const rows = payload.data ?? payload.items ?? payload.bookings ?? payload.records ?? payload.rows ?? payload.result;
    if (Array.isArray(rows)) return rows as IntegrationBooking[];
  }
  return [];
}

function getStatusText(status: number): string {
  if (status === 400) return "Malformed request (missing-token-or-store or contract-version-mismatch).";
  if (status === 401) return "Invalid integration token. Rotate or re-issue the key and retry.";
  if (status === 404) return "Unknown store.";
  if (status === 405) return "Unsupported method.";
  return "Sedifex request failed.";
}

async function fetchWithBackoff(url: string, init: RequestInit): Promise<Response> {
  let lastError: unknown;

  for (let attempt = 0; attempt < MAX_GET_RETRIES; attempt += 1) {
    try {
      const response = await fetch(url, init);
      if (response.ok) return response;

      if (response.status < 500 || response.status === 501) {
        return response;
      }

      lastError = new Error(`GET failed with status ${response.status}`);
    } catch (error) {
      lastError = error;
    }

    if (attempt < MAX_GET_RETRIES - 1) {
      await new Promise((resolve) => setTimeout(resolve, 2 ** attempt * 250));
    }
  }

  throw lastError instanceof Error ? lastError : new Error("GET request failed after retries.");
}

export async function GET(request: NextRequest) {
  const { baseUrl, storeId, integrationKey, contractVersion } = getEnv();

  if (!baseUrl || !storeId || !integrationKey) {
    return NextResponse.json({ error: "Missing Sedifex environment configuration." }, { status: 400 });
  }

  const params = request.nextUrl.searchParams;
  const status = params.get("status");
  const serviceId = params.get("serviceId");

  const query = new URLSearchParams({ storeId });
  if (status) query.set("status", status);
  if (serviceId) query.set("serviceId", serviceId);

  const endpoint = `${cleanBaseUrl(baseUrl)}/v1IntegrationBookings?${query.toString()}`;

  try {
    const response = await fetchWithBackoff(endpoint, {
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
          error: getStatusText(response.status),
          status: response.status,
          requestId,
          raw: data
        },
        { status: response.status }
      );
    }

    return NextResponse.json(
      {
        bookings: normalizeBookings(data),
        requestId
      },
      {
        headers: requestId ? { "x-sedifex-request-id": requestId } : undefined
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch bookings."
      },
      { status: 502 }
    );
  }
}

export async function POST(request: NextRequest) {
  const { baseUrl, storeId, integrationKey, contractVersion } = getEnv();

  if (!baseUrl || !storeId || !integrationKey) {
    return NextResponse.json({ error: "Missing Sedifex environment configuration." }, { status: 400 });
  }

  const body = (await request.json().catch(() => null)) as BookingRequestBody | null;
  if (!body) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const slotId = body.slotId ?? body.slotID ?? body.slot_id;

  const hasCustomerField = Boolean(
    body.customer?.name ||
      body.customer?.phone ||
      body.customer?.email ||
      body.customerName ||
      body.customerPhone ||
      body.customerEmail
  );
  if (!hasCustomerField) {
    return NextResponse.json({ error: "At least one customer field (name, phone, or email) is required." }, { status: 400 });
  }

  const customer = {
    name: body.customer?.name ?? body.customerName,
    phone: body.customer?.phone ?? body.customerPhone,
    email: body.customer?.email ?? body.customerEmail
  };

  const endpoint = `${cleanBaseUrl(baseUrl)}/v1IntegrationBookings?storeId=${encodeURIComponent(storeId)}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "x-api-key": integrationKey,
      "X-Sedifex-Contract-Version": contractVersion,
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      serviceId: body.serviceId,
      slotId,
      customer,
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      customerEmail: body.customerEmail,
      serviceName: body.serviceName,
      bookingDate: body.bookingDate,
      bookingTime: body.bookingTime,
      branchLocationId: body.branchLocationId,
      branchLocationName: body.branchLocationName,
      eventLocation: body.eventLocation,
      customerStayLocation: body.customerStayLocation,
      paymentMethod: body.paymentMethod,
      paymentAmount: body.paymentAmount,
      preferredBranch: body.preferredBranch,
      depositAmount: body.depositAmount,
      quantity: body.quantity ?? 1,
      notes: body.notes,
      attributes: body.attributes ?? {}
    }),
    cache: "no-store"
  });

  const requestId = response.headers.get("x-sedifex-request-id") ?? undefined;
  const data = (await response.json().catch(() => null)) as unknown;

  if (requestId) {
    console.info("Sedifex booking request id", requestId);
  }

  if (!response.ok) {
    return NextResponse.json(
      {
        error: getStatusText(response.status),
        status: response.status,
        requestId,
        raw: data
      },
      { status: response.status }
    );
  }

  return NextResponse.json(
    { booking: data, requestId },
    {
      status: 201,
      headers: requestId ? { "x-sedifex-request-id": requestId } : undefined
    }
  );
}
