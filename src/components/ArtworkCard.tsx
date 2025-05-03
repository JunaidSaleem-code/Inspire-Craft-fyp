// 'use client';

// import { Card, CardContent } from '@/components/ui/card';
// import { IKImage, IKVideo } from 'imagekitio-next';
// import { IArtwork } from '@/models/Artwork';
// import { useRouter } from 'next/navigation';


// const _DIMENSIONS = {
//   square: { width: 1080, height: 1080 },
//   portrait: { width: 1080, height: 1350 },
//   landscape: { width: 1080, height: 566 },
// } as const;

// interface ArtworkCardProps {
//   artwork: IArtwork;
// }

// export default function ArtworkCard({ artwork }: ArtworkCardProps) {
//   const router = useRouter();

//   const goToDetailPage = () => {
//     router.push(`/artwork/${artwork._id}`);
//   };

//   return (
//     <div
//       onClick={goToDetailPage}
//       className="bg-white shadow-md rounded-xl overflow-hidden cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-xl"
//     >
//       <Card className="border-none rounded-none">
//         <CardContent className="p-0">
//           <div className="relative aspect-[4/5] w-full max-h-80 ">
//             {artwork.mediaType === 'image' ? (
//               <IKImage
//                 path={artwork.mediaUrl.startsWith('http') ? undefined : artwork.mediaUrl}
//                 src={artwork.mediaUrl.startsWith('http') ? artwork.mediaUrl : undefined}
//                 alt={artwork.title}
//                 className="w-full h-full object-cover rounded-2xl"
//                 width={_DIMENSIONS.portrait.width}
//                 height={_DIMENSIONS.portrait.height}
//                 loading="lazy"
//               />
//             ) : (
//               <IKVideo
//                 src={artwork.mediaUrl}
//                 controls
//                 className="w-full h-full object-cover"
//                 width={_DIMENSIONS.portrait.width}
//                 height={_DIMENSIONS.portrait.height}
//               />
//             )}
//           </div>

//           <div className="p-4 space-y-1">
//             <h3 className="text-lg font-bold text-gray-900 truncate">{artwork.title}</h3>
//             <p className="text-sm text-gray-600 line-clamp-2">{artwork.description}</p>
//             <p className="text-base text-gray-800 font-medium mt-1">
//               {artwork.price} {artwork.currency}
//             </p>
//             {artwork.isSold && <p className="text-red-500 text-xs font-semibold">Sold</p>}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

'use client';

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
      className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col sm:flex-row cursor-pointer hover:shadow-xl transition"
    >
      {/* Media */}
      <div className="sm:w-1/2 w-full">
        {artwork.mediaType === 'image' ? (
          <IKImage
            urlEndpoint={IMAGEKIT_BASE_URL}
            path={artwork.mediaUrl.startsWith('http') ? undefined : artwork.mediaUrl}
            src={artwork.mediaUrl.startsWith('http') ? artwork.mediaUrl : undefined}
            alt={artwork.title}
            className="w-full h-full object-cover max-h-80"
            width={_DIMENSIONS.square.width}
            height={_DIMENSIONS.square.height}
            loading="lazy"
          />
        ) : (
          <IKVideo
            urlEndpoint={IMAGEKIT_BASE_URL}
            src={artwork.mediaUrl}
            controls
            className="w-full h-full object-cover max-h-80"
            width={_DIMENSIONS.square.width}
            height={_DIMENSIONS.square.height}
          />
        )}
      </div>

      {/* Text Content */}
      <div className="p-4 flex flex-col justify-between sm:w-1/2 w-full">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{artwork.title}</h3>
          <p className="text-gray-600 text-sm mt-2 line-clamp-2">{artwork.description}</p>
        </div>
        <div className="mt-4">
          <p className="text-base font-semibold text-gray-800">
            {artwork.price} {artwork.currency}
          </p>
          {artwork.isSold && (
            <p className="text-sm text-red-500 font-medium mt-1">Sold</p>
          )}
        </div>
      </div>
    </div>
  );
}
