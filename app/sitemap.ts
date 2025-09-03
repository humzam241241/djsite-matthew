import { MetadataRoute } from "next";
import { readJson } from "@/app/lib/fsdb";
import { Page } from "@/types/page";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get base URL from environment or default to localhost
  const baseUrl = process.env.SITE_URL ?? "http://localhost:3000";
  
  // Get all pages from pages.json
  const pages = await readJson<Page[]>("content/pages.json");
  
  // Create sitemap entries for each page
  const entries = pages.map(page => ({
    url: `${baseUrl}${page.slug}`,
    lastModified: new Date(),
    changeFrequency: page.slug === "/" ? "daily" : "weekly",
    priority: page.slug === "/" ? 1.0 : 0.8
  } as const));
  
  return entries;
}
