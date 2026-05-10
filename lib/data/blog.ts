import type { BlogPost } from "@/types";

export const blogPosts: BlogPost[] = [
  {
    id: "blog-001",
    slug: "buying-guide-second-hand-laptop-2026",
    title: "The Ultimate Buying Guide for a Second-Hand Laptop in 2026",
    excerpt:
      "From battery health to motherboard checks, here's exactly what to inspect before buying a used laptop — by experts who do it daily.",
    cover:
      "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=1600&q=80",
    author: {
      name: "Aditya Verma",
      role: "Senior Hardware Engineer",
      avatar:
        "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&q=80",
    },
    category: "Buying Guides",
    tags: ["second-hand", "buying", "guide"],
    date: "2026-04-22",
    readingTime: "8 min read",
    featured: true,
    content:
      "When buying a second-hand laptop, the difference between a smart deal and a costly mistake comes down to a few crucial checks...",
  },
  {
    id: "blog-002",
    slug: "ssd-vs-hdd-which-should-you-pick",
    title: "SSD vs HDD: Which Storage Should You Pick in 2026?",
    excerpt:
      "Speed, durability, price, lifespan — the no-fluff comparison every buyer should read before upgrading.",
    cover:
      "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=1600&q=80",
    author: {
      name: "Neha Chopra",
      role: "PC Build Specialist",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    },
    category: "Tech Tips",
    tags: ["ssd", "hdd", "storage"],
    date: "2026-04-10",
    readingTime: "6 min read",
    content:
      "If you're still running an HDD in 2026, you're leaving up to 10x speed on the table...",
  },
  {
    id: "blog-003",
    slug: "best-gaming-laptops-under-1-lakh",
    title: "Top 5 Gaming Laptops Under ₹1 Lakh — Honest 2026 Edition",
    excerpt:
      "We benchmarked over a dozen sub-1L gaming laptops. These five came out on top for real-world FPS, build, and value.",
    cover:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1600&q=80",
    author: {
      name: "Karthik Rao",
      role: "Gaming Editor",
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80",
    },
    category: "Gaming",
    tags: ["gaming", "laptops", "budget"],
    date: "2026-03-30",
    readingTime: "10 min read",
    featured: true,
    content:
      "We tested 14 gaming laptops in the under-1-Lakh segment. Here are our picks based on FPS-per-rupee...",
  },
  {
    id: "blog-004",
    slug: "refurbished-laptop-myths-debunked",
    title: "5 Myths About Refurbished Laptops — Debunked",
    excerpt:
      "“They break faster!” “Battery is dead!” We're tired of hearing it. Here's the data-driven truth about refurbished laptops.",
    cover:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1600&q=80",
    author: {
      name: "Priya Mehta",
      role: "Quality Lead",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
    },
    category: "Buying Guides",
    tags: ["refurbished", "myth", "guide"],
    date: "2026-03-18",
    readingTime: "7 min read",
    content:
      "Refurbished isn't just 'used and resold' — when done right, it's better than buying new in many cases...",
  },
  {
    id: "blog-005",
    slug: "laptop-cooling-tips",
    title: "Why Is Your Laptop Overheating? 7 Fixes That Actually Work",
    excerpt:
      "Stop watching your CPU thermal-throttle every summer. From thermal paste to fan curves, we share the real fixes.",
    cover:
      "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=1600&q=80",
    author: {
      name: "Aditya Verma",
      role: "Senior Hardware Engineer",
      avatar:
        "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&q=80",
    },
    category: "Repair Tips",
    tags: ["cooling", "repair", "thermal"],
    date: "2026-02-28",
    readingTime: "5 min read",
    content:
      "If your laptop is hotter than your morning chai, here's everything you can do about it...",
  },
  {
    id: "blog-006",
    slug: "macbook-vs-windows-for-creators",
    title: "MacBook M3 Pro vs Windows RTX Workstation — Which Is Better?",
    excerpt:
      "We pit the new MacBook Pro against a tricked-out Windows workstation in real creative workflows. The winner might surprise you.",
    cover:
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=1600&q=80",
    author: {
      name: "Rahul Bansal",
      role: "Senior Reviewer",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    },
    category: "Comparisons",
    tags: ["macbook", "windows", "creator"],
    date: "2026-02-12",
    readingTime: "12 min read",
    content:
      "Apple Silicon vs Intel + RTX: in real workflows, here's how each platform stacks up...",
  },
];

export const getBlogPostBySlug = (slug: string) =>
  blogPosts.find((p) => p.slug === slug);

export const getFeaturedBlogPosts = () =>
  blogPosts.filter((p) => p.featured);

export const blogCategories = Array.from(
  new Set(blogPosts.map((p) => p.category)),
);
