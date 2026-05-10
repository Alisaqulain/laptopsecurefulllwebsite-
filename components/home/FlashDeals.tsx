"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, EffectCoverflow } from "swiper/modules";
import { Flame, ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

import { products } from "@/lib/data/products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { buildWhatsAppLink, waMessages } from "@/lib/whatsapp";
import { calculateDiscount, formatPrice } from "@/lib/utils";

function useCountdown(targetMinutes: number) {
  const [secondsLeft, setSecondsLeft] = useState(targetMinutes * 60);
  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : targetMinutes * 60));
    }, 1000);
    return () => clearInterval(id);
  }, [targetMinutes]);

  const h = Math.floor(secondsLeft / 3600);
  const m = Math.floor((secondsLeft % 3600) / 60);
  const s = secondsLeft % 60;
  return { h, m, s };
}

export function FlashDeals() {
  const dealItems = products
    .filter((p) => p.originalPrice)
    .sort((a, b) => {
      const da = calculateDiscount(a.originalPrice!, a.price);
      const db = calculateDiscount(b.originalPrice!, b.price);
      return db - da;
    })
    .slice(0, 6);

  const { h, m, s } = useCountdown(60 * 12); // 12 h cycle

  return (
    <section className="container py-20 md:py-28">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
        <div>
          <SectionHeading
            align="left"
            eyebrow={
              <span className="inline-flex items-center gap-2">
                <Flame className="h-3.5 w-3.5 text-rose-400 animate-pulse" />
                Flash Deals
              </span>
            }
            title={
              <>
                Limited-time{" "}
                <span className="gradient-text-orange">deals</span>
              </>
            }
            subtitle="Hand-picked discounts that disappear in hours, not days."
          />
        </div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex items-center gap-2 self-start md:self-end"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mr-1">
            Ends in
          </span>
          {[
            { v: h, l: "Hrs" },
            { v: m, l: "Min" },
            { v: s, l: "Sec" },
          ].map((u, i) => (
            <div key={i} className="text-center">
              <div className="font-display text-xl md:text-2xl font-bold rounded-lg glass border border-electric-500/30 px-3 py-2 min-w-[55px] tabular-nums shadow-glow-soft">
                {u.v.toString().padStart(2, "0")}
              </div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
                {u.l}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="relative">
        <Swiper
          modules={[Autoplay, Navigation, Pagination, EffectCoverflow]}
          effect="coverflow"
          centeredSlides
          slidesPerView="auto"
          loop
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 220,
            modifier: 1.5,
            slideShadows: false,
          }}
          navigation={{
            prevEl: ".flash-prev",
            nextEl: ".flash-next",
          }}
          pagination={{ clickable: true, dynamicBullets: true }}
          className="!pb-12"
        >
          {dealItems.map((p) => {
            const disc = calculateDiscount(p.originalPrice!, p.price);
            return (
              <SwiperSlide
                key={p.id}
                style={{ width: "min(420px, 88vw)" }}
                className="!h-auto"
              >
                <article className="group rounded-3xl glass-strong border border-rose-500/20 overflow-hidden hover:border-rose-500/50 transition-all duration-500 shadow-premium">
                  <div className="relative aspect-[5/4] overflow-hidden">
                    <Image
                      src={p.thumbnail}
                      alt={p.name}
                      fill
                      sizes="420px"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-70" />
                    <Badge
                      variant="destructive"
                      className="absolute top-4 left-4"
                    >
                      <Flame className="h-3 w-3" />
                      {disc}% OFF
                    </Badge>
                    <Badge
                      variant="outline"
                      className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm"
                    >
                      {p.condition}
                    </Badge>
                  </div>
                  <div className="p-6">
                    <div className="text-xs uppercase tracking-widest text-electric-300 font-semibold">
                      {p.brand}
                    </div>
                    <h3 className="font-display text-lg md:text-xl font-bold mt-1 mb-2 line-clamp-2 leading-tight">
                      {p.name}
                    </h3>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="font-display text-2xl font-bold gradient-text-orange">
                        {formatPrice(p.price)}
                      </span>
                      <span className="text-sm text-muted-foreground line-through">
                        {formatPrice(p.originalPrice!)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/shop/${p.slug}`}>View</Link>
                      </Button>
                      <Button asChild size="sm" variant="whatsapp">
                        <a
                          href={buildWhatsAppLink(
                            waMessages.buyProduct(
                              p.name,
                              formatPrice(p.price),
                            ),
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ShoppingCart className="h-4 w-4" />
                          Grab Deal
                        </a>
                      </Button>
                    </div>
                  </div>
                </article>
              </SwiperSlide>
            );
          })}
        </Swiper>

        <button
          aria-label="Previous deal"
          className="flash-prev hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 h-12 w-12 items-center justify-center rounded-full bg-background/70 backdrop-blur-md border border-white/10 hover:border-electric-500/40 hover:bg-electric-500/10 transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          aria-label="Next deal"
          className="flash-next hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 h-12 w-12 items-center justify-center rounded-full bg-background/70 backdrop-blur-md border border-white/10 hover:border-electric-500/40 hover:bg-electric-500/10 transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}
