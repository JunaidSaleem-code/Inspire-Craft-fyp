'use client';

import { Heart, MessageCircle, Trash } from 'lucide-react';
import { IKImage } from 'imagekitio-next';
import { IPost } from '@/models/Post';
import Link from 'next/link';
import { useState } from 'react';

const _DIMENSIONS = {
  square: { width: 1080, height: 1080 },
  portrait: { width: 1080, height: 1350 },
  landscape: { width: 1080, height: 566 },
} as const;



export default function PostCard({ post }: { post: IPost}) {
  const IMAGEKIT_BASE_URL = process.env.NEXT_PUBLIC_URL_ENDPOINT || '';
  
  const [liked, setLiked] = useState(false);

  // Handle like toggle
  const handleLikeToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    setLiked((prev) => !prev);
  };

  // Handle comment toggle
  const handleCommentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  }


  return (
            <Link href={`/post/${post._id}`}>
    <div className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col sm:flex-row">
      <div className="flex-1">
        <div className="relative">
          {post.mediaType === 'image' ? (
            <IKImage
              urlEndpoint={IMAGEKIT_BASE_URL}
              path={post.mediaUrl.startsWith('http') ? undefined : post.mediaUrl}
              src={post.mediaUrl.startsWith('http') ? post.mediaUrl : undefined}
              alt={post.title}
              className="w-full h-auto object-cover"
              width={_DIMENSIONS.square.width}
              height={_DIMENSIONS.square.height}
            />
          ) : (
            <video
              src={post.mediaUrl}
              controls
              className="w-full h-auto object-cover"
              width={_DIMENSIONS.square.width}
              height={_DIMENSIONS.square.height}
            />
          )}
        </div>

        <div className="p-4">
          <h3 className="text-xl font-semibold">{post.title}</h3>
          <p className="text-gray-600 text-sm mt-2">{post.description}</p>

          <div className="mt-4 flex justify-between items-center">

            <div className="flex items-center gap-4">
              <button onClick={handleLikeToggle} className="flex items-center gap-1">
                <Heart className={`w-6 h-6 ${liked ? 'text-red-500' : 'text-gray-600'}`} />
              </button>
              <button onClick={handleCommentClick} className="flex items-center gap-1">
                <MessageCircle className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
            </Link>
  );
}
