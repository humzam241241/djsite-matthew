import testimonials from "../../content/testimonials.json";

export const metadata = {
  title: "Testimonials - Sound Vibe",
  description: "What our clients say about our DJ services."
};

export default function TestimonialsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Testimonials</h1>
      <p className="text-gray-700">
        Don't just take our word for it. Here's what our clients have to say about our services.
      </p>
      <div className="grid md:grid-cols-2 gap-6">
        {testimonials.items.map((t, i) => (
          <blockquote key={i} className="card">
            <p className="italic">"{t.quote}"</p>
            <div className="mt-3 text-sm text-gray-600">— {t.author}</div>
          </blockquote>
        ))}
      </div>
    </div>
  );
}