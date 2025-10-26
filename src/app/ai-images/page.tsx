"use client";

import AIImageCard from "@/components/AIImageCard";
import CardSkeleton from "@/components/skeletons/CardSkeleton";
import { useAIImages } from "@/hooks/useData";


export default function MyAiImagesPage() {
  const { data: images, isLoading: loading } = useAIImages();

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-24 pb-24">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <h1 className="text-4xl md:text-5xl font-black mb-8 gradient-text">🖼️ My AI Generated Images</h1>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardSkeleton count={6} aspectRatio="square" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-24">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-8 gradient-text">🖼️ My AI Generated Images</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {images?.map((image) => (
            <AIImageCard
              key={image._id}
              image={image}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
