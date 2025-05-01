"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { motion } from "framer-motion";
import { apiClient } from "@/lib/api-client";
import { IKImage } from "imagekitio-next";

export default function AIGeneratePage() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<any>(null); // store full image object

  const generateImage = async () => {
    setLoading(true);
    try {
      const data = await apiClient.generateAIImage(prompt);
      if (data.success) setImage(data.image);
    } catch (err) {
      console.error("Failed to generate image:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = async () => {
    if (!image) return;
    try {
      const data = await apiClient.toggleImageVisibility(image._id, !image.isPublic);
      if (data.success) {
        setImage((prev: any) => ({ ...prev, isPublic: !prev.isPublic }));
      }
    } catch (err) {
      console.error("Failed to toggle visibility:", err);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white p-6 flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold text-center drop-shadow-xl">AI Image Generator 🎨</h1>
      <div className="w-full max-w-md flex flex-col gap-4 items-center">
        <Input
          placeholder="Enter your creative prompt..."
          value={prompt}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrompt(e.target.value)}
          className="rounded-xl bg-white text-black placeholder:text-gray-600"
        />
        <Button
          onClick={generateImage}
          className="px-6 py-2 text-lg bg-purple-600 hover:bg-purple-800 transition rounded-xl"
          disabled={loading || !prompt}
        >
          {loading ? "Generating..." : "Generate"}
        </Button>
      </div>

      {image && (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="mt-10 w-full max-w-2xl flex flex-col items-center gap-4"
  >
    {/* Image Box */}
    <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-white">
      <IKImage
        urlEndpoint={process.env.NEXT_PUBLIC_URL_ENDPOINT}
        path={image.mediaUrl}
        transformation={[
          {
            width: image.transformation?.width || 1024,
            height: image.transformation?.height || 1024,
          },
        ]}
        alt={image.prompt}
        className="w-full h-auto object-contain"
      />
    </div>

    {/* Info Box */}
    <div className="w-full bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 text-white text-sm space-y-2">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <p><strong>Prompt:</strong> <em>{image.prompt}</em></p>
        <p className="text-xs text-white/60">
          Generated: {new Date(image.createdAt).toLocaleDateString()}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <p>
          <strong>Status:</strong>{" "}
          <span className={image.isPublic ? "text-green-400" : "text-red-400"}>
            {image.isPublic ? "🌐 Public" : "🔒 Private"}
          </span>
        </p>
        <Button onClick={toggleVisibility} className="bg-purple-600 hover:bg-purple-800">
          Make {image.isPublic ? "Private" : "Public"}
        </Button>
      </div>
    </div>
  </motion.div>
)}


    </main>
  );
}
