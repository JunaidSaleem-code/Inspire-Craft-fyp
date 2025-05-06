"use client";

import { useEffect, useState } from "react";
import  {apiClient} from "@/lib/api-client";
import { Loader2 } from "lucide-react";
import AIImageCard from "@/components/AIImageCard";
import { useNotification } from "@/components/Notification";
import { GeneratedImage } from "@/app/types/page";



export default function MyAiImagesPage() {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(true);

  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const data = await apiClient.getOwnAIImages();
         setImages(data);
        
      } catch{
        showNotification("Failed to load private images", "error");
      } finally {
        setLoading(false);
    }
    };
    fetchImages();
  }, [showNotification]);

  if (loading) return <Loader2 className="mx-auto animate-spin mt-10" />;

  return (
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">🖼️ My AI Generated Images</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <AIImageCard
            key={image._id}
            image={image}
          />
        ))}
      </div>
    </div>
  );
}
