'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { IKImage, IKVideo } from 'imagekitio-next';
import { Heart, MessageCircle, Pencil, X, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import CommentSection from '@/components/CommentSection';
import { useNotification } from '@/components/Notification';

const IMAGEKIT_BASE_URL = process.env.NEXT_PUBLIC_URL_ENDPOINT || '';

export default function ArtworkDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { data: session } = useSession();
  const router = useRouter();

  const [artwork, setArtwork] = useState<any>(null);
  const [likes, setLikes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [liking, setLiking] = useState(false);
  const [showLikesDropdown, setShowLikesDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchArtwork = async () => {
      try {
        const data = await apiClient.getArtworkById(id);
        const { data: artworkData } = data;
        setArtwork(artworkData);
        setLikes(artworkData.likes || []);
      } catch (err) {
        console.error('Error fetching artwork:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchArtwork();
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowLikesDropdown(false);
      }
    };

    if (showLikesDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showLikesDropdown]);

  const updateArtwork = async () => {
    try {
      router.push(`/edit/artwork/${artwork?._id}?category=artwork&fileType=${artwork.mediaType}`);

    } catch (err) {
      console.error(err);
      showNotification('Error updating artwork', 'error');
    }
  };

  const handleLike = async () => {
    if (!session) return showNotification('You must be logged in to like', 'error');

    setLiking(true);
    try {
      const response = await apiClient.likeContent(id, 'artwork');
      if (response.success) {
        setLikes(response.likes);
      }
    } catch (err) {
      console.error('Like error:', err);
      showNotification('Error liking artwork', 'error');
    } finally {
      setLiking(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = confirm('Are you sure you want to delete this artwork?');
    if (!confirmDelete) return;

    try {
      const res = await apiClient.deleteArtwork(id);
      if (res.success) {
        showNotification('Artwork deleted successfully', 'success');
        router.push('/artwork');
      } else {
        showNotification('Error deleting artwork', 'error');
      }
    } catch (err) {
      console.error(err);
      showNotification('Error deleting artwork', 'error');
    }
  };

  if (loading) {
    return (
      <div className="p-6 animate-pulse max-w-3xl mx-auto">
        <div className="h-[500px] bg-gray-200 rounded-lg" />
        <div className="mt-4 h-6 bg-gray-200 w-2/3 rounded" />
        <div className="mt-2 h-4 bg-gray-200 w-full rounded" />
      </div>
    );
  }

  if (!artwork) return <p className="text-center p-6 text-gray-600">Artwork not found.</p>;

  const isOwner = session?.user?.email === artwork.artist?.email;
  const userHasLiked = Array.isArray(likes) && session?.user?.email
  ? likes.some((like: any) => like?.user?.email === session.user.email)
  : false;


  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="bg-white shadow-md rounded-lg overflow-hidden relative">
        {artwork.mediaType === 'image' ? (
          <IKImage
            urlEndpoint={IMAGEKIT_BASE_URL}
            path={artwork.mediaUrl.startsWith('http') ? undefined : artwork.mediaUrl}
            src={artwork.mediaUrl.startsWith('http') ? artwork.mediaUrl : undefined}
            alt={artwork.title}
            width={1080}
            height={1350}
            className="w-full object-cover"
            lqip={{ active: true }}
          />
        ) : (
          <IKVideo
            urlEndpoint={IMAGEKIT_BASE_URL}
            src={artwork.mediaUrl}
            width={1080}
            height={1350}
            className="w-full object-cover"
            controls
          />
        )}

        <div className="p-6 space-y-3">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{artwork.title}</h1>
            {isOwner && (
              <div className="flex items-center gap-2">
                <button
                  onClick={updateArtwork}
                  className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                >
                  <Pencil className="w-4 h-4" /> Update
                </button>
                <button
                  onClick={handleDelete}
                  className="text-sm text-red-600 hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            )}
          </div>

          <p className="text-gray-600">{artwork.description}</p>

          <div className="text-sm text-gray-500">
            Posted by:{' '}
            <Link href={`/profile/${artwork.artist._id}`} className="underline hover:text-blue-600">
              {artwork.artist.email}
            </Link>
          </div>

          <div className="font-semibold text-lg">
            {artwork.price} {artwork.currency}
          </div>

          {artwork.isSold && <p className="text-red-600 font-medium">Sold</p>}

          <div className="flex items-center gap-3 mt-4 relative">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 text-sm ${
                userHasLiked ? 'text-red-500' : 'text-gray-600'
              }`}
              disabled={liking}
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

              {showLikesDropdown && (
                <div
                  ref={dropdownRef}
                  className="absolute z-20 top-8 left-0 bg-white shadow-lg border border-gray-200 rounded-lg w-64 max-h-60 overflow-y-auto"
                >
                  <div className="p-2 border-b text-gray-700 font-semibold flex justify-between items-center">
                    Liked by
                    <X
                      className="w-4 h-4 cursor-pointer"
                      onClick={() => setShowLikesDropdown(false)}
                    />
                  </div>

                  {liking ? (
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
                    </div>
                  ) : likes.length > 0 ? (
                    likes.map((like: any) => (
                      <div key={like._id} className="p-2 hover:bg-gray-50">
                        <div className="flex items-center gap-2">
                          <img
                            src={like.user?.image || '/default-avatar.png'}
                            alt={like.user?.name || like.user?.email}
                            className="w-6 h-6 rounded-full"
                          />
                          <span>{like.user?.name || like.user?.email}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-2 text-gray-500">No likes yet.</div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <MessageCircle className="w-5 h-5" />
              {artwork.comments?.length || 0}
            </div>
          </div>

          <div className="mt-6">
            <CommentSection contentId={artwork._id.toString()} category="artwork" />
          </div>
        </div>
      </div>
    </div>
  );
}
