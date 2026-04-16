import type { Metadata } from "next";
import BookingForm from "@/components/booking-form";

export const metadata: Metadata = {
  title: "Booking | Chill and Serve Ghana",
  description: "Create and review website bookings synced to Sedifex Integration Bookings endpoints."
};

export default function BookingPage() {
  return (
    <main>
      <BookingForm />
    </main>
  );
}
