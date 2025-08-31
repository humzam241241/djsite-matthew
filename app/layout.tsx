import "./globals.css";
import Link from "next/link";
import type { Metadata } from "next";
import ScrollIndicator from "./components/ScrollIndicator";
import DynamicNavigation from "./components/DynamicNavigation";

export const metadata: Metadata = {
  title: "Sound Vibe — DJ & Events",
  description: "Premium DJ services for weddings, corporate events, and more.",
  icons: [{ rel: "icon", url: "/favicon.ico" }]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  
  return (
    <html lang="en" className="scroll-smooth">
      <body>
        <header className="border-b sticky top-0 bg-white z-10">
          <div className="container flex items-center justify-between h-16">
            <Link href="/" className="font-display text-xl">Sound Vibe</Link>
            <DynamicNavigation />
          </div>
        </header>
        <main className="container py-10">
          {children}
          <ScrollIndicator />
        </main>
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