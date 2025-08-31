export default function AdminPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p className="text-gray-700">
        Placeholder admin. In production, wire this page to read/write JSON under /content
        (services, testimonials, gallery, about) or connect a DB. Keep this route protected behind
        auth before deploying publicly.
      </p>
      <ul className="list-disc pl-6">
        <li>CRUD: Services (4 categories)</li>
        <li>CRUD: Testimonials</li>
        <li>CRUD: Gallery (image/video items)</li>
        <li>CRUD: About/Referrals</li>
      </ul>
    </div>
  );
}
