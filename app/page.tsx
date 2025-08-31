import Image from "next/image";
import Link from "next/link";
import services from "../content/services.json";
import testimonials from "../content/testimonials.json";
import gallery from "../content/gallery.json";
import about from "../content/about.json";
import landing from "../content/landing.json";
import pages from "../content/pages.json";
import ContactForm from "./components/ContactForm";
import MediaGallery, { MediaItem } from "./components/MediaGallery";

export default function HomePage() {
  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section id="home" className="grid md:grid-cols-2 gap-8 items-center min-h-[70vh] py-10 relative">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-display font-bold">{landing.hero.title}</h1>
          <p className="text-lg text-gray-700">
            {landing.hero.subtitle}
          </p>
          <div className="flex gap-3">
            <Link href={landing.hero.primaryButtonLink} className="btn">{landing.hero.primaryButtonText}</Link>
            <a href={landing.hero.secondaryButtonLink} className="navlink">{landing.hero.secondaryButtonText}</a>
          </div>
        </div>
        <MediaGallery items={(landing.hero.mediaItems as MediaItem[]) || []} />
        
        {/* Scroll down indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
          <a href="#services" className="flex flex-col items-center text-gray-500 hover:text-brand-primary transition">
            <span className="text-sm mb-1">Scroll Down</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="pt-16 pb-10">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold">{landing.sections.services.title}</h2>
            <Link href="/services" className="navlink">View All</Link>
          </div>
          <p className="text-gray-700">
            {landing.sections.services.description}
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {services.categories.map((s) => (
              <div key={s.slug} className="card">
                <h3 className="text-xl font-semibold">{s.title}</h3>
                <p className="text-gray-700">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="pt-16 pb-10">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold">{landing.sections.testimonials.title}</h2>
            <Link href="/testimonials" className="navlink">View All</Link>
          </div>
          <p className="text-gray-700">
            {landing.sections.testimonials.description}
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
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="pt-16 pb-10">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold">{landing.sections.gallery.title}</h2>
            <Link href="/gallery" className="navlink">View All</Link>
          </div>
          <p className="text-gray-700">
            {landing.sections.gallery.description}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {gallery.items.map((g, i) => (
              <div key={i} className="card p-0 overflow-hidden">
                <img src={g.src} alt={g.alt} className="w-full h-48 object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="pt-16 pb-10">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold">{landing.sections.about.title}</h2>
            <Link href="/about" className="navlink">View All</Link>
          </div>
          <p className="text-gray-700 text-lg">
            {about.blurb}
          </p>
          
          <div className="card">
            <h3 className="text-xl font-semibold mb-3">Our Partners & Referrals</h3>
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
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="pt-16 pb-10">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold">{landing.sections.contact.title}</h2>
            <Link href="/contact" className="navlink">View All</Link>
          </div>
          <p className="text-gray-700">
            {landing.sections.contact.description}
          </p>
          <ContactForm />
        </div>
      </section>
    </div>
  );
}