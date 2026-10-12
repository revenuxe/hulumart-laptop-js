import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { serviceAreas } from "@/lib/service-areas";

export const metadata: Metadata = {
  title: { absolute: "Bangalore Pickup Areas | Hulumart" },
  description: "Browse Bangalore locations and ask Hulumart about laptop or desktop collection at your pincode. Confirm availability and timing before booking.",
  alternates: { canonical: "https://www.hulumart.com/bangalore/areas" },
  openGraph: { title: "Bangalore Pickup Areas | Hulumart", description: "Check laptop and desktop pickup availability for your Bangalore address.", url: "https://www.hulumart.com/bangalore/areas" },
};

export default function AreasPage() {
  return <><Header /><main className="container px-5 py-8 sm:px-8 sm:py-12">
    <nav aria-label="Breadcrumb" className="mb-7 flex flex-wrap gap-2 text-xs text-muted-foreground"><Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/bangalore">Bangalore</Link><span aria-hidden="true">/</span><span aria-current="page">Pickup areas</span></nav>
    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Browse Bangalore pickup areas</h1>
    <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">Find your area below and share your six-digit pincode with our team. Collection availability, timing, and any conditions are confirmed for your exact address before you book.</p>
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{serviceAreas.map(area => <section id={area.slug} key={area.slug} className="scroll-mt-28 rounded-2xl border bg-card p-5 target:border-primary target:bg-primary/5 sm:p-6">
      <MapPin aria-hidden="true" className="mb-4 h-5 w-5 text-secondary" /><h2 className="text-lg font-semibold">{area.name}</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{area.intro}</p>
      <Link href={`/bangalore/areas/${area.slug}`} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">Sell a device in {area.name}<ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
      <a href={`https://wa.me/919886579923?text=${encodeURIComponent(`Hi Hulumart, I would like to check device pickup in ${area.name}. My pincode is: `)}`} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary"><img src="/assets/whatsapp-mark.svg" width={18} height={18} alt="" />Check pickup availability<ArrowRight aria-hidden="true" className="h-4 w-4" /></a>
    </section>)}</div>
    <section className="mt-8 rounded-2xl bg-muted/40 p-5 sm:p-7"><h2 className="text-xl font-semibold">Can’t find your area?</h2><p className="mt-2 text-sm leading-7 text-muted-foreground">This list is a starting guide, not a complete coverage guarantee. Contact us with your pincode to ask about another Bangalore location.</p><Link href="/contact" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">Contact our team<ArrowRight aria-hidden="true" className="h-4 w-4" /></Link></section>
  </main><Footer /></>;
}
