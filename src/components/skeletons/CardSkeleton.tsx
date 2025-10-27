"use client";

interface CardSkeletonProps {
  count?: number;
  aspectRatio?: 'square' | 'video' | 'portrait';
  showContent?: boolean;
}

export default function CardSkeleton({ 
  count = 1,
  aspectRatio = 'video',
  showContent = false 
}: CardSkeletonProps) {
  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-[4/3]',
    portrait: 'aspect-[3/4]'
  };

  const SkeletonCard = () => (
    <div className="group relative card-artist overflow-hidden">
      {/* Image placeholder with shimmer */}
      <div className={`relative ${aspectRatioClasses[aspectRatio]} overflow-hidden`}>
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
        
        {/* Shimmer overlay */}
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* Content skeleton */}
      {showContent && (
        <div className="p-4 space-y-2">
          {/* Title */}
          <div className="h-5 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded w-3/4 animate-pulse" />
          
          {/* Description */}
          <div className="space-y-1.5">
            <div className="h-3 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded w-full animate-pulse" />
            <div className="h-3 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded w-5/6 animate-pulse" />
          </div>
          
          {/* Footer */}
          <div className="flex items-center justify-between pt-2">
            <div className="h-4 bg-gradient-to-r from-purple-900 via-purple-800 to-purple-900 rounded w-1/3 animate-pulse" />
            <div className="h-6 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded-full w-16 animate-pulse" />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </>
  );
}

