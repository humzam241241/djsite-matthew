import Link from "next/link";
import { getAllPages } from "@/lib/pages";
import PageEditor from "../_components/PageEditor";

export default async function AdminPages() {
  const pages = await getAllPages();
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Page Management</h1>
        <Link href="/admin" className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">
          Back to Dashboard
        </Link>
      </div>
      
      <PageEditor pages={pages} />
    </div>
  );
}