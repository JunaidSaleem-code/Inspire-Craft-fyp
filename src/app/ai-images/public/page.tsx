"use client";

import { useEffect, useState } from "react";
import  {apiClient} from "@/lib/api-client";
import AIImageCard from "@/components/AIImageCard";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotification } from "@/components/Notification";
import { GeneratedImage } from "@/app/types/page";

export default function PublicAiImages() {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(true);

  const { showNotification } = useNotification();

  useEffect(() => {
    const loadPublicImages = async () => {
      try {
        const images = await apiClient.getPublicAIImages();
         setImages(images);
      } catch  {
        showNotification("Could not load public images", "error");
      } finally {
        setLoading(false);
      }
    };

    loadPublicImages();
  }, [showNotification]);

  if (loading) return <Loader2 className="mx-auto animate-spin" />;

  return (
    <div className="max-w-6xl mx-auto py-8">
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold mb-4">🌍 Public AI Image Gallery</h1>
    <Button onClick={() => window.location.href = "/ai-images/generate" }>Generate Image</Button>
    </div>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {images.map((img) => (
        <AIImageCard key={img._id?.toString()} image={img} />
      ))}
    </div>
  </div>
  );
}
