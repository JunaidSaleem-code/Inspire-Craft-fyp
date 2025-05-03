"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { apiClient } from "@/lib/api-client";
import { useNotification } from "@/components/Notification";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IKUpload } from "imagekitio-next";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { Loader2 } from "lucide-react";

export default function EditProfilePage({ params }: { params: { userId: string } }) {
  const { data: session } = useSession();
  const router = useRouter();
  const { showNotification } = useNotification();

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const userId = params.userId;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiClient.getUserById(userId);
        setName(data.username || "");
        setBio(data.bio || "");
        setAvatar(data.avatar || "");
      } catch {
        showNotification("Failed to load profile", "error");
      }
    };

    fetchProfile();
  }, [userId, showNotification]);

  const validateImageFile = (file: File) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 5 * 1024 * 1024;
    if (!allowedTypes.includes(file.type)) {
      setError("Invalid file type. Please upload a JPG, PNG, or WEBP image.");
      return false;
    }
    if (file.size > maxSize) {
      setError("File size must be under 5MB.");
      return false;
    }
    return true;
  };

  const handleAvatarUploadStart = () => {
    setUploading(true);
    setError(null);
  };

  const handleAvatarSuccess = (res: IKUploadResponse) => {
    setAvatar(res.url);
    setUploading(false);
    setProgress(100);
  };

  const handleAvatarError = (err: { message: string }) => {
    setError(err.message || "Upload failed.");
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.updateUser(userId, { name, bio, avatar });
      showNotification("Profile updated successfully", "success");
      router.push(`/profile/${userId}`);
    } catch (err: any) {
      const message = err?.response?.data?.message || err.message || "Failed to update profile.";
      showNotification(message, "error");
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <div className="bg-gradient-to-tr from-white via-indigo-50 to-purple-100 border border-purple-200 p-8 rounded-3xl shadow-xl">
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">✏️ Edit Your Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-indigo-600 mb-1">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div>
            <label className="block text-sm font-medium text-indigo-600 mb-1">Bio</label>
            <textarea
              className="textarea textarea-bordered w-full"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-indigo-600 mb-1">Avatar</label>
            <IKUpload
              fileName={`avatar-${userId}`}
              folder="/avatars"
              onUploadStart={handleAvatarUploadStart}
              onSuccess={handleAvatarSuccess}
              onError={handleAvatarError}
              useUniqueFileName
              validateFile={validateImageFile}
              accept="image/*"
              onUploadProgress={(e) => {
                const percent = Math.round((e.loaded / e.total) * 100);
                setProgress(percent);
              }}
              className="file-input file-input-bordered w-full"
            />
          </div>

          {progress > 0 && progress < 100 && (
            <div className="mt-2 w-full bg-gray-300 rounded h-2 overflow-hidden">
              <div
                className="h-2 bg-indigo-500 rounded transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {avatar && (
            <div className="mt-4">
              <img
                src={avatar}
                alt="Avatar"
                className="w-32 h-32 rounded-full object-cover border border-gray-300 shadow"
              />
            </div>
          )}

          {error && <div className="text-red-500 text-sm">⚠️ {error}</div>}

          <Button type="submit" disabled={uploading} className="w-full flex items-center justify-center gap-2">
            {uploading && <Loader2 className="animate-spin h-4 w-4" />}
            {uploading ? "Updating..." : "Update Profile"}
          </Button>
        </form>
      </div>
    </div>
  );
}
