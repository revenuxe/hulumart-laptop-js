"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from '@/lib/supabase/client';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search, Laptop } from 'lucide-react';

interface Model {
  id: string;
  name: string;
  slug: string;
  series: {
    id: string;
    name: string;
    slug: string;
    brand_id: string;
    brands: {
      name: string;
      slug: string;
      categories: { slug: string };
    };
  };
}

const POPULAR_BRANDS = [
  {
    name: "Acer",
    slug: "acer",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/a/a1/Acer_Logo.svg",
  },
  {
    name: "Apple",
    slug: "apple",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
  },
  {
    name: "Asus",
    slug: "asus",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/2/2e/ASUS_Logo.svg",
  },
  {
    name: "Dell",
    slug: "dell",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/1/18/Dell_logo_2016.svg",
  },
  {
    name: "HP",
    slug: "hp",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/a/ad/HP_logo_2012.svg",
  },
  {
    name: "Lenovo",
    slug: "lenovo",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/b/b8/Lenovo_logo_2015.svg",
  },
  {
    name: "Microsoft",
    slug: "microsoft",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
  },
];

export function DeviceSearch() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [models, setModels] = useState<Model[]>([]);
  const [filteredModels, setFilteredModels] = useState<Model[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    loadModels();
  }, []);

  async function loadModels() {
    try {
      const { data } = await supabase
        .from('models')
        .select(`
          id,
          name,
          slug,
          series (
            id,
            name,
            slug,
            brand_id,
            brands (
              name,
              slug,
              categories (slug)
            )
          )
        `)
        .eq('active', true);
      
      if (data) {
        const sortedModels = (data as Model[]).filter(model => model.series?.brands?.categories && ["laptop", "desktop"].includes(model.series.brands.categories.slug)).sort((a, b) => {
          const yearA = parseInt(a.name.match(/\b(19|20)\d{2}\b/)?.[0] || '0');
          const yearB = parseInt(b.name.match(/\b(19|20)\d{2}\b/)?.[0] || '0');
          return yearB - yearA;
        });
        setModels(sortedModels);
      }
    } catch (error) {
      console.error('Error loading models:', error);
    }
  }

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (value.trim() && models.length > 0) {
      const query = value.toLowerCase();
      const filtered = models.filter(model => 
        model.name.toLowerCase().includes(query) ||
        model.series.name.toLowerCase().includes(query) ||
        model.series.brands.name.toLowerCase().includes(query)
      ).slice(0, 5);
      setFilteredModels(filtered);
      setShowResults(true);
    } else {
      setShowResults(false);
      setFilteredModels([]);
    }
  };

  const handleModelClick = (model: Model) => {
    router.push(`/sell/${model.series.brands.categories.slug}/${model.series.brands.slug}/${model.series.slug}/${model.slug}`);
    setSearchQuery('');
    setShowResults(false);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search for your device brand, model..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-6 text-lg rounded-xl border-2 focus:border-primary"
        />
      </div>

      {showResults && (
        <Card className="absolute top-full mt-2 w-full z-50 max-h-96 overflow-auto shadow-lg">
          <div className="p-4">
            {filteredModels.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-muted-foreground mb-3">Models</p>
                {filteredModels.map(model => (
                  <div
                    key={model.id}
                    onClick={() => handleModelClick(model)}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors"
                  >
                    <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded">
                      <Laptop className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{model.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {model.series.brands.name} {model.series.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-6">No models found</p>
            )}
          </div>
        </Card>
      )}

      {/* Popular Brands (Static for instant rendering) */}
      <section className="mt-5 text-left" aria-labelledby="popular-brands-heading">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 id="popular-brands-heading" className="text-base font-semibold text-foreground sm:text-lg">Popular Brands</h2>
          <Link href="/sell/laptop" className="text-xs font-medium text-primary hover:underline underline-offset-4">View all</Link>
        </div>
        <div className="grid auto-cols-[78px] grid-flow-col gap-2.5 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:auto-cols-[84px] sm:gap-3">
        {POPULAR_BRANDS.map(brand => (
          <Link
            key={brand.slug}
            href={`/sell/laptop/${brand.slug}`}
            className="flex min-h-[92px] flex-col items-center justify-center gap-3 rounded-[20px] border border-blue-100 bg-white px-2 py-3 text-center text-[11px] font-medium text-slate-900 shadow-[0_3px_8px_-4px_rgba(15,23,42,0.2)] transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-slate-900 active:border-blue-400 active:bg-blue-100 active:text-slate-900 focus-visible:bg-blue-50 focus-visible:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 sm:min-h-[100px] sm:text-xs"
          >
            <img
              src={brand.logo_url}
              alt={brand.name}
              className="h-8 w-12 object-contain sm:h-9"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <span>{brand.name}</span>
          </Link>
        ))}
        </div>
      </section>
    </div>
  );
}

