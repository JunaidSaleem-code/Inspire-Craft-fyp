"use client";

import AIImageCard from "@/components/AIImageCard";
import CardSkeleton from "@/components/skeletons/CardSkeleton";
import { Button } from "@/components/ui/button";
import { usePublicAIImages } from "@/hooks/useData";

export default function PublicAiImages() {
  const { data: images, isLoading: loading } = usePublicAIImages();

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-24 pb-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black">
              <span className="gradient-text">Public AI Gallery</span>
            </h1>
            <Button 
              onClick={() => window.location.href = "/ai-images/generate"}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              disabled
            >
              Generate Image
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardSkeleton count={6} aspectRatio="square" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-24">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black">
            <span className="gradient-text">Public AI Gallery</span>
          </h1>
          <Button 
            onClick={() => window.location.href = "/ai-images/generate"}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            Generate Image
          </Button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images?.map((img) => (
            <AIImageCard key={img._id?.toString()} image={img} />
          ))}
        </div>
      </div>
    </div>
  );
}
