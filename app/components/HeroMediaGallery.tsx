"use client";

import { useState } from "react";
import Image from "next/image";
import SafeImage from "./SafeImage";
import { MediaItem } from "./MediaGallery";

export default function HeroMediaGallery({ 
  items 
}: { 
  items: MediaItem[] 
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  
  if (!items || items.length === 0) {
    return (
      <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">No media items</p>
      </div>
    );
  }
  
  const activeItem = items[activeIndex];
  
  return (
    <div className="absolute inset-0 z-0">
      {/* Main media display */}
      <div className="absolute inset-0 overflow-hidden">
        {activeItem.type === "image" ? (
          <div className="relative w-full h-full">
            <SafeImage 
              src={activeItem.src} 
              alt={activeItem.alt || "Media"} 
              fill
              className="object-cover"
            />
            {/* Semi-transparent overlay for better text readability */}
            <div className="absolute inset-0 bg-black/30"></div>
          </div>
        ) : (
          <div className="relative w-full h-full">
            <video 
              src={activeItem.src} 
              autoPlay
              muted
              loop
              className="w-full h-full object-cover"
            />
            {/* Semi-transparent overlay for better text readability */}
            <div className="absolute inset-0 bg-black/30"></div>
          </div>
        )}
      </div>
      
      {/* Thumbnails for navigation */}
      {items.length > 1 && (
        <div className="absolute bottom-4 right-4 flex gap-2 z-10">
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`relative w-12 h-12 flex-shrink-0 rounded-md overflow-hidden border-2 ${
                index === activeIndex ? "border-white" : "border-gray-300/50"
              }`}
            >
              {item.type === "image" ? (
                <SafeImage
                  src={item.src}
                  alt={item.alt || `Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="bg-gray-800/70 w-full h-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

