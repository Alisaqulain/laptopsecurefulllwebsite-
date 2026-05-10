export const siteConfig = {
  name: "LaptopSecure",
  tagline: "Buy • Sell • Upgrade • Repair",
  description:
    "India's premium marketplace for second-hand, refurbished, and new laptops, gaming PCs, accessories, and expert repair services. Trade-in, upgrade, and shop with confidence.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://laptopsecure.com",
  ogImage: "/og-image.jpg",
  whatsappNumber:
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "91XXXXXXXXXX",
  contact: {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@laptopsecure.com",
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "+91XXXXXXXXXX",
    address: "Tech Hub, Sector 18, Cyber City, Gurugram, India",
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
    { name: "Gaming Laptops", href: "/shop?category=gaming" },
    { name: "Business Laptops", href: "/shop?category=business" },
    { name: "Student Laptops", href: "/shop?category=student" },
    { name: "Refurbished", href: "/shop?category=refurbished" },
    { name: "Accessories", href: "/accessories" },
  ],
  services: [
    { name: "Laptop Repair", href: "/repair" },
    { name: "Sell Your Laptop", href: "/sell" },
    { name: "Custom PC Build", href: "/custom-pc" },
    { name: "PC Upgrades", href: "/repair#upgrades" },
    { name: "Trade-in Program", href: "/sell" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Gallery", href: "/gallery" },
    { name: "Testimonials", href: "/testimonials" },
    { name: "Contact", href: "/contact" },
  ],
  support: [
    { name: "FAQ", href: "/faq" },
    { name: "Warranty", href: "/warranty" },
    { name: "Shipping", href: "/warranty#shipping" },
    { name: "Returns", href: "/warranty#returns" },
    { name: "Track Order", href: "/contact" },
  ],
};
