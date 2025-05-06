// "use client";

// import { useState } from "react";
// import { IKImage } from "imagekitio-next";
// import Link from "next/link";
// import { Heart, MessageCircle, ShoppingCart } from "lucide-react";
// import { apiClient } from "@/lib/api-client";
// import { useSession } from "next-auth/react";
// import CommentSection from "../CommentSection";


// export default function ArtworkComponent({ artwork }: { artwork: any }) {
//   const { data: session } = useSession();
//   const [likes, setLikes] = useState<number>(artwork.likes.length);
//   const [isLiked, setIsLiked] = useState(artwork.likes.includes(session?.user.id));
//   const [comments, setComments] = useState(artwork.comments);

//   const handleLike = async () => {
//     if (!session) return alert("Please log in to like artworks.");
//     setIsLiked(!isLiked);
//     setLikes((prev: number) => (isLiked ? prev - 1 : prev + 1));
//     await apiClient.likeArtwork(artwork._id);
//   };

//   const handleBuy = async () => {
//     if (!session) return alert("Please log in to purchase artwork.");
//     await apiClient.buyArtwork(artwork._id);
//     alert("Purchase successful!");
//   };

//   return (
//     <div className="card bg-base-100 shadow hover:shadow-lg transition-all duration-300">
//       <figure className="relative px-4 pt-4">
//         <Link href={`/artwork/${artwork._id}`} className="relative group w-full">
//           <div className="rounded-xl overflow-hidden relative w-full" style={{ aspectRatio: "1 / 1" }}>
//             <IKImage path={artwork.imageUrl} transformation={[{ height: "1080", width: "1080" }]} className="w-full h-full object-cover" alt={artwork.title}/>
//           </div>
//         </Link>
//       </figure>

//       <div className="card-body p-4">
//         <h2 className="card-title text-lg">{artwork.title}</h2>
//         <p className="text-sm text-base-content/70">{artwork.description}</p>

//         <div className="flex items-center justify-between">
//           <span className="text-lg font-bold">PKR {artwork.price}</span>
//           <button className="btn btn-primary" onClick={handleBuy}>
//             <ShoppingCart className="w-5 h-5" /> Buy Now
//           </button>
//         </div>

//         {/* Like & Comment Section */}
//         <div className="flex items-center gap-4 mt-2">
//           <button className="flex items-center gap-1 text-red-500" onClick={handleLike}>
//             <Heart className={`w-5 h-5 ${isLiked ? "fill-red-500" : "stroke-red-500"}`} />
//             <span>{likes}</span>
//           </button>
//           <button className="flex items-center gap-1 text-gray-500">
//             <MessageCircle className="w-5 h-5" />
//             <span>{comments.length}</span>
//           </button>
//         </div>

//         {/* Nested Comments */}
//         <CommentSection comments={comments} onComment={(comment) => console.log("Comment: ", comment)} />
//       </div>
//     </div>
//   );
// }
