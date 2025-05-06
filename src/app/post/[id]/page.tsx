'use client';

import { Heart, MessageCircle, Trash, Pencil } from 'lucide-react';
import { IKImage } from 'imagekitio-next';
import { Suspense, useEffect, useState,useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import  {apiClient} from "@/lib/api-client";
import { Skeleton } from '@/components/ui/skeleton';
import { useSession } from 'next-auth/react';
import CommentSection from '@/components/CommentSection';
import { formatDistanceToNow } from 'date-fns';
import LikesDropdown from '@/components/LikeDropdown';
import { useNotification } from '@/components/Notification';
import { Like, Post } from '@/app/types/page';


export default function PostDetail() {
  const router = useRouter();
  const { id } = useParams();
  const { data: session } = useSession();
  const [post, setPost] = useState<Post >();
  const [showComments, setShowComments] = useState(false);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [showLikesDropdown, setShowLikesDropdown] = useState(false);
  const {showNotification} = useNotification();
  const [likes,setLikes] = useState<Like[]>([]);
  
  const fetchPost = useCallback(async () => {
    try {
      const {post,likes} = await apiClient.getPostById(id!.toString());
      setPost(post);
      setLikes(likes);
      console.log('post', post);
    } catch {
      showNotification('Failed to fetch post', 'error');
      // console.error('Failed to fetch post', error);
    } finally {
      setLoading(false);
    }
  }, [id, showNotification]);
  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id, fetchPost]);
  
  useEffect(() => {
    if (post && session?.user?.id) {
      setLiked((likes as Like[])?.some((like) => like?.user?._id?.toString() === session.user.id));
    }
  }, [post, session,likes]);

  const handleLikeToggle = async () => {
    if (!session?.user) {
      showNotification('Login to like!', 'error');
      // alert('Login to like!');
      return;
    }

    if (isLiking) return;
    setIsLiking(true);

    setLiked((prev) => !prev); // Optimistic update

    try {
      await apiClient.likeContent(id!.toString(), 'post');
      fetchPost();
    } catch {
      showNotification('Error liking post', 'error');
      // console.error(error);
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
      // console.error('Delete failed:', error);
    }
  };

  const handleUpdatePost = () => {
    if (post)
      router.push(`/edit/post/${post._id}?category=post&fileType=${post.mediaType}`);
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto mt-10 p-6">
        <Skeleton className="h-[500px] w-full rounded-xl mb-4" />
        <Skeleton className="h-6 w-1/2 mb-2" />
        <Skeleton className="h-4 w-full mb-4" />
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    );
  }

  if (!post) return <div className="text-center mt-10">Post not found.</div>;

  return (
    <div className="bg-white shadow-xl rounded-xl overflow-hidden max-w-2xl mx-auto mt-2 border mb-11">
      
      {/* Media Section */}
      <div
  className="relative w-full bg-black flex items-center justify-center"
  // style={{ height: post.transformation?.height ? `${post.transformation.height}px` : 'auto' }}
>

        {post.mediaType === 'image' ? (
          <IKImage
            // urlEndpoint={IMAGEKIT_BASE_URL}
            src={post.mediaUrl}
            alt={post.title}
            className=" max-h-full w-full object-cover"
            width={post.transformation?.width}
            height={post.transformation?.height}
            transformation={[{ quality: 'auto' }]}
            lqip={{ active: true, quality: 20, blur: 20 }}

          />
        ) : (
          <video
            controls
            preload="metadata"
            className="rounded-xl max-h-full w-full object-cover"
          >
            <source src={post.mediaUrl} type="video/mp4" />
          </video>
        )}
      </div>

      {/* Post Info Section */}
      <div className="px-6 py-4">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold">{post.title}</h2>
          <p className="text-gray-500 text-sm">{post.description}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-4 gap-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLikeToggle}
              disabled={isLiking}
              className={`flex items-center space-x-1 ${
                liked ? 'text-red-500' : 'text-gray-500'
              } hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
                <Heart className="w-6 h-6" />
            </button>

            {/* Likes Count */}
            <button
              onClick={() => setShowLikesDropdown((prev) => !prev)}
              className="text-gray-500 hover:text-gray-700"
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
              className="text-gray-500 hover:text-gray-700"
            >
              <MessageCircle className="w-6 h-6" />
            </button>
          </div>

          {/* Edit and Delete buttons */}
          {session?.user?.id === post?.user?._id.toString() && (
            <div className="flex space-x-4">
              <button
                onClick={handleUpdatePost}
                className="text-blue-500 hover:text-blue-700"
              >
                <Pencil className="w-5 h-5" />
              </button>
              <button
                onClick={handleDeletePost}
                className="text-red-500 hover:text-red-700"
              >
                <Trash className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Comments Section */}
        {showComments && (
          <Suspense fallback={<Skeleton className="h-20 w-full" />}>
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
  );
}
