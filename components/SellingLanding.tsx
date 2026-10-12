import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, ChevronRight, ClipboardCheck, Laptop, MapPin, Monitor, PackageCheck, SlidersHorizontal, Truck } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import CategorySection from "@/components/CategorySection";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { sellingLandings, landingDetails, type SellingLandingData } from "@/lib/selling-landings";
import { serviceAreas } from "@/lib/service-areas";

const areas = serviceAreas.slice(0, 6);

export default function SellingLanding({ data }: { data: SellingLandingData }) {
  const route = Object.keys(sellingLandings).find(key => sellingLandings[key] === data)!;
  const details = landingDetails[route];
  const parentRoute = route === "bangalore" ? null : route.startsWith("bangalore/") ? "bangalore" : Object.keys(sellingLandings).find(key => key.startsWith("bangalore/") && sellingLandings[key].brandSlug === data.brandSlug) || "bangalore";
  const breadcrumbs = [{ name: "Home", path: "/" }, ...(parentRoute ? [{ name: parentRoute === "bangalore" ? "Sell in Bangalore" : sellingLandings[parentRoute].name, path: "/" + parentRoute }] : []), { name: data.name, path: "/" + route }];
  const related = Object.entries(sellingLandings).filter(([key, item]) => key !== route && (route === "bangalore" || item.brandSlug === data.brandSlug));
  const pageUrl = "https://www.hulumart.com/" + route;
  const schema = { "@context": "https://schema.org", "@graph": [
    { "@type": "WebPage", "@id": pageUrl + "#webpage", url: pageUrl, name: "Sell your " + data.name + " in Bangalore | Hulumart", description: data.intro, inLanguage: "en-IN", breadcrumb: { "@id": pageUrl + "#breadcrumb" } },
    { "@type": "BreadcrumbList", "@id": pageUrl + "#breadcrumb", itemListElement: breadcrumbs.map((crumb, i) => ({ "@type": "ListItem", position: i + 1, name: crumb.name, item: "https://www.hulumart.com" + crumb.path })) }
  ] };
  const city = data.city || "Bangalore";
  const category = data.category === "desktop" ? "desktop" : "laptop";
  const deviceHref = `/sell/${category}${data.brandSlug ? `/${data.brandSlug}` : ""}`;
  const DeviceIcon = category === "desktop" ? Monitor : Laptop;
  const headingName = data.name.replace(/ (laptop|desktop)$/i, "");
  const headingWidth = Math.max(`Sell your ${headingName}`.length, `in ${city}.`.length) * 0.54;
  const whatsappHref = `https://wa.me/919886579923?text=${encodeURIComponent(`Hi Hulumart, I’d like to sell my ${data.name} in ${city}. Can you help me with the process?`)}`;
  const faqs = [
    { question: `How do I sell my ${data.name}?`, answer: `Start by selecting your device in the catalog. Share its configuration, condition, contact details, and pickup pincode. Our team will follow up to discuss the assessment and available collection arrangements.` },
    { question: "How is the offer decided?", answer: `The exact configuration, age, working condition, and inspection all affect the offer. For a ${data.name}, ${data.factors[0].toLowerCase()} are useful starting details. Confirm the final amount and terms before handing over your device.` },
    { question: "Can I sell a damaged or faulty device?", answer: "Tell us about any damage or faults before booking. Acceptance and pricing depend on the model and the issue; contact the team if you are unsure or cannot find your device in the catalog." },
    { question: `Is pickup available in my part of ${city}?`, answer: "Share your six-digit pincode with your request. Our team will confirm service availability, timing, and any collection conditions for your address before the pickup is agreed." },
    { question: "What should I do with my personal data?", answer: "Back up your files, sign out of linked accounts, and follow the manufacturer’s reset instructions. Keep your model and specification notes before resetting. If it is a work device, check your employer’s requirements first." },
    { question: "When will I receive payment?", answer: "Confirm the payment method and timing with our team during assessment. Check the agreed amount and verify receipt in your own account before completing the handover." },
  ];

  return <div className="min-h-screen bg-background text-foreground">
    <Header />
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      {data.category === "both" ? <Hero location={city} title={<><span className="block">Sell laptop or desktop</span><span className="block text-primary">in {city}.</span></>} description={data.intro} /> : (<section className="relative overflow-hidden border-b border-primary/10 bg-gradient-to-br from-primary/[0.06] via-background to-secondary/[0.06]">
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 top-20 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="container relative px-5 pb-10 pt-5 sm:px-8 sm:pb-14 lg:pb-20">
          <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground sm:mb-12 sm:text-xs">
            {breadcrumbs.map((crumb, i) => <span key={crumb.path} className="inline-flex items-center gap-2">{i > 0 && <ChevronRight aria-hidden="true" className="h-3 w-3" />}{i === breadcrumbs.length - 1 ? <span aria-current="page" className="capitalize text-foreground">{crumb.name}</span> : <Link href={crumb.path} className="capitalize hover:text-primary">{crumb.name}</Link>}</span>)}
          </nav>
          <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
            <div>
              <div className="w-full max-w-2xl" style={{ containerType: "inline-size" }}><h1 className="font-bold leading-[1.16] tracking-tight" style={{ fontSize: `min(48px, calc(100cqw / ${headingWidth}))` }}><span className="block whitespace-nowrap">Sell your {headingName}</span><span className="mt-1 block whitespace-nowrap text-primary">in {city}.</span></h1></div>
              <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">{data.intro}</p>
              <div className="mt-6 flex flex-col gap-3 min-[400px]:flex-row sm:mt-8">
                <Button asChild size="lg" className="h-12 rounded-xl px-5 font-semibold"><Link href={deviceHref}>Choose my device<ArrowRight aria-hidden="true" className="h-4 w-4" /></Link></Button>
                <Button asChild size="lg" variant="outline" className="h-12 rounded-xl border-primary/15 bg-background/80 px-5"><a href={whatsappHref} target="_blank" rel="noopener noreferrer"><img src="/assets/whatsapp-mark.svg" width={20} height={20} alt="" aria-hidden="true" className="h-5 w-5 shrink-0" />Ask on WhatsApp</a></Button>
              </div>
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-muted-foreground sm:text-xs"><span className="inline-flex items-center gap-1.5"><ClipboardCheck aria-hidden="true" className="h-3.5 w-3.5 text-primary" />Model-specific assessment</span><span className="inline-flex items-center gap-1.5"><MapPin aria-hidden="true" className="h-3.5 w-3.5 text-secondary" />Pickup by pincode</span></div>
            </div>
            <div className="relative mx-auto w-full max-w-md rounded-[28px] border border-primary/10 bg-card p-4 shadow-[0_20px_60px_-30px_hsl(var(--primary)/0.3)] sm:p-6">
              <div className="flex items-center justify-between gap-3"><span className="inline-flex items-center gap-2 text-xs font-semibold"><DeviceIcon aria-hidden="true" className="h-4 w-4 text-primary" />Your next upgrade starts here</span><ArrowUpRight aria-hidden="true" className="h-4 w-4 text-muted-foreground" /></div>
              <div className="relative mt-4 flex h-40 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary/[0.06] to-secondary/[0.08] sm:h-56">
                <div aria-hidden="true" className="absolute h-32 w-32 rounded-full border border-primary/10 sm:h-44 sm:w-44" />
                <img src={category === "desktop" ? "/assets/sell-desktop-cutout.webp" : "/assets/sell-laptop-cutout.webp"} width={320} height={240} alt={`${category === "desktop" ? "Desktop" : "Laptop"} illustration`} className="relative h-full w-full object-contain p-4" />
              </div>
              <div className="mt-4 flex items-center justify-between gap-3"><div><p className="mt-1 text-sm font-semibold capitalize">Your {data.name}</p></div><span className="rounded-full bg-secondary/10 p-2.5 text-secondary"><PackageCheck aria-hidden="true" className="h-5 w-5" /></span></div>
              <div className="mt-4 grid grid-cols-3 gap-2 border-t pt-4 text-center text-[10px] leading-4 text-muted-foreground sm:text-xs">{["Select model", "Share details", "Confirm pickup"].map((label, i) => <div key={label}><span className="mx-auto mb-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">{i + 1}</span>{label}</div>)}</div>
            </div>
          </div>
        </div>
      </section>)}

      {data.category === "both" ? <CategorySection /> : (<section className="container px-5 py-10 sm:px-8 sm:py-14" aria-labelledby="models-heading">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><h2 id="models-heading" className="text-2xl font-bold tracking-tight sm:text-3xl">{`Explore ${data.name} models`}</h2></div><p className="max-w-sm text-xs leading-6 text-muted-foreground sm:text-sm">These families are a starting guide. Check the catalog for your exact model and current availability.</p></div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{data.families.map((family, i) => <Link key={family.name} href={deviceHref} className="group rounded-2xl border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-primary/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:p-5"><div className="mb-5 flex items-center justify-between"><span className="rounded-xl bg-primary/[0.06] p-2.5 text-primary"><DeviceIcon aria-hidden="true" className="h-5 w-5" /></span><ArrowUpRight aria-hidden="true" className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></div><h3 className="text-sm font-semibold sm:text-base">{family.name}</h3><p className="mt-2 text-xs leading-5 text-muted-foreground">{family.detail}</p></Link>)}</div>
        <p className="mt-4 text-xs text-muted-foreground">Can’t find your model? <Link href="/contact" className="font-medium text-primary underline underline-offset-4">Ask our team before choosing a different device.</Link></p>
      </section>)}

      <section className="container px-5 pb-10 sm:px-8 sm:pb-14" aria-labelledby="device-details-heading">
        <div className="rounded-3xl border bg-card p-5 sm:p-7"><h2 id="device-details-heading" className="text-2xl font-bold tracking-tight sm:text-3xl">{details.heading}</h2><div className="mt-4 grid gap-5 md:grid-cols-2">{details.paragraphs.map(text => <p key={text} className="text-sm leading-7 text-muted-foreground">{text}</p>)}</div></div>
      </section>

      <section className="border-y bg-muted/30">
        <div className="container px-5 py-10 sm:px-8 sm:py-14">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">How to sell your {data.name}</h2>
          <ol className="mt-7 grid gap-5 md:grid-cols-3">{[
            { title: "Tell us about your device", text: "Select the model and keep its configuration and condition notes ready. Share your contact details and pickup pincode.", icon: DeviceIcon },
            { title: "Review the details together", text: "Our team will discuss the device, assessment, and collection availability. Confirm any questions before agreeing to a pickup.", icon: ClipboardCheck },
            { title: "Complete the handover", text: "Back up and reset your device. Confirm the inspection outcome and payment terms before completing the sale.", icon: Truck },
          ].map((step, i) => <li key={step.title} className="rounded-2xl border bg-card p-5 sm:p-6"><div className="mb-5 flex items-center justify-between"><span className="text-xs font-semibold text-primary">0{i + 1}</span><step.icon aria-hidden="true" className="h-5 w-5 text-muted-foreground" /></div><h3 className="text-base font-semibold">{step.title}</h3><p className="mt-3 text-sm leading-7 text-muted-foreground">{step.text}</p></li>)}</ol>
        </div>
      </section>

      <section className="container grid gap-8 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-2 lg:gap-14">
        <div><span className="mb-4 inline-flex rounded-xl bg-primary/[0.06] p-3 text-primary"><SlidersHorizontal aria-hidden="true" className="h-5 w-5" /></span><h2 className="text-2xl font-bold tracking-tight sm:text-3xl">What affects your {data.name} resale value?</h2><p className="mt-4 text-sm leading-7 text-muted-foreground">Two devices from the same range can have very different resale values. The exact configuration and working condition matter more than the name alone.</p><ul className="mt-5 space-y-3">{data.factors.map(factor => <li key={factor} className="flex gap-3 text-sm leading-6"><Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />{factor}</li>)}</ul><p className="mt-5 text-xs leading-6 text-muted-foreground">An initial estimate is not a final offer. Any agreed price depends on the actual device and assessment.</p></div>
        <aside className="rounded-3xl border border-secondary/20 bg-secondary/[0.05] p-5 sm:p-7"><h3 className="text-xl font-semibold tracking-tight">Prepare your device before selling</h3><ul className="mt-5 space-y-4">{["Back up photos, files, and anything you want to keep.", "Sign out of personal accounts and remove linked device locks.", "Reset using the manufacturer’s instructions after saving your specifications.", "Set aside the charger and any agreed accessories."].map((text, i) => <li key={text} className="flex gap-3 text-sm leading-6 text-muted-foreground"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-secondary/20 bg-card text-[10px] font-semibold text-foreground">{i + 1}</span>{text}</li>)}</ul><Link href="/blog/prepare-laptop-for-sale" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">Read the preparation guide<ArrowRight aria-hidden="true" className="h-4 w-4" /></Link></aside>
      </section>

      <section className="container px-5 pb-10 sm:px-8 sm:pb-14"><div className="flex flex-col gap-6 rounded-3xl border bg-card p-5 sm:p-7 lg:flex-row lg:items-center lg:justify-between"><div className="max-w-xl"><h2 className="text-xl font-semibold tracking-tight">Pickup availability in {city}</h2><p className="mt-3 text-sm leading-7 text-muted-foreground">Share your pincode so our team can confirm collection availability and timing. Service arrangements vary by address.</p></div><div className="max-w-sm"><div className="flex flex-wrap gap-2">{areas.map(area => <Link key={area.slug} href={`/bangalore/areas/${area.slug}`} className="rounded-full border bg-muted/30 px-3 py-1.5 text-[11px] text-muted-foreground hover:border-primary hover:text-primary">{area.name}</Link>)}</div><a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-primary">Ask about your area<ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" /></a></div></div></section>

      <section className="border-t bg-muted/20"><div className="container grid gap-6 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-[0.7fr_1.3fr] lg:gap-14"><div><h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{data.name} selling FAQs</h2><p className="mt-4 text-sm leading-7 text-muted-foreground">Need help with a particular model or condition? <Link href="/contact" className="text-primary underline underline-offset-4">Talk to our team.</Link></p></div><Accordion type="single" collapsible className="rounded-2xl border bg-card px-4 sm:px-6">{faqs.map((faq, i) => <AccordionItem key={faq.question} value={`faq-${i}`} className="last:border-b-0"><AccordionTrigger className="gap-4 py-5 text-left text-sm font-semibold hover:no-underline">{faq.question}</AccordionTrigger><AccordionContent className="pb-5 text-sm leading-7 text-muted-foreground">{faq.answer}</AccordionContent></AccordionItem>)}</Accordion></div></section>

      <section className="container px-5 py-10 sm:px-8 sm:py-14"><div className="relative overflow-hidden rounded-3xl bg-foreground p-6 text-background sm:p-10"><div aria-hidden="true" className="absolute -right-12 -top-24 h-64 w-64 rounded-full border-[35px] border-white/5" /><div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between"><div className="max-w-xl"><h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Ready to sell your {data.name}?</h2><p className="mt-3 text-sm leading-7 text-background/70">Start with your {data.name}. We’ll help you work out the next step.</p></div><Button asChild size="lg" className="h-12 shrink-0 rounded-xl bg-background px-6 text-foreground hover:bg-background/90"><Link href={deviceHref}>Select my device<ArrowRight aria-hidden="true" className="h-4 w-4" /></Link></Button></div></div></section>
      {related.length > 0 && <nav aria-label="Related selling guides" className="container px-5 pb-10 sm:px-8 sm:pb-14"><h2 className="text-xl font-semibold">Related selling guides</h2><div className="mt-4 flex flex-wrap gap-3">{related.map(([key, item]) => <Link key={key} href={"/" + key} className="rounded-xl border bg-card px-4 py-3 text-sm text-primary hover:bg-primary/5">Sell {item.name} in Bangalore<ArrowUpRight aria-hidden="true" className="ml-2 inline h-3.5 w-3.5" /></Link>)}</div></nav>}
    </main>
    <Footer />
    <WhatsAppFloat />
  </div>;
}
