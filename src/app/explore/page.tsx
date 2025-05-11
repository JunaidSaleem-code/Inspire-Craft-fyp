'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import ArtworkCard from '@/components/ArtworkCard';
import PostCard from '@/components/PostCard';
import TutorialCard from '@/components/TutorialCard';
import AIImageCard from '@/components/AIImageCard';
import { Button } from '@/components/ui/button';
import { Artwork, GeneratedImage, Post, SearchResult, Tutorial } from '../types/page';

const SearchComponent = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult>({ artworks: [], posts: [], tutorials: [], generatedImages: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'artwork' | 'post' | 'tutorial' | 'image' | 'all'>('all');
  const [page, setPage] = useState(1);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
const [artworks, setArtworks] = useState<Artwork[]>([]);
const [posts, setPosts] = useState<Post[]>([]);
const [tutorials, setTutorials] = useState<Tutorial[]>([]);
const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const handleSearch = async () => {
    if (!query) {
      setError('Please enter a search query');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const searchResults = await apiClient.search(
        query,
        filter === 'all' ? undefined : filter,
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
      setError('An error occurred while fetching search results');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Search Form */}
      <div className="mb-8 space-y-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search artworks, posts, tutorials..."
          className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-500"
        />

        <div className="flex flex-wrap gap-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'artwork' | 'post' | 'tutorial' | 'image' | 'all')}
            className="px-4 py-2 border rounded-md"
          >
            <option value="all">All</option>
            <option value="artwork">Artworks</option>
            <option value="post">Posts</option>
            <option value="tutorial">Tutorials</option>
            <option value="image">Generated Images</option>
          </select>

          {filter === 'artwork' && (
            <>
              <input
                type="number"
                min={1}
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Min Price"
                className="w-32 px-3 py-2 border rounded-md"
              />
              <input
                type="number"
                min={1}
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Max Price"
                className="w-32 px-3 py-2 border rounded-md"
              />
            </>
          )}
        </div>

        <Button onClick={handleSearch} disabled={loading} className="w-full text-lg">
          {loading ? 'Searching...' : 'Search'}
        </Button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>

      {/* Results */}
      {results && (
        <div className="space-y-12">
          {artworks.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-4">Artworks</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {artworks.map((art: Artwork) => (
                  <ArtworkCard key={art._id} artwork={art} />
                ))}
              </div>
            </section>
          )}

          {posts.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-4">Posts</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {posts.map((post: Post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            </section>
          )}

          {tutorials.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-4">Tutorials</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {tutorials.map((t: Tutorial) => (
                  <TutorialCard key={t._id} tutorial={t} />
                ))}
              </div>
            </section>
          )}

          {generatedImages.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-4">Generated Images</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {generatedImages.map((img: GeneratedImage) => (
                  <AIImageCard key={img._id} image={img} />
                ))}
              </div>
            </section>
          )}

          {/* Pagination */}
          <div className="flex justify-between items-center mt-10">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => {
                setPage((p) => Math.max(1, p - 1));
                handleSearch();
              }}
            >
              Previous
            </Button>
            <span className="text-gray-700">Page {page}</span>
            <Button
              variant="outline"
              onClick={() => {
                setPage((p) => p + 1);
                handleSearch();
              }}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchComponent;
