import type { Metadata } from "next";
import { getBlogSummaries } from "@/lib/blog-server";
import { jsonLd } from "@/lib/blog";
import { BlogListClient } from "./blog-list-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Hulumart Blog - Laptop Buying Guides, Selling Tips & Tech Insights",
  description:
    "Practical laptop selling guides, refurbished buying checklists, and upgrade comparisons. Get clear answers and plan your next step with Hulumart.",
  keywords: ["laptop blog", "refurbished laptop guide", "selling laptop tips", "tech insights", "laptop comparisons"],
  alternates: { canonical: "https://www.hulumart.com/blog" },
  openGraph: {
    title: "Hulumart Blog - Tech Guides & Insights",
    url: "https://www.hulumart.com/blog",
  },
};

export default async function BlogPage() {
  const blogPosts = await getBlogSummaries();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://www.hulumart.com" },
              { "@type": "ListItem", position: 2, name: "Blog", item: "https://www.hulumart.com/blog" },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "Hulumart Blog",
            description: "Expert guides on buying and selling laptops, tech insights, and market trends",
            url: "https://www.hulumart.com/blog",
            publisher: {
              "@type": "Organization",
              name: "Hulumart",
              logo: { "@type": "ImageObject", url: "https://www.hulumart.com/assets/hulumart-logo.avif" },
            },
          }),
        }}
      />
      <BlogListClient blogPosts={blogPosts} />
    </>
  );
}
