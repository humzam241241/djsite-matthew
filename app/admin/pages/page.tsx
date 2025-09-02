import Link from "next/link";
import { getAllPagesForNav } from "@/lib/pages";

export default async function AdminPages() {
  const pages = await getAllPagesForNav();
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Page Management</h1>
        <Link href="/admin" className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">
          Back to Dashboard
        </Link>
      </div>
      <div className="space-y-4">
        {pages.map((page) => (
          <div key={page.slug} className="rounded-lg border p-4 bg-white">
            <div className="mb-2 text-sm text-gray-500">Slug: {page.slug}</div>
            <div className="mb-1 font-medium">{page.navLabel || page.title}</div>
            <Link href={`/admin/pages/${encodeURIComponent(page.slug.replace(/^\//, ""))}`}
              className="text-blue-600 hover:text-blue-800 text-sm">
              Edit
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
