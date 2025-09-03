"use server";

import { revalidatePath } from "next/cache";
import { readJson, writeJson } from "@/app/lib/fsdb";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

// Define gallery item schema
const GalleryItemSchema = z.object({
  id: z.string().min(1),
  type: z.enum(["image", "video"]),
  src: z.string().min(1),
  alt: z.string().optional(),
  w: z.number().optional(),
  h: z.number().optional(),
  poster: z.string().url().optional() // For video thumbnails
});

export type GalleryItem = z.infer<typeof GalleryItemSchema>;

/**
 * Get all gallery items
 * @returns Array of gallery items
 */
export async function getGalleryItems(): Promise<GalleryItem[]> {
  try {
    return await readJson<GalleryItem[]>("content/gallery.json");
  } catch (error) {
    console.error("Error reading gallery items:", error);
    return [];
  }
}

/**
 * Add a new item to the gallery
 * @param item New gallery item to add
 * @returns Success status
 */
export async function addGalleryItem(item: Omit<GalleryItem, "id">) {
  try {
    // Generate ID if not provided
    const newItem: GalleryItem = {
      ...item,
      id: `g${Date.now().toString(36)}${uuidv4().substring(0, 4)}`
    };
    
    // Validate with schema
    const validatedItem = GalleryItemSchema.parse(newItem);
    
    // Read existing items
    let items: GalleryItem[] = [];
    try {
      items = await readJson<GalleryItem[]>("content/gallery.json");
    } catch (error) {
      // If file doesn't exist or is invalid, start with empty array
      console.warn("Couldn't read gallery.json, creating new file:", error);
    }
    
    // Add new item
    items.push(validatedItem);
    
    // Save to file
    await writeJson("content/gallery.json", items);
    
    // Revalidate gallery page
    revalidatePath("/gallery");
    revalidatePath("/admin/gallery");
    
    return { ok: true, item: validatedItem };
  } catch (error) {
    console.error("Error adding gallery item:", error);
    return { ok: false, error: (error as Error).message };
  }
}

/**
 * Delete a gallery item by ID
 * @param id ID of the item to delete
 * @returns Success status
 */
export async function deleteGalleryItem(id: string) {
  try {
    // Read existing items
    const items = await readJson<GalleryItem[]>("content/gallery.json");
    
    // Filter out the item to delete
    const newItems = items.filter(item => item.id !== id);
    
    // If no items were removed, item wasn't found
    if (newItems.length === items.length) {
      return { ok: false, error: `Item with ID ${id} not found` };
    }
    
    // Save to file
    await writeJson("content/gallery.json", newItems);
    
    // Revalidate gallery page
    revalidatePath("/gallery");
    revalidatePath("/admin/gallery");
    
    return { ok: true };
  } catch (error) {
    console.error("Error deleting gallery item:", error);
    return { ok: false, error: (error as Error).message };
  }
}

/**
 * Update a gallery item
 * @param id ID of the item to update
 * @param updates Updates to apply to the item
 * @returns Success status
 */
export async function updateGalleryItem(id: string, updates: Partial<Omit<GalleryItem, "id">>) {
  try {
    // Read existing items
    const items = await readJson<GalleryItem[]>("content/gallery.json");
    
    // Find the item to update
    const index = items.findIndex(item => item.id === id);
    if (index === -1) {
      return { ok: false, error: `Item with ID ${id} not found` };
    }
    
    // Update the item
    const updatedItem = { ...items[index], ...updates };
    
    // Validate with schema
    const validatedItem = GalleryItemSchema.parse(updatedItem);
    
    // Replace the item
    items[index] = validatedItem;
    
    // Save to file
    await writeJson("content/gallery.json", items);
    
    // Revalidate gallery page
    revalidatePath("/gallery");
    revalidatePath("/admin/gallery");
    
    return { ok: true, item: validatedItem };
  } catch (error) {
    console.error("Error updating gallery item:", error);
    return { ok: false, error: (error as Error).message };
  }
}
