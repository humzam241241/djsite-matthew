"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

type CustomPage = {
  id: string;
  title: string;
  slug: string;
  content: string;
  showInNavigation: boolean;
  order: number;
};

type PagesContent = {
  pages: CustomPage[];
};

export default function PagesEditor({
  pages = { pages: [] },
  onChange
}: {
  pages: PagesContent;
  onChange: (pages: PagesContent) => void;
}) {
  const [editingPage, setEditingPage] = useState<CustomPage | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newPage, setNewPage] = useState<Omit<CustomPage, "id">>({
    title: "",
    slug: "",
    content: "<h1>Page Title</h1><p>Page content goes here.</p>",
    showInNavigation: true,
    order: 0
  });

  function startEditing(page: CustomPage) {
    setEditingPage(page);
    setIsCreating(false);
  }

  function cancelEditing() {
    setEditingPage(null);
    setIsCreating(false);
  }

  function startCreating() {
    setEditingPage(null);
    setIsCreating(true);
    setNewPage({
      title: "",
      slug: "",
      content: "<h1>Page Title</h1><p>Page content goes here.</p>",
      showInNavigation: true,
      order: pages?.pages && pages.pages.length > 0 
        ? Math.max(...pages.pages.map(p => p.order)) + 1 
        : 0
    });
  }

  function updatePage(updatedPage: CustomPage) {
    if (!pages?.pages) return;
    
    const updatedPages = pages.pages.map(p => 
      p.id === updatedPage.id ? updatedPage : p
    );
    onChange({ pages: updatedPages });
    setEditingPage(null);
  }

  function createPage() {
    if (!newPage.title || !newPage.slug) return;
    
    const pageWithId: CustomPage = {
      ...newPage,
      id: uuidv4()
    };
    
    const currentPages = pages?.pages || [];
    onChange({ pages: [...currentPages, pageWithId] });
    setIsCreating(false);
  }

  function deletePage(id: string) {
    if (!pages?.pages) return;
    onChange({ pages: pages.pages.filter(p => p.id !== id) });
  }

  function movePageOrder(id: string, direction: "up" | "down") {
    if (!pages?.pages) return;
    
    const pageIndex = pages.pages.findIndex(p => p.id === id);
    if (pageIndex === -1) return;
    
    const page = pages.pages[pageIndex];
    const newPages = [...pages.pages];
    
    if (direction === "up" && pageIndex > 0) {
      // Swap with previous page
      const prevPage = { ...newPages[pageIndex - 1] };
      const currentPage = { ...page };
      
      // Swap orders
      const tempOrder = prevPage.order;
      prevPage.order = currentPage.order;
      currentPage.order = tempOrder;
      
      newPages[pageIndex - 1] = prevPage;
      newPages[pageIndex] = currentPage;
    } else if (direction === "down" && pageIndex < pages.pages.length - 1) {
      // Swap with next page
      const nextPage = { ...newPages[pageIndex + 1] };
      const currentPage = { ...page };
      
      // Swap orders
      const tempOrder = nextPage.order;
      nextPage.order = currentPage.order;
      currentPage.order = tempOrder;
      
      newPages[pageIndex + 1] = nextPage;
      newPages[pageIndex] = currentPage;
    }
    
    onChange({ pages: newPages.sort((a, b) => a.order - b.order) });
  }

  function handleSlugChange(value: string) {
    // Convert to URL-friendly slug
    const slug = value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    
    if (isCreating) {
      setNewPage({ ...newPage, slug });
    } else if (editingPage) {
      setEditingPage({ ...editingPage, slug });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Custom Pages</h3>
        {!isCreating && !editingPage && (
          <button
            onClick={startCreating}
            className="px-4 py-2 rounded-lg bg-brand-primary text-white"
          >
            Add New Page
          </button>
        )}
      </div>
      
      {/* Page List */}
      {!isCreating && !editingPage && (
        <div className="space-y-4">
          {!pages?.pages || pages.pages.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No custom pages yet. Click "Add New Page" to create one.</p>
            </div>
          ) : (
            pages.pages
              .sort((a, b) => a.order - b.order)
              .map(page => (
                <div key={page.id} className="card">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-medium">{page.title}</h4>
                      <p className="text-sm text-gray-600">/{page.slug}</p>
                      <div className="mt-2 flex items-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                          page.showInNavigation 
                            ? "bg-green-100 text-green-800" 
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {page.showInNavigation ? "Shown in navigation" : "Hidden from navigation"}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => movePageOrder(page.id, "up")}
                        className="p-1 rounded text-gray-600 hover:bg-gray-100"
                        title="Move up"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button
                        onClick={() => movePageOrder(page.id, "down")}
                        className="p-1 rounded text-gray-600 hover:bg-gray-100"
                        title="Move down"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button
                        onClick={() => startEditing(page)}
                        className="p-1 rounded text-blue-600 hover:bg-blue-50"
                        title="Edit"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => deletePage(page.id)}
                        className="p-1 rounded text-red-600 hover:bg-red-50"
                        title="Delete"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      )}
      
      {/* Edit Page Form */}
      {editingPage && (
        <div className="space-y-4">
          <div className="card">
            <h4 className="text-lg font-medium mb-4">Edit Page</h4>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Page Title
                </label>
                <input
                  type="text"
                  value={editingPage.title}
                  onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                  className="w-full border rounded-lg p-2 mt-1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  URL Slug
                </label>
                <div className="flex items-center mt-1">
                  <span className="text-gray-500 mr-1">/</span>
                  <input
                    type="text"
                    value={editingPage.slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    className="flex-1 border rounded-lg p-2"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  This will be the URL of your page. Use only letters, numbers, and hyphens.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Page Content (HTML)
                </label>
                <textarea
                  value={editingPage.content}
                  onChange={(e) => setEditingPage({ ...editingPage, content: e.target.value })}
                  className="w-full border rounded-lg p-2 mt-1 font-mono text-sm"
                  rows={10}
                />
                <p className="text-xs text-gray-500 mt-1">
                  You can use HTML tags to format your content.
                </p>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showInNavigation"
                  checked={editingPage.showInNavigation}
                  onChange={(e) => setEditingPage({ ...editingPage, showInNavigation: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="showInNavigation" className="text-sm font-medium text-gray-700">
                  Show in Navigation
                </label>
              </div>
              
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={cancelEditing}
                  className="px-4 py-2 rounded-lg border hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => updatePage(editingPage)}
                  className="px-4 py-2 rounded-lg bg-brand-primary text-white"
                  disabled={!editingPage.title || !editingPage.slug}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Create Page Form */}
      {isCreating && (
        <div className="space-y-4">
          <div className="card">
            <h4 className="text-lg font-medium mb-4">Create New Page</h4>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Page Title
                </label>
                <input
                  type="text"
                  value={newPage.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setNewPage({ 
                      ...newPage, 
                      title,
                      // Auto-generate slug from title if slug is empty
                      slug: newPage.slug === "" ? title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") : newPage.slug
                    });
                  }}
                  className="w-full border rounded-lg p-2 mt-1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  URL Slug
                </label>
                <div className="flex items-center mt-1">
                  <span className="text-gray-500 mr-1">/</span>
                  <input
                    type="text"
                    value={newPage.slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    className="flex-1 border rounded-lg p-2"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  This will be the URL of your page. Use only letters, numbers, and hyphens.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Page Content (HTML)
                </label>
                <textarea
                  value={newPage.content}
                  onChange={(e) => setNewPage({ ...newPage, content: e.target.value })}
                  className="w-full border rounded-lg p-2 mt-1 font-mono text-sm"
                  rows={10}
                />
                <p className="text-xs text-gray-500 mt-1">
                  You can use HTML tags to format your content.
                </p>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showInNavigation"
                  checked={newPage.showInNavigation}
                  onChange={(e) => setNewPage({ ...newPage, showInNavigation: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="showInNavigation" className="text-sm font-medium text-gray-700">
                  Show in Navigation
                </label>
              </div>
              
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={cancelEditing}
                  className="px-4 py-2 rounded-lg border hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={createPage}
                  className="px-4 py-2 rounded-lg bg-brand-primary text-white"
                  disabled={!newPage.title || !newPage.slug}
                >
                  Create Page
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
