import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AreaLanding from "@/components/AreaLanding";
import { serviceAreas } from "@/lib/service-areas";

export const dynamicParams = false;
export function generateStaticParams() { return serviceAreas.map(area => ({ area: area.slug })); }

export function generateMetadata({ params }: { params: { area: string } }): Metadata {
  const area = serviceAreas.find(item => item.slug === params.area);
  if (!area) notFound();
  const title = `Sell Laptop & Desktop in ${area.name}, Bangalore | Hulumart`;
  const url = `https://www.hulumart.com/bangalore/areas/${area.slug}`;
  return {
    title: { absolute: title }, description: area.intro,
    alternates: { canonical: url },
    openGraph: { title, description: area.intro, url, type: "website", siteName: "Hulumart", images: [{ url: "/assets/hulumart-logo.png", width: 640, height: 121, alt: "Hulumart" }] },
    twitter: { card: "summary", title, description: area.intro, images: ["/assets/hulumart-logo.png"] },
  };
}

export default function Page({ params }: { params: { area: string } }) {
  const area = serviceAreas.find(item => item.slug === params.area);
  if (!area) notFound();
  return <AreaLanding area={area} />;
}
