import { z } from "zod";

export const PageSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(1),
  navLabel: z.string().optional(),
  visible: z.boolean().default(true),
  order: z.number().int().nonnegative().default(0),
  heroMediaUrl: z.string().url().optional()
});

export type Page = z.infer<typeof PageSchema>;

export type PageForNav = Pick<Page, "slug" | "title" | "navLabel" | "order" | "visible">;
