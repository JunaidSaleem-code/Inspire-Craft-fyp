"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import  {apiClient} from "@/lib/api-client";
import { GeneratedImage } from "@/app/types/page";
import Image from "next/image";

export default function AIGeneratePage() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<GeneratedImage>(); // store full image object

  const generateImage = async () => {
    setLoading(true);
    try {
      const data = await apiClient.generateAIImage(prompt);
      if (data.success) setImage(data.image);
    } catch {
      // Error handled by notification system
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = async () => {
    if (!image) return;
    try {
      const data = await apiClient.toggleImageVisibility(image._id!, !image.isPublic);
      if (data.success) {
        setImage(prev => ({ ...prev!, isPublic: !prev!.isPublic, }));
      }
    } catch {
      // Error handled by notification system
    }
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-24">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black mb-2">
            <span className="gradient-text">AI Image Generator</span>
          </h1>
          <p className="text-gray-400">Transform your ideas into stunning visuals</p>
        </div>

        <div className="w-full max-w-2xl mx-auto">
          <div className="glass-strong rounded-2xl p-8 border border-white/20 mb-8">
            <div className="flex flex-col gap-4">
              <Input
                placeholder="Enter your creative prompt..."
                value={prompt}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrompt(e.target.value)}
                className="glass border border-white/20 text-white placeholder:text-gray-500"
              />
              <Button
                onClick={generateImage}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || !prompt}
              >
                {loading ? "Generating..." : "Generate Image"}
              </Button>
            </div>
          </div>
        </div>

        {image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-strong rounded-2xl p-6 border border-white/20"
          >
            {/* Image */}
            <div className="w-full overflow-hidden rounded-xl bg-black mb-6">
              <Image
                src={image.mediaUrl}
                width={image.transformation?.width || 1024}
                height={image.transformation?.height || 1024}
                alt={image.prompt}
                loading="eager"
                className="w-full h-auto object-contain"
              />
            </div>

            {/* Info Box */}
            <div className="space-y-4 text-gray-300">
              <div>
                <p className="text-sm text-gray-400 mb-1">Prompt:</p>
                <p className="text-lg italic text-white">{image.prompt}</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <strong>Status:</strong>{" "}
                  <span className={image.isPublic ? "text-green-400" : "text-red-400"}>
                    {image.isPublic ? "🌐 Public" : "🔒 Private"}
                  </span>
                </div>
                <Button 
                  onClick={toggleVisibility} 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  Make {image.isPublic ? "Private" : "Public"}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
