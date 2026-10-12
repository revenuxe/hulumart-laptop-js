import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/dashboard/", "/auth/", "/track/"],
      },
    ],
    sitemap: "https://www.hulumart.com/sitemap.xml",
  };
}
