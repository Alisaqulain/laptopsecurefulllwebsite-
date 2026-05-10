import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/shared/PageHero";
import { Star, BadgeCheck, Quote, Play } from "lucide-react";
import { testimonials } from "@/lib/data/testimonials";

export const metadata: Metadata = {
  title: "Customer Testimonials & Reviews",
  description:
    "25,000+ verified customer reviews. Real stories from real LaptopSecure customers across India.",
};

export default function TestimonialsPage() {
  const videos = testimonials.filter((t) => t.videoThumb);
  const text = testimonials.filter((t) => !t.videoThumb);

  return (
    <>
      <PageHero
        eyebrow="Reviews & Stories"
        title={
          <>
            Loved by{" "}
            <span className="gradient-text">25,000+ customers</span>
          </>
        }
        subtitle="Don't take our word for it — read and watch what our customers are saying."
        breadcrumbs={[{ name: "Testimonials" }]}
      />

      {/* Video reviews */}
      {videos.length > 0 && (
        <section className="container py-12">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-8 tracking-tight">
            Video <span className="gradient-text">stories</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {videos.map((v) => (
              <div
                key={v.id}
                className="group relative aspect-video rounded-2xl overflow-hidden glass border border-white/5 hover:border-electric-500/30 transition-all duration-500 cursor-pointer"
              >
                <Image
                  src={v.videoThumb!}
                  alt={`${v.name} review`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-electric-500/90 shadow-glow-blue group-hover:scale-110 transition-transform">
                    <Play className="h-7 w-7 text-white fill-white ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="font-display font-bold text-white">
                    {v.name}
                  </div>
                  <div className="text-xs text-white/80">{v.role}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Written reviews */}
      <section className="container pb-24">
        <h2 className="font-display text-2xl md:text-3xl font-bold mt-12 mb-8 tracking-tight">
          What customers <span className="gradient-text">are saying</span>
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...text, ...videos].map((t, i) => (
            <article
              key={t.id}
              className="group relative rounded-2xl glass border border-white/5 hover:border-electric-500/30 p-7 transition-all duration-500 hover:shadow-glow-soft"
            >
              <Quote className="absolute top-5 right-5 h-7 w-7 text-electric-500/20 group-hover:text-electric-500/40 transition-colors" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    className={`h-4 w-4 ${
                      idx < Math.round(t.rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
              <p className="text-foreground/90 leading-relaxed text-sm md:text-base">
                "{t.comment}"
              </p>

              {t.product && (
                <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-electric-500/10 border border-electric-500/30 px-3 py-1 text-xs text-electric-300">
                  Bought: {t.product}
                </div>
              )}

              <div className="mt-6 pt-5 border-t border-white/5 flex items-center gap-3">
                <div className="relative h-11 w-11 rounded-full overflow-hidden border-2 border-electric-500/30 shrink-0">
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm truncate">{t.name}</span>
                    {t.verified && (
                      <BadgeCheck className="h-4 w-4 text-electric-400 shrink-0" />
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {t.role} · {t.city}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
