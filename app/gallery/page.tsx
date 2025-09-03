import gallery from "../../content/gallery.json";
import { getGalleryItems } from "../lib/utils";

export const metadata = {
  title: "Gallery - Sound Vibe",
  description: "Photos from our events and performances."
};

export default function GalleryPage() {
  // Use the utility function to safely get gallery items
  const galleryItems = getGalleryItems(gallery);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Gallery</h1>
      <p className="text-gray-700">
        Browse through photos from our past events and performances.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {galleryItems.map((g, i) => (
          <div key={g.id || i} className="card p-0 overflow-hidden relative">
            <img src={g.src} alt={g.alt} className="w-full h-48 object-cover" />
            {g.type === "video" && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}