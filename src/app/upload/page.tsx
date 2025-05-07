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
    <div className="container mx-auto px-4 py-10 max-w-3xl mb-10">
      <div className="bg-gradient-to-tr from-white via-indigo-50 to-purple-100 border border-purple-200 p-8 rounded-3xl shadow-xl">
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">📤 Upload Your Content</h1>

        <div className="flex gap-4 mb-6">
          <select
            className="select select-bordered w-full"
            value={category}
            onChange={(e) => {
              const newCategory = e.target.value as typeof category;
              setCategory(newCategory);
              setFileType(newCategory === "tutorial" ? "video" : "image");
            }}
          >
            <option value="post">Post</option>
            <option value="tutorial">Tutorial</option>
            <option value="artwork">Artwork</option>
          </select>

          {category !== "tutorial" && (
            <select
              className="select select-bordered w-full"
              value={fileType}
              onChange={(e) => setFileType(e.target.value as typeof fileType)}
            >
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-indigo-600 mb-1">Title</label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="e.g. Stunning Landscape"
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
              placeholder="Describe your creative piece..."
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
                onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-indigo-600 mb-1">Upload File</label>
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
              className="file-input file-input-bordered w-full"
            />
          </div>

          {progress > 0 && progress < 100 && (
            <div className="mt-4 w-full bg-gray-300 rounded h-2 overflow-hidden">
              <div
                className="h-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {mediaUrl && (
            <div className="mt-4">
              {fileType === "image" ? (
                <Image src={mediaUrl} alt="Uploaded"
                width={500} height={500} className="w-full max-h-64 object-contain rounded-xl shadow" />
              ) : (
                <video controls className="w-full max-h-64 rounded-xl shadow">
                  <source src={mediaUrl} type="video/mp4" width={500} height={500}/>
                  
                </video>
              )}
            </div>
          )}

          {error && <div className="text-red-500 font-medium text-sm">⚠️ {error}</div>}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-semibold text-sm shadow-xl hover:scale-[1.01] transition-all duration-300 disabled:opacity-50"
            disabled={uploading || !title || !description || (category === "artwork" && (!price || Number(price) <= 0))}
          >
            {uploading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="animate-spin w-5 h-5 mr-2" /> Uploading...
              </span>
            ) : (
              "Upload File"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
