// components/PostList.tsx
'use client'
import { useState, useEffect } from 'react';
import { IPost } from '@/models/Post';
import PostCard from '@/components/PostCard';
import { apiClient } from '@/lib/api-client';

const PostList = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // For loading state
  const [error, setError] = useState<string | null>(null); // For error state

  // Fetch posts on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true); // Set loading to true while fetching
        const response = await apiClient.getPosts();
        setPosts(response.data);
      } catch (error) {
        setError('Failed to fetch posts');
        console.error(error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchPosts();
  }, []);

  const handleDeletePost = async (postId: string) => {
    try {
      // Delete the post from the server
      await apiClient.deletePost(postId);
      // Remove the deleted post from the state
      setPosts((prevPosts) => prevPosts.filter((post) => post._id?.toString() !== postId));
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

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
