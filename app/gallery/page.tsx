import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { GalleryGrid } from "./GalleryGrid";

export const metadata: Metadata = {
  title: "Gallery — Store, Products & Repair Lab",
  description:
    "A visual tour of LaptopSecure — our store, repair lab, custom PC builds, and team in action.",
};

export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title={
          <>
            A visual tour of{" "}
            <span className="gradient-text">LaptopSecure.</span>
          </>
        }
        subtitle="Our store, lab, and team in action — captured in beautiful detail."
        breadcrumbs={[{ name: "Gallery" }]}
      />

      <GalleryGrid />
    </>
  );
}
