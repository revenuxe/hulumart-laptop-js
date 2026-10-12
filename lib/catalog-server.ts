import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export interface CatalogEntry { id: string; name: string; slug: string | null; logo_url?: string | null; image_url?: string | null; thumbnail_url?: string | null; category_id?: string | null; brand_id?: string; series_id?: string }
export interface CatalogPageData {
  routeKey: string; brands: CatalogEntry[]; series: CatalogEntry[]; models: CatalogEntry[];
  brand: CatalogEntry | null; selectedSeries: CatalogEntry | null; model: CatalogEntry | null;
}

const catalogSnapshot = unstable_cache(async () => {
  const client = createServerSupabaseClient();
  const signal = AbortSignal.timeout(10000);
  const requests = await Promise.all([
    client.from('categories').select('id,slug').abortSignal(signal),
    client.from('brands').select('id,name,slug,logo_url,category_id').order('name').abortSignal(signal),
    client.from('series').select('id,name,slug,image_url,brand_id').order('name').abortSignal(signal),
    (async () => {
      const rows: CatalogEntry[] = [];
      for (let offset = 0; ; offset += 1000) {
        const result = await client.from('models').select('id,name,slug,thumbnail_url,series_id').eq('active', true).order('id').range(offset, offset + 999).abortSignal(signal);
        if (result.error) throw new Error('The device catalog is temporarily unavailable.');
        rows.push(...result.data);
        if (result.data.length < 1000) return { data: rows, error: null };
      }
    })(),
  ]);
  if (requests.some(result => result.error)) throw new Error('The device catalog is temporarily unavailable.');
  return { categories: requests[0].data!, brands: requests[1].data!, series: requests[2].data!, models: requests[3].data! };
}, ['public-device-catalog-v1'], { revalidate: 60 });

export const resolveCatalogPage = cache(async (routeKey: string): Promise<CatalogPageData> => {
  const route = routeKey ? routeKey.split('/') : [];
  const empty: CatalogPageData = { routeKey, brands: [], series: [], models: [], brand: null, selectedSeries: null, model: null };
  if (!route.length) return empty;
  if (route.length > 4 || !['laptop', 'desktop'].includes(route[0])) notFound();
  const catalog = await catalogSnapshot();
  const category = catalog.categories.find(item => item.slug === route[0]);
  if (!category) notFound();
  const brands = catalog.brands.filter(item => item.category_id === category.id && item.slug);
  const brand = route[1] ? brands.find(item => item.slug === route[1]) ?? null : null;
  if (route[1] && !brand) notFound();
  const series = brand ? catalog.series.filter(item => item.brand_id === brand.id && item.slug) : [];
  const selectedSeries = route[2] ? series.find(item => item.slug === route[2]) ?? null : null;
  if (route[2] && !selectedSeries) notFound();
  const models = selectedSeries ? catalog.models.filter(item => item.series_id === selectedSeries.id && item.slug).sort((a,b) => a.name.localeCompare(b.name)) : [];
  const model = route[3] ? models.find(item => item.slug === route[3]) ?? null : null;
  if (route[3] && !model) notFound();
  return { routeKey, brands, series, models, brand, selectedSeries, model };
});
