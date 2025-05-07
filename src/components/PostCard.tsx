'use client';

import { Post } from '@/app/types/page';
import Image from 'next/image';
import Link from 'next/link';

const _DIMENSIONS = {
  square: { width: 1080, height: 1080 },
  portrait: { width: 1080, height: 1350 },
  landscape: { width: 1080, height: 566 },
} as const;



export default function PostCard({ post }: { post: Post}) {
  



  return (
    <Link href={`/post/${post._id}`} className="block w-full">
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 mb-6">
      <div className="relative w-full">
        {post.mediaType === 'image' ? (
          <Image
            src={post.mediaUrl}
            alt={post.title}
            className="w-full object-cover aspect-square sm:aspect-video"
            width={_DIMENSIONS.square.width}
            height={_DIMENSIONS.square.height}
            loading='lazy'
          />
        ) : (
          <video
            src={post.mediaUrl}
            controls
            className="w-full object-cover aspect-square sm:aspect-video"
          />
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{post.title}</h3>
        <p className="text-gray-600 text-sm mt-1 line-clamp-3">{post.description}</p>
      </div>
    </div>
            </Link>
  );
}
