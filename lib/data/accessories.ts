import type { Accessory } from "@/types";

export const accessories: Accessory[] = [
  {
    id: "a-001",
    slug: "logitech-g502-x-plus",
    name: "Logitech G502 X Plus Wireless",
    category: "mouse",
    brand: "Logitech",
    price: 14999,
    originalPrice: 18999,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&q=80",
    description:
      "LIGHTSPEED wireless gaming mouse with HERO 25K sensor and Lightforce switches.",
    inStock: true,
  },
  {
    id: "a-002",
    slug: "razer-blackwidow-v4-pro",
    name: "Razer BlackWidow V4 Pro",
    category: "keyboard",
    brand: "Razer",
    price: 22999,
    originalPrice: 27999,
    rating: 4.85,
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80",
    description:
      "Mechanical gaming keyboard with green switches, command dial, and Chroma RGB.",
    inStock: true,
  },
  {
    id: "a-003",
    slug: "cooler-master-notepal-x3",
    name: "Cooler Master NotePal X3",
    category: "cooling-pad",
    brand: "Cooler Master",
    price: 2499,
    originalPrice: 3499,
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&q=80",
    description:
      "200mm fan with adjustable height for laptops up to 17 inches.",
    inStock: true,
  },
  {
    id: "a-004",
    slug: "anker-100w-gan-charger",
    name: "Anker 100W GaN III Charger",
    category: "charger",
    brand: "Anker",
    price: 4999,
    originalPrice: 6499,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&q=80",
    description:
      "Universal 100W USB-C charger compatible with most modern laptops.",
    inStock: true,
  },
  {
    id: "a-005",
    slug: "samsung-980-pro-2tb",
    name: "Samsung 980 PRO 2TB NVMe SSD",
    category: "ssd",
    brand: "Samsung",
    price: 14999,
    originalPrice: 21999,
    rating: 4.95,
    image:
      "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&q=80",
    description:
      "Gen4 NVMe SSD with sequential reads up to 7,000 MB/s. 5-year warranty.",
    inStock: true,
  },
  {
    id: "a-006",
    slug: "corsair-vengeance-32gb-ddr5",
    name: "Corsair Vengeance 32GB DDR5-5600",
    category: "ram",
    brand: "Corsair",
    price: 11499,
    originalPrice: 14999,
    rating: 4.85,
    image:
      "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80",
    description:
      "32GB (2×16GB) DDR5-5600 SO-DIMM kit for high-performance laptops.",
    inStock: true,
  },
  {
    id: "a-007",
    slug: "targus-citylite-pro-156",
    name: "Targus CityLite Pro 15.6\" Backpack",
    category: "bag",
    brand: "Targus",
    price: 3499,
    originalPrice: 4999,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
    description:
      "Premium business backpack with anti-theft pockets and USB pass-through.",
    inStock: true,
  },
  {
    id: "a-008",
    slug: "sony-wh-1000xm5",
    name: "Sony WH-1000XM5 Wireless",
    category: "headphones",
    brand: "Sony",
    price: 26999,
    originalPrice: 34990,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80",
    description:
      "Industry-leading noise cancellation with 30-hour battery life.",
    inStock: true,
  },
  {
    id: "a-009",
    slug: "lg-ultragear-27-1440p",
    name: 'LG UltraGear 27" 1440p 165Hz',
    category: "monitor",
    brand: "LG",
    price: 28999,
    originalPrice: 36999,
    rating: 4.75,
    image:
      "https://images.unsplash.com/photo-1547119957-637f8679db1e?w=800&q=80",
    description:
      "27-inch QHD IPS gaming monitor with 165Hz refresh rate and 1ms response.",
    inStock: true,
  },
  {
    id: "a-010",
    slug: "logitech-mx-keys-s",
    name: "Logitech MX Keys S",
    category: "keyboard",
    brand: "Logitech",
    price: 11999,
    originalPrice: 14999,
    rating: 4.85,
    image:
      "https://images.unsplash.com/photo-1561112078-7d24e04c3407?w=800&q=80",
    description:
      "Premium wireless keyboard for productivity, with smart backlighting.",
    inStock: true,
  },
  {
    id: "a-011",
    slug: "logitech-mx-master-3s",
    name: "Logitech MX Master 3S",
    category: "mouse",
    brand: "Logitech",
    price: 9999,
    originalPrice: 12995,
    rating: 4.95,
    image:
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80",
    description:
      "The ultimate productivity mouse with quiet clicks and 8K DPI tracking.",
    inStock: true,
  },
  {
    id: "a-012",
    slug: "wd-black-sn850x-1tb",
    name: "WD Black SN850X 1TB",
    category: "ssd",
    brand: "WD",
    price: 8999,
    originalPrice: 13499,
    rating: 4.85,
    image:
      "https://images.unsplash.com/photo-1601999700430-bdec1baea3a4?w=800&q=80",
    description:
      "PCIe Gen4 NVMe SSD optimized for gaming and content creation.",
    inStock: true,
  },
];

export const getAccessoryBySlug = (slug: string) =>
  accessories.find((a) => a.slug === slug);

export const getAccessoriesByCategory = (category: string) =>
  accessories.filter((a) => a.category === category);
