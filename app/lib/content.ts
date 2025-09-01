import { promises as fs } from "fs";
import path from "path";
import { PageMeta } from "@/app/types/page";

const PAGES_PATH = path.join(process.cwd(), "content", "pages.json");

export async function readPages(): Promise<PageMeta[]> {
  const raw = await fs.readFile(PAGES_PATH, "utf-8");
  return JSON.parse(raw) as PageMeta[];
}

export async function writePages(pages: PageMeta[]) {
  // keep deterministic order by `order`
  const sorted = [...pages].sort((a, b) => a.order - b.order);
  await fs.writeFile(PAGES_PATH, JSON.stringify(sorted, null, 2), "utf-8");
  return sorted;
}

export async function updatePageTitle(id: string, newTitle: string) {
  const pages = await readPages();
  const idx = pages.findIndex(p => p.id === id);
  if (idx === -1) throw new Error(`Page with id "${id}" not found`);
  pages[idx] = { ...pages[idx], title: newTitle };
  return writePages(pages);
}
