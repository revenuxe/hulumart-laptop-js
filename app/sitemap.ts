import { sellingLandings } from "@/lib/selling-landings";
import { serviceAreas } from "@/lib/service-areas";
import type { MetadataRoute } from "next";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { editorialPosts, getEditorialPost } from "@/lib/blog-content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createServerSupabaseClient();

  // Fetch all published blog slugs from Supabase
  const { data: blogs } = await supabase
    .from("blogs")
    .select("slug, updated_at")
    .eq("published", true);

  const allBlogs = [...editorialPosts, ...(blogs ?? []).filter(blog => !getEditorialPost(blog.slug) && blog.slug !== 'sell-used-laptop-bangalore-guide')];
  const blogEntries: MetadataRoute.Sitemap = allBlogs.map((blog) => ({
    url: `https://www.hulumart.com/blog/${blog.slug}`,
    ...(blog.updated_at ? { lastModified: new Date(blog.updated_at) } : {}),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const staticPages: MetadataRoute.Sitemap = [
    { url: "https://www.hulumart.com/", changeFrequency: "daily", priority: 1.0 },
    { url: "https://www.hulumart.com/sell", changeFrequency: "daily", priority: 0.95 },
    { url: "https://www.hulumart.com/sell/laptop", changeFrequency: "daily", priority: 0.9 },
    { url: "https://www.hulumart.com/sell/desktop", changeFrequency: "daily", priority: 0.9 },
    { url: "https://www.hulumart.com/about", changeFrequency: "monthly", priority: 0.8 },
    { url: "https://www.hulumart.com/contact", changeFrequency: "monthly", priority: 0.8 },
    { url: "https://www.hulumart.com/terms", changeFrequency: "yearly", priority: 0.5 },
    { url: "https://www.hulumart.com/privacy", changeFrequency: "yearly", priority: 0.5 },
    { url: "https://www.hulumart.com/blog", changeFrequency: "weekly", priority: 0.7 },
    ...Object.keys(sellingLandings).map(path => ({ url: `https://www.hulumart.com/${path}`, changeFrequency: "monthly" as const, priority: 0.8 })),
    // Repair
    { url: "https://www.hulumart.com/bangalore/areas", changeFrequency: "monthly", priority: 0.7 },
    ...serviceAreas.map(area => ({ url: `https://www.hulumart.com/bangalore/areas/${area.slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
    { url: "https://www.hulumart.com/repair", changeFrequency: "weekly", priority: 0.8 },
  ];

  return [...staticPages, ...blogEntries];
}
