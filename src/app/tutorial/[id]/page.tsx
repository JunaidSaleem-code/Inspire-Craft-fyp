'use client';

import { useEffect, useState,useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import  {apiClient} from "@/lib/api-client";
import { useSession } from 'next-auth/react';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, Pencil, Trash } from 'lucide-react';
import CommentSection from '@/components/CommentSection';
import LikesDropdown from '@/components/LikeDropdown';
import { useNotification } from '@/components/Notification';
import { Skeleton } from '@/components/ui/skeleton';
import { Like, Tutorial, User } from '@/app/types/page';



export default function TutorialPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { showNotification } = useNotification();

  const [tutorial, setTutorial] = useState<Tutorial | null>(null);
  const [liked, setLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [showLikesDropdown, setShowLikesDropdown] = useState(false);

  
  const fetchTutorial = useCallback(async () => {
    try {
      const {tutorial,likes} = await apiClient.getTutorialById(id as string);
      setTutorial(tutorial!);
      setLiked(likes!.some((like: Like) => like?.user?._id === session?.user?.id));
    } catch {
      showNotification('Failed to fetch tutorial', 'error');
    } finally {
      setLoading(false);
    }
  }, [id, session, showNotification]);

  useEffect(() => {
    if (id) fetchTutorial();
  }, [id, fetchTutorial]);

  const handleLikeToggle = async () => {
    if (!session?.user) return showNotification('Login to like!', 'error');
    if (isLiking) return;

    setIsLiking(true);
    setLiked((prev) => !prev);

    try {
      await apiClient.likeContent(id as string, 'tutorial');
      fetchTutorial();
    } catch {
      showNotification('Error toggling like', 'error');
    } finally {
      setIsLiking(false);
    }
  };

  const handleCommentClick = () => setShowComments((prev) => !prev);

  const handleDeleteTutorial = async () => {
    if (!tutorial) return;
    try {
      const res = await apiClient.deleteTutorial(id!.toString());
      if (res.success) router.push('/tutorial');
    } catch {
      showNotification('Delete failed', 'error');
    }
  };

  const handleUpdateTutorial = () => {
    if (tutorial)
    //   console.log(tutorial);
    // console.log('id', id);
      router.push(`/edit/tutorial/${tutorial._id}?category=tutorial&fileType=video`);
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

  if (!tutorial) return <div className="text-center mt-10 text-red-500">Tutorial not found</div>;

  const isOwner = session?.user?.id === tutorial.author?._id;

  return (
    <div className="bg-white shadow-xl rounded-xl overflow-hidden max-w-2xl mx-auto mt-4 mb-12 border">
      {/* Media Section */}
      <div className="w-full bg-black">
        <video controls preload="metadata" className="w-full h-auto object-contain max-h-[600px]">
          <source src={tutorial.mediaUrl} type="video/mp4" />
        </video>
      </div>
      {/* Info Section */}
      <div className="px-6 py-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-600">
            {typeof tutorial.author === 'object' ? (
              <span className="font-semibold">
                {(tutorial.author as User)?.username || (tutorial.author as User)?.email}
              </span>
            ) : (
              <span className="text-gray-400">Unknown Author</span>
            )}
            <span className="ml-2 text-gray-400">• {formatDistanceToNow(new Date(tutorial.createdAt))} ago</span>
          </div>

          {isOwner && (
            <div className="flex items-center space-x-3">
              <button onClick={handleUpdateTutorial}>
                <Pencil className="w-5 h-5 text-blue-500" />
              </button>
              <button onClick={handleDeleteTutorial}>
                <Trash className="w-5 h-5 text-red-500" />
              </button>
            </div>
          )}
        </div>

        {/* Title & Description */}
        <h1 className="text-2xl font-bold mb-2">{tutorial.title}</h1>
        <p className="text-gray-700">{tutorial.description}</p>

        {/* Actions */}
        <div className="flex items-center justify-between mt-4 gap-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLikeToggle}
              disabled={isLiking}
              className={`flex items-center space-x-1 ${
                liked ? 'text-red-500' : 'text-gray-500'
              } hover:text-red-500 disabled:opacity-50`}
            >
              <Heart className="w-6 h-6" />
            </button>

            <button onClick={() => setShowLikesDropdown((prev) => !prev)}>
              <span className="text-lg text-gray-700 hover:text-black">{tutorial.likes?.length || 0}</span>
            </button>

            {showLikesDropdown && (
              <LikesDropdown
                likes={tutorial.likes ||  []}
                showLikesDropdown={showLikesDropdown}
                setShowLikesDropdown={setShowLikesDropdown}
              />
            )}

            <button onClick={handleCommentClick} className="text-gray-500 hover:text-gray-700">
              <MessageCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Comments */}
        {showComments && (
          <div className="mt-6">
            <CommentSection contentId={String(tutorial._id)} category="tutorial" />
          </div>
        )}
      </div>
    </div>
  );
}
