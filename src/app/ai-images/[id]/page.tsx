"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import  {apiClient} from "@/lib/api-client";
import { Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { IKImage } from "imagekitio-next";
import { useNotification } from "@/components/Notification";
import { GeneratedImage } from "@/app/types/page";
import Image from "next/image";

export default function AIImageDetailsPage() {
  const [image, setImage] = useState< GeneratedImage>();
  const [loading, setLoading] = useState(true);
  const { id } = useParams<{ id: string }>();
  const { data: session } = useSession();
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const data = await apiClient.getGeneratedImageById(id);
        
          console.log(data);
          setImage(data);
        
      } catch {
        showNotification("Failed to load image", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [id, showNotification]);

  const toggleVisibility = async () => {
    try {
      const data = await apiClient.toggleImageVisibility(image!._id!, !image!.isPublic);
      if (data.success) {
        setImage((prev) => prev ? { ...prev, isPublic: !prev.isPublic } : prev);

      }
    } catch {
      showNotification("Failed to toggle visibility", "error");
    }
  };

  if (loading) return <Loader2 className="mx-auto animate-spin mt-10" />;

  if (!image) return <p>Image not found</p>;

  const user = image.user;
  const isOwner = session?.user?.id === user?._id;

  return (
    <div className="max-w-4xl mx-auto mb-15 p-4 md:p-6 ">
      <div className="rounded-2xl shadow-lg bg-white dark:bg-neutral-900 overflow-hidden">
        {/* Image */}
        <div className="relative aspect-[4/3]">
          <IKImage
            path={image?.mediaUrl}
            transformation={[{
              width: image.transformation?.width.toString() || "1024",
              height: image.transformation?.height.toString() || '1024',
            }]}
            alt={image.prompt}
            loading="eager"
            priority
            className="w-full h-auto rounded-t-2xl"
          />
        </div>

        {/* Info */}
        <div className="p-4 md:p-6">
          {/* User */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm font-bold">
                <Image src={user?.avatar || ""} alt={user?.username || ""} width={40} height={40} className="w-10 h-10 rounded-full" />
              </div>
              <div>
                <p className="font-semibold text-base flex items-center">
                  {user?.username || "Anonymous"}
                  {user?.isVerified && <span className="ml-1 text-blue-500 text-sm">✔️</span>}
                </p>
                {image.createdAt && (
  <p className="text-xs text-gray-500">
    {formatDistanceToNow(new Date(image.createdAt))} ago
  </p>
)}

              </div>
            </div>
            {/* <div className="text-sm text-gray-500">{user?.followers?.length || 0} followers</div> */}
          </div>

          {/* Prompt */}
          <div className="mt-2">
            <p className="text-gray-500 text-sm mb-1">Prompt:</p>
            <p className="text-lg italic text-gray-800 dark:text-gray-100">{image.prompt}</p>
          </div>

          {/* Visibility toggle */}
          {isOwner && (
            <div className="mt-6">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                Visibility:{" "}
                <strong>{image.isPublic ? "🌐 Public" : "🔒 Private"}</strong>
              </div>
              <Button onClick={toggleVisibility}>
                Make {image.isPublic ? "Private" : "Public"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
