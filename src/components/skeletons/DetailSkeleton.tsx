"use client";

import { Skeleton } from "@/components/ui/skeleton";

interface DetailSkeletonProps {
  type?: 'artwork' | 'post' | 'tutorial';
}

export default function DetailSkeleton({ type = 'artwork' }: DetailSkeletonProps) {
  return (
    <div className="min-h-screen bg-black pt-24 pb-24">
      <div className="max-w-2xl mx-auto px-4">
        <div className="glass-strong rounded-2xl overflow-hidden border border-white/10">
          {/* Large Media Placeholder */}
          <div className="relative w-full bg-black">
            {type === 'tutorial' ? (
              <Skeleton className="w-full aspect-video max-h-[400px] rounded-none" />
            ) : (
              <Skeleton className="w-full max-h-[500px] aspect-auto rounded-none" />
            )}
          </div>

          {/* Content Section */}
          <div className="px-4 py-3 bg-black/60 space-y-3">
            {/* User Info */}
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>

            {/* Title & Description */}
            <div className="space-y-2">
              <Skeleton className="h-7 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 pt-2">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-4 w-12" />
            </div>

            {/* Additional Info (for artwork) */}
            {type === 'artwork' && (
              <div className="space-y-2 pt-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-10 w-32 rounded-full" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

