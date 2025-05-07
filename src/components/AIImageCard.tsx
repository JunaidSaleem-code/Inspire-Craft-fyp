"use client";

import { GeneratedImage } from "@/app/types/page";
import { AI_IMAGE_DIMENSIONS } from "@/models/GeneratedImage";
import Image from "next/image";

import Link from "next/link";

interface Props {
  image: GeneratedImage;
}

export default function AIImageCard({ image }: Props) {
  return (
    <Link
      href={`/ai-images/${image._id}`}
      className="block group border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
    >
      <div className="relative w-full aspect-[4/3]">
      <Image 
  src={image.mediaUrl} 
   width={ AI_IMAGE_DIMENSIONS.default.width} height= {AI_IMAGE_DIMENSIONS.default.height}
   loading="lazy"
  alt= "AI Image"
/>
      </div>
    </Link>
  );
}
