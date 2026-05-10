import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";
import { GlowOrb } from "@/components/shared/GlowOrb";

export default function NotFound() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <GlowOrb className="left-1/3 top-1/2 -translate-y-1/2" color="blue" size="lg" />
        <GlowOrb className="right-1/3 top-1/3" color="orange" size="md" />
      </div>

      <div className="container max-w-2xl text-center py-20">
        <div className="font-display text-[10rem] md:text-[14rem] font-black leading-none gradient-text">
          404
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold mt-2 tracking-tight">
          This page took a coffee break.
        </h1>
        <p className="mt-4 text-base md:text-lg text-muted-foreground">
          The page you're looking for doesn't exist or has been moved. Let's get
          you back on track.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <Button asChild size="lg">
            <Link href="/">
              <Home className="h-5 w-5" />
              Go home
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/shop">
              <Search className="h-5 w-5" />
              Browse shop
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
