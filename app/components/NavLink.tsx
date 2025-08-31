"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function NavLink({ 
  item 
}: { 
  item: { href: string; scrollId: string; label: string } 
}) {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const isActive = pathname === item.href;
  
  // Listen for hash changes and section visibility
  useEffect(() => {
    if (pathname !== "/") return;
    
    const handleScroll = () => {
      const sections = document.querySelectorAll("section[id]");
      const scrollPosition = window.scrollY + 100;
      
      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop;
        const sectionHeight = section.clientHeight;
        const sectionId = section.getAttribute("id") || "";
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          setActiveSection(sectionId);
        }
      });
    };
    
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);
  
  // For the admin link, we always use a direct link
  if (item.href === "/admin") {
    return (
      <Link 
        href="/admin" 
        className={`navlink ${isActive ? "active" : ""}`}
      >
        {item.label}
      </Link>
    );
  }
  
  // For home page links, we use hash links for smooth scrolling
  if (pathname === "/") {
    const isSectionActive = activeSection === item.scrollId;
    
    return (
      <a 
        href={`#${item.scrollId}`} 
        className={`navlink ${isSectionActive ? "active" : ""}`}
      >
        {item.label}
      </a>
    );
  }
  
  // For other pages, we use direct links
  return (
    <Link 
      href={item.href} 
      className={`navlink ${isActive ? "active" : ""}`}
    >
      {item.label}
    </Link>
  );
}
