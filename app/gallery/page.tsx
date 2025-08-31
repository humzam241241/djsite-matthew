import gallery from "../../content/gallery.json";

export const metadata = {
  title: "Gallery - Sound Vibe",
  description: "Photos from our events and performances."
};

export default function GalleryPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Gallery</h1>
      <p className="text-gray-700">
        Browse through photos from our past events and performances.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {gallery.items.map((g, i) => (
          <div key={i} className="card p-0 overflow-hidden">
            <img src={g.src} alt={g.alt} className="w-full h-48 object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}