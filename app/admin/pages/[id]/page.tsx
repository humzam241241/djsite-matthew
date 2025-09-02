import { notFound } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { getPageBySlug, updatePage } from "@/lib/pages";
import { revalidatePath } from "next/cache";

const FormSchema = z.object({
  title: z.string().min(1),
  navLabel: z.string().optional(),
  slug: z.string().min(1),
  order: z.coerce.number().int().nonnegative().default(0),
  visible: z.coerce.boolean().default(true),
  heroMediaUrl: z.string().url().optional()
});

async function saveAction(prevState: any, formData: FormData) {
  "use server";
  const slugParam = formData.get("slugOriginal") as string;
  const parsed = FormSchema.safeParse({
    title: formData.get("title") || "",
    navLabel: formData.get("navLabel") || undefined,
    slug: formData.get("slug") || slugParam,
    order: formData.get("order") || 0,
    visible: formData.get("visible") === "on",
    heroMediaUrl: formData.get("heroMediaUrl") || undefined
  });
  if (!parsed.success) {
    return { ok: false, error: "Invalid form", issues: parsed.error.flatten() };
  }
  const existing = await getPageBySlug(slugParam);
  if (!existing) return { ok: false, error: "Page not found" };
  const updated = await updatePage(existing.id, parsed.data);
  revalidatePath("/");
  revalidatePath("/admin/pages");
  revalidatePath(`/admin/pages/${slugParam.replace(/^\//, "")}`);
  return { ok: true, page: updated };
}

export default async function EditPage({ params }: { params: { id: string } }) {
  const slug = params.id === "home" ? "/" : `/${params.id}`;
  const page = await getPageBySlug(slug);
  if (!page) return notFound();
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Edit Page</h1>
        <Link href="/admin/pages" className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">Back</Link>
      </div>
      <form action={saveAction} className="space-y-4">
        <input type="hidden" name="slugOriginal" defaultValue={page.slug} />
        <div>
          <label className="block text-sm mb-1">Title</label>
          <input name="title" defaultValue={page.title} className="border rounded px-3 py-2 w-full" />
        </div>
        <div>
          <label className="block text-sm mb-1">Nav Label</label>
          <input name="navLabel" defaultValue={page.navLabel || ""} className="border rounded px-3 py-2 w-full" />
        </div>
        <div>
          <label className="block text-sm mb-1">Slug</label>
          <input name="slug" defaultValue={page.slug} className="border rounded px-3 py-2 w-full" />
        </div>
        <div>
          <label className="block text-sm mb-1">Order</label>
          <input name="order" type="number" defaultValue={page.order ?? 0} className="border rounded px-3 py-2 w-full" />
        </div>
        <div className="flex items-center gap-2">
          <input id="visible" name="visible" type="checkbox" defaultChecked={page.visible !== false} />
          <label htmlFor="visible">Visible</label>
        </div>
        <div>
          <label className="block text-sm mb-1">Hero Media URL</label>
          <input name="heroMediaUrl" defaultValue={page.heroMediaUrl || ""} className="border rounded px-3 py-2 w-full" />
          <p className="text-xs text-gray-500 mt-1">Upload below to Cloudinary and paste the returned secure_url here automatically.</p>
        </div>
        <UploadToCloudinaryInput defaultUrl={page.heroMediaUrl} />
        <button className="px-4 py-2 rounded bg-black text-white">Save</button>
      </form>
    </div>
  );
}

function UploadToCloudinaryInput({ defaultUrl }: { defaultUrl?: string }) {
  return (
    <div className="space-y-2">
      <CloudinaryUploader />
      <script
        dangerouslySetInnerHTML={{
          __html: `
          document.addEventListener('upload:cloudinary:success', function(e) {
            const url = e.detail && e.detail.secure_url;
            if (url) {
              const input = document.querySelector('input[name="heroMediaUrl"]');
              if (input) input.value = url;
            }
          });
        `
        }}
      />
    </div>
  );
}

function CloudinaryUploader() {
  return (
    <div className="rounded border p-4">
      <div className="text-sm mb-2">Upload hero media to Cloudinary</div>
      <form method="post" encType="multipart/form-data" onSubmit={(e) => e.preventDefault()}>
        <input type="file" id="file" name="file" onChange={(e) => uploadDirect(e)} />
      </form>
      <div id="upload-status" className="text-xs text-gray-600 mt-2"></div>
      <script
        dangerouslySetInnerHTML={{
          __html: `
          async function uploadDirect(e){
            const file = e.target.files && e.target.files[0];
            if(!file) return;
            const status = document.getElementById('upload-status');
            status.textContent = 'Requesting signature...';
            const sigRes = await fetch('/api/media/sign');
            if(!sigRes.ok){ status.textContent = 'Failed to get signature'; return; }
            const { signature, timestamp, cloudName, apiKey, uploadPreset } = await sigRes.json();
            const url = ` + "`" + `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload` + "`" + `;
            const form = new FormData();
            form.append('file', file);
            if (uploadPreset) form.append('upload_preset', uploadPreset);
            form.append('api_key', apiKey);
            form.append('timestamp', String(timestamp));
            form.append('signature', signature);
            status.textContent = 'Uploading to Cloudinary...';
            const upRes = await fetch(url, { method: 'POST', body: form });
            const data = await upRes.json();
            if (!upRes.ok) { status.textContent = 'Upload failed: ' + (data.error?.message || upRes.status); return; }
            status.textContent = 'Uploaded: ' + data.secure_url;
            document.dispatchEvent(new CustomEvent('upload:cloudinary:success', { detail: data }));
          }
        `
        }}
      />
    </div>
  );
}


