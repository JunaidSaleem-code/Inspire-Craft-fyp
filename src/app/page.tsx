'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { IArtwork } from '@/models/Artwork';
import { ITutorial } from '@/models/Tutorial';
import { IPost } from '@/models/Post';
import ArtworkCard from '@/components/ArtworkCard';
import PostCard from '@/components/PostCard';
import TutorialCard from '@/components/TutorialCard';

export default function HomePage() {
  const [artworks, setArtworks] = useState<IArtwork[]>([]);
  const [tutorials, setTutorials] = useState<ITutorial[]>([]);
  const [posts, setPosts] = useState<IPost[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artworksData, tutorialsData, postsData] = await Promise.all([
          apiClient.getArtworks(),
          apiClient.getTutorials(),
          apiClient.getPosts(),
        ]);
        setArtworks(artworksData?.data || []);
        setTutorials(tutorialsData?.data || []);
        setPosts(postsData?.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-bold text-gray-900">Discover & Create Stunning Art</h1>
        <p className="text-lg text-gray-600 mt-4">Join the community of artists & art lovers</p>
        <Link href="/explore">
          <Button className="mt-6 px-6 py-3 text-lg">Explore Artworks</Button>
        </Link>
      </motion.div>

      {/* Featured Artworks */}
      <section className="space-y-6 py-10">
        <h2 className="text-3xl font-semibold mb-4">Featured Artworks</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {artworks.slice(0, 6).map((artwork) => (
            <ArtworkCard key={artwork._id?.toString()} artwork={artwork} />
          ))}
        </div>
      </section>

      {/* Posts Section */}
      <section className="space-y-6 py-10">
        <h2 className="text-3xl font-semibold mb-4">Community Posts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {posts.slice(0, 6).map((post) => (
            <PostCard key={post._id?.toString()} post={post} />
          ))}
        </div>
      </section>

      {/* Tutorials Section */}
      <section className="space-y-6 py-10">
        <h2 className="text-3xl font-semibold mb-4">Latest Art Tutorials</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {tutorials.slice(0, 6).map((tutorial) => (
            <TutorialCard key={tutorial._id?.toString()} tutorial={tutorial} />
          ))}
        </div>
      </section>
    </div>
  );
}
