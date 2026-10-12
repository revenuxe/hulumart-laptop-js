import type { Metadata } from "next";
import { PageClient } from "./page-client";
import { sellingLandings } from "@/lib/selling-landings";

const description = sellingLandings["models/microsoft-surface"].intro;
const title = "Sell Your Microsoft Surface in Bangalore | Hulumart";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "https://www.hulumart.com/models/microsoft-surface" },
  openGraph: { title, description, url: "https://www.hulumart.com/models/microsoft-surface", type: "website", siteName: "Hulumart", images: [{ url: "/assets/hulumart-logo.png", width: 640, height: 121, alt: "Hulumart" }] },
  twitter: { card: "summary", title, description, images: ["/assets/hulumart-logo.png"] },
};

export default function Page() {
  return <PageClient />;
}
