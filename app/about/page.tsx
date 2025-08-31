import about from "../../content/about.json";

export const metadata = {
  title: "About - Sound Vibe",
  description: "Learn about Sound Vibe DJ services and our team."
};

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">About Sound Vibe</h1>
      <p className="text-gray-700 text-lg">
        {about.blurb}
      </p>
      
      <div className="card">
        <h2 className="text-xl font-semibold mb-3">Our Partners & Referrals</h2>
        <ul className="space-y-2">
          {about.referrals.map((r, i) => (
            <li key={i} className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-primary mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {r}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="card">
        <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
        <p className="text-gray-700">
          Want to learn more about our services or book us for your event?
        </p>
        <a href="/contact" className="btn inline-block mt-3">Get in Touch</a>
      </div>
    </div>
  );
}