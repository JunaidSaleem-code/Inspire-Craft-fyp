"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { Loader2 } from "lucide-react";
import AIImageCard from "@/components/AIImageCard";

export default function MyAiImagesPage() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const data = await apiClient.getOwnAIImages();
        if (data.success) setImages(data.images);
      } catch (err) {
        console.error("Failed to load private images");
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

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
