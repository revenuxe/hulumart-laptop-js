import Link from 'next/link';

const links = [
  { text: 'Sell laptops in Bangalore', href: '/bangalore' },
  { text: 'MacBook selling guide', href: '/bangalore/macbook' },
  { text: 'Dell selling guide', href: '/bangalore/dell' },
  { text: 'HP selling guide', href: '/bangalore/hp' },
  { text: 'Lenovo selling guide', href: '/bangalore/lenovo' },
  { text: 'Dell XPS models', href: '/models/dell-xps' },
  { text: 'MacBook Pro models', href: '/models/macbook-pro' },
  { text: 'Sell a desktop', href: '/sell/desktop' },
  { text: 'Bangalore pickup areas', href: '/bangalore/areas' },
  { text: 'Prepare your laptop for sale', href: '/blog/prepare-laptop-for-sale' },
  { text: 'Laptop selling process', href: '/blog/sell-used-laptop-bangalore' },
  { text: 'Laptop repair enquiries', href: '/repair' },
];

export default function QuickLinks() {
  return <nav aria-label="Selling guides and services" className="border-t bg-background py-8 sm:py-12"><div className="container"><h2 className="text-lg font-semibold">Find the right guide for your next step</h2><div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-4 sm:grid-cols-3 lg:grid-cols-4">{links.map(link => <Link key={link.href} href={link.href} className="text-xs leading-6 text-muted-foreground hover:text-primary sm:text-sm">{link.text}</Link>)}</div></div></nav>;
}
