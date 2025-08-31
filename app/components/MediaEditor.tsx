"use client";

import { useState } from "react";
import Image from "next/image";
import FileUpload from "./FileUpload";
import SafeImage from "./SafeImage";

type MediaItem = {
  type: "image" | "video";
  src: string;
  alt?: string;
};

export default function MediaEditor({
  items = [],
  onChange
}: {
  items: MediaItem[];
  onChange: (items: MediaItem[]) => void;
}) {
  const [newItemType, setNewItemType] = useState<"image" | "video">("image");
  const [newItemSrc, setNewItemSrc] = useState("");
  const [newItemAlt, setNewItemAlt] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  function addItem() {
    if (!newItemSrc) return;
    
    const newItem: MediaItem = {
      type: newItemType,
      src: newItemSrc,
      alt: newItemAlt || undefined
    };
    
    onChange([...items, newItem]);
    
    // Reset form
    setNewItemSrc("");
    setNewItemAlt("");
  }
  
  function removeItem(index: number) {
    const newItems = [...items];
    newItems.splice(index, 1);
    onChange(newItems);
  }
  
  function moveItem(index: number, direction: "up" | "down") {
    if (
      (direction === "up" && index === 0) || 
      (direction === "down" && index === items.length - 1)
    ) {
      return;
    }
    
    const newItems = [...items];
    const item = newItems[index];
    
    if (direction === "up") {
      newItems[index] = newItems[index - 1];
      newItems[index - 1] = item;
    } else {
      newItems[index] = newItems[index + 1];
      newItems[index + 1] = item;
    }
    
    onChange(newItems);
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Media Items</h3>
      
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="card">
            <div className="flex justify-between items-start">
              <div className="flex gap-4 items-center">
                <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden relative">
                  {item.type === "image" ? (
                    <SafeImage
                      src={item.src}
                      alt={item.alt || `Media item ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium capitalize">{item.type}</p>
                  <p className="text-sm text-gray-600 truncate max-w-xs">{item.src}</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => moveItem(index, "up")}
                  disabled={index === 0}
                  className={`p-1 rounded ${index === 0 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}
                  title="Move up"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={() => moveItem(index, "down")}
                  disabled={index === items.length - 1}
                  className={`p-1 rounded ${index === items.length - 1 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}
                  title="Move down"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={() => removeItem(index)}
                  className="p-1 rounded text-red-600 hover:bg-red-50"
                  title="Remove"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="card bg-gray-50">
        <h4 className="text-md font-medium mb-3">Add New Media Item</h4>
        
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={newItemType === "image"}
                  onChange={() => setNewItemType("image")}
                  className="mr-2"
                />
                Image
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={newItemType === "video"}
                  onChange={() => setNewItemType("video")}
                  className="mr-2"
                />
                Video
              </label>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h5 className="font-medium mb-3">Option 1: Upload File</h5>
            <FileUpload 
              fileType={newItemType}
              onUploadComplete={(fileData) => {
                setNewItemSrc(fileData.url);
                if (!newItemAlt && fileData.name) {
                  setNewItemAlt(fileData.name.split('.')[0]);
                }
              }}
            />
          </div>
          
          <div className="border-t pt-4">
            <h5 className="font-medium mb-3">Option 2: Enter URL</h5>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Source URL
                </label>
                <input
                  type="text"
                  value={newItemSrc}
                  onChange={(e) => setNewItemSrc(e.target.value)}
                  placeholder={newItemType === "image" ? "/images/example.jpg" : "/videos/example.mp4"}
                  className="w-full border rounded-lg p-2 mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter the path to your media file. For images, use .jpg, .png, or .webp. For videos, use .mp4 or .webm.
                </p>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Alt Text {newItemType === "image" && "(for accessibility)"}
              </label>
              <input
                type="text"
                value={newItemAlt}
                onChange={(e) => setNewItemAlt(e.target.value)}
                placeholder={newItemType === "image" ? "Description of image" : "Video title"}
                className="w-full border rounded-lg p-2 mt-1"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            {newItemSrc && (
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
              >
                {showPreview ? "Hide Preview" : "Show Preview"}
              </button>
            )}
            <button
              onClick={addItem}
              disabled={!newItemSrc}
              className={`px-4 py-2 rounded-lg ${
                !newItemSrc ? "bg-gray-300 cursor-not-allowed" : "bg-brand-primary text-white hover:opacity-90"
              }`}
            >
              Add Media Item
            </button>
          </div>
          
          {showPreview && newItemSrc && (
            <div className="mt-4 border-t pt-4">
              <h5 className="font-medium mb-3">Preview</h5>
              <div className="bg-white border rounded-lg p-4 flex justify-center">
                {newItemType === "image" ? (
                  <div className="relative h-64 w-full max-w-md">
                    <SafeImage 
                      src={newItemSrc}
                      alt={newItemAlt || "Preview"}
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <video 
                    src={newItemSrc}
                    controls
                    className="max-h-64 max-w-full"
                    onError={() => {
                      alert("Error loading video. Please check the URL.");
                      setShowPreview(false);
                    }}
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
