import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  // Get base URL from environment or default to localhost
  const baseUrl = process.env.SITE_URL ?? "http://localhost:3000";
  
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/"]
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl
  };
}
