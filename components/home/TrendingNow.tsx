"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import { TrendingUp } from "lucide-react";
import "swiper/css";
import "swiper/css/free-mode";

import { products } from "@/lib/data/products";
import { ProductCard } from "@/components/shared/ProductCard";
import { SectionHeading } from "@/components/shared/SectionHeading";

export function TrendingNow() {
  const trending = [...products]
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, 8);

  return (
    <section className="container py-20 md:py-28">
      <SectionHeading
        align="left"
        eyebrow={
          <span className="inline-flex items-center gap-2">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
            Trending Now
          </span>
        }
        title={
          <>
            What everyone's{" "}
            <span className="gradient-text">buying this week</span>
          </>
        }
        subtitle="Top sellers based on real-time orders, reviews, and search volume."
      />

      <div className="mt-12 -mx-4 md:-mx-0">
        <Swiper
          modules={[Autoplay, FreeMode]}
          slidesPerView="auto"
          spaceBetween={20}
          freeMode
          autoplay={{ delay: 0, disableOnInteraction: false }}
          speed={6000}
          loop
          className="!px-4 md:!px-0"
          breakpoints={{
            0: { slidesPerView: 1.15 },
            640: { slidesPerView: 2.1 },
            1024: { slidesPerView: 3.2 },
            1280: { slidesPerView: 4 },
          }}
        >
          {trending.map((p, i) => (
            <SwiperSlide key={p.id} className="!h-auto">
              <ProductCard product={p} index={i} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
