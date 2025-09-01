"use client";

import { useState } from "react";
import MediaEditor from "./MediaEditor";
import Uploader from "../admin/_components/Uploader";

type MediaItem = {
  type: "image" | "video";
  src: string;
  alt?: string;
};

type LandingPageContent = {
  hero: {
    title: string;
    subtitle: string;
    primaryButtonText: string;
    primaryButtonLink: string;
    secondaryButtonText: string;
    secondaryButtonLink: string;
    heroImageUrl?: string | null;
    heroVideoUrl?: string | null;
    mediaItems?: MediaItem[];
  };
  sections: {
    services: {
      title: string;
      description: string;
    };
    testimonials: {
      title: string;
      description: string;
    };
    gallery: {
      title: string;
      description: string;
    };
    about: {
      title: string;
      description: string;
    };
    contact: {
      title: string;
      description: string;
    };
  };
};

export default function LandingPageEditor({
  landing,
  onChange
}: {
  landing: LandingPageContent;
  onChange: (newContent: LandingPageContent) => void;
}) {
  const [activeTab, setActiveTab] = useState<"hero" | "sections" | "media">("hero");

  function updateHero(field: keyof typeof landing.hero, value: string) {
    if (!landing) return;
    const newLanding = { ...landing };
    newLanding.hero = { ...newLanding.hero, [field]: value };
    onChange(newLanding);
  }
  
  function updateMediaItems(items: MediaItem[]) {
    if (!landing) return;
    const newLanding = { ...landing };
    newLanding.hero = { ...newLanding.hero, mediaItems: items };
    onChange(newLanding);
  }

  function updateSection(
    section: keyof typeof landing.sections,
    field: "title" | "description",
    value: string
  ) {
    if (!landing) return;
    const newLanding = { ...landing };
    newLanding.sections = {
      ...newLanding.sections,
      [section]: {
        ...newLanding.sections[section],
        [field]: value
      }
    };
    onChange(newLanding);
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 border-b pb-2">
        <button
          onClick={() => setActiveTab("hero")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "hero" ? "bg-brand-primary text-white" : "navlink"
          }`}
        >
          Hero Section
        </button>
        <button
          onClick={() => setActiveTab("sections")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "sections" ? "bg-brand-primary text-white" : "navlink"
          }`}
        >
          Page Sections
        </button>
      </div>

      {activeTab === "hero" ? (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Hero Section</h3>
          
          {/* Hero Media */}
          <div className="card">
            <h4 className="text-lg font-semibold mb-4">Hero Media</h4>
            
            <div className="space-y-6">
              <div>
                <h5 className="font-medium mb-3">Hero Image</h5>
                <Uploader
                  label="Upload Hero Image"
                  accept="image/*"
                  onUploaded={(url) => updateHero("heroImageUrl", url)}
                />
                {landing?.hero?.heroImageUrl && (
                  <div className="mt-4 rounded-xl overflow-hidden">
                    <img 
                      src={landing.hero.heroImageUrl} 
                      alt="Hero" 
                      className="w-full h-auto max-h-64 object-cover"
                    />
                  </div>
                )}
              </div>

              <div>
                <h5 className="font-medium mb-3">Hero Video</h5>
                <Uploader
                  label="Upload Hero Video"
                  accept="video/*"
                  onUploaded={(url) => updateHero("heroVideoUrl", url)}
                />
                {landing?.hero?.heroVideoUrl && (
                  <div className="mt-4 rounded-xl overflow-hidden">
                    <video 
                      src={landing.hero.heroVideoUrl} 
                      controls 
                      playsInline
                      className="w-full h-auto max-h-64"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Hero Content */}
          <div className="card">
            <h4 className="text-lg font-semibold mb-4">Hero Content</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  value={landing?.hero?.title || ""}
                  onChange={(e) => updateHero("title", e.target.value)}
                  className="w-full border rounded-lg p-2 mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Subtitle
                </label>
                <textarea
                  value={landing?.hero?.subtitle || ""}
                  onChange={(e) => updateHero("subtitle", e.target.value)}
                  className="w-full border rounded-lg p-2 mt-1"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Primary Button Text
                  </label>
                  <input
                    type="text"
                    value={landing?.hero?.primaryButtonText || ""}
                    onChange={(e) =>
                      updateHero("primaryButtonText", e.target.value)
                    }
                    className="w-full border rounded-lg p-2 mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Primary Button Link
                  </label>
                  <input
                    type="text"
                    value={landing?.hero?.primaryButtonLink || ""}
                    onChange={(e) =>
                      updateHero("primaryButtonLink", e.target.value)
                    }
                    className="w-full border rounded-lg p-2 mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Secondary Button Text
                  </label>
                  <input
                    type="text"
                    value={landing?.hero?.secondaryButtonText || ""}
                    onChange={(e) =>
                      updateHero("secondaryButtonText", e.target.value)
                    }
                    className="w-full border rounded-lg p-2 mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Secondary Button Link
                  </label>
                  <input
                    type="text"
                    value={landing?.hero?.secondaryButtonLink || ""}
                    onChange={(e) =>
                      updateHero("secondaryButtonLink", e.target.value)
                    }
                    className="w-full border rounded-lg p-2 mt-1"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Legacy Media Gallery */}
          <div className="card">
            <h4 className="text-lg font-semibold mb-4">Legacy Media Gallery</h4>
            <p className="text-sm text-gray-600 mb-4">
              Note: The Hero Image and Hero Video above are recommended for better performance. 
              This media gallery is kept for backward compatibility.
            </p>
            <MediaEditor 
              items={landing?.hero?.mediaItems || []} 
              onChange={updateMediaItems} 
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Page Sections</h3>

          {Object.entries(landing?.sections || {}).map(([key, section]) => (
            <div key={key} className="card">
              <h4 className="text-lg font-semibold capitalize mb-3">{key} Section</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    value={section.title || ""}
                    onChange={(e) =>
                      updateSection(
                        key as keyof typeof landing.sections,
                        "title",
                        e.target.value
                      )
                    }
                    className="w-full border rounded-lg p-2 mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={section.description || ""}
                    onChange={(e) =>
                      updateSection(
                        key as keyof typeof landing.sections,
                        "description",
                        e.target.value
                      )
                    }
                    className="w-full border rounded-lg p-2 mt-1"
                    rows={2}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}