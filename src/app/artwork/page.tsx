// pages/artworks.tsx

'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { IArtwork } from '@/models/Artwork';
import { apiClient } from '@/lib/api-client';
import ArtworkCard from '@/components/ArtworkCard';

export default function ArtworksPage() {
  const [artworks, setArtworks] = useState<IArtwork[]>([]);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const artworksData = await apiClient.getArtworks();
        setArtworks(artworksData?.data || []);
      } catch (error) {
        console.error('Error fetching artworks:', error);
      }
    };

    fetchArtworks();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-100">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-bold text-gray-900">Explore Stunning Artworks</h1>
        <p className="text-lg text-gray-600 mt-4">Browse through our beautiful art collection</p>
      </motion.div>

      {/* Artworks Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
  {artworks.map((artwork) => (
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
  );
}
