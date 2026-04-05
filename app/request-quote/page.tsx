import type { Metadata } from "next";
import RequestQuoteForm from "@/components/request-quote-form";

export const metadata: Metadata = {
  title: "Request a Quote | Chill and Serve Ghana",
  description:
    "Share your event needs and send a detailed quote request to Chill and Serve Ghana instantly on WhatsApp."
};

export default function RequestQuotePage() {
  return (
    <main>
      <RequestQuoteForm />
    </main>
  );
}
