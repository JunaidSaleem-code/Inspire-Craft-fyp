// components/PostList.tsx
'use client'
import { useState, useEffect } from 'react';
import PostCard from '@/components/PostCard';
import  {apiClient} from "@/lib/api-client";
import { Post } from '../types/page';

const PostList = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // For loading state
  const [error, setError] = useState<string | null>(null); // For error state

  // Fetch posts on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true); // Set loading to true while fetching
        const response = await apiClient.getPosts();
        setPosts(response);
      } catch (error) {
        setError('Failed to fetch posts');
        console.error(error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchPosts();
  }, []);


  // If the data is still loading
  if (loading) {
    return <div>Loading posts...</div>;
  }

  // If there was an error while fetching
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className='bg-gray-100'>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 m-4 ">
  {posts.length === 0 ? (
    <p className="text-center col-span-full text-gray-500">No posts available.</p>
  ) : (
    posts.map((post) => (
      <PostCard key={post._id?.toString()} post={post} />
    ))
  )}
</div>
</div>
  );
};

export default PostList;
