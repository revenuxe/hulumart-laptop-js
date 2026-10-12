import type { Metadata } from "next";
import { resolveCatalogPage } from "@/lib/catalog-server";
import { SellClient } from "./sell-client";

interface Props {
  params: { params?: string[] };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const urlSegments = params?.params || [];
  const resolved = await resolveCatalogPage(urlSegments.join("/"));
  if (urlSegments.length === 0) {
    const title = "Sell Your Device: Choose Laptop or Desktop | Hulumart";
    const description = "Choose a laptop or desktop to start your Hulumart selling request. Select your device and share its details to discuss assessment and pickup in Bangalore.";
    const url = "https://www.hulumart.com/sell";
    return { title: { absolute: title }, description, alternates: { canonical: url }, openGraph: { title, description, url, type: "website", siteName: "Hulumart" }, twitter: { card: "summary", title, description } };
  }
  const category = urlSegments[0] || "laptop";
  const brandSlug = urlSegments[1];
  const seriesSlug = urlSegments[2];
  const modelSlug = urlSegments[3];

  const brandLabel = resolved.brand?.name;
  const seriesLabel = resolved.selectedSeries?.name;
  const modelLabel = resolved.model?.name;

  const categoryName = category === "desktop" ? "Desktop" : "Laptop";
  let title = `Sell Used ${categoryName} Online | Instant Quote & Cash Payment - Hulumart`;
  let description = `Get the best price for your used ${categoryName.toLowerCase()} on Hulumart. Free doorstep pickup, instant evaluation, and immediate payment in Bangalore.`;
  let canonicalUrl = `https://www.hulumart.com/sell/${category}`;

  if (brandSlug) {

    const brandName = brandLabel || brandSlug.toUpperCase();
    title = `Sell Used ${brandName} ${categoryName}s | Best Buyback Price - Hulumart`;
    description = `Sell your old ${brandName} ${categoryName.toLowerCase()} for instant cash. Free doorstep pickup and instant payment guaranteed on Hulumart.`;
    canonicalUrl = `https://www.hulumart.com/sell/${category}/${brandSlug}`;

    if (seriesSlug) {

      const seriesName = seriesLabel || seriesSlug;
      title = `Sell Used ${brandName} ${seriesName} ${categoryName} | Instant Quote - Hulumart`;
      description = `Get instant price valuation for your used ${brandName} ${seriesName} ${categoryName.toLowerCase()}. Safe data wipe, free pickup & quick payment.`;
      canonicalUrl = `https://www.hulumart.com/sell/${category}/${brandSlug}/${seriesSlug}`;

      if (modelSlug) {

        const modelName = modelLabel || modelSlug;
        title = `Sell ${modelName} ${categoryName} | Best Resale Value - Hulumart`;
        description = `Sell your ${modelName} ${categoryName.toLowerCase()} at the top market price. Free doorstep pickup and instant payment across Bangalore & India.`;
        canonicalUrl = `https://www.hulumart.com/sell/${category}/${brandSlug}/${seriesSlug}/${modelSlug}`;
      }
    }
  }

  return {
    title: { absolute: title },
    description,
    keywords: [
      `sell ${categoryName.toLowerCase()}`,
      `sell used ${categoryName.toLowerCase()}`,
      "laptop buyback",
      "instant quote laptop",
      "free doorstep pickup",
      "sell old electronics",
    ],
    alternates: { canonical: canonicalUrl },
    ...(modelSlug ? { robots: { index: false, follow: true, googleBot: { index: false, follow: true } } } : {}),
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      siteName: "Hulumart",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function SellPage({ params }: Props) {
  const initialData = await resolveCatalogPage((params.params || []).join("/"));
  return <SellClient initialData={initialData} />;
}
