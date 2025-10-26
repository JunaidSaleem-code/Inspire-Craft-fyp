"use client";

import { useState } from "react";
import { apiClient } from "@/lib/api-client";
import ArtworkCard from "@/components/ArtworkCard";
import PostCard from "@/components/PostCard";
import TutorialCard from "@/components/TutorialCard";
import AIImageCard from "@/components/AIImageCard";
import { Button } from "@/components/ui/button";
import {
  Artwork,
  GeneratedImage,
  Post,
  SearchResult,
  Tutorial,
} from "../types/page";
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const SearchComponent = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult>({
    artworks: [],
    posts: [],
    tutorials: [],
    generatedImages: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<
    "artwork" | "post" | "tutorial" | "image" | "all"
  >("all");
  const [page, setPage] = useState(1);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  
  const handleSearch = async () => {
    if (!query) {
      setError("Please enter a search query");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const searchResults = await apiClient.search(
        query,
        filter === "all" ? undefined : filter,
        page,
        10,
        minPrice ? parseFloat(minPrice) : undefined,
        maxPrice ? parseFloat(maxPrice) : undefined
      );
      setResults(searchResults);
      setArtworks(searchResults.artworks || []);
      setPosts(searchResults.posts || []);
      setTutorials(searchResults.tutorials || []);
      setGeneratedImages(searchResults.generatedImages || []);
    } catch (error) {
      console.error(error);
      setError("An error occurred while fetching search results");
    } finally {
      setLoading(false);
    }
  };

  const filterOptions = [
    { value: "all", label: "All", color: "from-purple-600 to-pink-600" },
    { value: "artwork", label: "Artworks", color: "from-blue-600 to-purple-600" },
    { value: "post", label: "Posts", color: "from-pink-600 to-red-600" },
    { value: "tutorial", label: "Tutorials", color: "from-orange-600 to-yellow-600" },
    { value: "image", label: "AI Images", color: "from-green-600 to-teal-600" },
  ];

  return (
    <div className="min-h-screen bg-black pt-24 pb-20">
      <div className="container mx-auto px-4 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4">
            <span className="gradient-text">Explore</span>
          </h1>
          <p className="text-xl text-gray-400">Discover amazing artworks and creations</p>
        </motion.div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 space-y-6"
        >
          {/* Search Bar */}
          <div className="relative max-w-3xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search artworks, posts, tutorials..."
              className="w-full pl-12 pr-4 py-4 glass border border-white/20 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap justify-center gap-3">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value as typeof filter)}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                  filter === option.value
                    ? `bg-gradient-to-r ${option.color} text-white shadow-lg scale-105`
                    : "glass border border-white/20 text-gray-300 hover:border-white/40 hover:scale-105"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Price Filters */}
          {filter === "artwork" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="flex flex-col sm:flex-row flex-wrap justify-center gap-4"
            >
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">Price Range:</span>
              </div>
              <input
                type="number"
                min={1}
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Min Price"
                className="w-full sm:w-32 px-4 py-3 glass border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
              <input
                type="number"
                min={1}
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Max Price"
                className="w-full sm:w-32 px-4 py-3 glass border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </motion.div>
          )}

          {/* Search Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleSearch}
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-6 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Searching...
                </span>
              ) : (
                "Search"
              )}
            </Button>
          </div>
          
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-sm text-center glass border border-red-500/30 rounded-lg py-2 px-4 max-w-md mx-auto"
            >
              {error}
            </motion.p>
          )}
        </motion.div>

        {/* Results */}
        {results && (
          <div className="space-y-16">
            {/* Show "Nothing found" if all result types are empty */}
            {!loading &&
              query &&
              artworks.length === 0 &&
              posts.length === 0 &&
              tutorials.length === 0 &&
              generatedImages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20"
                >
                  <div className="w-24 h-24 mx-auto mb-6 glass rounded-full flex items-center justify-center border border-white/20">
                    <Search className="w-12 h-12 text-gray-500" />
                  </div>
                  <p className="text-gray-400 text-xl">No results found for &quot;{query}&quot;</p>
                  <p className="text-gray-500 text-sm mt-2">Try different keywords or filters</p>
                </motion.div>
              )}
              
            {artworks.length > 0 && (
              <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-1 h-12 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full"></div>
                  <h2 className="text-4xl font-black text-white">Artworks</h2>
                  <span className="badge badge-purple">{artworks.length}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                  {artworks.map((art: Artwork, index) => (
                    <motion.div
                      key={art._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ArtworkCard artwork={art} />
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {posts.length > 0 && (
              <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-1 h-12 bg-gradient-to-b from-pink-600 to-red-600 rounded-full"></div>
                  <h2 className="text-4xl font-black text-white">Posts</h2>
                  <span className="badge badge-pink">{posts.length}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                  {posts.map((post: Post, index) => (
                    <motion.div
                      key={post._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <PostCard post={post} />
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {tutorials.length > 0 && (
              <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-1 h-12 bg-gradient-to-b from-orange-600 to-yellow-600 rounded-full"></div>
                  <h2 className="text-4xl font-black text-white">Tutorials</h2>
                  <span className="badge bg-orange-500/20 text-orange-300 border border-orange-500/30">{tutorials.length}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                  {tutorials.map((t: Tutorial, index) => (
                    <motion.div
                      key={t._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <TutorialCard tutorial={t} />
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {generatedImages.length > 0 && (
              <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-1 h-12 bg-gradient-to-b from-green-600 to-teal-600 rounded-full"></div>
                  <h2 className="text-4xl font-black text-white">AI Generated Images</h2>
                  <span className="badge badge-blue">{generatedImages.length}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                  {generatedImages.map((img: GeneratedImage, index) => (
                    <motion.div
                      key={img._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <AIImageCard image={img} />
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Pagination */}
            {(artworks.length > 0 || posts.length > 0 || tutorials.length > 0 || generatedImages.length > 0) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center items-center gap-4 mt-12"
              >
                <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => {
                    setPage((p) => Math.max(1, p - 1));
                    handleSearch();
                  }}
                  className="glass border-white/30 text-white hover:bg-white/10 disabled:opacity-30"
                >
                  <ChevronLeft className="w-5 h-5 mr-1" />
                  Previous
                </Button>
                <span className="px-6 py-2 glass rounded-lg border border-white/20 text-white font-semibold">
                  Page {page}
                </span>
                <Button
                  variant="outline"
                  onClick={() => {
                    setPage((p) => p + 1);
                    handleSearch();
                  }}
                  className="glass border-white/30 text-white hover:bg-white/10"
                >
                  Next
                  <ChevronRight className="w-5 h-5 ml-1" />
                </Button>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchComponent;
