"use client";

import { useState } from "react";
import Image from "next/image";
import SafeImage from "./SafeImage";

export type MediaItem = {
  type: "image" | "video";
  src: string;
  alt?: string;
};

export default function MediaGallery({ 
  items 
}: { 
  items: MediaItem[] 
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  
  if (!items || items.length === 0) {
    return (
      <div className="card flex items-center justify-center h-64 bg-gray-100">
        <p className="text-gray-500">No media items</p>
      </div>
    );
  }
  
  const activeItem = items[activeIndex];
  
  return (
    <div className="space-y-4">
      <div className="card p-0 overflow-hidden">
        {activeItem.type === "image" ? (
          <div className="relative h-72 md:h-96 w-full">
            <SafeImage 
              src={activeItem.src} 
              alt={activeItem.alt || "Media"} 
              fill
              className="object-contain"
            />
          </div>
        ) : (
          <video 
            src={activeItem.src} 
            controls
            className="w-full h-72 md:h-96 object-contain"
          />
        )}
      </div>
      
      {items.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden border-2 ${
                index === activeIndex ? "border-brand-primary" : "border-transparent"
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
                <div className="bg-gray-100 w-full h-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
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
