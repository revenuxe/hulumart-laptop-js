"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const closeMenu = () => setMobileMenuOpen(false);

  return <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div className="container flex h-14 items-center justify-between px-4 sm:h-16 sm:px-5 md:h-20 md:px-8">
      <Link href="/" className="flex items-center space-x-2" aria-label="Hulumart home"><img src="/assets/hulumart-logo.avif" alt="Hulumart" className="h-auto w-40 object-contain sm:w-48 md:w-56 dark:rounded-lg dark:bg-white dark:p-2" /></Link>
      <nav className="hidden items-center space-x-8 md:flex"><Link href="/" className="text-sm font-medium transition-colors hover:text-primary">Home</Link><Link href="/sell/laptop" className="text-sm font-medium transition-colors hover:text-primary">Sell Device</Link><Link href="/repair" className="text-sm font-medium transition-colors hover:text-primary">Repair</Link><Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">About</Link><Link href="/blog" className="text-sm font-medium transition-colors hover:text-primary">Blog</Link></nav>
      <div className="flex items-center gap-2"><Button variant="cta" size="sm" asChild className="hidden sm:inline-flex"><Link href="/sell/laptop">Sell Now</Link></Button><button className="rounded-lg p-1.5 transition-colors hover:bg-muted md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle navigation">{mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button></div>
    </div>
    {mobileMenuOpen && <div className="animate-in slide-in-from-top-2 border-t bg-background/98 duration-200 md:hidden"><nav className="container flex flex-col gap-1 py-4"><Link href="/" onClick={closeMenu} className="rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted">Home</Link><Link href="/sell/laptop" onClick={closeMenu} className="rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted">Sell Device</Link><Link href="/repair" onClick={closeMenu} className="rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted">Repair</Link><Link href="/about" onClick={closeMenu} className="rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted">About</Link><Link href="/blog" onClick={closeMenu} className="rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted">Blog</Link><Link href="/contact" onClick={closeMenu} className="rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted">Contact</Link><div className="px-3 pt-2"><Button variant="cta" className="w-full" asChild><Link href="/sell/laptop" onClick={closeMenu}>Sell Now</Link></Button></div></nav></div>}
  </header>;
};

export default Header;
