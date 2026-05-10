import { Hero } from "@/components/home/Hero";
import { Categories } from "@/components/home/Categories";
import { FlashDeals } from "@/components/home/FlashDeals";
import { TrendingNow } from "@/components/home/TrendingNow";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { TradeInSection } from "@/components/home/TradeInSection";
import { RepairSection } from "@/components/home/RepairSection";
import { Brands } from "@/components/home/Brands";
import { Stats } from "@/components/home/Stats";
import { CTABanner } from "@/components/home/CTABanner";
import { TestimonialsSlider } from "@/components/home/TestimonialsSlider";
import { FAQSection } from "@/components/home/FAQSection";
import { ContactStrip } from "@/components/home/ContactStrip";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Categories />
      <FlashDeals />
      <FeaturedProducts />
      <TrendingNow />
      <WhyChooseUs />
      <Stats />
      <TradeInSection />
      <RepairSection />
      <Brands />
      <CTABanner />
      <TestimonialsSlider />
      <FAQSection />
      <ContactStrip />
    </>
  );
}
