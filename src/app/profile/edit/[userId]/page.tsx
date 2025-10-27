"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import  {apiClient} from "@/lib/api-client";
import { useNotification } from "@/components/Notification";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IKUpload } from "imagekitio-next";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { Loader2, ArrowLeft, Camera, X } from "lucide-react";
import Image from "next/image";

export default function EditProfilePage({ params }: { params: Promise<{ userId: string }> }) {
  const router = useRouter();
  const { showNotification } = useNotification();

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [hasChanges, setHasChanges] = useState(false);
  const [originalUsername, setOriginalUsername] = useState("");
  const [originalBio, setOriginalBio] = useState("");
  const [originalAvatar, setOriginalAvatar] = useState("");

  useEffect(() => {
    async function getParams() {
      const resolvedParams = await params;
      setUserId(resolvedParams.userId);
    }
    getParams();
  }, [params]);

  useEffect(() => {
    if (!userId) return;
    
    const fetchProfile = async () => {
      try {
        const data = await apiClient.getUserById(userId);
        const uname = data.username || "";
        const ubio = data.bio || "";
        const uavatar = data.avatar || "";
        
        setUsername(uname);
        setBio(ubio);
        setAvatar(uavatar);
        setOriginalUsername(uname);
        setOriginalBio(ubio);
        setOriginalAvatar(uavatar);
      } catch {
        showNotification("Failed to load profile", "error");
      }
    };

    fetchProfile();
  }, [userId, showNotification]);

  useEffect(() => {
    const changed = username !== originalUsername || bio !== originalBio || avatar !== originalAvatar;
    setHasChanges(changed);
  }, [username, bio, avatar, originalUsername, originalBio, originalAvatar]);

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
      await apiClient.updateUser(userId, { username, bio, avatar });
      showNotification("Profile updated successfully", "success");
      router.push(`/profile/${userId}`);
    } catch {
      const message ="Failed to update profile.";
      showNotification(message, "error");
    }
  };

  return (
    <div className="min-h-screen bg-black pt-20 pb-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-white">Edit Profile</h1>
        </div>

        {/* Form Container */}
        <div className="glass-strong rounded-2xl p-6 md:p-8 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
              {/* Avatar Section */}
              <div className="w-full md:w-auto">
                <label className="block text-sm font-medium text-gray-300 mb-3">Avatar</label>
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20">
                    <Image
                      src={avatar || "/default-avatar.png"}
                      alt="Avatar preview"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 rounded-full flex items-center justify-center transition-opacity cursor-pointer">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                {/* Upload Component */}
                <div className="mt-4">
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
                    className="glass border border-white/20 rounded-xl text-white hover:bg-white/10 cursor-pointer px-4 py-2 text-sm transition-all"
                  />
                </div>

                {/* Progress Bar */}
                {progress > 0 && progress < 100 && (
                  <div className="mt-3 w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
                
                {error && (
                  <div className="mt-2 text-red-500 text-xs flex items-center gap-1">
                    <X className="w-4 h-4" />
                    {error}
                  </div>
                )}
              </div>

              {/* Form Fields */}
              <div className="flex-1 w-full space-y-6">
                {/* Username */}
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                    Username
                  </label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full"
                    maxLength={30}
                  />
                  <p className="mt-1 text-xs text-gray-500">{username.length}/30</p>
                </div>

                {/* Bio */}
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-2">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    maxLength={150}
                    className="w-full px-4 py-3 glass border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all resize-none"
                    placeholder="Tell us about yourself..."
                  />
                  <p className="mt-1 text-xs text-gray-500">{bio.length}/150</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-white/10">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={uploading || !hasChanges}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
