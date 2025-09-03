import SocialLinks from "./SocialLinks";

export default function Footer() {
  return (
    <footer className="border-t mt-10">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <div className="text-xl font-medium mb-2">Sound Vibe</div>
            <p className="text-sm text-gray-600">
              Premium DJ services for weddings, corporate events, and more.
            </p>
            <div className="text-sm text-gray-600 mt-4">
              © {new Date().getFullYear()} Sound Vibe — All rights reserved
            </div>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-4">
            <SocialLinks />
          </div>
        </div>
      </div>
    </footer>
  );
}
