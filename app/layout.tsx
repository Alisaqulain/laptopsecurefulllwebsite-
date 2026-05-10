import type { Metadata, Viewport } from "next";
import { Inter, Orbitron, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { LenisProvider } from "@/components/layout/LenisProvider";
import { PageTransition } from "@/components/layout/PageTransition";
import { MarketplaceProvider } from "@/components/providers/MarketplaceProvider";
import { QuickViewModal } from "@/components/shared/QuickViewModal";
import { CompareDrawer } from "@/components/shared/CompareDrawer";
import { siteConfig } from "@/lib/config";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-orbitron",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#020817",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords as unknown as string[],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteConfig.url,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: "/logo.jpg",
        width: 1536,
        height: 1024,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: ["/logo.jpg"],
    creator: "@laptopsecure",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/logo.jpg", type: "image/jpeg" },
    ],
    apple: [
      { url: "/logo.jpg" },
    ],
  },
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: siteConfig.url,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${orbitron.variable} ${jetbrains.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: siteConfig.name,
              url: siteConfig.url,
              logo: `${siteConfig.url}/logo.jpg`,
              email: siteConfig.contact.email,
              telephone: siteConfig.contact.phone,
              address: {
                "@type": "PostalAddress",
                streetAddress: siteConfig.contact.address,
                addressCountry: "IN",
              },
              sameAs: Object.values(siteConfig.social),
            }),
          }}
        />
        <MarketplaceProvider>
          <LenisProvider>
            <Navbar />
            <main className="flex-1 relative">
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer />
            <WhatsAppButton />
            <QuickViewModal />
            <CompareDrawer />
          </LenisProvider>
        </MarketplaceProvider>
      </body>
    </html>
  );
}
