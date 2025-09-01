"use client";

import { useEffect, useState } from "react";
import NavLink from "./NavLink";
import { PageMeta } from "@/app/types/page";

// Define default navigation items as fallback
const DEFAULT_NAV_ITEMS = [
  { href: "/", scrollId: "home", label: "Home" },
  { href: "/services", scrollId: "services", label: "Services" },
  { href: "/testimonials", scrollId: "testimonials", label: "Testimonials" },
  { href: "/gallery", scrollId: "gallery", label: "Gallery" },
  { href: "/about", scrollId: "about", label: "About" },
  { href: "/contact", scrollId: "contact", label: "Contact" },
  { href: "/admin", scrollId: "", label: "Admin" }
];

type NavItem = {
  href: string;
  scrollId: string;
  label: string;
};

export default function DynamicNavigation() {
  const [navItems, setNavItems] = useState<NavItem[]>(DEFAULT_NAV_ITEMS);

  useEffect(() => {
    // Add a timestamp to prevent caching
    const timestamp = new Date().getTime();
    
    async function loadNavigation() {
      try {
        // Fetch pages from our navigation source (pages JSON via API)
        const response = await fetch(`/api/pages?t=${timestamp}`, {
          cache: "no-store"
        });
        
        if (response.ok) {
          const pages = await response.json() as PageMeta[];
          
          // Convert PageMeta to NavItems
          const navItems = pages
            .filter(page => page.showInNav)
            .sort((a, b) => a.order - b.order)
            .map(page => ({
              href: page.slug,
              scrollId: page.slug === "/" ? "home" : page.slug.replace("/", ""),
              label: page.title
            }));
          
          setNavItems(navItems);
        }
      } catch (error) {
        console.error('Error loading navigation:', error);
        // Keep using default navigation items if there's an error
      }
    }
    
    loadNavigation();
    
    // Refresh navigation every 5 seconds to catch updates
    const intervalId = setInterval(loadNavigation, 5000);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <nav className="flex gap-1 flex-wrap">
      {navItems.map((item) => (
        <NavLink key={item.href} item={item} />
      ))}
    </nav>
  );
}