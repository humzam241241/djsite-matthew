'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import LandingPageEditor from '../components/LandingPageEditor';
import PagesEditor from '../components/PagesEditor';
import NavigationEditor from '../components/NavigationEditor';
import Uploader from './_components/Uploader';
import SectionTitleInput from '../components/SectionTitleInput';
import { getGalleryItems } from '../lib/utils';

type ContentType = 'services' | 'testimonials' | 'gallery' | 'about' | 'pages' | 'landing' | 'navigation' | 'contact';

// Type for navigation items
type NavItem = {
  name: string;
  href: string;
  isExternal?: boolean;
};

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState<ContentType>('landing');
  const [content, setContent] = useState<any>(null);
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [navigationLabels, setNavigationLabels] = useState<{[key: string]: string}>({
    landing: 'Landing Page',
    services: 'Services',
    testimonials: 'Testimonials',
    gallery: 'Gallery',
    about: 'About',
    pages: 'Custom Pages',
    navigation: 'Navigation Menu',
    contact: 'Contact'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Load navigation settings first to get custom labels
    fetchNavigationLabels();
    
    if (activeSection === 'navigation') {
      fetchNavigation();
    } else {
      fetchContent(activeSection);
    }
    
    // Set up interval to refresh navigation labels every 5 seconds
    const intervalId = setInterval(fetchNavigationLabels, 5000);
    
    // Clean up on unmount
    return () => clearInterval(intervalId);
  }, [activeSection]);
  
  async function fetchNavigationLabels() {
    // Add a timestamp to prevent caching
    const timestamp = new Date().getTime();
    
    try {
      // Fetch from our new pages API
      const response = await fetch(`/api/pages?t=${timestamp}`, {
        cache: "no-store"
      });
      
      if (response.ok) {
        const pages = await response.json();
        
        // Create a mapping of section IDs to their titles
        const labels: {[key: string]: string} = {
          landing: 'Landing Page',
          pages: 'Custom Pages',
          navigation: 'Navigation Menu'
        };
        
        // Update labels based on page titles
        pages.forEach((page: any) => {
          if (page.id in labels || ['services', 'testimonials', 'gallery', 'about'].includes(page.id)) {
            labels[page.id] = page.title;
          }
        });
        
        setNavigationLabels(labels);
      }
    } catch (error) {
      console.error('Error fetching navigation labels:', error);
    }
  }

  async function fetchNavigation() {
    setIsLoading(true);
    try {
      const response = await fetch('/api/content?type=navigation');
      const data = await response.json();
      setContent(data);
    } catch (error) {
      console.error('Error fetching navigation:', error);
      setMessage('Failed to load navigation settings');
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchContent(type: ContentType) {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/content?type=${type}`);
      const data = await response.json();
      setContent(data);
    } catch (error) {
      console.error('Error fetching content:', error);
      setMessage('Failed to load content');
    } finally {
      setIsLoading(false);
    }
  }

  async function saveContent() {
    setIsSaving(true);
    setMessage('');
    try {
      const response = await fetch(`/api/content?type=${activeSection}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content)
      });
      
      if (response.ok) {
        setMessage('Content saved successfully!');
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.error || 'Failed to save'}`);
      }
    } catch (error) {
      console.error('Error saving content:', error);
      setMessage('Failed to save content');
    } finally {
      setIsSaving(false);
    }
  }

  function handleContentChange(newContent: any) {
    setContent(newContent);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-2">
          <Link href="/admin/pages" className="px-4 py-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-800">
            Page Management
          </Link>
          <Link href="/admin/gallery" className="px-4 py-2 rounded-lg bg-green-100 hover:bg-green-200 text-green-800">
            Gallery Management
          </Link>
        </div>
      </div>
      
      <div className="flex gap-2 border-b pb-2 flex-wrap">
        <button 
          onClick={() => setActiveSection('landing')}
          className={`px-4 py-2 rounded-lg ${activeSection === 'landing' ? 'bg-brand-primary text-white' : 'navlink'}`}
        >
          {navigationLabels.landing}
        </button>
        <button 
          onClick={() => setActiveSection('services')}
          className={`px-4 py-2 rounded-lg ${activeSection === 'services' ? 'bg-brand-primary text-white' : 'navlink'}`}
        >
          {navigationLabels.services}
        </button>
        <button 
          onClick={() => setActiveSection('testimonials')}
          className={`px-4 py-2 rounded-lg ${activeSection === 'testimonials' ? 'bg-brand-primary text-white' : 'navlink'}`}
        >
          {navigationLabels.testimonials}
        </button>
        <button 
          onClick={() => setActiveSection('about')}
          className={`px-4 py-2 rounded-lg ${activeSection === 'about' ? 'bg-brand-primary text-white' : 'navlink'}`}
        >
          {navigationLabels.about}
        </button>
        <button 
          onClick={() => setActiveSection('pages')}
          className={`px-4 py-2 rounded-lg ${activeSection === 'pages' ? 'bg-brand-primary text-white' : 'navlink'}`}
        >
          {navigationLabels.pages}
        </button>
        <button 
          onClick={() => setActiveSection('navigation')}
          className={`px-4 py-2 rounded-lg ${activeSection === 'navigation' ? 'bg-brand-primary text-white' : 'navlink'}`}
        >
          {navigationLabels.navigation}
        </button>
        <button 
          onClick={() => setActiveSection('contact')}
          className={`px-4 py-2 rounded-lg ${activeSection === 'contact' ? 'bg-brand-primary text-white' : 'navlink'}`}
        >
          {navigationLabels.contact}
        </button>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">{navigationLabels[activeSection]}</h2>
            <div className="flex gap-2">
              <Link href={`/${activeSection === 'landing' ? '' : activeSection === 'navigation' ? '' : activeSection}`} className="navlink" target="_blank">
                View {activeSection === 'navigation' ? 'Site' : 'Page'}
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

          {activeSection === 'navigation' ? (
            <NavigationEditor 
              navigation={content} 
              onChange={handleContentChange} 
            />
          ) : activeSection === 'gallery' ? (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="text-lg font-medium text-yellow-800">Gallery Management Updated</h3>
              <p className="mt-2 text-yellow-700">
                We've moved gallery management to a dedicated page for better organization and support for both images and videos.
              </p>
              <div className="mt-4">
                <Link href="/admin/gallery" className="px-4 py-2 rounded-lg bg-yellow-600 text-white hover:bg-yellow-700">
                  Go to Gallery Management
                </Link>
              </div>
            </div>
          ) : (
            <ContentEditor 
              type={activeSection} 
              content={content} 
              onChange={handleContentChange} 
            />
          )}
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
    case 'landing':
      return (
        <LandingPageEditor
          landing={content}
          onChange={onChange}
        />
      );
    case 'services':
      return (
        <ServicesEditor 
          services={content} 
          onChange={onChange} 
        />
      );
    case 'testimonials':
      return (
        <TestimonialsEditor 
          testimonials={content} 
          onChange={onChange} 
        />
      );
    case 'about':
      return (
        <AboutEditor 
          about={content} 
          onChange={onChange} 
        />
      );
    case 'pages':
      return (
        <PagesEditor
          pages={content}
          onChange={onChange}
        />
      );
    case 'contact':
      return (
        <ContactEditor 
          contact={content}
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
  services: { categories: Array<{ slug: string; title: string; description: string }>, sectionTitle?: string }; 
  onChange: (newContent: any) => void;
}) {
  // Initialize section title if not present
  const [sectionTitle, setSectionTitle] = useState(services.sectionTitle || "Services");

  function updateCategory(index: number, field: string, value: string) {
    const newServices = { ...services };
    newServices.categories[index] = {
      ...newServices.categories[index],
      [field]: value
    };
    onChange(newServices);
  }

  function updateSectionTitle(newTitle: string) {
    const newServices = { ...services, sectionTitle: newTitle };
    onChange(newServices);
  }

  function addCategory() {
    const newServices = services ? { ...services } : { categories: [], sectionTitle };
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
      <div className="card">
        <h3 className="text-xl font-semibold mb-3">Section Settings</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
          <SectionTitleInput
            sectionId="services"
            initialValue={sectionTitle}
            onChange={updateSectionTitle}
          />
          <p className="text-xs text-gray-500 mt-1">
            This title will be used in the navigation bar and admin dashboard.
          </p>
        </div>
      </div>
      
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
  testimonials: { items: Array<{ quote: string; author: string }>, sectionTitle?: string }; 
  onChange: (newContent: any) => void;
}) {
  // Initialize section title if not present
  const [sectionTitle, setSectionTitle] = useState(testimonials.sectionTitle || "Testimonials");

  function updateTestimonial(index: number, field: string, value: string) {
    const newTestimonials = { ...testimonials };
    newTestimonials.items[index] = {
      ...newTestimonials.items[index],
      [field]: value
    };
    onChange(newTestimonials);
  }

  function updateSectionTitle(newTitle: string) {
    const newTestimonials = { ...testimonials, sectionTitle: newTitle };
    onChange(newTestimonials);
  }

  function addTestimonial() {
    const newTestimonials = testimonials ? { ...testimonials } : { items: [], sectionTitle };
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
      <div className="card">
        <h3 className="text-xl font-semibold mb-3">Section Settings</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
          <SectionTitleInput
            sectionId="testimonials"
            initialValue={sectionTitle}
            onChange={updateSectionTitle}
          />
          <p className="text-xs text-gray-500 mt-1">
            This title will be used in the navigation bar and admin dashboard.
          </p>
        </div>
      </div>
      
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

function AboutEditor({ 
  about, 
  onChange 
}: { 
  about: { blurb: string; referrals: string[]; sectionTitle?: string }; 
  onChange: (newContent: any) => void;
}) {
  // Initialize section title if not present
  const [sectionTitle, setSectionTitle] = useState(about.sectionTitle || "About");

  function updateBlurb(value: string) {
    const newAbout = about ? { ...about, blurb: value } : { blurb: value, referrals: [], sectionTitle };
    onChange(newAbout);
  }

  function updateSectionTitle(newTitle: string) {
    const newAbout = { ...about, sectionTitle: newTitle };
    onChange(newAbout);
  }

  function updateReferral(index: number, value: string) {
    if (!about || !about.referrals) return;
    const newAbout = { ...about };
    newAbout.referrals[index] = value;
    onChange(newAbout);
  }

  function addReferral() {
    const newAbout = about ? { ...about } : { blurb: "", referrals: [], sectionTitle };
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
        <h3 className="text-xl font-semibold mb-3">Section Settings</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
          <SectionTitleInput
            sectionId="about"
            initialValue={sectionTitle}
            onChange={updateSectionTitle}
          />
          <p className="text-xs text-gray-500 mt-1">
            This title will be used in the navigation bar and admin dashboard.
          </p>
        </div>
      </div>
      
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

function ContactEditor({
  contact,
  onChange
}: {
  contact: { title: string; intro?: string; email?: string; phone?: string; address?: string };
  onChange: (newContent: any) => void;
}) {
  function update(field: keyof typeof contact, value: string) {
    const next = { ...contact, [field]: value };
    onChange(next);
  }

  return (
    <div className="space-y-4">
      <div className="card">
        <h3 className="text-xl font-semibold">Contact Page</h3>
        <div className="space-y-3 mt-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={contact?.title || ''}
              onChange={(e) => update('title', e.target.value)}
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Intro</label>
            <textarea
              value={contact?.intro || ''}
              onChange={(e) => update('intro', e.target.value)}
              rows={3}
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={contact?.email || ''}
                onChange={(e) => update('email', e.target.value)}
                className="w-full border rounded-lg p-2 mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="text"
                value={contact?.phone || ''}
                onChange={(e) => update('phone', e.target.value)}
                className="w-full border rounded-lg p-2 mt-1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              value={contact?.address || ''}
              onChange={(e) => update('address', e.target.value)}
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}