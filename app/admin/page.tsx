"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import LandingPageEditor from "../components/LandingPageEditor";
import PagesEditor from "../components/PagesEditor";

type ContentType = "services" | "testimonials" | "gallery" | "about" | "pages" | "landing";

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState<ContentType>("services");
  const [content, setContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchContent(activeSection);
  }, [activeSection]);

  async function fetchContent(type: ContentType) {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/content?type=${type}`);
      const data = await response.json();
      setContent(data);
    } catch (error) {
      console.error("Error fetching content:", error);
      setMessage("Failed to load content");
    } finally {
      setIsLoading(false);
    }
  }

  async function saveContent() {
    setIsSaving(true);
    setMessage("");
    try {
      const response = await fetch(`/api/content?type=${activeSection}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content)
      });
      
      if (response.ok) {
        setMessage("Content saved successfully!");
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.error || "Failed to save"}`);
      }
    } catch (error) {
      console.error("Error saving content:", error);
      setMessage("Failed to save content");
    } finally {
      setIsSaving(false);
    }
  }

  function handleContentChange(newContent: any) {
    setContent(newContent);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      
      <div className="flex gap-2 border-b pb-2 flex-wrap">
        <button 
          onClick={() => setActiveSection("landing")}
          className={`px-4 py-2 rounded-lg ${activeSection === "landing" ? "bg-brand-primary text-white" : "navlink"}`}
        >
          Landing Page
        </button>
        <button 
          onClick={() => setActiveSection("services")}
          className={`px-4 py-2 rounded-lg ${activeSection === "services" ? "bg-brand-primary text-white" : "navlink"}`}
        >
          Services
        </button>
        <button 
          onClick={() => setActiveSection("testimonials")}
          className={`px-4 py-2 rounded-lg ${activeSection === "testimonials" ? "bg-brand-primary text-white" : "navlink"}`}
        >
          Testimonials
        </button>
        <button 
          onClick={() => setActiveSection("gallery")}
          className={`px-4 py-2 rounded-lg ${activeSection === "gallery" ? "bg-brand-primary text-white" : "navlink"}`}
        >
          Gallery
        </button>
        <button 
          onClick={() => setActiveSection("about")}
          className={`px-4 py-2 rounded-lg ${activeSection === "about" ? "bg-brand-primary text-white" : "navlink"}`}
        >
          About
        </button>
        <button 
          onClick={() => setActiveSection("pages")}
          className={`px-4 py-2 rounded-lg ${activeSection === "pages" ? "bg-brand-primary text-white" : "navlink"}`}
        >
          Custom Pages
        </button>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold capitalize">{activeSection}</h2>
            <div className="flex gap-2">
              <Link href={`/${activeSection}`} className="navlink" target="_blank">
                View Page
              </Link>
              <button 
                onClick={saveContent} 
                disabled={isSaving}
                className="btn"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>

          {message && (
            <div className={`p-3 rounded-lg ${message.includes("Error") ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
              {message}
            </div>
          )}

          <ContentEditor 
            type={activeSection} 
            content={content} 
            onChange={handleContentChange} 
          />
        </div>
      )}
    </div>
  );
}

function ContentEditor({ 
  type, 
  content, 
  onChange 
}: { 
  type: ContentType; 
  content: any; 
  onChange: (newContent: any) => void;
}) {
  if (!content) return null;

  switch (type) {
    case "landing":
      return (
        <LandingPageEditor
          landing={content}
          onChange={onChange}
        />
      );
    case "services":
      return (
        <ServicesEditor 
          services={content} 
          onChange={onChange} 
        />
      );
    case "testimonials":
      return (
        <TestimonialsEditor 
          testimonials={content} 
          onChange={onChange} 
        />
      );
    case "gallery":
      return (
        <GalleryEditor 
          gallery={content} 
          onChange={onChange} 
        />
      );
    case "about":
      return (
        <AboutEditor 
          about={content} 
          onChange={onChange} 
        />
      );
    case "pages":
      return (
        <PagesEditor
          pages={content}
          onChange={onChange}
        />
      );
    default:
      return <div>Unknown content type</div>;
  }
}

