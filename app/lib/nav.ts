import pages from "../../content/pages.json";
import type { PageMeta } from "@/app/types/page";
import { promises as fs } from "fs";
import path from "path";

const PAGES_PATH = path.join(process.cwd(), "content", "pages.json");

export async function getNavItems(): Promise<PageMeta[]> {
  // Read fresh from disk to avoid stale imports in dev
  try {
    const raw = await fs.readFile(PAGES_PATH, "utf-8");
    const data = JSON.parse(raw) as PageMeta[];
    return data.filter(p => p.showInNav).sort((a, b) => a.order - b.order);
  } catch {
    // Fallback to import snapshot
    return (pages as PageMeta[]).filter(p => p.showInNav).sort((a, b) => a.order - b.order);
  }
}

export async function updateNavItemTitle(id: string, title: string): Promise<PageMeta> {
  const raw = await fs.readFile(PAGES_PATH, "utf-8");
  const items = JSON.parse(raw) as PageMeta[];
  const idx = items.findIndex(i => i.id === id);
  if (idx === -1) throw new Error("Nav item not found");
  items[idx] = { ...items[idx], title };
  await fs.writeFile(PAGES_PATH, JSON.stringify(items, null, 2), "utf-8");
  return items[idx];
}


