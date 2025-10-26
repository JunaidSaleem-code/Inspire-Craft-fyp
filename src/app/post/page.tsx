// components/PostList.tsx
'use client'
import PostCard from '@/components/PostCard';
import CardSkeleton from '@/components/skeletons/CardSkeleton';
import { usePosts } from '@/hooks/useData';

const PostList = () => {
  const { data: posts, isLoading: loading, error } = usePosts();

  // If the data is still loading
  if (loading) {
    return (
      <div className='min-h-screen bg-black pt-24 pb-24'>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              <span className="gradient-text">Community Posts</span>
            </h1>
            <p className="text-gray-400 text-lg">See what the community is creating</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardSkeleton count={6} aspectRatio="square" />
          </div>
        </div>
      </div>
    );
  }

  // If there was an error while fetching
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className='min-h-screen bg-black pt-24 pb-24'>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">
            <span className="gradient-text">Community Posts</span>
          </h1>
          <p className="text-gray-400 text-base sm:text-lg">See what the community is creating</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {posts?.map((post) => (
            <PostCard key={post._id?.toString()} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostList;
