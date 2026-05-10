import type { Product } from "@/types";

export const products: Product[] = [
  {
    id: "p-001",
    slug: "asus-rog-strix-g16-rtx-4070",
    name: "ASUS ROG Strix G16 (RTX 4070)",
    brand: "ASUS",
    category: "gaming",
    price: 134999,
    originalPrice: 169999,
    condition: "Brand New",
    rating: 4.9,
    reviewCount: 248,
    inStock: true,
    isFeatured: true,
    isBestseller: true,
    warranty: "2 Year International Warranty",
    shortDescription:
      "Unleash next-gen gaming with the Intel Core i9-14900HX, NVIDIA RTX 4070, and a blazing 240Hz display.",
    description:
      "Built for esports and creators alike, the ROG Strix G16 packs Intel's latest Core i9 HX-class chip with NVIDIA's RTX 4070 GPU. The 240Hz QHD panel delivers buttery-smooth visuals while ROG Intelligent Cooling keeps thermals in check during marathon sessions.",
    images: [
      "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=1200&q=80",
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=1200&q=80",
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&q=80",
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=1200&q=80",
    ],
    thumbnail:
      "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80",
    specs: {
      processor: "Intel Core i9-14900HX (24C/32T)",
      ram: "32GB DDR5-5600MHz",
      storage: "1TB Gen4 NVMe SSD",
      display: "16″ QHD+ 240Hz IPS, 100% DCI-P3",
      graphics: "NVIDIA RTX 4070 8GB GDDR6",
      os: "Windows 11 Home",
      battery: "90Whr, up to 7 hours",
      weight: "2.5 kg",
      ports: "USB-C TB4, HDMI 2.1, 3× USB-A, RJ-45",
    },
    highlights: [
      "RTX 4070 with DLSS 3.5",
      "240Hz QHD+ display",
      "Per-key RGB keyboard",
      "Liquid metal cooling",
      "Wi-Fi 6E + Bluetooth 5.3",
    ],
    inBox: [
      "ROG Strix G16 laptop",
      "240W power adapter",
      "User manual & quick start guide",
      "ROG warranty card",
    ],
    tags: ["gaming", "rtx", "240hz", "intel"],
  },
  {
    id: "p-002",
    slug: "macbook-pro-14-m3-pro-refurbished",
    name: 'MacBook Pro 14" M3 Pro (Refurbished)',
    brand: "Apple",
    category: "refurbished",
    price: 154999,
    originalPrice: 199999,
    condition: "Like New",
    rating: 4.95,
    reviewCount: 412,
    inStock: true,
    isFeatured: true,
    warranty: "12 Month LaptopSecure Warranty",
    shortDescription:
      "Apple's M3 Pro powerhouse with Liquid Retina XDR, refurbished and tested across 50+ checkpoints.",
    description:
      "Certified refurbished MacBook Pro 14\" with the M3 Pro chip — perfect for video editors, developers, and pro creators. Each unit is restored to factory condition with a new battery, OS install, and 50+ checkpoint inspection.",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=80",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=1200&q=80",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&q=80",
      "https://images.unsplash.com/photo-1515343480029-43cdfe6b6aae?w=1200&q=80",
    ],
    thumbnail:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
    specs: {
      processor: "Apple M3 Pro (12-core CPU)",
      ram: "18GB Unified Memory",
      storage: "512GB SSD",
      display: "14.2″ Liquid Retina XDR 120Hz ProMotion",
      graphics: "18-core GPU",
      os: "macOS Sonoma",
      battery: "70Whr, up to 18 hours",
      weight: "1.61 kg",
      ports: "3× TB4, HDMI, MagSafe, SDXC",
    },
    highlights: [
      "M3 Pro chip - blistering fast",
      "Liquid Retina XDR ProMotion 120Hz",
      "Up to 18 hours battery",
      "New battery installed",
      "50+ point QC inspection",
    ],
    inBox: [
      "MacBook Pro 14",
      "70W USB-C adapter",
      "USB-C to MagSafe 3 cable",
      "LaptopSecure warranty card",
    ],
    tags: ["macbook", "apple", "refurbished", "creator"],
  },
  {
    id: "p-003",
    slug: "dell-xps-15-oled",
    name: "Dell XPS 15 OLED (i7 + RTX 4060)",
    brand: "Dell",
    category: "business",
    price: 174999,
    originalPrice: 219999,
    condition: "Brand New",
    rating: 4.8,
    reviewCount: 189,
    inStock: true,
    isFeatured: true,
    isNew: true,
    warranty: "1 Year Onsite Dell Warranty",
    shortDescription:
      "Premium creator-class laptop with stunning OLED display and CNC-machined aluminum chassis.",
    description:
      "The Dell XPS 15 combines Intel's 13th Gen i7 with NVIDIA RTX 4060 graphics inside a sleek, premium aluminum body. The OLED 3.5K touch display offers cinematic color accuracy.",
    images: [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&q=80",
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=1200&q=80",
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=1200&q=80",
    ],
    thumbnail:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80",
    specs: {
      processor: "Intel Core i7-13700H (14C/20T)",
      ram: "16GB DDR5-4800",
      storage: "1TB Gen4 NVMe SSD",
      display: "15.6″ 3.5K OLED Touch",
      graphics: "NVIDIA RTX 4060 8GB",
      os: "Windows 11 Pro",
      battery: "86Whr, up to 13 hours",
      weight: "1.92 kg",
    },
    highlights: [
      "3.5K OLED InfinityEdge",
      "CNC machined aluminum body",
      "Killer Wi-Fi 6E",
      "Eyesafe display certified",
    ],
    inBox: ["XPS 15 laptop", "130W USB-C adapter", "Quick start guide"],
    tags: ["business", "creator", "oled", "premium"],
  },
  {
    id: "p-004",
    slug: "lenovo-legion-pro-7i",
    name: "Lenovo Legion Pro 7i (RTX 4080)",
    brand: "Lenovo",
    category: "gaming",
    price: 224999,
    originalPrice: 274999,
    condition: "Brand New",
    rating: 4.85,
    reviewCount: 156,
    inStock: true,
    isFeatured: true,
    warranty: "2 Year Premium Care",
    shortDescription:
      "Beast-mode gaming with i9-13900HX, RTX 4080, and Lenovo's legendary Coldfront 5.0 cooling.",
    description:
      "Made for the apex predators of gaming. RTX 4080 + i9-13900HX deliver class-leading frame rates while the Coldfront 5.0 vapor chamber keeps temperatures civilized.",
    images: [
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=1200&q=80",
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&q=80",
      "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=1200&q=80",
    ],
    thumbnail:
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80",
    specs: {
      processor: "Intel Core i9-13900HX",
      ram: "32GB DDR5-5600",
      storage: "2TB Gen4 NVMe SSD",
      display: "16″ WQXGA 240Hz Mini-LED",
      graphics: "NVIDIA RTX 4080 12GB",
      os: "Windows 11 Home",
      battery: "99.9Whr",
      weight: "2.8 kg",
    },
    highlights: [
      "RTX 4080 175W TGP",
      "Mini-LED 240Hz display",
      "Per-key RGB Spectrum",
      "Vapor chamber cooling",
    ],
    inBox: ["Legion Pro 7i", "330W power brick", "Documentation pack"],
    tags: ["gaming", "rtx-4080", "esports"],
  },
  {
    id: "p-005",
    slug: "hp-pavilion-15-student",
    name: "HP Pavilion 15 (Ryzen 5)",
    brand: "HP",
    category: "student",
    price: 49999,
    originalPrice: 64999,
    condition: "Brand New",
    rating: 4.6,
    reviewCount: 312,
    inStock: true,
    isBestseller: true,
    warranty: "1 Year HP Warranty",
    shortDescription:
      "The perfect student laptop — Ryzen 5 7530U, 16GB RAM, and a full HD display under 50K.",
    description:
      "Affordable, light, and dependable. The HP Pavilion 15 is built for students who need real productivity without the gaming-laptop bulk.",
    images: [
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=1200&q=80",
      "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=1200&q=80",
    ],
    thumbnail:
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80",
    specs: {
      processor: "AMD Ryzen 5 7530U",
      ram: "16GB DDR4-3200",
      storage: "512GB NVMe SSD",
      display: "15.6″ FHD IPS Anti-Glare",
      graphics: "AMD Radeon Graphics",
      os: "Windows 11 Home",
      battery: "41Whr, up to 8 hours",
      weight: "1.75 kg",
    },
    highlights: [
      "Lightweight design",
      "Fast charging 50% in 30min",
      "Backlit keyboard",
      "Thin bezels",
    ],
    inBox: ["HP Pavilion 15", "65W USB-C adapter", "Manual"],
    tags: ["student", "budget", "amd"],
  },
  {
    id: "p-006",
    slug: "msi-stealth-16-studio",
    name: "MSI Stealth 16 Studio",
    brand: "MSI",
    category: "gaming",
    price: 189999,
    originalPrice: 239999,
    condition: "Brand New",
    rating: 4.75,
    reviewCount: 98,
    inStock: true,
    isNew: true,
    warranty: "2 Year MSI Warranty",
    shortDescription:
      "Ultra-thin gaming workstation with i7-13700H and RTX 4070, weighing just 2.1kg.",
    description:
      "MSI's Stealth Studio fuses gaming firepower with creator finesse. Perfect for content creators who also game.",
    images: [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&q=80",
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=1200&q=80",
    ],
    thumbnail:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80",
    specs: {
      processor: "Intel Core i7-13700H",
      ram: "32GB DDR5-5200",
      storage: "1TB Gen4 NVMe",
      display: "16″ QHD+ 240Hz IPS",
      graphics: "NVIDIA RTX 4070 8GB",
      os: "Windows 11 Home",
      battery: "99.9Whr",
      weight: "2.1 kg",
    },
    highlights: [
      "Ultra-thin chassis",
      "Cooler Boost 5",
      "MSI Center Pro",
      "SteelSeries RGB keyboard",
    ],
    inBox: ["MSI Stealth 16", "240W adapter", "MSI welcome pack"],
    tags: ["gaming", "creator", "thin", "premium"],
  },
  {
    id: "p-007",
    slug: "thinkpad-x1-carbon-gen-11",
    name: "ThinkPad X1 Carbon Gen 11",
    brand: "Lenovo",
    category: "business",
    price: 144999,
    originalPrice: 184999,
    condition: "Excellent",
    rating: 4.9,
    reviewCount: 274,
    inStock: true,
    warranty: "12 Month LaptopSecure Warranty",
    shortDescription:
      "Iconic business ultrabook — feather-light at 1.12kg with mil-spec durability and 14\" 2.8K OLED.",
    description:
      "The gold standard of business laptops. Built like a tank in carbon fiber, light enough to forget you're carrying it.",
    images: [
      "https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=1200&q=80",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&q=80",
    ],
    thumbnail:
      "https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=800&q=80",
    specs: {
      processor: "Intel Core i7-1365U vPro",
      ram: "16GB LPDDR5-6400",
      storage: "1TB Gen4 NVMe SSD",
      display: "14″ 2.8K OLED 120Hz",
      graphics: "Intel Iris Xe",
      os: "Windows 11 Pro",
      battery: "57Whr, up to 14 hours",
      weight: "1.12 kg",
    },
    highlights: [
      "MIL-STD-810H tested",
      "Feather-light carbon body",
      "ThinkShield security",
      "Dolby Vision OLED",
    ],
    inBox: ["ThinkPad X1 Carbon", "65W USB-C adapter", "Documentation"],
    tags: ["business", "thinkpad", "ultrabook", "vpro"],
  },
  {
    id: "p-008",
    slug: "macbook-air-13-m2-refurbished",
    name: 'MacBook Air 13" M2 (Refurbished)',
    brand: "Apple",
    category: "refurbished",
    price: 79999,
    originalPrice: 114999,
    condition: "Like New",
    rating: 4.85,
    reviewCount: 521,
    inStock: true,
    isBestseller: true,
    warranty: "12 Month LaptopSecure Warranty",
    shortDescription:
      "The everyday Mac. Apple M2 silicon, fanless, all-day battery, refurbished to like-new condition.",
    description:
      "Certified refurbished MacBook Air M2. Whisper quiet thanks to fanless design, runs cool, lasts all day. Each unit goes through 50-point inspection and ships with a fresh battery.",
    images: [
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=1200&q=80",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=80",
    ],
    thumbnail:
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80",
    specs: {
      processor: "Apple M2 (8-core CPU)",
      ram: "8GB Unified",
      storage: "256GB SSD",
      display: "13.6″ Liquid Retina",
      graphics: "10-core GPU",
      os: "macOS Sonoma",
      battery: "52Whr, up to 18 hours",
      weight: "1.24 kg",
    },
    highlights: [
      "Fanless silent design",
      "18-hour battery",
      "MagSafe 3 charging",
      "1080p FaceTime HD",
    ],
    inBox: ["MacBook Air 13", "30W USB-C adapter", "USB-C to MagSafe cable"],
    tags: ["macbook", "apple", "ultrabook", "refurbished"],
  },
];

export const getProductBySlug = (slug: string) =>
  products.find((p) => p.slug === slug);

export const getFeaturedProducts = () => products.filter((p) => p.isFeatured);

export const getProductsByCategory = (category: string) =>
  products.filter((p) => p.category === category);

export const getRelatedProducts = (product: Product, limit: number = 4) =>
  products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, limit);

export const getAllBrands = () =>
  Array.from(new Set(products.map((p) => p.brand))).sort();
