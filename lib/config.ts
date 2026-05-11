export const siteConfig = {
  name: "LaptopSecure",
  tagline: "Buy • Sell • Upgrade • Repair",
  description:
    "India's premium marketplace for second-hand, refurbished, and new laptops, gaming PCs, accessories, and expert repair services. Trade-in, upgrade, and shop with confidence.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://laptopsecure.com",
  ogImage: "/logo.jpg",
  whatsappNumber:
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "91XXXXXXXXXX",
  contact: {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "laptopsecure630@gmail.com",
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "+918439270277",
    address: "77/1 Bag Janki Dass, Shamli Road, Muzaffarnagar, 251002",
    hours: "Mon - Sat: 10:00 AM - 9:00 PM",
  },
  social: {
    instagram: "https://instagram.com/laptopsecure",
    facebook: "https://facebook.com/laptopsecure",
    twitter: "https://twitter.com/laptopsecure",
    youtube: "https://youtube.com/@laptopsecure",
    linkedin: "https://linkedin.com/company/laptopsecure",
  },
  keywords: [
    "buy laptop online India",
    "second hand laptops",
    "refurbished laptops",
    "gaming laptops",
    "gaming PC builds",
    "laptop repair near me",
    "sell old laptop",
    "trade in laptop",
    "MacBook second hand",
    "LaptopSecure",
    "laptop accessories",
    "PC upgrades India",
  ],
} as const;

export const navLinks = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "Repair", href: "/repair" },
  { name: "Sell Laptop", href: "/sell" },
  { name: "Custom PC", href: "/custom-pc" },
  { name: "Accessories", href: "/accessories" },
  { name: "Blog", href: "/blog" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
] as const;

export const footerLinks = {
  shop: [
    { name: "All Laptops", href: "/shop" },
    { name: "Gaming Laptops", href: "/gaming-laptops" },
    { name: "Refurbished", href: "/refurbished" },
    { name: "Student Deals", href: "/student-deals" },
    { name: "Custom PC Builds", href: "/custom-pc" },
    { name: "Accessories", href: "/accessories" },
  ],
  services: [
    { name: "Laptop Repair", href: "/repair" },
    { name: "Sell Your Laptop", href: "/sell" },
    { name: "Trade-In Program", href: "/trade-in" },
    { name: "Corporate / Bulk", href: "/corporate" },
    { name: "PC Upgrades", href: "/repair#upgrades" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Blog", href: "/blog" },
    { name: "Gallery", href: "/gallery" },
    { name: "Testimonials", href: "/testimonials" },
    { name: "Contact", href: "/contact" },
  ],
  support: [
    { name: "FAQ", href: "/faq" },
    { name: "Warranty", href: "/warranty" },
    { name: "Wishlist", href: "/wishlist" },
    { name: "Compare", href: "/compare" },
    { name: "Track Order", href: "/contact" },
  ],
};
