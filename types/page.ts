import { z } from "zod";

export const PageSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(1).max(40),
  nav: z.boolean().default(true),
  order: z.number().int().nonnegative().default(0),
  heroMediaUrl: z.string().url().optional()
});

export type Page = z.infer<typeof PageSchema>;

export type PageForNav = Pick<Page, "slug" | "title" | "order" | "nav">;