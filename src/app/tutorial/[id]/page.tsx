'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, Pencil, Trash } from 'lucide-react';
import Image from 'next/image';

import { apiClient } from '@/lib/api-client';
import { useNotification } from '@/components/Notification';
import CommentSection from '@/components/CommentSection-DESKTOP-Q7VSBOC';
import LikesDropdown from '@/components/LikeDropdown';
import DetailSkeleton from '@/components/skeletons/DetailSkeleton';
import { Like, Tutorial, User } from '@/app/types/page';
import { useTutorial } from '@/hooks/useData';
import ShareButton from '@/components/ShareButton';

export default function TutorialPage() {
  const params = useParams();
  const  id  = params?.id?.toString();
  const router = useRouter();
  const { data: session } = useSession();
  const { showNotification } = useNotification();

  const { data: tutorial, isLoading: loading, mutate } = useTutorial(id);
  const [liked, setLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showLikesDropdown, setShowLikesDropdown] = useState(false);

  useEffect(() => {
    if (tutorial && session?.user?.id) {
      setLiked(tutorial.likes?.some((like: Like) => like?.user?._id === session?.user?.id) || false);
    }
  }, [tutorial, session]);

  const handleLikeToggle = async () => {
    if (!session?.user) return showNotification('Login to like!', 'error');
    if (isLiking) return;

    setIsLiking(true);
    setLiked((prev) => !prev);

    try {
      await apiClient.likeContent(id!, 'tutorial');
      mutate(); // Revalidate SWR cache
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
    if (tutorial) {
      router.push(`/edit/tutorial/${tutorial._id}?category=tutorial&fileType=video`);
    }
  };

  if (loading) return <DetailSkeleton type="tutorial" />;

  if (!tutorial || typeof tutorial !== 'object') {
    return <div className="min-h-screen bg-black pt-24 pb-24"><div className="text-center text-red-400">Tutorial not found</div></div>;
  }

  const author = tutorial.author as User;
  const isOwner = session?.user?.id === author?._id;
  const likes = tutorial.likes || [];

  return (
    <div className="min-h-screen bg-black pt-24 pb-24">
      <div className="max-w-2xl mx-auto px-4">
        <div className="glass-strong rounded-2xl overflow-hidden border border-white/10">
          {/* Media Section */}
          <div className="w-full bg-black">
        <video controls preload="metadata" className="w-full h-auto object-contain max-h-[300px] sm:max-h-[400px] md:max-h-[500px]">
          <source src={tutorial.mediaUrl} type="video/mp4" />
        </video>
      </div>

          {/* Info Section */}
          <div className="px-4 py-3 bg-black/60">
        {/* Header with avatar, name, date */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3"
              onClick={() => router.push(`/profile/${author?._id}`)}>
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300">
              <Image
                src={author?.avatar || '/default-avatar.png'}
                alt={author?.username || 'User'}
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
            </div>
                          <div
              className="cursor-pointer"
            >
              <p className="font-semibold text-base flex items-center text-white">
                {author?.username || 'Anonymous'}
                {author?.isVerified && <span className="ml-1 text-blue-500 text-sm">✔️</span>}
              </p>
              {tutorial.createdAt && (
                <p className="text-xs text-gray-400">
                  {formatDistanceToNow(new Date(String(tutorial.createdAt)))} ago
                </p>
              )}
            </div>
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
        <h1 className="text-2xl font-bold mb-2 text-white">{tutorial.title}</h1>
        <p className="text-gray-300">{tutorial.description}</p>

        {/* Actions */}
        <div className="flex items-center justify-between mt-3 gap-6">
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
              <span className="text-lg text-gray-300 hover:text-white">{tutorial.likes?.length || 0}</span>
            </button>

            {showLikesDropdown && (
              <LikesDropdown
                likes={tutorial.likes || []}
                showLikesDropdown={showLikesDropdown}
                setShowLikesDropdown={setShowLikesDropdown}
              />
            )}

            <button onClick={handleCommentClick} className="text-gray-400 hover:text-gray-200">
              <MessageCircle className="w-6 h-6" />
            </button>

            <ShareButton
              contentType="tutorial"
              contentId={tutorial._id!.toString()}
              title={tutorial.title}
              description={tutorial.description}
              mediaUrl={tutorial.mediaUrl}
              author={{
                id: author._id!.toString(),
                username: author.username || 'Anonymous',
                avatar: author.avatar
              }}
            />
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
      </div>
    </div>
  );
}
