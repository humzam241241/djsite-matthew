"use client";

import { useState } from "react";

type NavigationItem = {
  id: string;
  defaultLabel: string;
  customLabel: string;
  href: string;
  scrollId: string;
  order: number;
  visible: boolean;
};

type NavigationSettings = {
  items: NavigationItem[];
};

export default function NavigationEditor({
  navigation = { items: [] },
  onChange
}: {
  navigation: NavigationSettings;
  onChange: (navigation: NavigationSettings) => void;
}) {
  const [editingItem, setEditingItem] = useState<NavigationItem | null>(null);

  function updateItem(index: number, field: keyof NavigationItem, value: string | boolean | number) {
    const newNavigation = { ...navigation };
    newNavigation.items[index] = {
      ...newNavigation.items[index],
      [field]: value
    };
    onChange(newNavigation);
  }

  function moveItem(index: number, direction: "up" | "down") {
    if (!navigation?.items) return;
    
    const newItems = [...navigation.items];
    
    if (direction === "up" && index > 0) {
      // Swap with previous item
      const temp = newItems[index - 1];
      newItems[index - 1] = newItems[index];
      newItems[index] = temp;
      
      // Update order values
      newItems[index - 1].order = index - 1;
      newItems[index].order = index;
    } else if (direction === "down" && index < newItems.length - 1) {
      // Swap with next item
      const temp = newItems[index + 1];
      newItems[index + 1] = newItems[index];
      newItems[index] = temp;
      
      // Update order values
      newItems[index + 1].order = index + 1;
      newItems[index].order = index;
    }
    
    onChange({ items: newItems });
  }

  function startEditing(item: NavigationItem) {
    setEditingItem({ ...item });
  }

  async function saveEditing() {
    if (!editingItem) return;
    
    const index = navigation.items.findIndex(item => item.id === editingItem.id);
    if (index === -1) return;
    
    const newNavigation = { ...navigation };
    newNavigation.items[index] = editingItem;
    
    // Save the navigation settings first
    try {
      const saveResponse = await fetch('/api/content?type=navigation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNavigation)
      });
      
      if (!saveResponse.ok) {
        console.error('Failed to save navigation settings');
      }
    } catch (error) {
      console.error('Error saving navigation settings:', error);
    }
    
    // Update the state
    onChange(newNavigation);
    
    // Force reload the page to reflect changes everywhere
    window.location.reload();
    
    setEditingItem(null);
  }

  function cancelEditing() {
    setEditingItem(null);
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Navigation Menu</h3>
      
      {/* Navigation Item List */}
      {!editingItem && (
        <div className="space-y-4">
          {navigation.items
            .sort((a, b) => a.order - b.order)
            .map((item, index) => (
              <div key={item.id} className="card">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-medium">
                      {item.customLabel || item.defaultLabel}
                      {item.customLabel !== item.defaultLabel && (
                        <span className="text-sm text-gray-500 ml-2">
                          (Default: {item.defaultLabel})
                        </span>
                      )}
                    </h4>
                    <p className="text-sm text-gray-600">{item.href}</p>
                    <div className="mt-2 flex items-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                        item.visible 
                          ? "bg-green-100 text-green-800" 
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {item.visible ? "Visible" : "Hidden"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => moveItem(index, "up")}
                      className="p-1 rounded text-gray-600 hover:bg-gray-100"
                      title="Move up"
                      disabled={index === 0}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${index === 0 ? 'opacity-30' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button
                      onClick={() => moveItem(index, "down")}
                      className="p-1 rounded text-gray-600 hover:bg-gray-100"
                      title="Move down"
                      disabled={index === navigation.items.length - 1}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${index === navigation.items.length - 1 ? 'opacity-30' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button
                      onClick={() => startEditing(item)}
                      className="p-1 rounded text-blue-600 hover:bg-blue-50"
                      title="Edit"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => updateItem(index, "visible", !item.visible)}
                      className={`p-1 rounded ${item.visible ? 'text-green-600 hover:bg-green-50' : 'text-gray-600 hover:bg-gray-100'}`}
                      title={item.visible ? "Hide" : "Show"}
                    >
                      {item.visible ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                          <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
      
      {/* Edit Navigation Item Form */}
      {editingItem && (
        <div className="card">
          <h4 className="text-lg font-medium mb-4">Edit Navigation Item</h4>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Default Label
              </label>
              <input
                type="text"
                value={editingItem.defaultLabel}
                disabled
                className="w-full border rounded-lg p-2 mt-1 bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-1">
                This is the default label for this navigation item.
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Custom Label
              </label>
              <input
                type="text"
                value={editingItem.customLabel}
                onChange={(e) => setEditingItem({ ...editingItem, customLabel: e.target.value })}
                className="w-full border rounded-lg p-2 mt-1"
                placeholder={editingItem.defaultLabel}
              />
              <p className="text-xs text-gray-500 mt-1">
                This is what will be displayed in the navigation menu. Leave empty to use the default label.
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                URL
              </label>
              <input
                type="text"
                value={editingItem.href}
                disabled
                className="w-full border rounded-lg p-2 mt-1 bg-gray-50"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="visible"
                checked={editingItem.visible}
                onChange={(e) => setEditingItem({ ...editingItem, visible: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="visible" className="text-sm font-medium text-gray-700">
                Visible in Navigation
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
                onClick={saveEditing}
                className="px-4 py-2 rounded-lg bg-brand-primary text-white"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
