// "use client";

// import { useState } from "react";
// import { IKVideo } from "imagekitio-next";
// import Link from "next/link";
// import { Heart, MessageCircle, Reply } from "lucide-react";
// import { apiClient } from "@/lib/api-client";
// import { useSession } from "next-auth/react";
// import CommentSection from "../CommentSection";

// export default function TutorialComponent({ tutorial }: { tutorial: any }) {
//   const { data: session } = useSession();
//   const [likes, setLikes] = useState<number>(tutorial.likes.length);
//   const [isLiked, setIsLiked] = useState(tutorial.likes.includes(session?.user.id));
//   const [comments, setComments] = useState(tutorial.comments);

//   const handleLike = async () => {
//     if (!session) return alert("Please log in to like tutorials.");
//     setIsLiked(!isLiked);
//     setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
//     await apiClient.likeTutorial(tutorial._id);
//   };

//   const handleComment = async (comment: string, parentId?: string) => {
//     if (!session) return alert("Please log in to comment.");
//     const newComment = { user: session.user.name, text: comment, parentId };

//     setComments([...comments, newComment]);
//     await apiClient.commentOnTutorial(tutorial._id, comment, parentId);
//   };

//   return (
//     <div className="card bg-base-100 shadow hover:shadow-lg transition-all duration-300">
//       <figure className="relative px-4 pt-4">
//         <Link href={`/tutorials/${tutorial._id}`} className="relative group w-full">
//           <div className="rounded-xl overflow-hidden relative w-full" style={{ aspectRatio: "16 / 9" }}>
//             <IKVideo path={tutorial.videoUrl} transformation={[{ height: "720", width: "1280" }]} controls className="w-full h-full object-cover" />
//           </div>
//         </Link>
//       </figure>

//       <div className="card-body p-4">
//         <h2 className="card-title text-lg">{tutorial.title}</h2>
//         <p className="text-sm text-base-content/70 line-clamp-2">{tutorial.description}</p>

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
//         <CommentSection comments={comments} onComment={handleComment} />
//       </div>
//     </div>
//   );
// }
