import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Script from "next/script";
import { Suspense } from "react";
import PageLoader from "@/components/PageLoader";
import ScrollToTop from "@/components/ScrollToTop";
import MobileBottomNav from "@/components/MobileBottomNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.hulumart.com"),
  title: {
    default: "Sell Used Laptop and Desktop in Bangalore | Same-Day Cash – Hulumart",
    template: "%s | Hulumart",
  },
  description:
    "Sell used laptop & desktop in Bangalore at the best price. Instant quote, same-day pickup, quick cash, and 500+ happy customers. Trusted, safe & hassle-free",
  keywords: [
    "sell laptop bangalore",
    "sell desktop",
    "used laptops",
    "refurbished laptops",
    "pre-owned tech",
    "instant quote",
    "doorstep pickup",
    "laptop buyback",
    "hbr layout",
    "nagawara",
  ],
  authors: [{ name: "Hulumart" }],
  openGraph: {
    type: "website",
    url: "https://www.hulumart.com/",
    title: "Sell Used Laptop and Desktop in Bangalore | Same-Day Cash – Hulumart",
    description:
      "Sell used laptop & desktop in Bangalore at the best price. Instant quote, same-day pickup, quick cash, and 500+ happy customers.",
    siteName: "Hulumart",
    locale: "en_IN",
    images: [{ url: "/assets/hulumart-logo.png", width: 640, height: 121, alt: "Hulumart — Buy it. Sell it. Repeat it." }],
  },
  twitter: {
    card: "summary",
    title: "Sell Used Laptop and Desktop in Bangalore | Same-Day Cash – Hulumart",
    description:
      "Sell used laptop & desktop in Bangalore at the best price. Instant quote, same-day pickup, quick cash, and 500+ happy customers.",
    images: ["/assets/hulumart-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: "https://www.hulumart.com",
  },
  icons: {
    icon: { url: "/favicon.ico?v=hulumart", type: "image/x-icon" },
    apple: "/assets/hulumart-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Hulumart",
              url: "https://www.hulumart.com",
              logo: "https://www.hulumart.com/assets/hulumart-logo.png",
              description: "Sell used laptops and desktops with Hulumart in Bangalore",
              telephone: "+919886579923",
              address: {
                "@type": "PostalAddress",
                streetAddress: "HBR Layout, Nagawara Main Road",
                addressLocality: "Bangalore",
                addressRegion: "Karnataka",
                postalCode: "560045",
                addressCountry: "IN",
              },
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+919886579923",
                email: "hulumart.com@gmail.com",
                contactType: "Customer Service",
                areaServed: "IN",
                availableLanguage: ["English", "Hindi"],
              },
              sameAs: [],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "Hulumart",
              image: "https://www.hulumart.com/assets/hulumart-logo.png",
              telephone: "+919886579923",
              priceRange: "₹₹",
              address: {
                "@type": "PostalAddress",
                streetAddress: "HBR Layout, Nagawara Main Road",
                addressLocality: "Bangalore",
                addressRegion: "Karnataka",
                postalCode: "560045",
                addressCountry: "IN",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: "13.0358",
                longitude: "77.6431",
              },
              url: "https://www.hulumart.com",
              email: "hulumart.com@gmail.com",
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                  opens: "10:00",
                  closes: "19:00",
                },
              ],
            }),
          }}
        />
        {/* Google Analytics 4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="ga4" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <Suspense fallback={null}>
          <PageLoader />
        </Suspense>
        <Suspense fallback={null}>
          <ScrollToTop />
        </Suspense>
        <Providers>{children}<MobileBottomNav /></Providers>
      </body>
    </html>
  );
}
