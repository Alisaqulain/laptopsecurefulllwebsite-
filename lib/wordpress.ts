/**
 * Headless WordPress integration.
 *
 * The site ships with rich dummy data (see lib/data/*) so the entire UI
 * works out of the box. Once you connect WordPress, these helpers fetch
 * dynamic content from your CMS and gracefully fall back to dummy data
 * when WP is unavailable.
 *
 * Required env vars:
 *   NEXT_PUBLIC_WP_API_URL=https://cms.example.com/wp-json/wp/v2
 * Optional:
 *   NEXT_PUBLIC_WP_GRAPHQL_URL=https://cms.example.com/graphql
 *
 * Example WordPress setup:
 *   - Install "WPGraphQL" plugin (recommended) or use REST API
 *   - Custom Post Types: `product`, `accessory`, `pc_build`, `repair_service`
 *   - Use ACF (Advanced Custom Fields) for product specs
 */

import { products as dummyProducts } from "./data/products";
import { blogPosts as dummyPosts } from "./data/blog";
import { accessories as dummyAccessories } from "./data/accessories";
import type { BlogPost, Product, Accessory } from "@/types";

const WP_API = process.env.NEXT_PUBLIC_WP_API_URL;
const REVALIDATE_SECONDS = 600;

interface WPResponse<T> {
  data?: T;
  error?: string;
}

async function wpFetch<T>(
  endpoint: string,
  init?: RequestInit,
): Promise<WPResponse<T>> {
  if (!WP_API) {
    return { error: "WordPress not configured — using dummy data." };
  }
  try {
    const res = await fetch(`${WP_API}${endpoint}`, {
      ...init,
      next: { revalidate: REVALIDATE_SECONDS },
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers || {}),
      },
    });
    if (!res.ok) {
      return { error: `WP fetch failed: ${res.status}` };
    }
    return { data: (await res.json()) as T };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Unknown WP error",
    };
  }
}

/**
 * Map a WordPress product post (custom post type) into our Product type.
 * Adjust ACF field names to match your WordPress setup.
 */
function mapWPProduct(wp: any): Product {
  return {
    id: String(wp.id),
    slug: wp.slug,
    name: wp.title?.rendered ?? wp.acf?.name ?? "Untitled",
    brand: wp.acf?.brand ?? "Unknown",
    category: wp.acf?.category ?? "new",
    price: Number(wp.acf?.price ?? 0),
    originalPrice: wp.acf?.original_price
      ? Number(wp.acf.original_price)
      : undefined,
    condition: wp.acf?.condition ?? "Brand New",
    rating: Number(wp.acf?.rating ?? 5),
    reviewCount: Number(wp.acf?.review_count ?? 0),
    inStock: Boolean(wp.acf?.in_stock ?? true),
    isFeatured: Boolean(wp.acf?.is_featured),
    isNew: Boolean(wp.acf?.is_new),
    isBestseller: Boolean(wp.acf?.is_bestseller),
    warranty: wp.acf?.warranty ?? "12 Month Warranty",
    shortDescription:
      wp.excerpt?.rendered?.replace(/<[^>]+>/g, "") ??
      wp.acf?.short_description ??
      "",
    description:
      wp.content?.rendered?.replace(/<[^>]+>/g, "") ?? wp.acf?.description ?? "",
    images: wp.acf?.images ?? [],
    thumbnail: wp.acf?.thumbnail ?? wp._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? "",
    specs: {
      processor: wp.acf?.processor ?? "",
      ram: wp.acf?.ram ?? "",
      storage: wp.acf?.storage ?? "",
      display: wp.acf?.display ?? "",
      graphics: wp.acf?.graphics ?? "",
      os: wp.acf?.os ?? "",
      battery: wp.acf?.battery ?? "",
      weight: wp.acf?.weight ?? "",
      ports: wp.acf?.ports,
    },
    highlights: wp.acf?.highlights ?? [],
    inBox: wp.acf?.in_box ?? [],
    tags: wp.acf?.tags ?? [],
  };
}

function mapWPBlog(wp: any): BlogPost {
  return {
    id: String(wp.id),
    slug: wp.slug,
    title: wp.title?.rendered ?? "",
    excerpt: wp.excerpt?.rendered?.replace(/<[^>]+>/g, "") ?? "",
    content: wp.content?.rendered ?? "",
    cover: wp._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? "",
    author: {
      name: wp._embedded?.author?.[0]?.name ?? "Editor",
      role: "Editor",
      avatar:
        wp._embedded?.author?.[0]?.avatar_urls?.["96"] ??
        "https://via.placeholder.com/96",
    },
    category: wp._embedded?.["wp:term"]?.[0]?.[0]?.name ?? "General",
    tags:
      wp._embedded?.["wp:term"]?.[1]?.map((t: { name: string }) => t.name) ??
      [],
    date: wp.date,
    readingTime: `${Math.max(1, Math.round((wp.content?.rendered?.length ?? 0) / 1500))} min read`,
    featured: Boolean(wp.sticky),
  };
}

export async function getProducts(): Promise<Product[]> {
  const { data } = await wpFetch<unknown[]>("/product?_embed&per_page=24");
  if (Array.isArray(data) && data.length) return data.map(mapWPProduct);
  return dummyProducts;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data } = await wpFetch<unknown[]>(
    `/product?slug=${slug}&_embed`,
  );
  if (Array.isArray(data) && data.length) return mapWPProduct(data[0]);
  return dummyProducts.find((p) => p.slug === slug) ?? null;
}

export async function getAccessories(): Promise<Accessory[]> {
  const { data } = await wpFetch<unknown[]>("/accessory?_embed&per_page=24");
  if (Array.isArray(data) && data.length) {
    return data.map((a: any) => ({
      id: String(a.id),
      slug: a.slug,
      name: a.title?.rendered ?? "",
      category: a.acf?.category ?? "other",
      brand: a.acf?.brand ?? "",
      price: Number(a.acf?.price ?? 0),
      originalPrice: a.acf?.original_price,
      rating: Number(a.acf?.rating ?? 5),
      image: a._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? "",
      description: a.acf?.description ?? "",
      inStock: Boolean(a.acf?.in_stock ?? true),
    }));
  }
  return dummyAccessories;
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const { data } = await wpFetch<unknown[]>("/posts?_embed&per_page=12");
  if (Array.isArray(data) && data.length) return data.map(mapWPBlog);
  return dummyPosts;
}

export async function getBlogPostBySlug(
  slug: string,
): Promise<BlogPost | null> {
  const { data } = await wpFetch<unknown[]>(`/posts?slug=${slug}&_embed`);
  if (Array.isArray(data) && data.length) return mapWPBlog(data[0]);
  return dummyPosts.find((p) => p.slug === slug) ?? null;
}
