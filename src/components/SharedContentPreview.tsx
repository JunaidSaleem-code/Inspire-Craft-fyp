'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

interface SharedContentPreviewProps {
  type: 'post' | 'artwork' | 'tutorial';
  contentId: string;
  title: string;
  description?: string;
  mediaUrl: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
  };
}

export default function SharedContentPreview({
  type,
  contentId,
  title,
  description,
  mediaUrl,
  author
}: SharedContentPreviewProps) {
  const linkPath = `/${type}/${contentId}`;
  const isVideo = mediaUrl.includes('.mp4') || mediaUrl.includes('video');

  return (
    <Link href={linkPath} className="block">
      <div className="glass border border-white/20 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all cursor-pointer max-w-sm group">
        {/* Media Preview */}
        <div className="relative aspect-video bg-black">
          {isVideo ? (
            <video
              src={mediaUrl}
              className="w-full h-full object-cover"
              muted
              preload="metadata"
            />
          ) : (
            <Image
              src={mediaUrl}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          )}
          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full text-xs text-white capitalize">
            {type}
          </div>
        </div>

        {/* Content Info */}
        <div className="p-3 space-y-2">
          <h4 className="text-white font-semibold line-clamp-1">{title}</h4>
          {description && (
            <p className="text-gray-400 text-sm line-clamp-2">{description}</p>
          )}
          
          {/* Author */}
          <div className="flex items-center gap-2 pt-2 border-t border-white/10">
            {author.avatar && (
              <div className="w-5 h-5 rounded-full overflow-hidden">
                <Image
                  src={author.avatar}
                  alt={author.username}
                  width={20}
                  height={20}
                  className="object-cover"
                />
              </div>
            )}
            <span className="text-xs text-gray-400">by {author.username}</span>
            <ExternalLink className="w-3 h-3 text-gray-500 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>
    </Link>
  );
}

