'use client';

import { IKImage, IKVideo } from 'imagekitio-next';
import { useRouter } from 'next/navigation';
import { Artwork } from '@/app/types/page';
import { ShoppingBag, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

const _DIMENSIONS = {
  square: { width: 600, height: 600 }, // Optimized from 1080x1080 for better performance
  portrait: { width: 600, height: 800 },
  landscape: { width: 600, height: 340 },
} as const;

interface ArtworkCardProps {
  artwork: Artwork;
}

export default function ArtworkCard({ artwork }: ArtworkCardProps) {
  const IMAGEKIT_BASE_URL = process.env.NEXT_PUBLIC_URL_ENDPOINT || '';
  const router = useRouter();

  const goToDetailPage = () => {
    router.push(`/artwork/${artwork._id}`);
  };

  return (
    <motion.div
      onClick={goToDetailPage}
      className="group relative card-artist hover-lift transition-all duration-300 cursor-pointer overflow-hidden"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {/* Media */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {artwork.mediaType === 'image' ? (
          <IKImage
            urlEndpoint={IMAGEKIT_BASE_URL}
            path={artwork.mediaUrl.startsWith('http') ? undefined : artwork.mediaUrl}
            src={artwork.mediaUrl.startsWith('http') ? artwork.mediaUrl : undefined}
            alt={artwork.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            width={_DIMENSIONS.square.width}
            height={_DIMENSIONS.square.height}
            loading="lazy"
          />
        ) : (
          <IKVideo
            urlEndpoint={IMAGEKIT_BASE_URL}
            src={artwork.mediaUrl}
            controls
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            width={_DIMENSIONS.square.width}
            height={_DIMENSIONS.square.height}
          />
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Hover Overlay Content */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex gap-3">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileHover={{ y: 0, opacity: 1 }}
              className="p-3 glass rounded-full border border-white/20"
            >
              <Eye className="w-5 h-5 text-white" />
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileHover={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="p-3 glass rounded-full border border-white/20"
            >
              <ShoppingBag className="w-5 h-5 text-white" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
          {artwork.title}
        </h3>
        <p className="text-sm text-gray-400 line-clamp-2">
          {artwork.description}
        </p>
        
        <div className="flex items-center justify-between pt-2">
          <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {artwork.price} {artwork.currency}
          </span>
          {artwork.isSold && (
            <span className="badge badge-pink">Sold</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
