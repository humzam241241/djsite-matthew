'use client';

import { useState, useEffect } from 'react';

type Props = {
  sectionId: string;
  initialValue: string;
  onChange: (value: string) => void;
};

export default function SectionTitleInput({ sectionId, initialValue, onChange }: Props) {
  const [value, setValue] = useState(initialValue);
  const [isSaving, setIsSaving] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

  // Update navigation settings when title changes
  const updateNavigationLabel = async (newTitle: string) => {
    try {
      setIsSaving(true);
      
      // First fetch current navigation settings
      const response = await fetch('/api/content?type=navigation');
      if (response.ok) {
        const navigationSettings = await response.json();
        
        // Find the matching navigation item
        const itemIndex = navigationSettings.items.findIndex(
          (item: any) => item.id === sectionId
        );
        
        if (itemIndex !== -1) {
          // Update the custom label
          navigationSettings.items[itemIndex].customLabel = newTitle;
          
          // Save the updated navigation settings
          await fetch('/api/content?type=navigation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(navigationSettings)
          });
          
          console.log(`Updated navigation label for ${sectionId} to "${newTitle}"`);
        }
      }
    } catch (error) {
      console.error('Error updating navigation label:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle input change with debounce
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    
    // Call the parent's onChange handler
    onChange(newValue);
    
    // Debounce the navigation update
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    
    const timeout = setTimeout(() => {
      updateNavigationLabel(newValue);
    }, 1000); // Wait 1 second after typing stops
    
    setDebounceTimeout(timeout);
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    };
  }, [debounceTimeout]);

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        className={`w-full border rounded-lg p-2 ${isSaving ? 'bg-gray-50' : ''}`}
      />
      {isSaving && (
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      )}
    </div>
  );
}
