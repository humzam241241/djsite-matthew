import { promises as fs } from "fs";
import path from "path";
import { Page, PageForNav, PageSchema } from "@/types/page";

const DATA_PATH = path.join(process.cwd(), "content", "pages.json");
const LOCK_PATH = `${DATA_PATH}.lock`;

async function acquireLock(timeoutMs = 2000): Promise<void> {
  const start = Date.now();
  while (true) {
    try {
      await fs.open(LOCK_PATH, "wx");
      return;
    } catch {
      if (Date.now() - start > timeoutMs) throw new Error("Lock timeout for pages.json");
      await new Promise((r) => setTimeout(r, 25));
    }
  }
}

async function releaseLock(): Promise<void> {
  try { await fs.unlink(LOCK_PATH); } catch {}
}

async function readAllPages(): Promise<Page[]> {
  const raw = await fs.readFile(DATA_PATH, "utf-8").catch(async (e) => {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return "[]";
    throw e;
  });
  const parsed = JSON.parse(raw) as unknown[];
  return parsed.map((p) => PageSchema.parse(p));
}

async function writeAllPages(pages: Page[]): Promise<void> {
  const ordered = [...pages].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  await fs.writeFile(DATA_PATH, JSON.stringify(ordered, null, 2), "utf-8");
}

export async function getAllPagesForNav(): Promise<PageForNav[]> {
  const pages = await readAllPages();
  return pages
    .filter((p) => p.visible !== false)
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      navLabel: p.navLabel,
      order: p.order ?? 0,
      visible: p.visible !== false
    }))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export async function getPageBySlug(slug: string): Promise<Page | undefined> {
  const pages = await readAllPages();
  return pages.find((p) => p.slug === slug);
}

export type UpdatePageInput = Partial<Omit<Page, "id">> & { id: string };

export async function updatePage(id: string, data: Partial<Page>): Promise<Page> {
  await acquireLock();
  try {
    const pages = await readAllPages();
    const index = pages.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Page not found");
    const updated: Page = PageSchema.parse({ ...pages[index], ...data });
    pages[index] = updated;
    await writeAllPages(pages);
    return updated;
  } finally {
    await releaseLock();
  }
}

