'use client';

import { useEffect, useState,useCallback } from 'react';
import { useParams } from 'next/navigation';
import  {apiClient} from "@/lib/api-client";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { formatDistanceToNow } from 'date-fns';
import CommentSection from '@/components/CommentSection';
import { Like, Tutorial, User } from '@/app/types/page';




export default function TutorialPage() {
  const [tutorial, setTutorial] = useState<Tutorial>();
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const { id } = useParams();
  
  const fetchTutorial = useCallback(async () => {
    try {
      const {tutorial} = await apiClient.getTutorialById(id as string);
      setTutorial(tutorial);
      
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchTutorial();
  }, [id, fetchTutorial]);

  const handleLikeToggle = async () => {
    if (!session?.user) return alert('Login to like!');
    await apiClient.likeContent(id as string, 'tutorial');   
    fetchTutorial();
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!tutorial) return <div className="text-center mt-10 text-red-500">Tutorial not found</div>;

  const isLikedByUser = tutorial.likes?.some((like: Like) => like.user?._id === session?.user?.id);

  function isPopulatedUser(author: User): author is { _id: string; username?: string; email?: string } {
    return typeof author === 'object' && ('username' in author || 'email' in author);
  }
  

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Card className="shadow-md rounded-lg overflow-hidden">
        <CardContent>
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-3">
            {isPopulatedUser(tutorial.author) ? (
      <Link href={`/profile/${(tutorial.author as User)._id}`} className="flex items-center gap-2">
        <span className="font-medium">
          {tutorial.author.username ?? tutorial.author.email}
        </span>
      </Link>
    ) : (
      <span className="font-medium text-gray-500">Unknown Author</span>
    )}
              <span className="text-sm text-gray-500">
                • {formatDistanceToNow(new Date(tutorial.createdAt!.toString()))} ago
              </span>
            </div>

            {/* LIKE have issues */}
            <Button variant="outline" onClick={handleLikeToggle}>
              {isLikedByUser ? '❤️ Liked' : '🤍 Like'} ({tutorial.likes?.length})
            </Button>
          </div>


          {/* Video */} 
           <video controls className="w-full rounded-lg mb-6">
            <source src={tutorial.mediaUrl} type="video/mp4" />
          </video>
          
          {/* Title */}
          <h1 className="text-2xl font-bold mb-4">{tutorial.title}</h1>

          {/* Description */}
          <p className="text-gray-700 mb-6">{tutorial.description}</p>

          {/* Comments */}
          <div className="mt-6">
            <CommentSection contentId={String(tutorial._id)} category="tutorial" />
          </div>
    
        </CardContent>
      </Card>
 </div>
  );
}  
