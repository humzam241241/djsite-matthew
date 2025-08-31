import { notFound } from "next/navigation";
import pages from "../../content/pages.json";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const page = pages.pages.find(p => p.slug === params.slug);
  
  if (!page) {
    return {
      title: "Page Not Found",
      description: "The requested page could not be found."
    };
  }
  
  return {
    title: `${page.title} - Sound Vibe`,
    description: `${page.title} page for Sound Vibe DJ services.`
  };
}

export default function CustomPage({ params }: { params: { slug: string } }) {
  const page = pages.pages.find(p => p.slug === params.slug);
  
  if (!page) {
    notFound();
  }
  
  return (
    <div className="prose max-w-none">
      <div dangerouslySetInnerHTML={{ __html: page.content }} />
    </div>
  );
}

// Generate static paths for all custom pages
export async function generateStaticParams() {
  return pages.pages.map(page => ({
    slug: page.slug
  }));
}

