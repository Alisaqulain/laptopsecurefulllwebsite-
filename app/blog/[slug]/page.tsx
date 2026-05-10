import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, ArrowLeft, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { blogPosts, getBlogPostBySlug } from "@/lib/data/blog";
import { formatDate } from "@/lib/utils";
import { siteConfig } from "@/lib/config";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return { title: "Article not found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author.name],
      url: `${siteConfig.url}/blog/${post.slug}`,
      images: [{ url: post.cover, width: 1600, height: 900, alt: post.title }],
    },
  };
}

export default async function BlogDetail({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const related = blogPosts.filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <article className="pb-24">
      {/* Hero */}
      <header className="relative pt-32 pb-12">
        <div aria-hidden className="absolute inset-0 -z-10 bg-grid opacity-30" />
        <div className="container max-w-4xl">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="mb-6 -ml-3"
          >
            <Link href="/blog">
              <ArrowLeft className="h-4 w-4" />
              Back to blog
            </Link>
          </Button>

          <Badge variant="glow" className="mb-5">
            {post.category}
          </Badge>
          <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight leading-[1.1] text-balance">
            {post.title}
          </h1>
          <p className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed">
            {post.excerpt}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-5 text-sm">
            <div className="flex items-center gap-3">
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                width={40}
                height={40}
                className="rounded-full ring-2 ring-electric-500/30"
              />
              <div>
                <div className="font-semibold">{post.author.name}</div>
                <div className="text-xs text-muted-foreground">
                  {post.author.role}
                </div>
              </div>
            </div>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {formatDate(post.date)}
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-4 w-4" />
              {post.readingTime}
            </span>
          </div>
        </div>
      </header>

      {/* Cover */}
      <div className="container max-w-5xl">
        <div className="relative aspect-[16/9] rounded-3xl overflow-hidden glass border border-white/5">
          <Image
            src={post.cover}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover"
          />
        </div>
      </div>

      {/* Content */}
      <div className="container max-w-3xl py-12">
        <div className="prose prose-invert prose-lg max-w-none text-foreground/90 leading-relaxed">
          <p className="text-base md:text-lg leading-relaxed text-foreground/85">
            {post.content}
          </p>
          <p className="text-base md:text-lg leading-relaxed text-foreground/85 mt-6">
            We're tech enthusiasts ourselves — every laptop we sell, every
            repair we make, every accessory we ship is something we'd happily
            use in our own homes. That's the LaptopSecure standard.
          </p>
          <h2 className="font-display text-2xl md:text-3xl font-bold mt-10 mb-4 tracking-tight">
            Key takeaways
          </h2>
          <ul className="space-y-2.5 text-foreground/85">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-electric-400 shrink-0" />
              Always test the device thoroughly before purchasing — battery, screen, ports, hinges.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-electric-400 shrink-0" />
              Buy from sellers who offer a real warranty and support.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-electric-400 shrink-0" />
              Original accessories and bills increase resale value significantly.
            </li>
          </ul>
        </div>

        {/* Tags */}
        <div className="mt-12 flex flex-wrap gap-2">
          {post.tags.map((t) => (
            <Badge key={t} variant="outline">
              #{t}
            </Badge>
          ))}
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="container py-12 max-w-5xl">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-8">
            Related reads
          </h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {related.map((p) => (
              <Link
                key={p.id}
                href={`/blog/${p.slug}`}
                className="group rounded-2xl glass border border-white/5 hover:border-electric-500/30 transition-all duration-500 overflow-hidden flex flex-col"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={p.cover}
                    alt={p.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-base font-bold leading-tight line-clamp-2 group-hover:text-electric-300 transition-colors">
                    {p.title}
                  </h3>
                  <span className="mt-3 text-xs text-muted-foreground">
                    {p.readingTime}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
