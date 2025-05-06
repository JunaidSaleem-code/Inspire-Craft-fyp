"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { Loader2 } from "lucide-react";
import { useNotification } from "@/components/Notification";
import { useParams } from "next/navigation";
import { IKImage } from "imagekitio-next";

type EditableContent = {
  title: string;
  description: string;
  price?: number;
  mediaUrl?: string;
  transformation?: {
    width: number;
    height: number;
  };
};
export default function EditPage() {
  const params = useParams(); // ✅ hook used at top level
  const searchParams = useSearchParams(); // for fileType, category, etc. from query
  const id = params.id?.toString() || "";
  const category = searchParams.get("category") || "";
  const fileType = searchParams.get("fileType") || "";
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [initialValues, setInitialValues] = useState<EditableContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const[mediawidth, setmediawidth] = useState(0);
  const[mediaheight, setmediaheight] = useState(0);

  const { showNotification } = useNotification();
  const router = useRouter();

  // Fetch content on load
  useEffect(() => {
        const fetchData = async () => {
      try {
         
        if (category === "artwork") {
          const artwork = await apiClient.getArtworkById(id);
          setTitle(artwork.title);
          setDescription(artwork.description!);
          setMediaUrl(artwork.mediaUrl);
          setmediawidth(artwork.transformation?.width ?? 0);
          setmediaheight(artwork.transformation?.height ?? 0);
          setPrice(artwork.price);
          setInitialValues({
            title: artwork.title,
            description: artwork.description!,
            mediaUrl: artwork.mediaUrl,
            price: artwork.price,
            transformation: artwork.transformation,
          });
        } else if (category === "post") {
          const  post  = await apiClient.getPostById(id);
          setTitle(post.title);
          setDescription(post.description!);
          setMediaUrl(post.mediaUrl);
          setmediawidth(post.transformation?.width ?? 0);
          setmediaheight(post.transformation?.height ?? 0);
          setInitialValues({
            title: post.title,
            description: post.description!,
            mediaUrl: post.mediaUrl,
            transformation: post.transformation,
          });
        } else if (category === "tutorial") {
          const  tutorial  = await apiClient.getTutorialById(id);
          setTitle(tutorial.title);
          setDescription(tutorial.description);
          setMediaUrl(tutorial.mediaUrl);
          setmediawidth(tutorial.transformation?.width ?? 0);
          setmediaheight(tutorial.transformation?.height ?? 0);
          setInitialValues({
            title: tutorial.title,
            description: tutorial.description,
            mediaUrl: tutorial.mediaUrl,
            transformation: tutorial.transformation,
          });
        }
        
        setLoading(false);
      } catch {
        setError("Failed to fetch content.");
        showNotification("Failed to fetch content", "error");
      }
    };
    if(id && category){
    fetchData();
    }
  }, [id, category, showNotification]);

  const isDirty =
    title !== initialValues?.title ||
    description !== initialValues?.description ||
    (category === "artwork" && price !== initialValues?.price);

  // Reset form to original values
  const handleCancel = () => {
    if (!initialValues) return;
    setTitle(initialValues.title);
    setDescription(initialValues.description);
    if (category === "artwork") {
      setPrice(initialValues.price!);
    }
  };

  // Submit updated content
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      return setError("Title and Description are required.");
    }

    try {
      setSubmitting(true);
      const updatedData: Partial<Omit<EditableContent, 'transformation'>> = { title, description };


      if (category === "artwork") {
        const parsedPrice = Number(price);
        if (!parsedPrice || parsedPrice <= 0) {
          setError("Please provide a valid price.");
          return; 
        }
        updatedData.price = parsedPrice;
      }

      await apiClient.updateContentById(id!.toString(), category!.toString(), updatedData);
      showNotification("Content updated successfully!", "success");
      router.push("/");
    } catch  {
      const message = "Failed to update content.";
      setError(message);
      showNotification(message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <Loader2 className="animate-spin w-6 h-6 text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      <div className="bg-white border border-gray-200 p-8 rounded-3xl shadow-xl">
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">
          ✏️ Edit {category}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-indigo-600 mb-1">Title</label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-indigo-600 mb-1">Description</label>
            <textarea
              className="textarea textarea-bordered w-full"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {category === "artwork" && (
            <div>
              <label className="block text-sm font-medium text-indigo-600 mb-1">Price (PKR)</label>
              <input
                type="number"
                className="input input-bordered w-full"
                placeholder="e.g. 3000"
                min={0}
                value={price}
                onChange={(e) => {
                  const value = e.target.value;
                  setPrice(value === "" ? "" : Math.max(0, Number(value)));
                }}
                required
              />
            </div>
          )}

          {mediaUrl && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-indigo-600 mb-1">Media Preview</label>
              {fileType === "image" ? (
                // <img
                //   src={mediaUrl}
                //   alt="Preview"
                //   className="w-full max-h-64 object-contain rounded-xl shadow"
                // />
                <IKImage path={mediaUrl} src={mediaUrl} className="w-full max-h-64 rounded-xl shadow" 
                lqip={{active: true, quality: 20}}
                alt={mediaUrl}
                height={mediaheight}
                width={mediawidth}/>
              ) : (
                <video controls className="w-full max-h-64 rounded-xl shadow">
                  <source src={mediaUrl} type={fileType === "video" ? "video/mp4" : undefined} />
                </video>
              )}
            </div>
          )}

          {error && (
            <div className="text-red-500 font-medium text-sm">⚠️ {error}</div>
          )}

          <div className="flex flex-wrap gap-4 justify-between mt-6">
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-semibold text-sm shadow-xl hover:scale-[1.01] transition-all duration-300 disabled:opacity-50"
              disabled={submitting}
            >
              {submitting ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="animate-spin w-5 h-5 mr-2" /> Updating...
                </span>
              ) : (
                "Update Content"
              )}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              disabled={!isDirty}
              className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-100 transition disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 py-3 rounded-xl border border-indigo-500 text-indigo-600 font-medium text-sm hover:bg-indigo-50 transition"
            >
              Go Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
