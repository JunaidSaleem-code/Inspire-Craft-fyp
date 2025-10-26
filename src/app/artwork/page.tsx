// pages/artworks.tsx

'use client';

import { motion } from 'framer-motion';
import ArtworkCard from '@/components/ArtworkCard';
import CardSkeleton from '@/components/skeletons/CardSkeleton';
import { useArtworks } from '@/hooks/useData';

export default function ArtworksPage() {
  const { data: artworks, isLoading: loading } = useArtworks();

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-24 pb-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              <span className="gradient-text">Explore Stunning Artworks</span>
            </h1>
            <p className="text-lg text-gray-400">Browse through our beautiful art collection</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-7xl mx-auto">
            <CardSkeleton count={6} aspectRatio="square" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">
            <span className="gradient-text">Explore Stunning Artworks</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-400">Browse through our beautiful art collection</p>
        </motion.div>

        {/* Artworks Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-7xl mx-auto">
  {artworks?.map((artwork) => (
    <motion.div
      key={artwork._id?.toString()}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ArtworkCard artwork={artwork} />
    </motion.div>
  ))}
</section>
      </div>
    </div>
  );
}
