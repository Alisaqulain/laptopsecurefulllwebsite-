import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { Badge } from "@/components/ui/badge";
import { blogPosts, getFeaturedBlogPosts } from "@/lib/data/blog";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "LaptopSecure Blog — Buying Guides, Repair Tips, Tech News",
  description:
    "Expert laptop buying guides, repair tips, gaming laptop comparisons, and the latest tech news. Curated by India's most trusted laptop marketplace.",
};

export default function BlogPage() {
  const featured = getFeaturedBlogPosts();
  const others = blogPosts.filter((p) => !p.featured);

  return (
    <>
      <PageHero
        eyebrow="LaptopSecure Blog"
        title={
          <>
            Tech tips, expert reviews,{" "}
            <span className="gradient-text">buying guides.</span>
          </>
        }
        subtitle="Honest, in-depth content from the team that handles thousands of devices every month."
        breadcrumbs={[{ name: "Blog" }]}
      />

      {/* Featured */}
      {featured.length > 0 && (
        <section className="container py-12">
          <div className="grid lg:grid-cols-2 gap-6">
            {featured.slice(0, 2).map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group relative overflow-hidden rounded-3xl glass border border-white/5 hover:border-electric-500/40 transition-all duration-500"
              >
                <div className="relative aspect-[16/10]">
                  <Image
                    src={post.cover}
                    alt={post.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                </div>
                <div className="absolute inset-0 flex flex-col justify-end p-7">
                  <Badge variant="glow" className="self-start mb-3">
                    {post.category}
                  </Badge>
                  <h3 className="font-display text-2xl md:text-3xl font-bold leading-tight tracking-tight mb-3 group-hover:text-electric-300 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <Image
                        src={post.author.avatar}
                        alt={post.author.name}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                      <span className="font-semibold">{post.author.name}</span>
                    </div>
                    <span className="text-muted-foreground">
                      {formatDate(post.date)}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {post.readingTime}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Grid */}
      <section className="container py-12 pb-24">
        <h2 className="font-display text-2xl md:text-3xl font-bold mb-8">
          Latest articles
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {others.map((post) => (
            <article
              key={post.id}
              className="group rounded-2xl glass border border-white/5 hover:border-electric-500/30 transition-all duration-500 overflow-hidden flex flex-col"
            >
              <Link
                href={`/blog/${post.slug}`}
                className="relative aspect-[16/10] overflow-hidden"
              >
                <Image
                  src={post.cover}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <Badge
                  variant="default"
                  className="absolute top-4 left-4 z-10"
                >
                  {post.category}
                </Badge>
              </Link>
              <div className="flex flex-1 flex-col p-6">
                <Link href={`/blog/${post.slug}`}>
                  <h3 className="font-display text-lg font-bold leading-tight tracking-tight line-clamp-2 mb-2 group-hover:text-electric-300 transition-colors">
                    {post.title}
                  </h3>
                </Link>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-5">
                  {post.excerpt}
                </p>
                <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{formatDate(post.date)}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readingTime}
                  </span>
                </div>
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-electric-300 hover:text-electric-200 transition-colors"
                >
                  Read article
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
