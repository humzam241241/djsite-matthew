'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';
import Uploader from '../_components/Uploader';
import { getGalleryItems } from '@/app/lib/utils';

type GalleryItem = {
  id: string;
  type: 'image' | 'video';
  src: string;
  alt?: string;
  w?: number;
  h?: number;
  poster?: string;
};

export default function AdminGalleryPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchGallery();
  }, []);

  async function fetchGallery() {
    setIsLoading(true);
    try {
      const response = await fetch('/api/content?type=gallery');
      const data = await response.json();
      // Use the utility function to get gallery items in the correct format
      const galleryItems = getGalleryItems(data);
      setGallery(galleryItems);
    } catch (error) {
      console.error('Error fetching gallery:', error);
      setMessage('Failed to load gallery items');
    } finally {
      setIsLoading(false);
    }
  }

  async function saveGallery() {
    setIsSaving(true);
    setMessage('');
    try {
      const response = await fetch('/api/content?type=gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gallery)
      });
      
      if (response.ok) {
        setMessage('Gallery saved successfully!');
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.error || 'Failed to save'}`);
      }
    } catch (error) {
      console.error('Error saving gallery:', error);
      setMessage('Failed to save gallery');
    } finally {
      setIsSaving(false);
    }
  }

  function updateGalleryItem(index: number, field: string, value: any) {
    const newGallery = [...gallery];
    newGallery[index] = {
      ...newGallery[index],
      [field]: value
    };
    setGallery(newGallery);
  }

  function addGalleryItem(type: 'image' | 'video') {
    const newItem: GalleryItem = {
      id: `g${Date.now().toString(36)}${uuidv4().substring(0, 4)}`,
      type,
      src: "",
      alt: type === 'image' ? "New gallery image" : "New gallery video"
    };
    
    setGallery([...gallery, newItem]);
  }

  function removeGalleryItem(index: number) {
    const newGallery = [...gallery];
    newGallery.splice(index, 1);
    setGallery(newGallery);
  }

  function handleMediaUploaded(index: number, url: string) {
    updateGalleryItem(index, "src", url);
  }

  function handlePosterUploaded(index: number, url: string) {
    updateGalleryItem(index, "poster", url);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gallery Management</h1>
        <Link href="/admin" className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">
          Back to Dashboard
        </Link>
      </div>
      
      {message && (
        <div className={`p-3 rounded-lg ${message.includes("Error") ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
          {message}
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <button 
            onClick={() => addGalleryItem('image')} 
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            + Add Image
          </button>
          <button 
            onClick={() => addGalleryItem('video')} 
            className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
          >
            + Add Video
          </button>
        </div>
        <button 
          onClick={saveGallery} 
          disabled={isSaving}
          className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400"
        >
          {isSaving ? "Saving..." : "Save Gallery"}
        </button>
      </div>
      
      {isLoading ? (
        <div>Loading gallery items...</div>
      ) : (
        <div className="space-y-4">
          {gallery.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed">
              <p className="text-gray-500">No gallery items yet. Add some using the buttons above.</p>
            </div>
          ) : (
            gallery.map((item, index) => (
              <div key={item.id} className="card">
                <div className="flex justify-between">
                  <h3 className="text-xl font-semibold">
                    {item.type === 'image' ? 'Image' : 'Video'} #{index + 1}
                  </h3>
                  <button 
                    onClick={() => removeGalleryItem(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
                
                <div className="space-y-4 mt-3">
                  {/* Media Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {item.type === 'image' ? 'Gallery Image' : 'Gallery Video'}
                    </label>
                    <Uploader
                      label={`Upload ${item.type === 'image' ? 'Image' : 'Video'}`}
                      accept={item.type === 'image' ? "image/*" : "video/*"}
                      onUploaded={(url) => handleMediaUploaded(index, url)}
                    />
                  </div>
                  
                  {/* Video Poster (thumbnail) */}
                  {item.type === 'video' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Video Thumbnail (Poster)
                      </label>
                      <Uploader
                        label="Upload Thumbnail"
                        accept="image/*"
                        onUploaded={(url) => handlePosterUploaded(index, url)}
                      />
                    </div>
                  )}
                  
                  {/* Manual URL Input (as fallback) */}
                  <div className="mt-4 pt-4 border-t">
                    <label className="block text-sm font-medium text-gray-700">
                      {item.type === 'image' ? 'Image' : 'Video'} Path (Manual Entry)
                    </label>
                    <div className="text-xs text-gray-500 mb-2">
                      You can also enter the path manually if you prefer.
                    </div>
                    <input
                      type="text"
                      value={item.src}
                      onChange={(e) => updateGalleryItem(index, "src", e.target.value)}
                      className="w-full border rounded-lg p-2"
                      placeholder={item.type === 'image' ? "/uploads/images/example.jpg" : "/uploads/videos/example.mp4"}
                    />
                  </div>
                  
                  {/* Alt Text / Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {item.type === 'image' ? 'Alt Text' : 'Description'}
                    </label>
                    <input
                      type="text"
                      value={item.alt || ''}
                      onChange={(e) => updateGalleryItem(index, "alt", e.target.value)}
                      className="w-full border rounded-lg p-2 mt-1"
                      placeholder={item.type === 'image' ? "Descriptive text for the image" : "Description of the video"}
                    />
                  </div>
                  
                  {/* Dimensions */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Width</label>
                      <input
                        type="number"
                        value={item.w || ''}
                        onChange={(e) => updateGalleryItem(index, "w", parseInt(e.target.value) || undefined)}
                        className="w-full border rounded-lg p-2 mt-1"
                        placeholder="Width in pixels"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Height</label>
                      <input
                        type="number"
                        value={item.h || ''}
                        onChange={(e) => updateGalleryItem(index, "h", parseInt(e.target.value) || undefined)}
                        className="w-full border rounded-lg p-2 mt-1"
                        placeholder="Height in pixels"
                      />
                    </div>
                  </div>
                  
                  {/* Preview */}
                  {item.src && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-700">Preview:</p>
                      <div className="mt-2 p-2 border rounded-lg bg-gray-50">
                        {item.type === 'image' ? (
                          <img 
                            src={item.src} 
                            alt={item.alt} 
                            className="max-h-60 mx-auto"
                          />
                        ) : (
                          <video 
                            src={item.src}
                            poster={item.poster}
                            controls
                            className="max-h-60 mx-auto"
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
