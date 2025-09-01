export type PageMeta = {
  id: string;       // stable uuid-ish
  slug: string;     // used for routing
  title: string;    // human-readable label
  showInNav: boolean;
  order: number;    // for navbar ordering
};
