'use client';

import { Card, CardContent } from '@/components/ui/card';
import { IKImage, IKVideo } from 'imagekitio-next';
import { IArtwork } from '@/models/Artwork';
import { useRouter } from 'next/navigation';


const _DIMENSIONS = {
  square: { width: 1080, height: 1080 },
  portrait: { width: 1080, height: 1350 },
  landscape: { width: 1080, height: 566 },
} as const;

interface ArtworkCardProps {
  artwork: IArtwork;
}

export default function ArtworkCard({ artwork }: ArtworkCardProps) {
  const IMAGEKIT_BASE_URL = process.env.NEXT_PUBLIC_URL_ENDPOINT || '';
  const router = useRouter();

  const goToDetailPage = () => {
    router.push(`/artwork/${artwork._id}`);
  };

  return (
    <div
      onClick={goToDetailPage}
      className="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition"
    >
      <Card>
        <CardContent className="p-0">
          {artwork.mediaType === 'image' ? (
            <IKImage
              urlEndpoint={IMAGEKIT_BASE_URL}
              path={artwork.mediaUrl.startsWith('http') ? undefined : artwork.mediaUrl}
              src={artwork.mediaUrl.startsWith('http') ? artwork.mediaUrl : undefined}
              alt={artwork.title}
              className="w-full h-auto object-cover"
              width={_DIMENSIONS.portrait.width}
              height={_DIMENSIONS.portrait.height}
              loading="lazy"
            />
          ) : (
            <IKVideo
              urlEndpoint={IMAGEKIT_BASE_URL}
              src={artwork.mediaUrl}
              controls
              className="w-full h-auto object-cover"
              width={_DIMENSIONS.portrait.width}
              height={_DIMENSIONS.portrait.height}
            />
          )}
          <div className="p-4">
            <h3 className="text-xl font-semibold">{artwork.title}</h3>
            <p className="text-gray-700 text-sm mt-2">{artwork.description}</p>
            <p className="text-gray-800 font-semibold mt-2">
              {artwork.price} {artwork.currency}
            </p>
            {artwork.isSold && <p className="text-red-500 text-sm">Sold</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
