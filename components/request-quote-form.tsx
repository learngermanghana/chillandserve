"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { PHONE_DISPLAY } from "@/lib/constants";

const WHATSAPP_NUMBER = "233240649883";

const inputClass =
  "w-full rounded-xl border border-charcoalBrand/20 bg-white px-4 py-2.5 text-sm text-charcoalBrand outline-none transition focus:border-emeraldBrand focus:ring-2 focus:ring-emeraldBrand/20";

export default function RequestQuoteForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [eventType, setEventType] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [details, setDetails] = useState("");

  const whatsappLink = useMemo(() => {
    const lines = [
      "Hello Chill and Serve team, I would like to request a quote.",
      `Name: ${name || "Not provided"}`,
      `Phone: ${phone || "Not provided"}`,
      `Event type: ${eventType || "Not provided"}`,
      `Event date: ${eventDate || "Not provided"}`,
      `Event location: ${eventLocation || "Not provided"}`,
      `Estimated guests: ${guestCount || "Not provided"}`,
      `Details: ${details || "Not provided"}`
    ];

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
  }, [name, phone, eventType, eventDate, eventLocation, guestCount, details]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    window.open(whatsappLink, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto max-w-3xl px-4 md:px-8">
        <div className="rounded-3xl border border-charcoalBrand/10 bg-ivoryBrand p-8 shadow-premium md:p-12">
          <h1 className="text-3xl font-semibold text-charcoalBrand md:text-4xl">Request a Quote</h1>
          <p className="mt-4 text-charcoalBrand/80">
            Tell us exactly what you need for your event and we will continue the conversation on WhatsApp.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-medium text-charcoalBrand/90">
                Full name
                <input
                  className={inputClass}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your name"
                  required
                />
              </label>

              <label className="text-sm font-medium text-charcoalBrand/90">
                Phone number
                <input
                  className={inputClass}
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="e.g. 024 000 0000"
                  required
                />
              </label>

              <label className="text-sm font-medium text-charcoalBrand/90">
                Event type
                <input
                  className={inputClass}
                  value={eventType}
                  onChange={(event) => setEventType(event.target.value)}
                  placeholder="Wedding, birthday, private party..."
                />
              </label>

              <label className="text-sm font-medium text-charcoalBrand/90">
                Event date
                <input className={inputClass} type="date" value={eventDate} onChange={(event) => setEventDate(event.target.value)} />
              </label>

              <label className="text-sm font-medium text-charcoalBrand/90">
                Event location
                <input
                  className={inputClass}
                  value={eventLocation}
                  onChange={(event) => setEventLocation(event.target.value)}
                  placeholder="Accra, Tema, Kumasi..."
                />
              </label>

              <label className="text-sm font-medium text-charcoalBrand/90">
                Estimated guests
                <input
                  className={inputClass}
                  type="number"
                  min={1}
                  value={guestCount}
                  onChange={(event) => setGuestCount(event.target.value)}
                  placeholder="Number of guests"
                />
              </label>
            </div>

            <label className="block text-sm font-medium text-charcoalBrand/90">
              What do you really need?
              <textarea
                className={`${inputClass} min-h-32 resize-y`}
                value={details}
                onChange={(event) => setDetails(event.target.value)}
                placeholder="Describe drinks quantity, waiters, chilling setup, cocktails, serving style, budget range, and any special requests."
                required
              />
            </label>

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-emeraldBrand px-5 py-3 text-sm font-semibold text-white transition hover:bg-emeraldBrand/90"
            >
              Send quote request on WhatsApp
            </button>
          </form>

          <p className="mt-4 text-sm text-charcoalBrand/70">
            Prefer direct chat? Reach us on WhatsApp/phone at <Link href="tel:+233240649883" className="font-semibold text-emeraldBrand">{PHONE_DISPLAY}</Link>.
          </p>
        </div>
      </div>
    </section>
  );
}
