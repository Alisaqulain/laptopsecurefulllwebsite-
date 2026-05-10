"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Cpu,
  HardDrive,
  MemoryStick,
  CircuitBoard,
  Plug,
  Boxes,
  Snowflake,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { pcBuilds } from "@/lib/data/pc-builds";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { buildWhatsAppLink, waMessages } from "@/lib/whatsapp";
import { calculateDiscount, formatPrice } from "@/lib/utils";

// Lucide doesn't have GraphicsCard so use Cpu
const ComponentIcon = ({ type }: { type: string }) => {
  const icons: Record<string, any> = {
    cpu: Cpu,
    gpu: Sparkles,
    ram: MemoryStick,
    storage: HardDrive,
    motherboard: CircuitBoard,
    psu: Plug,
    case: Boxes,
    cooler: Snowflake,
  };
  const Icon = icons[type] || Cpu;
  return <Icon className="h-4 w-4 text-electric-300" />;
};

export function PCBuildShowcase() {
  return (
    <section id="builds" className="container py-16 md:py-24">
      <SectionHeading
        eyebrow="Featured Builds"
        title={
          <>
            Choose your{" "}
            <span className="gradient-text">dream rig</span>
          </>
        }
        subtitle="Five pre-configured builds — or message us for a 100% custom config tailored to your budget and use-case."
      />

      <div className="mt-14 space-y-8">
        {pcBuilds.map((build, i) => {
          const discount =
            build.originalPrice &&
            calculateDiscount(build.originalPrice, build.price);
          const isEven = i % 2 === 0;

          return (
            <motion.article
              key={build.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="group relative overflow-hidden rounded-3xl glass border border-white/5 hover:border-electric-500/30 transition-all duration-500"
            >
              <div className="grid lg:grid-cols-2 gap-0">
                {/* Image */}
                <div
                  className={`relative aspect-[4/3] lg:aspect-auto ${
                    isEven ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  <Image
                    src={build.image}
                    alt={build.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-background via-background/30 to-transparent" />

                  {/* Badges over image */}
                  <div className="absolute top-5 left-5 flex flex-col gap-2">
                    <Badge variant="glow" className="text-sm">
                      {build.category.toUpperCase()}
                    </Badge>
                    {!!discount && discount > 0 && (
                      <Badge variant="success">Save {discount}%</Badge>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div
                  className={`p-7 md:p-10 ${
                    isEven ? "lg:order-2" : "lg:order-1"
                  }`}
                >
                  <h3 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-2">
                    {build.name}
                  </h3>
                  <p className="text-base text-muted-foreground mb-6">
                    {build.tagline}
                  </p>

                  {/* Components */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                    {Object.entries(build.components).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-start gap-2.5 text-xs"
                      >
                        <ComponentIcon type={key} />
                        <div className="min-w-0">
                          <div className="uppercase tracking-widest text-[10px] text-muted-foreground">
                            {key}
                          </div>
                          <div className="font-medium text-foreground truncate">
                            {value}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Performance bars */}
                  <div className="space-y-2.5 mb-6">
                    {build.performance.map((p) => (
                      <div key={p.label}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">{p.label}</span>
                          <span className="font-bold text-electric-300">
                            {p.score}/100
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${p.score}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            className="h-full rounded-full bg-gradient-to-r from-electric-500 to-neon-500 shadow-[0_0_10px_rgba(0,120,255,0.5)]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 mb-5">
                    <span className="font-display text-3xl font-bold gradient-text">
                      {formatPrice(build.price)}
                    </span>
                    {build.originalPrice && (
                      <span className="text-base text-muted-foreground line-through">
                        {formatPrice(build.originalPrice)}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button asChild size="lg" variant="whatsapp">
                      <a
                        href={buildWhatsAppLink(
                          waMessages.customPC(
                            build.name,
                            formatPrice(build.price),
                          ),
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Order Build
                        <ArrowRight className="h-5 w-5" />
                      </a>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                      <a
                        href={buildWhatsAppLink(
                          waMessages.customPC(`Customize: ${build.name}`),
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Customize
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>

      {/* CTA */}
      <div className="mt-16 rounded-3xl glass-strong border border-electric-500/20 p-10 md:p-14 text-center relative overflow-hidden">
        <motion.div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(0,120,255,0.15), transparent 70%)",
          }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <h3 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
          Want a <span className="gradient-text">100% custom</span> build?
        </h3>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
          Share your budget and use-case on WhatsApp. Our build engineers will
          design a custom rig with the latest components and benchmark results
          before delivery.
        </p>
        <div className="mt-7 flex justify-center gap-3 flex-wrap">
          <Button asChild size="lg" variant="default">
            <a
              href={buildWhatsAppLink(
                waMessages.customPC("100% custom build inquiry"),
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              Start Custom Build
              <ArrowRight className="h-5 w-5" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
