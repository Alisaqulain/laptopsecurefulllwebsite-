import type { FAQ } from "@/types";

export const faqs: FAQ[] = [
  {
    id: "f-001",
    category: "Buying",
    question: "Are your refurbished laptops reliable?",
    answer:
      "Absolutely. Each refurbished laptop undergoes a rigorous 50+ checkpoint inspection: motherboard, battery health, screen, keyboard, ports, speakers, camera, hinges, thermals — everything. We replace worn-out parts with original components and ship every unit with a 12-month LaptopSecure warranty.",
  },
  {
    id: "f-002",
    category: "Buying",
    question: "What is the difference between Brand New and Refurbished?",
    answer:
      "Brand New laptops are sealed-box, never-used units with original manufacturer warranty. Refurbished units are pre-owned laptops we've fully restored, tested, and certified — often saving you 30-50% over new prices, with our 12-month warranty included.",
  },
  {
    id: "f-003",
    category: "Buying",
    question: "Do you offer EMI / cardless EMI?",
    answer:
      "Yes! We support no-cost EMI on most credit cards, cardless EMI via ZestMoney/Bajaj Finserv, and offer a buy-now-pay-later option for select products. Just message us on WhatsApp for instant approval.",
  },
  {
    id: "f-004",
    category: "Selling",
    question: "How does the sell / trade-in process work?",
    answer:
      "1) Submit your laptop details on our Sell page or WhatsApp, 2) Receive an instant quote, 3) Free doorstep pickup is scheduled, 4) Final inspection happens in front of you, 5) Money transferred to your account in under 30 minutes. As simple as that.",
  },
  {
    id: "f-005",
    category: "Selling",
    question: "How do you decide the resale price of my laptop?",
    answer:
      "Our pricing engine considers brand, model year, processor generation, RAM, storage, condition, current market demand, and warranty status. We give the most competitive prices in India — beat-the-quote guarantee.",
  },
  {
    id: "f-006",
    category: "Repair",
    question: "Do you offer doorstep repair pickup?",
    answer:
      "Yes — across Delhi NCR, Mumbai, Bengaluru, Hyderabad, Pune, and Chennai, we offer free doorstep pickup and drop. For other cities, we offer reverse-shipping with insurance coverage.",
  },
  {
    id: "f-007",
    category: "Repair",
    question: "Do you provide warranty on repairs?",
    answer:
      "Every repair comes with a 90-day service warranty (180 days for motherboard repairs). If the same issue recurs, we re-fix it for free.",
  },
  {
    id: "f-008",
    category: "Repair",
    question: "How long does a typical repair take?",
    answer:
      "Most software fixes and battery/keyboard replacements are same-day. Screen replacements take 4-6 hours. Motherboard chip-level repair can take 2-5 days depending on parts availability.",
  },
  {
    id: "f-009",
    category: "Custom PC",
    question: "Can I customize a PC build to my needs?",
    answer:
      "100%. Pick a starter build or share your budget and use case (gaming, editing, AI/ML, etc.) and our engineers will design a custom-tailored build with the latest components, RGB lighting if you want, and benchmark results before delivery.",
  },
  {
    id: "f-010",
    category: "Custom PC",
    question: "Do you provide assembly warranty for custom PCs?",
    answer:
      "Yes. We give a 1-year LaptopSecure assembly warranty on top of individual component warranties. We also provide free re-assembly if you ever upgrade or move components.",
  },
  {
    id: "f-011",
    category: "Shipping",
    question: "Do you ship pan-India?",
    answer:
      "Yes! We ship across India via Bluedart, DTDC, and Shadowfax with full insurance. Most major cities receive within 2-4 business days. Free shipping on orders above ₹15,000.",
  },
  {
    id: "f-012",
    category: "Shipping",
    question: "Is the laptop sealed when I receive it?",
    answer:
      "All Brand New units arrive in original factory-sealed boxes. Refurbished units come in our premium LaptopSecure tamper-proof packaging with hologram seal.",
  },
  {
    id: "f-013",
    category: "Warranty",
    question: "What does the LaptopSecure warranty cover?",
    answer:
      "Our 12-month warranty covers motherboard, hardware functionality, charging issues, display, and keyboard malfunctions. It does NOT cover physical damage, liquid spills, or unauthorized repairs by third parties.",
  },
  {
    id: "f-014",
    category: "Warranty",
    question: "Can I extend the warranty?",
    answer:
      "Yes — we offer extended warranty plans for 6, 12, or 24 additional months. Pricing varies by product; just ask on WhatsApp for a quote when checking out.",
  },
  {
    id: "f-015",
    category: "General",
    question: "Do you offer GST invoices?",
    answer:
      "Of course. All our invoices are GST compliant. If you're a business buyer, share your GSTIN at checkout and we'll generate a B2B invoice automatically.",
  },
  {
    id: "f-016",
    category: "General",
    question: "Do you have a physical store?",
    answer:
      "Yes — our flagship store is in Gurugram, Cyber City. Visit, see laptops in person, get hands-on demos, and pick up your dream rig today. Address & timings are on the Contact page.",
  },
];

export const getFAQsByCategory = (category: string) =>
  faqs.filter((f) => f.category === category);

export const faqCategories = Array.from(new Set(faqs.map((f) => f.category)));
