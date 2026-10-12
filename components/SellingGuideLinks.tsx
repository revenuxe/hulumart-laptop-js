import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function SellingGuideLinks() {
  return <nav aria-label="Guides for selling your device" className="container px-5 py-8 sm:py-12"><h2 className="text-xl font-semibold">A little preparation makes the next step easier</h2><div className="mt-5 grid gap-3 sm:grid-cols-3">{[
    { href: '/blog/prepare-laptop-for-sale', title: 'Prepare your laptop for sale', text: 'Back up your files, remove accounts, and record the condition.' },
    { href: '/blog/how-to-get-highest-resale-value-for-laptop', title: 'Understand your laptop’s resale value', text: 'Learn which specifications and condition details affect an offer.' },
    { href: '/bangalore/areas', title: 'Check your Bangalore pickup area', text: 'Find your location and discuss collection for your address.' },
  ].map(link => <Link key={link.href} href={link.href} className="rounded-2xl border bg-card p-5 hover:border-primary/40"><h3 className="text-sm font-semibold text-primary">{link.title}<ArrowRight aria-hidden="true" className="ml-2 inline h-4 w-4" /></h3><p className="mt-2 text-xs leading-6 text-muted-foreground">{link.text}</p></Link>)}</div></nav>;
}
