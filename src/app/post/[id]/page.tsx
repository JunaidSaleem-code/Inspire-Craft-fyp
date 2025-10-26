'use client';

import { Heart, MessageCircle, Trash, Pencil } from 'lucide-react';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DetailSkeleton from '@/components/skeletons/DetailSkeleton';
import { useSession } from 'next-auth/react';
import CommentSection from '@/components/CommentSection-DESKTOP-Q7VSBOC';
import { formatDistanceToNow } from 'date-fns';
import LikesDropdown from '@/components/LikeDropdown';
import { useNotification } from '@/components/Notification';
import { Like, Post } from '@/app/types/page';
import Image from 'next/image';
import Link from 'next/link';
import { usePost } from '@/hooks/useData';
import { apiClient } from '@/lib/api-client';
import ShareButton from '@/components/ShareButton';

export default function PostDetail() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id?.toString();
  const { data: session } = useSession();
  const { data: post, isLoading: loading, mutate } = usePost(id);
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [showLikesDropdown, setShowLikesDropdown] = useState(false);
  const {showNotification} = useNotification();
  const likes = post?.likes || [];
  
  useEffect(() => {
    if (post && session?.user?.id) {
      setLiked((likes as Like[])?.some((like) => like?.user?._id?.toString() === session.user.id));
    }
  }, [post, session, likes]);

  const handleLikeToggle = async () => {
    if (!session?.user) {
      showNotification('Login to like!', 'error');
      return;
    }

    if (isLiking) return;
    setIsLiking(true);

    setLiked((prev) => !prev); // Optimistic update

    try {
      await apiClient.likeContent(id!, 'post');
      mutate(); // Revalidate SWR cache
    } catch {
      showNotification('Error liking post', 'error');
    } finally {
      setIsLiking(false);
    }
  };

  const handleCommentClick = () => {
    setShowComments((prev) => !prev);
  };

  const handleDeletePost = async () => {
    if (!post || !post._id) return;
    try {
      const response = await apiClient.deletePost(post._id.toString());
      if (response.success) {
        router.push('/post');
      }
    } catch {
      showNotification('Delete failed', 'error');
    }
  };

  const handleUpdatePost = () => {
    if (post)
      router.push(`/edit/post/${post._id}?category=post&fileType=${post.mediaType}`);
  };

  if (loading) return <DetailSkeleton type="post" />;

  if (!post) return <div className="min-h-screen bg-black pt-24 pb-24 flex items-center justify-center"><p className="text-white">Post not found</p></div>;

  return (
    <div className="min-h-screen bg-black pt-24 pb-24">
      <div className="max-w-2xl mx-auto px-4">
        <div className="glass-strong rounded-2xl overflow-hidden border border-white/10">
          {/* Media Section */}
          <div className="relative w-full bg-black flex items-center justify-center">
            {post.mediaType === 'image' ? (
              <Image
                src={post.mediaUrl}
                alt={post.title}
                className="max-h-[300px] sm:max-h-[400px] md:max-h-[500px] object-contain"
                width={post.transformation?.width}
                height={post.transformation?.height}
              />
            ) : (
              <video
                controls
                preload="metadata"
                className="max-h-[300px] sm:max-h-[400px] md:max-h-[500px] w-full object-contain"
              >
                <source src={post.mediaUrl} type="video/mp4" />
              </video>
            )}
          </div>

          {/* Post Info Section */}
          <div className="px-4 py-3 bg-black/60">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold text-white">{post.title}</h2>
              <p className="text-gray-300 text-sm">{post.description}</p>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <Link href={`/profile/${post.user._id}`} className="flex items-center gap-4">
                <Image
                  src={post.user.avatar || "/default-avatar.png"}
                  alt={post.user.username || "User Avatar"}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <span className="text-lg font-semibold text-white">{post.user.username || "Anonymous"}</span>
              </Link>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between mt-4 gap-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLikeToggle}
                  disabled={isLiking}
                  className={`flex items-center space-x-1 ${
                    liked ? 'text-red-500' : 'text-gray-400'
                  } hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <Heart className="w-6 h-6" />
                </button>

                {/* Likes Count */}
                <button
                  onClick={() => setShowLikesDropdown((prev) => !prev)}
                  className="text-gray-400 hover:text-white"
                >
                  <span className="text-lg">{likes?.length || 0}</span>
                </button>

                {/* Likes Dropdown */}
                {showLikesDropdown && <LikesDropdown
                  likes={likes as Like[]}
                  showLikesDropdown={showLikesDropdown}
                  setShowLikesDropdown={setShowLikesDropdown}
                />}

                {/* Comment Button */}
                <button
                  onClick={handleCommentClick}
                  className="text-gray-400 hover:text-white"
                >
                  <MessageCircle className="w-6 h-6" />
                </button>

                {/* Share Button */}
                <ShareButton
                  contentType="post"
                  contentId={post._id!.toString()}
                  title={post.title}
                  description={post.description}
                  mediaUrl={post.mediaUrl}
                  author={{
                    id: post.user._id!.toString(),
                    username: post.user.username || 'Anonymous',
                    avatar: post.user.avatar
                  }}
                />
              </div>

              {/* Edit and Delete buttons */}
              {session?.user?.id === post?.user?._id.toString() && (
                <div className="flex space-x-4">
                  <button
                    onClick={handleUpdatePost}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleDeletePost}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash className="w-5 h-5" />
                  </button>
                </div>
              )}
        </div>

            {/* Comments Section */}
            {showComments && (
              <Suspense fallback={<DetailSkeleton type="post" />}>
                <div className="mt-6">
                  <CommentSection contentId={post._id!.toString()} category="post" />
                </div>
              </Suspense>
            )}

            <div className="text-xs text-gray-400 mt-4">
              <p>
                <strong>Created:</strong>{' '}
                {post.createdAt ? formatDistanceToNow(new Date(post.createdAt)) + ' ago' : 'Not available'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