function ServicesEditor({ 
  services, 
  onChange 
}: { 
  services: { categories: Array<{ slug: string; title: string; description: string }> }; 
  onChange: (newContent: any) => void;
}) {
  function updateCategory(index: number, field: string, value: string) {
    const newServices = { ...services };
    newServices.categories[index] = {
      ...newServices.categories[index],
      [field]: value
    };
    onChange(newServices);
  }

  function addCategory() {
    const newServices = services ? { ...services } : { categories: [] };
    if (!newServices.categories) {
      newServices.categories = [];
    }
    newServices.categories.push({
      slug: `service-${newServices.categories.length + 1}`,
      title: "New Service",
      description: "Description for the new service"
    });
    onChange(newServices);
  }

  function removeCategory(index: number) {
    if (!services || !services.categories) return;
    const newServices = { ...services };
    newServices.categories.splice(index, 1);
    onChange(newServices);
  }

  return (
    <div className="space-y-4">
      <button onClick={addCategory} className="navlink">
        + Add Service Category
      </button>
      
      {services && services.categories && services.categories.map((category, index) => (
        <div key={index} className="card">
          <div className="flex justify-between">
            <h3 className="text-xl font-semibold">Service #{index + 1}</h3>
            <button 
              onClick={() => removeCategory(index)}
              className="text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>
          
          <div className="space-y-3 mt-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Slug</label>
              <input
                type="text"
                value={category.slug}
                onChange={(e) => updateCategory(index, "slug", e.target.value)}
                className="w-full border rounded-lg p-2 mt-1"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={category.title}
                onChange={(e) => updateCategory(index, "title", e.target.value)}
                className="w-full border rounded-lg p-2 mt-1"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={category.description}
                onChange={(e) => updateCategory(index, "description", e.target.value)}
                className="w-full border rounded-lg p-2 mt-1"
                rows={3}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TestimonialsEditor({ 
  testimonials, 
  onChange 
}: { 
  testimonials: { items: Array<{ quote: string; author: string }> }; 
  onChange: (newContent: any) => void;
}) {
  function updateTestimonial(index: number, field: string, value: string) {
    const newTestimonials = { ...testimonials };
    newTestimonials.items[index] = {
      ...newTestimonials.items[index],
      [field]: value
    };
    onChange(newTestimonials);
  }

  function addTestimonial() {
    const newTestimonials = testimonials ? { ...testimonials } : { items: [] };
    if (!newTestimonials.items) {
      newTestimonials.items = [];
    }
    newTestimonials.items.push({
      quote: "Great service!",
      author: "New Client"
    });
    onChange(newTestimonials);
  }

  function removeTestimonial(index: number) {
    if (!testimonials || !testimonials.items) return;
    const newTestimonials = { ...testimonials };
    newTestimonials.items.splice(index, 1);
    onChange(newTestimonials);
  }

  return (
    <div className="space-y-4">
      <button onClick={addTestimonial} className="navlink">
        + Add Testimonial
      </button>
      
      {testimonials && testimonials.items && testimonials.items.map((testimonial, index) => (
        <div key={index} className="card">
          <div className="flex justify-between">
            <h3 className="text-xl font-semibold">Testimonial #{index + 1}</h3>
            <button 
              onClick={() => removeTestimonial(index)}
              className="text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>
          
          <div className="space-y-3 mt-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Quote</label>
              <textarea
                value={testimonial.quote}
                onChange={(e) => updateTestimonial(index, "quote", e.target.value)}
                className="w-full border rounded-lg p-2 mt-1"
                rows={3}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Author</label>
              <input
                type="text"
                value={testimonial.author}
                onChange={(e) => updateTestimonial(index, "author", e.target.value)}
                className="w-full border rounded-lg p-2 mt-1"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function GalleryEditor({ 
  gallery, 
  onChange 
}: { 
  gallery: { items: Array<{ src: string; alt: string }> }; 
  onChange: (newContent: any) => void;
}) {
  function updateGalleryItem(index: number, field: string, value: string) {
    const newGallery = { ...gallery };
    newGallery.items[index] = {
      ...newGallery.items[index],
      [field]: value
    };
    onChange(newGallery);
  }

  function addGalleryItem() {
    const newGallery = gallery ? { ...gallery } : { items: [] };
    if (!newGallery.items) {
      newGallery.items = [];
    }
    newGallery.items.push({
      src: "/placeholder.jpg",
      alt: "New gallery item"
    });
    onChange(newGallery);
  }

  function removeGalleryItem(index: number) {
    if (!gallery || !gallery.items) return;
    const newGallery = { ...gallery };
    newGallery.items.splice(index, 1);
    onChange(newGallery);
  }

  return (
    <div className="space-y-4">
      <button onClick={addGalleryItem} className="navlink">
        + Add Gallery Item
      </button>
      
      {gallery && gallery.items && gallery.items.map((item, index) => (
        <div key={index} className="card">
          <div className="flex justify-between">
            <h3 className="text-xl font-semibold">Gallery Item #{index + 1}</h3>
            <button 
              onClick={() => removeGalleryItem(index)}
              className="text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>
          
          <div className="space-y-3 mt-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Image Path</label>
              <input
                type="text"
                value={item.src}
                onChange={(e) => updateGalleryItem(index, "src", e.target.value)}
                className="w-full border rounded-lg p-2 mt-1"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Alt Text</label>
              <input
                type="text"
                value={item.alt}
                onChange={(e) => updateGalleryItem(index, "alt", e.target.value)}
                className="w-full border rounded-lg p-2 mt-1"
              />
            </div>
            
            {item.src && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">Preview:</p>
                <img 
                  src={item.src} 
                  alt={item.alt} 
                  className="max-h-40 mt-1 border rounded"
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function AboutEditor({ 
  about, 
  onChange 
}: { 
  about: { blurb: string; referrals: string[] }; 
  onChange: (newContent: any) => void;
}) {
  function updateBlurb(value: string) {
    const newAbout = about ? { ...about, blurb: value } : { blurb: value, referrals: [] };
    onChange(newAbout);
  }

  function updateReferral(index: number, value: string) {
    if (!about || !about.referrals) return;
    const newAbout = { ...about };
    newAbout.referrals[index] = value;
    onChange(newAbout);
  }

  function addReferral() {
    const newAbout = about ? { ...about } : { blurb: "", referrals: [] };
    if (!newAbout.referrals) {
      newAbout.referrals = [];
    }
    newAbout.referrals.push("New Referral");
    onChange(newAbout);
  }

  function removeReferral(index: number) {
    if (!about || !about.referrals) return;
    const newAbout = { ...about };
    newAbout.referrals.splice(index, 1);
    onChange(newAbout);
  }

  return (
    <div className="space-y-4">
      <div className="card">
        <h3 className="text-xl font-semibold">About Blurb</h3>
        <div className="mt-3">
          <textarea
            value={about.blurb}
            onChange={(e) => updateBlurb(e.target.value)}
            className="w-full border rounded-lg p-2"
            rows={4}
          />
        </div>
      </div>
      
      <div className="card">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Referrals</h3>
          <button onClick={addReferral} className="navlink">
            + Add Referral
          </button>
        </div>
        
        <div className="space-y-3 mt-3">
          {about && about.referrals && about.referrals.map((referral, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={referral}
                onChange={(e) => updateReferral(index, e.target.value)}
                className="flex-1 border rounded-lg p-2"
              />
              <button 
                onClick={() => removeReferral(index)}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}