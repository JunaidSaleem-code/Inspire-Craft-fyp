"use client";

import { GeneratedImage } from "@/app/types/page";
import { AI_IMAGE_DIMENSIONS } from "@/models/GeneratedImage";
import { IKImage } from "imagekitio-next";
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
      <IKImage 
  urlEndpoint={process.env.NEXT_PUBLIC_URL_ENDPOINT}
  path={image.mediaUrl} 
  transformation={[
    { width: AI_IMAGE_DIMENSIONS.default.width.toString(), height: AI_IMAGE_DIMENSIONS.default.height.toString() },
  ]}
  alt= "AI Image"
/>
      </div>
    </Link>
  );
}
