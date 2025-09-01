"use client";

import { useEffect, useState } from "react";
import NavLink from "./NavLink";
import customPages from "../../content/pages.json";

// Define default navigation items
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
        // Try to fetch navigation settings from API with cache-busting
        const response = await fetch(`/api/content?type=navigation&t=${timestamp}`);
        if (response.ok) {
          const navigationSettings = await response.json();
          
          // Get the navigation items from the navigation settings
          const baseNavItems = navigationSettings.items
            .filter((item: any) => item.visible)
            .sort((a: any, b: any) => a.order - b.order)
            .map((item: any) => ({
              href: item.href,
              scrollId: item.scrollId,
              label: item.customLabel || item.defaultLabel
            }));
    
          // Get custom pages that should be shown in navigation but aren't already in the navigation settings
          const existingPaths = new Set(baseNavItems.map((item: any) => item.href));
          const additionalCustomPages = customPages?.pages 
            ? customPages.pages
                .filter(page => page.showInNavigation && !existingPaths.has(`/${page.slug}`))
                .sort((a, b) => a.order - b.order)
                .map(page => ({
                  href: `/${page.slug}`,
                  scrollId: "",
                  // Use navigationName if available, otherwise fall back to title
                  label: page.navigationName || page.title
                }))
            : [];
    
          // Combine the base navigation items with any additional custom pages
          setNavItems([
            ...baseNavItems,
            ...additionalCustomPages
          ]);
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