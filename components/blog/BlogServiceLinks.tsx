import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function BlogServiceLinks({ slug }: { slug: string }) {
  const links = slug === 'prepare-laptop-for-sale' ? [
    { href: '/bangalore/macbook', title: 'Sell a MacBook in Bangalore' },
    { href: '/bangalore/dell', title: 'Sell a Dell laptop in Bangalore' },
    { href: '/models/lenovo-thinkpad', title: 'Identify your ThinkPad before selling' },
  ] : [
    { href: '/bangalore', title: 'Sell a laptop or desktop in Bangalore' },
    { href: '/models/macbook-air', title: 'MacBook Air selling guide' },
    { href: '/models/dell-xps', title: 'Dell XPS selling guide' },
  ];
  return <nav aria-label="Related device selling services" className="mt-8 rounded-2xl border p-5"><h2 className="text-lg font-semibold">Explore the guide for your device</h2><ul className="mt-4 space-y-3">{links.map(link => <li key={link.href}><Link href={link.href} className="inline-flex items-center gap-2 text-sm text-primary hover:underline underline-offset-4">{link.title}<ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" /></Link></li>)}</ul></nav>;
}
