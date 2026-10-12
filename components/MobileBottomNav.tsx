"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { House, Tag, Headset, LayoutGrid } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const destinations = [
  { href: "/", label: "Home", icon: House },
  { href: "/sell/laptop", label: "Sell Device", icon: Tag },
  { href: "/contact", label: "Contact", icon: Headset },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  if (pathname.startsWith("/admin")) return null;

  const itemClass = "group flex min-h-14 min-w-0 flex-col items-center justify-center gap-1 rounded-2xl text-[10px] font-medium leading-4 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-reduce:transition-none";
  const renderLink = (item: typeof destinations[number]) => {
    const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href === "/sell/laptop" ? "/sell" : item.href);
    return <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={cn(itemClass, active ? "bg-primary/[0.08] text-primary" : "text-muted-foreground hover:bg-muted/70 hover:text-foreground")}><item.icon className="h-[19px] w-[19px]" strokeWidth={active ? 2.3 : 1.8} /><span className={cn("whitespace-nowrap", active && "font-semibold")}>{item.label}</span><span aria-hidden="true" className={cn("h-0.5 w-3 rounded-full", active ? "bg-primary" : "bg-transparent")} /></Link>;
  };

  return <>
    <div aria-hidden="true" className="h-[calc(6rem+env(safe-area-inset-bottom))] md:hidden" />
    <nav aria-label="Mobile primary navigation" className="fixed inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-40 mx-auto max-w-lg rounded-[24px] border border-primary/[0.08] bg-background/95 p-1.5 shadow-[0_8px_32px_-8px_hsl(var(--foreground)/0.2)] backdrop-blur-xl md:hidden">
      <div className="grid h-16 grid-cols-5 items-center gap-0.5">
        {destinations.slice(0, 2).map(renderLink)}
        <a href="https://wa.me/919886579923?text=Hi%21%20I%20want%20to%20sell%20or%20repair%20my%20device." target="_blank" rel="noopener noreferrer" aria-label="Chat with Hulumart on WhatsApp (opens in a new tab)" className={cn(itemClass, "gap-1 text-foreground")}>
          <span className="-mt-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#08bf64] to-[#009f39] shadow-[0_4px_12px_-3px_rgba(0,159,57,0.5)] ring-4 ring-background transition-transform duration-200 group-hover:-translate-y-0.5 group-active:scale-95 motion-reduce:transform-none"><img src="/assets/whatsapp.svg" alt="" className="h-8 w-8" /></span>
          <span>WhatsApp</span>
        </a>
        {renderLink(destinations[2])}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className={cn(itemClass, "text-muted-foreground hover:bg-muted/70 hover:text-foreground")}><LayoutGrid className="h-[19px] w-[19px]" strokeWidth={1.8} /><span>Menu</span><span aria-hidden="true" className="h-0.5 w-3" /></SheetTrigger>
          <SheetContent side="bottom" className="max-h-[80dvh] overflow-y-auto rounded-t-3xl pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
            <SheetTitle className="text-left">Explore Hulumart</SheetTitle>
            <SheetDescription className="mt-1 text-left">Sell your device, book a repair, or get help from our team.</SheetDescription>
            <nav aria-label="More navigation" className="mt-5 grid grid-cols-2 gap-2">
              {[{ href: "/sell/laptop", label: "Sell Laptop" }, { href: "/sell/desktop", label: "Sell Desktop" }, { href: "/repair", label: "Repair Services" }, { href: "/about", label: "About Us" }, { href: "/blog", label: "Blog & Guides" }, { href: "/contact", label: "Contact Us" }].map(item => <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="rounded-xl border p-4 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">{item.label}</Link>)}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  </>;
}
