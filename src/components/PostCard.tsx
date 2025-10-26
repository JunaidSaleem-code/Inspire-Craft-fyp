'use client';

import { Post } from '@/app/types/page';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';

const _DIMENSIONS = {
  square: { width: 600, height: 600 }, // Optimized from 1080x1080 for better performance
  portrait: { width: 600, height: 800 },
  landscape: { width: 600, height: 340 },
} as const;

export default function PostCard({ post }: { post: Post}) {
  return (
    <Link href={`/post/${post._id}`} className="block w-full">
      <motion.div
        className="group relative card-artist hover-lift transition-all duration-300 overflow-hidden"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          {post.mediaType === 'image' ? (
            <Image
              src={post.mediaUrl}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              width={_DIMENSIONS.square.width}
              height={_DIMENSIONS.square.height}
              loading='lazy'
            />
          ) : (
            <video
              src={post.mediaUrl}
              controls
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Hover Overlay Content */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileHover={{ y: 0, opacity: 1 }}
              className="p-3 glass rounded-full border border-white/20"
            >
              <Eye className="w-5 h-5 text-white" />
            </motion.div>
          </div>
        </div>

        <div className="p-4 space-y-2">
          <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
            {post.title}
          </h3>
          <p className="text-sm text-gray-400 line-clamp-2">
            {post.description}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}
