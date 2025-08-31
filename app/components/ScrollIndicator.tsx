"use client";

import { useEffect, useState } from "react";

export default function ScrollIndicator() {
  const [activeSection, setActiveSection] = useState("home");
  
  useEffect(() => {
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
  }, []);
  
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
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
          onClick={() => scrollTo(section.id)}
          className={`scroll-indicator-dot ${activeSection === section.id ? "active" : ""}`}
          title={section.label}
          aria-label={`Scroll to ${section.label} section`}
        />
      ))}
    </div>
  );
}

