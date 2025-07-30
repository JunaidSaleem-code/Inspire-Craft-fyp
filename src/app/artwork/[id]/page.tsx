'use client';

import { Heart, MessageCircle, Trash, Pencil } from 'lucide-react';
import { Suspense, useEffect, useState,useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import  {apiClient} from "@/lib/api-client";
import { Skeleton } from '@/components/ui/skeleton';
import { useSession } from 'next-auth/react';
import CommentSection from '@/components/CommentSection-DESKTOP-Q7VSBOC';
import { formatDistanceToNow } from 'date-fns';
import LikesDropdown from '@/components/LikeDropdown';
import { useNotification } from '@/components/Notification';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Artwork, Like } from '@/app/types/page';
import Image from 'next/image';


export default function ArtworkDetail() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const { data: session } = useSession(); 
  const [artwork, setArtwork] = useState<Artwork>();
  const [showComments, setShowComments] = useState(false);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [showLikesDropdown, setShowLikesDropdown] = useState(false);
  const { showNotification } = useNotification();
  const [likes, setLikes] = useState<Like[]>([]);
  
  
  const fetchArtwork = useCallback(async () => {
    try {
      const artwork = await apiClient.getArtworkById(id!.toString());
      // console.log('response', artwork);
      setArtwork(artwork);
      setLikes(artwork.likes || []);
    } catch {
      showNotification('Failed to fetch artwork', 'error');
    } finally {
      setLoading(false);
    }
  }, [id, showNotification]);

  useEffect(() => {
    if (id) {
      fetchArtwork();
    }
  }, [id, fetchArtwork]);

  useEffect(() => {
    if (artwork && session?.user?.id) {
      setLiked(likes?.some((like: Like) => like?.user?._id?.toString() === session.user.id));
    }
  }, [artwork, session, likes]);

  const handleLikeToggle = async () => {
    if (!session?.user) {
      showNotification('Login to like!', 'error');
      return;
    }

    if (isLiking) return;
    setIsLiking(true);

    setLiked((prev) => !prev); // Optimistic update

    try {
      await apiClient.likeContent(id!.toString(), 'artwork');
      fetchArtwork();
    } catch {
      showNotification('Error liking artwork', 'error');
    } finally {
      setIsLiking(false);
    }
  };

  const handleCommentClick = () => {
    setShowComments((prev) => !prev);
  };

  const handleDeleteArtwork = async () => {
    if (!artwork || !artwork._id) return;
    try {
      const response = await apiClient.deleteArtwork(artwork._id.toString());
      if (response.success) {
        router.push('/artwork');
      }
    } catch  {
      showNotification('Delete failed', 'error');
    }
  };

  const handleUpdateArtwork = () => {
    if (artwork) {
      router.push(`/edit/artwork/${artwork._id}?category=artwork&fileType=${artwork.mediaType}`);
    }
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

  if (!artwork) return <div className="text-center mt-10">Artwork not found.</div>;

  const buyArtwork = async () => {
    if (!artwork || !artwork._id) return;
  
    try {
      const response = await apiClient.buyArtworkById(artwork._id.toString());
      console.log('response', response);
      if (response?.url) {
        window.location.href = response.url; // redirect to Stripe checkout
      } else {
        showNotification("Stripe session failed", "error");
      }
    } catch  {
      showNotification("Buy failed", "error");
    }
  };
  

  return (
    <div className="bg-white shadow-xl rounded-xl overflow-hidden max-w-2xl mx-auto mt-2 border mb-11">
      
      {/* Media Section */}
      <div className="relative w-full bg-black flex items-center justify-center">
        {artwork.mediaType === 'image' ? (
          <Image
            src={artwork.mediaUrl}
            alt={artwork.title}
            width={1080}
            height={1350}
            className="w-full object-cover"
            loading='eager'
          />
        ) : (
          <video
          controls
          preload="metadata"
          className="rounded-xl max-h-full w-full object-cover"
          width={1080}
          height={1350}
        >
          <source src={artwork.mediaUrl} type="video/mp4" />
        </video>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-3">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{artwork.title}</h1>
          {session?.user?.email === artwork.artist?.email && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleUpdateArtwork}
                className="text-sm text-blue-600 hover:underline flex items-center gap-1"
              >
                <Pencil className="w-5 h-5" /> 
              </button>
              <button
                onClick={handleDeleteArtwork}
                className="text-sm text-red-600 hover:underline flex items-center gap-1"
              >
                <Trash className="w-5 h-" />
              </button>
            </div>
          )}
        </div>

        <p className="text-gray-600">{artwork.description}</p>

        <div className="flex items-center gap-3 mt-4 relative">
          <button
            onClick={handleLikeToggle}
            className={`flex items-center gap-1 text-sm ${
              liked ? 'text-red-500' : 'text-gray-600'
            }`}
            disabled={isLiking}
          >
            <Heart className="w-5 h-5" />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowLikesDropdown(!showLikesDropdown)}
              className="text-gray-600 flex items-center"
            >
              {likes?.length || 0} 
            </button>

            {showLikesDropdown && <LikesDropdown 
            likes={likes} 
            showLikesDropdown={showLikesDropdown} 
            setShowLikesDropdown={setShowLikesDropdown} />}
          </div>

          <button 
          onClick={handleCommentClick}
          className="flex items-center gap-2 text-gray-600">
            <MessageCircle className="w-5 h-5" />
            {artwork.comments?.length || 0}
          </button>
        </div>

        <Link href={`/profile/${artwork.artist._id}`} className="flex items-center gap-4">
          <Image
            src={artwork.artist.avatar || "/default-avatar.png"}
            alt={artwork.artist.username || "User Avatar"}
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="text-lg font-semibold">{artwork.artist.username || "Anonymous"}</span>
        </Link>

        <div className="font-semibold text-lg">
          {artwork.price} {artwork.currency}
        </div>

        {artwork.isSold? <p className="text-red-600 font-medium">Sold</p> : <Button onClick={buyArtwork}>Buy Now</Button>
      }


        {showComments && (
          <Suspense fallback={<Skeleton className="h-20 w-full" />}>
          <div className="mt-6">
          <CommentSection contentId={artwork._id!.toString()} category="artwork" />
        </div>
          </Suspense>
        )}

        <div className="text-xs text-gray-400 mt-4">
                  <p>
                    <strong>Created:</strong>{' '}
                    {artwork.createdAt ? formatDistanceToNow(new Date(artwork.createdAt)) + ' ago' : 'Not available'}
                  </p>
                </div>

      </div>
    </div>
  );
}
