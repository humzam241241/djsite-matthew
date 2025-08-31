import "./globals.css";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sound Vibe — DJ & Events",
  description: "Premium DJ services for weddings, corporate events, and more.",
  openGraph: {
    title: "Sound Vibe — DJ & Events",
    description: "Premium DJ services for weddings, corporate events, and more.",
    url: "https://example.com",
    siteName: "Sound Vibe",
    images: [{ url: "/branding/logo_black.png", width: 1200, height: 630 }],
    locale: "en_CA",
    type: "website"
  },
  icons: [{ rel: "icon", url: "/favicon.ico" }]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const nav = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/testimonials", label: "Testimonials" },
    { href: "/gallery", label: "Gallery" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/admin", label: "Admin" },
  ];
  return (
    <html lang="en">
      <body>
        <header className="border-b">
          <div className="container flex items-center justify-between h-16">
            <Link href="/" className="font-display text-xl">Sound Vibe</Link>
            <nav className="flex gap-1">
              {nav.map((n) => (
                <Link key={n.href} href={n.href} className="navlink">{n.label}</Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="container py-10">{children}</main>
        <footer className="border-t mt-10">
          <div className="container py-6 text-sm text-gray-600">
            © {new Date().getFullYear()} Sound Vibe — Follow us on{" "}
            <a href="https://instagram.com" className="underline">Instagram</a>
          </div>
        </footer>
      </body>
    </html>
  );
}
