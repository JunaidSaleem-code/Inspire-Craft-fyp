"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { Loader2 } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useNotification } from "@/components/Notification";
import { useParams } from "next/navigation";
import Image from "next/image";

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
  const id = params?.id?.toString() || "";
  const category = searchParams?.get("category") || "";
  const fileType = searchParams?.get("fileType") || "";
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
          const response = await apiClient.getArtworkById(id);
          console.log('artwork',response);
          setTitle(response.title);
          setDescription(response.description!);
          setMediaUrl(response.mediaUrl);
          setmediawidth(response.transformation?.width ?? 0);
          setmediaheight(response.transformation?.height ?? 0);
          setPrice(response.price);
          setInitialValues({
            title: response.title,
            description: response.description!,
            mediaUrl: response.mediaUrl,
            price: response.price,
            transformation: response.transformation,
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
      const updatedData: EditableContent = { title, description };


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
    return <LoadingSpinner text="Loading content..." />;
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-24">
      <div className="container mx-auto max-w-3xl px-4 py-10">
        <div className="glass-strong border border-white/20 p-8 rounded-3xl shadow-xl">
          <h1 className="text-3xl font-bold text-center mb-6">
            <span className="gradient-text">✏️ Edit {category}</span>
          </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
            <input
              type="text"
              className="w-full px-4 py-3 glass border border-white/20 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all bg-black/50"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
            <textarea
              className="w-full px-4 py-3 glass border border-white/20 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all bg-black/50"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {category === "artwork" && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Price (PKR)</label>
              <input
                type="number"
                className="w-full px-4 py-3 glass border border-white/20 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all bg-black/50"
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
              <label className="block text-sm font-medium text-gray-300 mb-1">Media Preview</label>
              {fileType === "image" ? (
                // <img
                //   src={mediaUrl}
                //   alt="Preview"
                //   className="w-full max-h-64 object-contain rounded-xl shadow"
                // />
                <Image
                 src={mediaUrl} className="w-full max-h-64 rounded-xl shadow" 
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
            <div className="text-red-400 font-medium text-sm">⚠️ {error}</div>
          )}

          <div className="flex flex-wrap gap-4 justify-between mt-6">
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-sm shadow-xl hover:scale-[1.01] transition-all duration-300 disabled:opacity-50"
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
              className="flex-1 py-3 rounded-xl border border-white/20 glass text-gray-300 font-medium text-sm hover:bg-white/10 transition disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 py-3 rounded-xl border border-purple-500 glass text-purple-300 font-medium text-sm hover:bg-purple-500/10 transition"
            >
              Go Back
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}
