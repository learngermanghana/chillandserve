import { SedifexGalleryItem, SedifexProduct, SedifexPromo } from "./types";

export const fallbackProducts: SedifexProduct[] = [
  {
    id: "f-1",
    storeId: "fallback-store",
    name: "Premium Drinks Catering",
    category: "Drinks Service",
    description:
      "Signature non-alcoholic and cocktail-style drinks station curated for weddings, receptions, and upscale private events.",
    price: 1800,
    itemType: "service",
    imageUrl:
      "https://images.unsplash.com/photo-1514361892635-6b07e31e75ef?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Elegant drinks table setup for a wedding reception"
  },
  {
    id: "f-2",
    storeId: "fallback-store",
    name: "Chilling Equipment Setup",
    category: "Chilling Service",
    description:
      "Professional chilling stations, ice support, and beverage temperature management for all-day events.",
    price: 1300,
    itemType: "service",
    imageUrl:
      "https://images.unsplash.com/photo-1551024709-8f23befc6cf7?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Chilled beverages ready for guests at a premium event"
  },
  {
    id: "f-3",
    storeId: "fallback-store",
    name: "Cocktail Service Experience",
    category: "Cocktail Service",
    description:
      "Stylish cocktail setup and mixologist-led service that adds elegance and energy to birthdays and private parties.",
    price: 2200,
    itemType: "service",
    imageUrl:
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Luxury cocktail glasses prepared for a special event"
  },
  {
    id: "f-4",
    storeId: "fallback-store",
    name: "Professional Waiters Team",
    category: "Event Staffing",
    description:
      "Polished and courteous waiters trained for weddings, receptions, and executive events in Accra and beyond.",
    price: 950,
    itemType: "service",
    imageUrl:
      "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Professional waiter serving guests during a premium event"
  },
  {
    id: "f-5",
    storeId: "fallback-store",
    name: "Event Beverage Setup",
    category: "Event Planning Support",
    description:
      "End-to-end beverage station planning including layout, logistics, and guest flow optimization.",
    price: 1600,
    itemType: "service",
    imageUrl:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Beautiful wedding beverage corner with flowers and drinks"
  },
  {
    id: "f-6",
    storeId: "fallback-store",
    name: "Wedding Reception Signature Service",
    category: "Wedding Reception",
    description:
      "A complete premium beverage and guest support package designed for unforgettable wedding receptions.",
    price: 2800,
    itemType: "service",
    imageUrl:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Elegant wedding reception party with premium service atmosphere"
  }
];

export const fallbackPromo: SedifexPromo = {
  promoTitle: "Elevate Your Event with Premium Drinks & Service",
  promoSummary:
    "Book Chill and Serve Ghana for weddings, birthdays, receptions, and private celebrations. Enjoy polished service, chilled perfection, and memorable guest experiences.",
  promoStartDate: "2026-01-01",
  promoEndDate: "2026-12-31",
  promoSlug: "premium-event-service",
  promoYoutubeChannelId: "UCYP5OOSH4IzNUgyqmRNrw7Q",
  displayName: "Chill and Serve Ghana"
};

export const fallbackGallery: SedifexGalleryItem[] = [
  {
    url: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=80",
    alt: "Guests enjoying stylish drinks service at a wedding event in Ghana",
    caption: "Wedding celebration drinks service",
    sortOrder: 1,
    isPublished: true
  },
  {
    url: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1400&q=80",
    alt: "Premium party beverage station with elegant setup",
    caption: "Curated beverage station",
    sortOrder: 2,
    isPublished: true
  },
  {
    url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
    alt: "Reception event with polished drinks and waiter support",
    caption: "Reception guest service",
    sortOrder: 3,
    isPublished: true
  },
  {
    url: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1200&q=80",
    alt: "Elegant private party setting with premium event atmosphere",
    caption: "Private party atmosphere",
    sortOrder: 4,
    isPublished: true
  }
];
