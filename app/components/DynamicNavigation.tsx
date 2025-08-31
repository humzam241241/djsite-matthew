"use client";

import { useEffect, useState } from "react";
import NavLink from "./NavLink";
import pages from "../../content/pages.json";

type NavItem = {
  href: string;
  scrollId: string;
  label: string;
};

export default function DynamicNavigation() {
  const [navItems, setNavItems] = useState<NavItem[]>([
    { href: "/", scrollId: "home", label: "Home" },
    { href: "/services", scrollId: "services", label: "Services" },
    { href: "/testimonials", scrollId: "testimonials", label: "Testimonials" },
    { href: "/gallery", scrollId: "gallery", label: "Gallery" },
    { href: "/about", scrollId: "about", label: "About" },
    { href: "/contact", scrollId: "contact", label: "Contact" },
    { href: "/admin", scrollId: "", label: "Admin" },
  ]);

  useEffect(() => {
    // Get custom pages that should be shown in navigation
    const customPages = pages?.pages 
      ? pages.pages
          .filter(page => page.showInNavigation)
          .sort((a, b) => a.order - b.order)
          .map(page => ({
            href: `/${page.slug}`,
            scrollId: "",
            label: page.title
          }))
      : [];

    // Insert custom pages before the Admin link
    const baseNavItems = navItems.filter(item => item.href !== "/admin");
    const adminItem = navItems.find(item => item.href === "/admin");

    setNavItems([
      ...baseNavItems,
      ...customPages,
      ...(adminItem ? [adminItem] : [])
    ]);
  }, []);

  return (
    <nav className="flex gap-1 flex-wrap">
      {navItems.map((item) => (
        <NavLink key={item.href} item={item} />
      ))}
    </nav>
  );
}
