"use server";

import { revalidatePath } from "next/cache";
import { readJson, writeJson } from "@/app/lib/fsdb";
import { Page, PageSchema } from "@/types/page";
import { z } from "zod";

/**
 * Save updated pages to the pages.json file
 * @param pages Array of page objects to save
 * @returns Success status
 */
export async function savePages(pages: Page[]) {
  // Basic validation
  if (!Array.isArray(pages)) throw new Error("Invalid payload");
  
  // Validate each page with Zod schema
  const validatedPages = pages.map(page => PageSchema.parse(page));
  
  // Ensure slugs remain unique & ids intact
  const ids = new Set(validatedPages.map(p => p.id));
  if (ids.size !== validatedPages.length) throw new Error("Duplicate ids");
  
  const slugs = new Set(validatedPages.map(p => p.slug));
  if (slugs.size !== validatedPages.length) throw new Error("Duplicate slugs");
  
  // Sort by order before saving
  const sortedPages = [...validatedPages].sort((a, b) => a.order - b.order);
  
  // Write to file
  await writeJson("content/pages.json", sortedPages);
  
  // Revalidate all paths to ensure navigation is updated everywhere
  ["/", "/services", "/gallery", "/testimonials", "/about", "/contact"].forEach(p => revalidatePath(p));
  revalidatePath("/", "layout");
  revalidatePath("/admin/pages");
  
  return { ok: true };
}

// Schema for updating a single page
const UpdatePageSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(40).optional(),
  nav: z.boolean().optional(),
  order: z.number().int().nonnegative().optional()
});

type UpdatePageInput = z.infer<typeof UpdatePageSchema>;

/**
 * Update a single page
 * @param input Page update data
 * @returns Updated page
 */
export async function updatePage(input: UpdatePageInput) {
  const { id, ...updates } = UpdatePageSchema.parse(input);
  
  // Read current pages
  const pages = await readJson<Page[]>("content/pages.json");
  
  // Find the page to update
  const index = pages.findIndex(p => p.id === id);
  if (index === -1) throw new Error(`Page with id ${id} not found`);
  
  // Update the page
  const updatedPage = { ...pages[index], ...updates };
  pages[index] = updatedPage;
  
  // Save all pages
  await writeJson("content/pages.json", pages);
  
  // Revalidate paths
  revalidatePath("/", "layout");
  revalidatePath(updatedPage.slug);
  revalidatePath("/admin/pages");
  
  return { ok: true, page: updatedPage };
}
