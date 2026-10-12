import { cache } from 'react';
import { createServerSupabaseClient } from './supabase/server';
import { getEditorialPost, mergeBlogSummaries } from './blog-content';
import { rebrandBlog } from './branding';

export const getBlogPost = cache(async (slug: string) => {
  const editorial = getEditorialPost(slug);
  if (editorial) return editorial;
  const { data } = await createServerSupabaseClient().from('blogs').select('*').eq('slug', slug).eq('published', true).abortSignal(AbortSignal.timeout(5000)).maybeSingle();
  return data ? rebrandBlog(data) : null;
});

export const getBlogSummaries = cache(async () => {
  const { data } = await createServerSupabaseClient().from('blogs').select('id, title, excerpt, created_at, category, slug, featured_image').eq('published', true).order('created_at', { ascending: false }).abortSignal(AbortSignal.timeout(5000));
  return mergeBlogSummaries(data?.map(rebrandBlog) ?? null);
});

export async function relatedBlogPosts(slug: string, category: string) {
  const posts = await getBlogSummaries();
  return posts.filter(post => post.slug !== slug).sort((a, b) => Number(b.category === category) - Number(a.category === category)).slice(0, 3);
}
