"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function ScrollIndicator() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState("home");
  
  // When on the homepage, highlight based on visible section.
  useEffect(() => {
    if (pathname !== "/") {
      // Derive active from current route when not on home
      const id = pathname === "/" ? "home" : pathname.replace(/^\//, "");
      setActiveSection(id || "home");
      return;
    }

    const sections = document.querySelectorAll("section[id]");

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop;
        const sectionHeight = section.clientHeight;
        const sectionId = section.getAttribute("id") || "";

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          setActiveSection(sectionId);

          // Update URL hash without scrolling
          history.replaceState(null, "", `/#${sectionId}`);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);
  
  const goTo = (id: string) => {
    if (pathname === "/") {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      const href = id === "home" ? "/" : `/${id}`;
      router.push(href);
    }
  };
  
  const sections = [
    { id: "home", label: "Home" },
    { id: "services", label: "Services" },
    { id: "testimonials", label: "Testimonials" },
    { id: "gallery", label: "Gallery" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" }
  ];
  
  return (
    <div className="scroll-indicator hidden md:flex">
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => goTo(section.id)}
          className={`scroll-indicator-dot ${activeSection === section.id ? "active" : ""}`}
          title={section.label}
          aria-label={`Scroll to ${section.label} section`}
        />
      ))}
    </div>
  );
}

