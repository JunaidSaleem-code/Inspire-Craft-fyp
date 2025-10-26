"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IKUpload } from "imagekitio-next";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { Loader2 } from "lucide-react";
import  {apiClient} from "@/lib/api-client";
import { useNotification } from "@/components/Notification";
import Image from "next/image";

export interface Data {
  title: string;
  description? : string;
  mediaUrl?: string;
  mediaFileId?: string;
  mediaType?: "image" | "video";
  category?: "post" | "tutorial" | "artwork";
  price?: number;
  currency?: string;
}

export default function UploadPage() {
  const [category, setCategory] = useState<"post" | "tutorial" | "artwork">("artwork");
  const [fileType, setFileType] = useState<"image" | "video">("image");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showNotification } = useNotification();
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [mediaFileId, setmediaFileId] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number | "">("");
  const [progress, setProgress] = useState(0);

  const router = useRouter();

  const categoryFolderPaths: Record<typeof category, string> = {
    post: "/post",
    tutorial: "/tutorial",
    artwork: "/artwork",
  };

  const maxFileSize = {
    image: 5 * 1024 * 1024,
    video: 100 * 1024 * 1024,
  };

  const validFileTypes = {
    image: ["image/jpeg", "image/png", "image/webp"],
    video: ["video/mp4", "video/webm", "video/ogg"],
  };

  const validateFile = (file: File) => {
    if (!validFileTypes[fileType].includes(file.type)) {
      setError(`Invalid file type. Please upload a ${fileType} file.`);
      return false;
    }
    if (file.size > maxFileSize[fileType]) {
      setError(`File size must be less than ${maxFileSize[fileType] / (1024 * 1024)}MB.`);
      return false;
    }
    return true;
  };

  const handleStartUpload = () => {
    console.log("start upload");
    setUploading(true);
    setError(null);
  };

  const handleSuccess = (res: IKUploadResponse) => {
    console.log('in success', res);
    setUploading(false);
    setError(null);
    setMediaUrl(res.url);
    setmediaFileId(res.fileId);
    setProgress(100);
  };

  const handleError = (err: { message: string }) => {
    console.log('err', err);
    setError(err.message || "Upload failed.");
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploading) return;
    if (!mediaUrl || !mediaFileId) return setError("File upload is required.");

    try {
      const data: Data = {
        title,
        description,
        mediaUrl,
        mediaFileId,
        mediaType: fileType,
        category,
        price: 0,
        currency: "",
      };

      if (category === "artwork") {
        const parsedPrice = Number(price);
        if (!parsedPrice || parsedPrice <= 0) return setError("Please provide a valid price.");
        data.price = parsedPrice;
        data.currency = "PKR";
      }
      
      console.log('DATA at frontend Upload form',data);

      await apiClient.uploadFile(data, category);
      showNotification(`${category.charAt(0).toUpperCase() + category.slice(1)} uploaded successfully!`, "success");

      // ✅ Clear form
      setTitle("");
      setDescription("");
      setPrice("");
      setMediaUrl(null);
      setmediaFileId(null);
      setProgress(0);

      // ✅ Redirect after success
      router.push("/");
    } catch {
      const message ="Error occurred during submission.";
      setError(message);
      showNotification(message, "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-20">
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <div className="glass-strong border border-white/20 p-8 rounded-3xl shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-black text-white mb-2">
              <span className="gradient-text">Upload Your Art</span>
            </h1>
            <p className="text-gray-400">Share your creativity with the world</p>
          </div>

          <div className="flex gap-4 mb-6">
            <select
              className="w-full px-4 py-3 glass border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all bg-black/50"
              value={category}
              onChange={(e) => {
                const newCategory = e.target.value as typeof category;
                setCategory(newCategory);
                setFileType(newCategory === "tutorial" ? "video" : "image");
              }}
            >
              <option value="post" className="bg-black">Post</option>
              <option value="tutorial" className="bg-black">Tutorial</option>
              <option value="artwork" className="bg-black">Artwork</option>
            </select>

            {category !== "tutorial" && (
              <select
                className="w-full px-4 py-3 glass border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all bg-black/50"
                value={fileType}
                onChange={(e) => setFileType(e.target.value as typeof fileType)}
              >
                <option value="image" className="bg-black">Image</option>
                <option value="video" className="bg-black">Video</option>
              </select>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Title</label>
              <input
                type="text"
                className="w-full px-4 py-3 glass border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all"
                placeholder="e.g. Stunning Landscape"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Description</label>
              <textarea
                className="w-full px-4 py-3 glass border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all resize-none"
                rows={4}
                placeholder="Describe your creative piece..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            {category === "artwork" && (
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Price (PKR)</label>
                <input
                  type="number"
                  className="w-full px-4 py-3 glass border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all"
                  placeholder="e.g. 3000"
                  min={0}
                  value={price}
                  onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Upload File</label>
              <div className="glass border-2 border-dashed border-white/20 rounded-xl p-6 hover:border-purple-500/50 transition-all">
                <IKUpload
                  fileName={`${category}-${fileType}`}
                  folder={categoryFolderPaths[category]}
                  onError={handleError}
                  onSuccess={handleSuccess}
                  onUploadStart={handleStartUpload}
                  accept={fileType === "video" ? "video/*" : "image/*"}
                  onUploadProgress={(progressEvent) => {
                    const progressPercent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                    setProgress(progressPercent);
                  }}
                  useUniqueFileName
                  validateFile={validateFile}
                  className="w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-purple-600 file:to-pink-600 file:text-white hover:file:from-purple-700 hover:file:to-pink-700 file:cursor-pointer"
                />
              </div>
            </div>

            {progress > 0 && progress < 100 && (
              <div className="w-full glass rounded-full h-3 overflow-hidden border border-white/20">
                <div
                  className="h-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-full transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}

            {mediaUrl && (
              <div className="glass rounded-xl p-4 border border-white/20">
                {fileType === "image" ? (
                  <Image 
                    src={mediaUrl} 
                    alt="Uploaded"
                    width={500} 
                    height={500} 
                    className="w-full max-h-80 object-contain rounded-xl" 
                  />
                ) : (
                  <video controls className="w-full max-h-80 rounded-xl">
                    <source src={mediaUrl} type="video/mp4" />
                  </video>
                )}
              </div>
            )}

            {error && (
              <div className="glass border border-red-500/30 rounded-xl p-4 text-red-400 font-medium text-sm flex items-center gap-2">
                <span>⚠️</span>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-lg shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={uploading || !title || !description || (category === "artwork" && (!price || Number(price) <= 0))}
            >
              {uploading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin w-5 h-5" /> 
                  Uploading...
                </span>
              ) : (
                "Upload & Share"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
