import "./globals.css";
import type { Metadata } from "next";
import ScrollIndicator from "./components/ScrollIndicator";
import DynamicNavigation from "./components/DynamicNavigation";
import Footer from "./components/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: {
    default: "Sound Vibe — DJ & Events",
    template: "%s | Sound Vibe"
  },
  description: "Premium DJ services for weddings, corporate events, and more.",
  icons: [{ rel: "icon", url: "/favicon.ico" }]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white"
        >
          Skip to content
        </a>
        
        <header className="border-b sticky top-0 bg-white z-10">
          <div className="container flex items-center justify-between h-16">
            {/* Accessible text brand to guarantee visibility */}
            <Link href="/" className="font-display text-xl font-semibold tracking-tight" aria-label="Sound Vibe home">
              <span>Sound </span><span className="text-brand-primary">Vibe</span>
            </Link>
            <DynamicNavigation />
          </div>
        </header>
        
        <main id="main-content" className="container py-10">
          {children}
          <ScrollIndicator />
        </main>
        
        <Footer />
      </body>
    </html>
  );
}