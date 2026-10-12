import type { Metadata } from "next";
import { PageClient } from "./page-client";
import { sellingLandings } from "@/lib/selling-landings";

const description = sellingLandings["models/hp-desktop"].intro;
const title = "Sell Your HP Desktop in Bangalore | Hulumart";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "https://www.hulumart.com/models/hp-desktop" },
  openGraph: { title, description, url: "https://www.hulumart.com/models/hp-desktop", type: "website", siteName: "Hulumart", images: [{ url: "/assets/hulumart-logo.png", width: 640, height: 121, alt: "Hulumart" }] },
  twitter: { card: "summary", title, description, images: ["/assets/hulumart-logo.png"] },
};

export default function Page() {
  return <PageClient />;
}
