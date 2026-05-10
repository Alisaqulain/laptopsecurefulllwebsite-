import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductDetail } from "./ProductDetail";
import { products, getProductBySlug, getRelatedProducts } from "@/lib/data/products";
import { siteConfig } from "@/lib/config";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      type: "website",
      url: `${siteConfig.url}/shop/${product.slug}`,
      images: [{ url: product.thumbnail, width: 1200, height: 630, alt: product.name }],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();
  const related = getRelatedProducts(product, 4);
  return <ProductDetail product={product} related={related} />;
}
