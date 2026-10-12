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
    lastModified: blog.updated_at ? new Date(blog.updated_at) : new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const staticPages: MetadataRoute.Sitemap = [
    { url: "https://www.hulumart.com/", lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: "https://www.hulumart.com/sell", lastModified: new Date(), changeFrequency: "daily", priority: 0.95 },
    { url: "https://www.hulumart.com/sell/laptop", lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: "https://www.hulumart.com/sell/desktop", lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: "https://www.hulumart.com/about", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: "https://www.hulumart.com/contact", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: "https://www.hulumart.com/terms", lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
    { url: "https://www.hulumart.com/privacy", lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
    { url: "https://www.hulumart.com/blog", lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    // Location Pages - Bangalore
    { url: "https://www.hulumart.com/bangalore", lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: "https://www.hulumart.com/bangalore/macbook", lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    { url: "https://www.hulumart.com/bangalore/dell", lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    { url: "https://www.hulumart.com/bangalore/hp", lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    { url: "https://www.hulumart.com/bangalore/lenovo", lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    // Gaming
    { url: "https://www.hulumart.com/gaming/asus-rog", lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    { url: "https://www.hulumart.com/gaming/acer-predator", lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    // Models
    { url: "https://www.hulumart.com/models/macbook-pro", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: "https://www.hulumart.com/models/macbook-air", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: "https://www.hulumart.com/models/dell-xps", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: "https://www.hulumart.com/models/hp-pavilion", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: "https://www.hulumart.com/models/lenovo-thinkpad", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: "https://www.hulumart.com/models/asus-laptop", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: "https://www.hulumart.com/models/acer-laptop", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: "https://www.hulumart.com/models/samsung-laptop", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: "https://www.hulumart.com/models/microsoft-surface", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: "https://www.hulumart.com/models/imac", lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: "https://www.hulumart.com/models/dell-optiplex", lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: "https://www.hulumart.com/models/hp-desktop", lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: "https://www.hulumart.com/models/lenovo-desktop", lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    // Repair
    { url: "https://www.hulumart.com/repair", lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  ];

  return [...staticPages, ...blogEntries];
}
