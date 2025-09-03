import { readJson } from "@/app/lib/fsdb";
import { Page, PageForNav } from "@/types/page";

/**
 * Get all pages that should appear in navigation
 * @returns Array of pages for navigation
 */
export async function getAllPagesForNav(): Promise<PageForNav[]> {
  const pages = await readJson<Page[]>("content/pages.json");
  return pages
    .filter((p) => p.nav === true)
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      order: p.order,
      nav: p.nav
    }))
    .sort((a, b) => a.order - b.order);
}

/**
 * Get a page by its slug
 * @param slug The page slug
 * @returns The page or undefined if not found
 */
export async function getPageBySlug(slug: string): Promise<Page | undefined> {
  const pages = await readJson<Page[]>("content/pages.json");
  return pages.find((p) => p.slug === slug);
}

/**
 * Get all pages
 * @returns Array of all pages
 */
export async function getAllPages(): Promise<Page[]> {
  return await readJson<Page[]>("content/pages.json");
}
