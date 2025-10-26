"use client";

import { GeneratedImage } from "@/app/types/page";
import { AI_IMAGE_DIMENSIONS } from "@/models/GeneratedImage";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface Props {
  image: GeneratedImage;
}

export default function AIImageCard({ image }: Props) {
  return (
    <Link href={`/ai-images/${image._id}`} className="block w-full">
      <motion.div
        className="group relative card-artist hover-lift transition-all duration-300 overflow-hidden cursor-pointer"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Image 
            src={image.mediaUrl} 
            width={AI_IMAGE_DIMENSIONS.default.width} 
            height={AI_IMAGE_DIMENSIONS.default.height}
            loading="lazy"
            alt="AI Image"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* AI Badge */}
          <div className="absolute top-3 left-3 badge badge-blue opacity-0 group-hover:opacity-100 transition-opacity">
            <Sparkles className="w-3 h-3 mr-1" />
            AI Generated
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
