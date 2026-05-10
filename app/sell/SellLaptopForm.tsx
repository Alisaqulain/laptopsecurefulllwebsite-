"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, MessageCircle, ArrowRight, Image as ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { buildWhatsAppLink, waMessages } from "@/lib/whatsapp";

const brands = [
  "Apple",
  "Dell",
  "HP",
  "Lenovo",
  "ASUS",
  "MSI",
  "Acer",
  "Razer",
  "Microsoft",
  "Other",
];

const conditions = [
  { id: "Like New", label: "Like New" },
  { id: "Excellent", label: "Excellent" },
  { id: "Good", label: "Good" },
  { id: "Fair", label: "Fair (some wear)" },
  { id: "Damaged", label: "Damaged / Not working" },
];

export function SellLaptopForm() {
  const [form, setForm] = useState({
    brand: "",
    model: "",
    processor: "",
    ram: "",
    storage: "",
    condition: "Excellent",
    additional: "",
    name: "",
    phone: "",
  });
  const [images, setImages] = useState<File[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const link = buildWhatsAppLink(
      waMessages.sellLaptop({
        brand: form.brand,
        model: form.model,
        processor: form.processor,
        ram: form.ram,
        storage: form.storage,
        condition: form.condition,
      }) +
        `\n\nName: ${form.name}\nPhone: ${form.phone}` +
        (form.additional ? `\nNotes: ${form.additional}` : "") +
        (images.length
          ? `\n\n📷 Will share ${images.length} photo(s) on WhatsApp.`
          : ""),
    );
    window.open(link, "_blank", "noopener,noreferrer");
  };

  const onFiles = (files: FileList | null) => {
    if (!files) return;
    setImages([...images, ...Array.from(files)].slice(0, 6));
  };

  return (
    <section className="container pb-24">
      <div className="grid lg:grid-cols-[1fr,400px] gap-10">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <SectionHeading
            align="left"
            title={
              <>
                Tell us about{" "}
                <span className="gradient-text-orange">your laptop</span>
              </>
            }
            subtitle="Fill in the details and we'll send your quote on WhatsApp."
          />

          <div className="rounded-2xl glass-strong border border-white/5 p-6 md:p-8 space-y-6">
            {/* Brand */}
            <div>
              <label className="text-sm font-semibold mb-2 block">
                Brand <span className="text-neon-400">*</span>
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {brands.map((b) => (
                  <button
                    type="button"
                    key={b}
                    onClick={() => setForm({ ...form, brand: b })}
                    className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-all ${
                      form.brand === b
                        ? "border-neon-500/60 bg-neon-500/15 text-neon-300 shadow-glow-orange"
                        : "border-white/10 bg-white/5 hover:border-neon-500/30"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-semibold mb-2 block">
                  Model <span className="text-neon-400">*</span>
                </label>
                <Input
                  required
                  placeholder="e.g. MacBook Pro 14 M3 Pro"
                  value={form.model}
                  onChange={(e) => setForm({ ...form, model: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block">
                  Processor
                </label>
                <Input
                  placeholder="e.g. Intel i7-1260P / Apple M2"
                  value={form.processor}
                  onChange={(e) =>
                    setForm({ ...form, processor: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block">
                  RAM <span className="text-neon-400">*</span>
                </label>
                <Input
                  required
                  placeholder="e.g. 16GB"
                  value={form.ram}
                  onChange={(e) => setForm({ ...form, ram: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block">
                  Storage <span className="text-neon-400">*</span>
                </label>
                <Input
                  required
                  placeholder="e.g. 512GB SSD"
                  value={form.storage}
                  onChange={(e) =>
                    setForm({ ...form, storage: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Condition */}
            <div>
              <label className="text-sm font-semibold mb-2 block">
                Condition <span className="text-neon-400">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {conditions.map((c) => (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => setForm({ ...form, condition: c.id })}
                    className={`rounded-lg border px-3 py-2.5 text-xs font-medium transition-all text-center ${
                      form.condition === c.id
                        ? "border-neon-500/60 bg-neon-500/15 text-neon-300 shadow-glow-orange"
                        : "border-white/10 bg-white/5 hover:border-neon-500/30"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Additional */}
            <div>
              <label className="text-sm font-semibold mb-2 block">
                Anything else? (optional)
              </label>
              <Textarea
                placeholder="Battery health, accessories, original bill, etc."
                value={form.additional}
                onChange={(e) =>
                  setForm({ ...form, additional: e.target.value })
                }
              />
            </div>

            {/* Images */}
            <div>
              <label className="text-sm font-semibold mb-2 block">
                Upload photos (optional, max 6)
              </label>
              <label className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/10 hover:border-neon-500/40 bg-white/5 p-6 cursor-pointer transition-colors">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm font-medium">
                  Drop images here or click to upload
                </span>
                <span className="text-xs text-muted-foreground">
                  PNG, JPG up to 5MB each
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => onFiles(e.target.files)}
                />
              </label>
              {images.length > 0 && (
                <div className="mt-3 grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {images.map((img, i) => (
                    <div
                      key={i}
                      className="relative aspect-square rounded-lg overflow-hidden border border-white/10 bg-white/5 group"
                    >
                      <ImageIcon className="absolute inset-0 m-auto h-6 w-6 text-muted-foreground" />
                      <span className="absolute bottom-1 left-1 right-1 truncate text-[9px] text-white/70 bg-black/40 rounded px-1">
                        {img.name}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setImages(images.filter((_, idx) => idx !== i))
                        }
                        className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-5 pt-4 border-t border-white/5">
              <div>
                <label className="text-sm font-semibold mb-2 block">
                  Your Name
                </label>
                <Input
                  placeholder="Full name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  placeholder="+91 ..."
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
            </div>

            <Button type="submit" size="xl" variant="accent" className="w-full">
              <MessageCircle className="h-5 w-5" />
              Get Instant Quote on WhatsApp
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </form>

        {/* Side info */}
        <aside className="lg:sticky lg:top-24 self-start space-y-4">
          <div className="rounded-2xl glass border border-neon-500/20 p-6">
            <h3 className="font-display text-lg font-bold mb-3">
              How we calculate your price
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {[
                "Brand & model year",
                "Processor & RAM/storage configuration",
                "Battery health and overall condition",
                "Live market demand on the day",
                "Original accessories and warranty",
              ].map((p) => (
                <li key={p} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-neon-400 shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl glass-strong border border-electric-500/20 p-6">
            <div className="font-display text-2xl font-bold gradient-text">
              Beat-the-quote
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Found a higher quote elsewhere? Show us in writing — we'll beat
              it by 5% and pick up free.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
