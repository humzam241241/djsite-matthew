"use client";

import { useState, useTransition } from "react";
import { Page } from "@/types/page";
import { savePages } from "../actions";

interface PageEditorProps {
  pages: Page[];
}

export default function PageEditor({ pages: initialPages }: PageEditorProps) {
  const [pages, setPages] = useState<Page[]>(initialPages);
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<string | null>(null);

  // Update a page property
  const updatePage = (id: string, updates: Partial<Page>) => {
    setPages(current => 
      current.map(page => 
        page.id === id ? { ...page, ...updates } : page
      )
    );
  };

  // Move a page up or down in order
  const movePage = (id: string, direction: "up" | "down") => {
    const index = pages.findIndex(p => p.id === id);
    if (index === -1) return;
    
    const newPages = [...pages];
    
    if (direction === "up" && index > 0) {
      // Swap with previous item
      [newPages[index - 1], newPages[index]] = [newPages[index], newPages[index - 1]];
    } else if (direction === "down" && index < pages.length - 1) {
      // Swap with next item
      [newPages[index], newPages[index + 1]] = [newPages[index + 1], newPages[index]];
    }
    
    // Update order values
    const reordered = newPages.map((page, idx) => ({ ...page, order: idx }));
    setPages(reordered);
  };

  // Save changes
  const saveChanges = () => {
    setStatus("Saving...");
    startTransition(async () => {
      try {
        await savePages(pages);
        setStatus("Saved successfully!");
        setTimeout(() => setStatus(null), 3000);
      } catch (error) {
        console.error("Error saving pages:", error);
        setStatus("Error saving changes");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">Page Management</h2>
        <button
          onClick={saveChanges}
          disabled={isPending}
          className={`px-4 py-2 rounded-lg ${
            isPending 
              ? "bg-gray-300 text-gray-500" 
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {status && (
        <div className={`p-3 rounded-lg ${
          status.includes("Error") 
            ? "bg-red-100 text-red-800" 
            : "bg-green-100 text-green-800"
        }`}>
          {status}
        </div>
      )}

      <div className="space-y-4">
        {pages.map((page, index) => (
          <div key={page.id} className="border rounded-lg p-4 bg-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={page.title}
                  onChange={(e) => updatePage(page.id, { title: e.target.value })}
                  maxLength={40}
                  className="w-full border-b border-gray-300 pb-1 text-lg font-medium focus:border-blue-500 focus:outline-none"
                />
                <div className="text-sm text-gray-500 mt-1">
                  Slug: {page.slug} (read-only)
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`nav-${page.id}`}
                    checked={page.nav}
                    onChange={(e) => updatePage(page.id, { nav: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor={`nav-${page.id}`} className="ml-2 text-sm text-gray-700">
                    Show in Nav
                  </label>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => movePage(page.id, "up")}
                    disabled={index === 0}
                    className={`p-1 rounded ${
                      index === 0 ? "text-gray-300" : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => movePage(page.id, "down")}
                    disabled={index === pages.length - 1}
                    className={`p-1 rounded ${
                      index === pages.length - 1 ? "text-gray-300" : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    ↓
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <button
          onClick={saveChanges}
          disabled={isPending}
          className={`px-4 py-2 rounded-lg ${
            isPending 
              ? "bg-gray-300 text-gray-500" 
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
