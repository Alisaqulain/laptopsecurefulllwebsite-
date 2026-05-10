import { siteConfig } from "./config";

/**
 * Build a WhatsApp `wa.me` link with a prefilled message.
 * Use this for every "Buy Now / Order / Get Quote / Sell / Repair" CTA
 * across the site so the customer is taken straight to chat.
 */
export function buildWhatsAppLink(message: string, phone?: string) {
  const number = (phone || siteConfig.whatsappNumber).replace(/[^\d]/g, "");
  const encoded = encodeURIComponent(message.trim());
  return `https://wa.me/${number}?text=${encoded}`;
}

export const waMessages = {
  generic: () =>
    `Hello LaptopSecure 👋\nI'd like to know more about your products and services.`,

  buyProduct: (name: string, price?: string) =>
    `Hi LaptopSecure! 🛒\n\nI'm interested in buying:\n*${name}*${
      price ? `\nPrice: ${price}` : ""
    }\n\nIs it available? Can you share more details?`,

  contactSeller: (name: string) =>
    `Hello LaptopSecure 👋\n\nI'd like to connect with the seller for:\n*${name}*\n\nPlease share more details.`,

  getQuote: (item: string) =>
    `Hi LaptopSecure! 💼\n\nCould you please send me a quote for:\n*${item}*\n\nThanks!`,

  repairRequest: (issue: string, device?: string) =>
    `Hi LaptopSecure! 🔧\n\nI need a repair service.\n${
      device ? `Device: *${device}*\n` : ""
    }Issue: *${issue}*\n\nPlease guide me with the next steps.`,

  sellLaptop: (details: {
    brand: string;
    model: string;
    processor: string;
    ram: string;
    storage: string;
    condition: string;
  }) =>
    `Hello LaptopSecure! 💻\n\nI want to sell my laptop. Here are the details:\n\n• Brand: *${details.brand}*\n• Model: *${details.model}*\n• Processor: *${details.processor}*\n• RAM: *${details.ram}*\n• Storage: *${details.storage}*\n• Condition: *${details.condition}*\n\nPlease share your best offer.`,

  customPC: (build: string, budget?: string) =>
    `Hi LaptopSecure! 🎮\n\nI want a custom PC build:\n*${build}*${
      budget ? `\nBudget: *${budget}*` : ""
    }\n\nPlease guide me with options.`,

  bookAppointment: () =>
    `Hello LaptopSecure 📅\n\nI'd like to book an appointment to visit your store.`,

  newsletter: (email: string) =>
    `Hi LaptopSecure! 📧\n\nPlease subscribe me to your newsletter.\nEmail: ${email}`,
};
