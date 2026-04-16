"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import type { IntegrationBooking } from "@/lib/types";

const inputClass =
  "w-full rounded-xl border border-charcoalBrand/20 bg-white px-4 py-2.5 text-sm text-charcoalBrand outline-none transition focus:border-emeraldBrand focus:ring-2 focus:ring-emeraldBrand/20";

const initialForm = {
  name: "Jane Doe",
  phone: "+1-555-111-2222",
  email: "jane@example.com",
  occasion: "Birthday Party",
  service: "Event Serving Staff",
  serviceId: "",
  slotId: "",
  event_date: "2026-04-20",
  start_time: "18:00",
  venue: "East Legon, Accra",
  guest_count: 50,
  contact_method: "WhatsApp",
  deposit_amount: 300,
  payment_method: "Mobile Money",
  payment_name: "Jane Doe",
  payment_number: "0541234567",
  notes: "Please arrive 1 hour before the event starts",
  terms_accepted: true
};

export default function BookingForm() {
  const [form, setForm] = useState(initialForm);
  const [availableServices, setAvailableServices] = useState<Array<{ id: string; name: string }>>([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  const [bookings, setBookings] = useState<IntegrationBooking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [lastRequestId, setLastRequestId] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      setLoadingServices(true);

      try {
        const response = await fetch("/api/services", { method: "GET", cache: "no-store" });
        const payload = (await response.json()) as {
          services?: Array<{ id: string; name: string }>;
          error?: string;
        };

        if (!response.ok) {
          throw new Error(payload.error ?? "Failed to load services.");
        }

        const services = payload.services ?? [];
        setAvailableServices(services);

        if (services.length > 0) {
          const firstService = services[0];
          setForm((prev) => {
            if (prev.serviceId) return prev;
            return { ...prev, serviceId: firstService.id, service: firstService.name };
          });
        }
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : "Failed to load services.");
      } finally {
        setLoadingServices(false);
      }
    };

    void fetchServices();
  }, []);

  const bookingPayload = useMemo(
    () => ({
      serviceId: form.serviceId,
      slotId: form.slotId || undefined,
      customer: {
        name: form.name || undefined,
        phone: form.phone || undefined,
        email: form.email || undefined
      },
      quantity: 1,
      notes: form.notes || undefined,
      attributes: {
        occasion: form.occasion,
        service: form.service,
        event_date: form.event_date,
        start_time: form.start_time,
        venue: form.venue,
        guest_count: form.guest_count,
        contact_method: form.contact_method,
        deposit_amount: form.deposit_amount,
        payment_method: form.payment_method,
        payment_name: form.payment_name,
        payment_number: form.payment_number,
        terms_accepted: form.terms_accepted
      }
    }),
    [form]
  );

  const fetchBookings = useCallback(async () => {
    setLoadingBookings(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);
      if (serviceFilter) params.set("serviceId", serviceFilter);

      const response = await fetch(`/api/bookings?${params.toString()}`, { method: "GET", cache: "no-store" });
      const payload = (await response.json()) as {
        bookings?: IntegrationBooking[];
        error?: string;
        requestId?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to load bookings.");
      }

      setBookings(payload.bookings ?? []);
      setLastRequestId(payload.requestId ?? null);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Failed to load bookings.");
    } finally {
      setLoadingBookings(false);
    }
  }, [serviceFilter, statusFilter]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingPayload)
      });

      const payload = (await response.json()) as {
        error?: string;
        requestId?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to create booking.");
      }

      setSuccess("Booking submitted successfully.");
      setLastRequestId(payload.requestId ?? null);
      await fetchBookings();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to create booking.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto max-w-5xl space-y-8 px-4 md:px-8">
        <div className="rounded-3xl border border-charcoalBrand/10 bg-ivoryBrand p-8 shadow-premium md:p-12">
          <h1 className="text-3xl font-semibold text-charcoalBrand md:text-4xl">Booking</h1>
          <p className="mt-3 text-sm text-charcoalBrand/80">
            Create website bookings via Sedifex <code>POST /v1IntegrationBookings</code> and review them with <code>GET /v1IntegrationBookings</code>.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-medium text-charcoalBrand/90">
                Name
                <input className={inputClass} value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} />
              </label>

              <label className="text-sm font-medium text-charcoalBrand/90">
                Phone
                <input className={inputClass} value={form.phone} onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))} />
              </label>

              <label className="text-sm font-medium text-charcoalBrand/90">
                Email
                <input className={inputClass} type="email" value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} />
              </label>

              <label className="text-sm font-medium text-charcoalBrand/90">
                Service (required)
                <select
                  className={inputClass}
                  value={form.serviceId}
                  onChange={(event) => {
                    const selectedId = event.target.value;
                    const selectedService = availableServices.find((service) => service.id === selectedId);
                    setForm((prev) => ({
                      ...prev,
                      serviceId: selectedId,
                      service: selectedService?.name ?? prev.service
                    }));
                  }}
                  required
                >
                  {availableServices.length === 0 ? (
                    <option value="">{loadingServices ? "Loading services..." : "No services available"}</option>
                  ) : null}
                  {availableServices.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-sm font-medium text-charcoalBrand/90">
                Service ID (auto-selected)
                <input className={inputClass} value={form.serviceId} readOnly />
              </label>

              <label className="text-sm font-medium text-charcoalBrand/90">
                Slot ID (optional)
                <input className={inputClass} value={form.slotId} onChange={(event) => setForm((prev) => ({ ...prev, slotId: event.target.value }))} />
              </label>

              <label className="text-sm font-medium text-charcoalBrand/90">
                Occasion
                <input className={inputClass} value={form.occasion} onChange={(event) => setForm((prev) => ({ ...prev, occasion: event.target.value }))} />
              </label>

              <label className="text-sm font-medium text-charcoalBrand/90">
                Event Date
                <input className={inputClass} type="date" value={form.event_date} onChange={(event) => setForm((prev) => ({ ...prev, event_date: event.target.value }))} />
              </label>

              <label className="text-sm font-medium text-charcoalBrand/90">
                Start Time
                <input className={inputClass} type="time" value={form.start_time} onChange={(event) => setForm((prev) => ({ ...prev, start_time: event.target.value }))} />
              </label>

              <label className="text-sm font-medium text-charcoalBrand/90">
                Venue
                <input className={inputClass} value={form.venue} onChange={(event) => setForm((prev) => ({ ...prev, venue: event.target.value }))} />
              </label>

              <label className="text-sm font-medium text-charcoalBrand/90">
                Guest Count
                <input
                  className={inputClass}
                  type="number"
                  min={1}
                  value={form.guest_count}
                  onChange={(event) => setForm((prev) => ({ ...prev, guest_count: Number(event.target.value) || 1 }))}
                />
              </label>

              <label className="text-sm font-medium text-charcoalBrand/90">
                Contact Method
                <input className={inputClass} value={form.contact_method} onChange={(event) => setForm((prev) => ({ ...prev, contact_method: event.target.value }))} />
              </label>

              <label className="text-sm font-medium text-charcoalBrand/90">
                Deposit Amount
                <input
                  className={inputClass}
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.deposit_amount}
                  onChange={(event) => setForm((prev) => ({ ...prev, deposit_amount: Number(event.target.value) || 0 }))}
                />
              </label>

              <label className="text-sm font-medium text-charcoalBrand/90">
                Payment Method
                <input className={inputClass} value={form.payment_method} onChange={(event) => setForm((prev) => ({ ...prev, payment_method: event.target.value }))} />
              </label>

              <label className="text-sm font-medium text-charcoalBrand/90">
                Payment Name
                <input className={inputClass} value={form.payment_name} onChange={(event) => setForm((prev) => ({ ...prev, payment_name: event.target.value }))} />
              </label>

              <label className="text-sm font-medium text-charcoalBrand/90">
                Payment Number
                <input className={inputClass} value={form.payment_number} onChange={(event) => setForm((prev) => ({ ...prev, payment_number: event.target.value }))} />
              </label>
            </div>

            <label className="block text-sm font-medium text-charcoalBrand/90">
              Notes
              <textarea
                className={`${inputClass} min-h-28 resize-y`}
                value={form.notes}
                onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
              />
            </label>

            <label className="inline-flex items-center gap-2 text-sm text-charcoalBrand/90">
              <input
                type="checkbox"
                checked={form.terms_accepted}
                onChange={(event) => setForm((prev) => ({ ...prev, terms_accepted: event.target.checked }))}
              />
              Terms accepted
            </label>

            {error ? <p className="text-sm font-medium text-red-700">{error}</p> : null}
            {success ? <p className="text-sm font-medium text-emeraldBrand">{success}</p> : null}
            {lastRequestId ? <p className="text-xs text-charcoalBrand/70">x-sedifex-request-id: {lastRequestId}</p> : null}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-full bg-emeraldBrand px-5 py-3 text-sm font-semibold text-white transition hover:bg-emeraldBrand/90 disabled:opacity-70"
            >
              {submitting ? "Submitting..." : "Submit booking"}
            </button>
          </form>
        </div>

        <div className="rounded-3xl border border-charcoalBrand/10 bg-ivoryBrand p-8 shadow-premium md:p-12">
          <div className="flex flex-col gap-3 md:flex-row md:items-end">
            <label className="text-sm font-medium text-charcoalBrand/90">
              Status filter
              <input className={inputClass} value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} placeholder="optional" />
            </label>
            <label className="text-sm font-medium text-charcoalBrand/90">
              Service ID filter
              <input className={inputClass} value={serviceFilter} onChange={(event) => setServiceFilter(event.target.value)} placeholder="optional" />
            </label>
            <button
              type="button"
              onClick={fetchBookings}
              disabled={loadingBookings}
              className="h-11 rounded-full bg-charcoalBrand px-5 text-sm font-semibold text-white transition hover:bg-charcoalBrand/90 disabled:opacity-70"
            >
              {loadingBookings ? "Loading..." : "Load bookings"}
            </button>
          </div>

          <div className="mt-6 space-y-3">
            {bookings.length === 0 ? <p className="text-sm text-charcoalBrand/80">No bookings loaded yet.</p> : null}
            {bookings.map((booking, index) => (
              <article key={booking.id ?? `${booking.serviceId ?? "booking"}-${index}`} className="rounded-xl border border-charcoalBrand/15 bg-white p-4">
                <p className="text-sm font-semibold text-charcoalBrand">{booking.customer?.name ?? "Unnamed customer"}</p>
                <p className="text-xs text-charcoalBrand/70">Service ID: {booking.serviceId ?? "-"} · Status: {booking.status ?? "-"}</p>
                <p className="text-xs text-charcoalBrand/70">Phone: {booking.customer?.phone ?? "-"} · Email: {booking.customer?.email ?? "-"}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
