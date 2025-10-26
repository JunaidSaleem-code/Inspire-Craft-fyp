"use client";

import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import  {apiClient} from "@/lib/api-client";
import DetailSkeleton from "@/components/skeletons/DetailSkeleton";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { useNotification } from "@/components/Notification";
import Image from "next/image";
import { useAIImage } from "@/hooks/useData";

export default function AIImageDetailsPage() {
  const { id } = useParams<{ id: string }>()!;
  const router = useRouter();
  const { data: session } = useSession();
  const { showNotification } = useNotification();
  const { data: image, isLoading: loading, mutate } = useAIImage(id);

  const toggleVisibility = async () => {
    try {
      const data = await apiClient.toggleImageVisibility(image!._id!, !image!.isPublic);
      if (data.success) {
        mutate(); // Revalidate SWR cache
      }
    } catch {
      showNotification("Failed to toggle visibility", "error");
    }
  };

  if (loading) return <DetailSkeleton type="artwork" />;

  if (!image) return <div className="min-h-screen bg-black pt-24 pb-24 flex items-center justify-center"><p className="text-white">Image not found</p></div>;

  const user = image.user;
  const isOwner = session?.user?.id === user?._id;

  return (
    <div className="min-h-screen bg-black pt-24 pb-24">
      <div className="max-w-4xl mx-auto px-4">
        <div className="glass-strong rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
          {/* Image */}
          <div className="relative aspect-[4/3] bg-black">
            <Image
              src={image?.mediaUrl}
              width={image.transformation?.width || 1024}
              height={image.transformation?.height || 1024}
              alt={image.prompt}
              loading="eager"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Info */}
          <div className="p-6 bg-black/60">
            {/* User */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push(`/profile/${user?._id}`)}>
                <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-purple-500/50">
                  {user?.avatar ? (
                    <Image src={user.avatar} alt={user.username || ""} width={40} height={40} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-sm">
                      {user?.username?.[0]?.toUpperCase() || "?"}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-base flex items-center text-white">
                    {user?.username || "Anonymous"}
                    {user?.isVerified && <span className="ml-1 text-blue-500 text-sm">✔️</span>}
                  </p>
                  {image.createdAt && (
                    <p className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(image.createdAt))} ago
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Prompt */}
            <div className="mt-4">
              <p className="text-gray-400 text-sm mb-2">Prompt:</p>
              <p className="text-lg italic text-white">{image.prompt}</p>
            </div>

            {/* Visibility toggle */}
            {isOwner && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center gap-2 text-sm text-gray-300 mb-4">
                  Visibility:{" "}
                  <strong className={image.isPublic ? "text-green-400" : "text-red-400"}>
                    {image.isPublic ? "🌐 Public" : "🔒 Private"}
                  </strong>
                </div>
                <Button 
                  onClick={toggleVisibility}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  Make {image.isPublic ? "Private" : "Public"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
