import { getAllPagesForNav } from "@/lib/pages";
import NavLink from "./NavLink";

export default async function DynamicNavigation() {
  const pages = await getAllPagesForNav();
  
  const navItems = pages.map((p) => ({
    href: p.slug,
    scrollId: p.slug === "/" ? "home" : p.slug.replace("/", ""),
    label: p.title
  }));
  
  return (
    <nav className="flex gap-1 flex-wrap">
      {navItems.map((item) => (
        <NavLink key={item.href} item={item} />
      ))}
    </nav>
  );
}