'use client';

import { useEffect, useState } from "react";
import type { PageMeta } from "@/app/types/page";
import Link from "next/link";

export default function AdminPages() {
  const [pages, setPages] = useState<PageMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<{[key: string]: boolean}>({});
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    loadPages();
  }, []);

  async function loadPages() {
    setLoading(true);
    try {
      const res = await fetch("/api/pages", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setPages(data);
      } else {
        setMessage({
          text: "Failed to load pages",
          type: "error"
        });
      }
    } catch (error) {
      console.error("Error loading pages:", error);
      setMessage({
        text: "Error loading pages",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  }

  async function renamePage(id: string, title: string) {
    // Set saving state for this page
    setSaving(prev => ({ ...prev, [id]: true }));
    
    try {
      // optimistic update
      setPages(prev => prev.map(p => (p.id === id ? { ...p, title } : p)));
      
      // Use new PATCH /api/nav/[id] to keep Navbar in sync
      const res = await fetch(`/api/nav/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title })
      });
      
      if (!res.ok) {
        // rollback if needed
        const fresh = await fetch("/api/pages", { cache: "no-store" }).then(r => r.json());
        setPages(fresh);
        setMessage({
          text: "Failed to rename page",
          type: "error"
        });
      } else {
        setMessage({
          text: "Page renamed successfully",
          type: "success"
        });
        // Refetch to ensure we have server-confirmed titles
        await loadPages();
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setMessage(null);
        }, 3000);
      }
    } catch (error) {
      console.error("Error renaming page:", error);
      setMessage({
        text: "Error renaming page",
        type: "error"
      });
    } finally {
      setSaving(prev => ({ ...prev, [id]: false }));
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-6 py-1">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-3">
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Page Management</h1>
        <Link href="/admin" className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">
          Back to Dashboard
        </Link>
      </div>
      
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}
      
      <p className="text-gray-600">
        Edit page titles below. Changes will be immediately reflected in the navigation bar and throughout the site.
      </p>
      
      <div className="space-y-4">
        {pages.map((page) => (
          <div key={page.id} className="rounded-lg border p-4 bg-white">
            <div className="mb-2 text-sm text-gray-500">ID: {page.id}</div>
            <div className="mb-2 text-sm text-gray-500">Slug: {page.slug}</div>
            
            <div className="mb-4">
              <label htmlFor={`title-${page.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                Page Title
              </label>
              <div className="relative">
                <input
                  id={`title-${page.id}`}
                  className="w-full rounded-lg border p-2"
                  value={page.title}
                  onChange={(e) => renamePage(page.id, e.target.value)}
                />
                {saving[page.id] && (
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center text-sm">
              <span className="mr-2">Show in Navigation:</span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                page.showInNav ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {page.showInNav ? 'Yes' : 'No'}
              </span>
              
              <span className="ml-4 mr-2">Order:</span>
              <span className="px-2 py-1 rounded-full bg-gray-100 text-xs">
                {page.order}
              </span>
              
              {page.slug !== "/admin" && (
                <a 
                  href={page.slug} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-auto text-blue-600 hover:text-blue-800"
                >
                  View Page
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
