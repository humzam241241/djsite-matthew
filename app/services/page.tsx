import services from "../../content/services.json";

export const metadata = {
  title: "Services - Sound Vibe",
  description: "Our professional DJ services for weddings, corporate events, and more."
};

export default function ServicesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Services</h1>
      <p className="text-gray-700">
        We offer a range of professional DJ services for various events. Contact us for custom packages.
      </p>
      <div className="grid md:grid-cols-2 gap-6">
        {services.categories.map((s) => (
          <div key={s.slug} className="card">
            <h2 className="text-xl font-semibold">{s.title}</h2>
            <p className="text-gray-700">{s.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}