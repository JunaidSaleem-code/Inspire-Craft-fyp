'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Link from 'next/link';
import ArtworkCard from '@/components/ArtworkCard';
import PostCard from '@/components/PostCard';
import TutorialCard from '@/components/TutorialCard';
import CardSkeleton from '@/components/skeletons/CardSkeleton';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useArtworks, usePosts, useTutorials } from '@/hooks/useData';

export default function HomePage() {
  const { data: artworks, isLoading: loadingArtworks } = useArtworks();
  const { data: posts, isLoading: loadingPosts } = usePosts();
  const { data: tutorials, isLoading: loadingTutorials } = useTutorials();

  return (
    <div className="min-h-screen bg-black pt-24">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-black to-black pointer-events-none"></div>
        
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative container mx-auto px-4 py-16 text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-8 border border-white/20"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-gray-300">Welcome to the Gallery</span>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
            <span className="gradient-text">Discover</span>
            <br />
            <span className="text-white">Create & Inspire</span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join a community of artists, creators, and art enthusiasts. Showcase your work and discover inspiring creations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/explore">
              <Button className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 sm:px-8 py-5 sm:py-6 rounded-full text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                Explore Gallery
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/upload">
              <Button variant="outline" className="glass border-white/30 text-white px-6 sm:px-8 py-5 sm:py-6 rounded-full text-base sm:text-lg font-semibold hover:bg-white/10 hover:scale-105 transition-all duration-300">
                Share Your Art
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Featured Artworks */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
                  <div className="flex items-center gap-4 mb-8">
            <div className="w-1 h-16 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full hidden sm:block"></div>
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-2">Featured Artworks</h2>
              <p className="text-gray-400 text-base sm:text-lg">Curated collection from talented artists</p>
            </div>
          </div>
        
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {loadingArtworks ? (
              <CardSkeleton count={6} aspectRatio="square" />
          ) : (
            artworks?.slice(0, 6).map((artwork, index) => (
              <motion.div
                key={artwork._id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ArtworkCard artwork={artwork} />
              </motion.div>
            ))
          )}
        </div>
      </motion.section>

      {/* Community Posts */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-b from-black to-gray-950 py-12"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-1 h-16 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full hidden sm:block"></div>
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-2">Community Posts</h2>
              <p className="text-gray-400 text-base sm:text-lg">Latest updates and creations</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {loadingPosts ? (
              <CardSkeleton count={6} aspectRatio="square" />
            ) : (
              posts?.slice(0, 6).map((post, index) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <PostCard post={post} />
                </motion.div>
              ))
            )}
          </div>
        </div>
      </motion.section>

      {/* Latest Tutorials */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-1 h-16 bg-gradient-to-b from-pink-600 to-orange-600 rounded-full hidden sm:block"></div>
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-2">Latest Tutorials</h2>
            <p className="text-gray-400 text-base sm:text-lg">Learn new techniques and skills</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {loadingTutorials ? (
            <CardSkeleton count={6} aspectRatio="video" />
          ) : (
            tutorials?.slice(0, 6).map((tutorial, index) => (
              <motion.div
                key={tutorial._id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <TutorialCard tutorial={tutorial} />
              </motion.div>
            ))
          )}
        </div>
      </motion.section>
    </div>
  );
}
