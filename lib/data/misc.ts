import type { Brand, GalleryImage } from "@/types";

export const brands: Brand[] = [
  { name: "Apple", logo: "Apple" },
  { name: "ASUS", logo: "Cpu" },
  { name: "Dell", logo: "Monitor" },
  { name: "HP", logo: "Printer" },
  { name: "Lenovo", logo: "Laptop" },
  { name: "MSI", logo: "Gamepad2" },
  { name: "Acer", logo: "Zap" },
  { name: "Razer", logo: "Skull" },
  { name: "Alienware", logo: "Bot" },
  { name: "Microsoft", logo: "Square" },
  { name: "LG", logo: "Tv" },
  { name: "Samsung", logo: "Smartphone" },
];

export const stats = [
  {
    label: "Happy Customers",
    value: 25000,
    suffix: "+",
    icon: "Users",
  },
  {
    label: "Laptops Sold",
    value: 18500,
    suffix: "+",
    icon: "Laptop",
  },
  {
    label: "Repairs Completed",
    value: 32000,
    suffix: "+",
    icon: "Wrench",
  },
  {
    label: "Cities Served",
    value: 120,
    suffix: "+",
    icon: "MapPin",
  },
];

export const whyChooseUs = [
  {
    title: "Genuine Products Only",
    description:
      "Every device — new or refurbished — is sourced from verified suppliers and undergoes a 50+ point inspection.",
    icon: "BadgeCheck",
  },
  {
    title: "Best Price Guarantee",
    description:
      "Find a lower price elsewhere on the same product? We'll beat it. No questions, no fine print.",
    icon: "TrendingDown",
  },
  {
    title: "12-Month Warranty",
    description:
      "Industry-leading warranty on every laptop, accessory, and repair we sell. Pan-India coverage.",
    icon: "ShieldCheck",
  },
  {
    title: "Free Doorstep Service",
    description:
      "Free pickup, repair, and delivery across major Indian cities. Insured and tracked, always.",
    icon: "Truck",
  },
  {
    title: "Expert Technicians",
    description:
      "Apple-certified, Lenovo-certified, and chip-level experts. 200+ years of combined experience.",
    icon: "Wrench",
  },
  {
    title: "Trade-In Welcome",
    description:
      "Got an old laptop? Trade it in for instant credit and upgrade to your dream device today.",
    icon: "RefreshCcw",
  },
];

export const galleryImages: GalleryImage[] = [
  {
    id: "g-001",
    src: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=1200&q=80",
    alt: "Gaming laptop showcase",
    category: "products",
  },
  {
    id: "g-002",
    src: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=80",
    alt: "MacBook display",
    category: "products",
  },
  {
    id: "g-003",
    src: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&q=80",
    alt: "Gaming setup with RGB lighting",
    category: "store",
  },
  {
    id: "g-004",
    src: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=1200&q=80",
    alt: "Laptop being repaired",
    category: "repair",
  },
  {
    id: "g-005",
    src: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=1200&q=80",
    alt: "Custom PC build with RGB",
    category: "products",
  },
  {
    id: "g-006",
    src: "https://images.unsplash.com/photo-1547355253-ff0740f6e8c1?w=1200&q=80",
    alt: "Streaming setup",
    category: "store",
  },
  {
    id: "g-007",
    src: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=1200&q=80",
    alt: "Engineer working on laptop motherboard",
    category: "repair",
  },
  {
    id: "g-008",
    src: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=1200&q=80",
    alt: "ROG laptop on display",
    category: "products",
  },
  {
    id: "g-009",
    src: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=1200&q=80",
    alt: "MacBook Air on desk",
    category: "products",
  },
  {
    id: "g-010",
    src: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=1200&q=80",
    alt: "Premium gaming laptop",
    category: "store",
  },
  {
    id: "g-011",
    src: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=1200&q=80",
    alt: "RGB Custom PC",
    category: "products",
  },
  {
    id: "g-012",
    src: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&q=80",
    alt: "Office setup",
    category: "team",
  },
];

export const teamMembers = [
  {
    id: "tm-001",
    name: "Rohit Khanna",
    role: "Founder & CEO",
    avatar:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80",
    bio: "20+ years in consumer electronics. Built LaptopSecure to bring trust to India's used laptop market.",
  },
  {
    id: "tm-002",
    name: "Aditya Verma",
    role: "Head of Engineering",
    avatar:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&q=80",
    bio: "Apple-certified board-level engineer. Repaired 8,000+ laptops over the past decade.",
  },
  {
    id: "tm-003",
    name: "Priya Mehta",
    role: "Quality Lead",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
    bio: "Ensures every device that leaves our facility passes our 50-point checklist.",
  },
  {
    id: "tm-004",
    name: "Karthik Rao",
    role: "Custom PC Architect",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80",
    bio: "Built custom rigs for streamers, esports teams, and AI engineers across India.",
  },
];

export const officeHours = [
  { day: "Monday", time: "10:00 AM - 9:00 PM" },
  { day: "Tuesday", time: "10:00 AM - 9:00 PM" },
  { day: "Wednesday", time: "10:00 AM - 9:00 PM" },
  { day: "Thursday", time: "10:00 AM - 9:00 PM" },
  { day: "Friday", time: "10:00 AM - 9:00 PM" },
  { day: "Saturday", time: "11:00 AM - 8:00 PM" },
  { day: "Sunday", time: "Closed" },
];
