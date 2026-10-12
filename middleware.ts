import { NextRequest, NextResponse } from 'next/server';
import { supabasePublicKey, supabaseUrl } from '@/lib/supabase/config';

const checked = new Map<string, { exists: boolean; expires: number }>();

function missing(request: NextRequest) {
  // Validate before Next starts streaming its loading boundary; otherwise
  // a notFound() rendered after streaming can retain HTTP status 200.
  const response = NextResponse.rewrite(new URL('/catalog-not-found', request.url), { status: 404 });
  response.headers.set('X-Robots-Tag', 'noindex');
  return response;
}

export async function middleware(request: NextRequest) {
  const parts = request.nextUrl.pathname.split('/').filter(Boolean).slice(1);
  if (!parts.length) return NextResponse.next();
  if (parts.length > 4 || !['laptop', 'desktop'].includes(parts[0])) return missing(request);
  if (parts.length === 1) return NextResponse.next();
  const key = parts.join('/');
  const previous = checked.get(key);
  if (previous && previous.expires > Date.now()) return previous.exists ? NextResponse.next() : missing(request);

  const query = new URLSearchParams();
  let table: string;
  if (parts.length === 2) {
    table = 'brands';
    query.set('select', 'id,categories!inner(slug)');
    query.set('slug', `eq.${parts[1]}`);
    query.set('categories.slug', `eq.${parts[0]}`);
  } else if (parts.length === 3) {
    table = 'series';
    query.set('select', 'id,brands!inner(slug,categories!inner(slug))');
    query.set('slug', `eq.${parts[2]}`);
    query.set('brands.slug', `eq.${parts[1]}`);
    query.set('brands.categories.slug', `eq.${parts[0]}`);
  } else {
    table = 'models';
    query.set('select', 'id,series!inner(slug,brands!inner(slug,categories!inner(slug)))');
    query.set('slug', `eq.${parts[3]}`);
    query.set('active', 'eq.true');
    query.set('series.slug', `eq.${parts[2]}`);
    query.set('series.brands.slug', `eq.${parts[1]}`);
    query.set('series.brands.categories.slug', `eq.${parts[0]}`);
  }
  query.set('limit', '1');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const result = await fetch(`${supabaseUrl}/rest/v1/${table}?${query}`, { headers: { apikey: supabasePublicKey }, signal: controller.signal });
    if (!result.ok) throw new Error('Catalog unavailable');
    const rows: unknown = await result.json();
    if (!Array.isArray(rows)) throw new Error('Invalid catalog response');
    const exists = rows.length > 0;
    if (checked.size >= 1000) checked.delete(checked.keys().next().value!);
    checked.set(key, { exists, expires: Date.now() + 60000 });
    return exists ? NextResponse.next() : missing(request);
  } catch {
    return new NextResponse('The device catalog is temporarily unavailable. Please try again shortly.', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Retry-After': '30', 'X-Robots-Tag': 'noindex' } });
  } finally { clearTimeout(timeout); }
}

export const config = { matcher: ['/sell/:path*'] };
