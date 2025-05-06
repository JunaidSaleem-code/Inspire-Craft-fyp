// "use client";

// import { useState, useEffect } from "react";
// import { IKImage, IKVideo } from "imagekitio-next";
// import Link from "next/link";
// import { IPost } from "@/models/Post";
// import { Heart, MessageCircle, Reply } from "lucide-react";
// import { apiClient } from "@/lib/api-client";
// import { useSession } from "next-auth/react";
// import CommentSection from "../CommentSection";
// import mongoose from "mongoose";
// import { Comment } from "../../../(types)/comment";  // Import the unified Comment type

// export default function PostComponent({ post }: { post: IPost }) {
//   const { data: session } = useSession();
//   const [likes, setLikes] = useState(post.likes.length);
//   const [isLiked, setIsLiked] = useState(post.likes.some((like) => like.toString() === session?.user.id));
//   const [comments, setComments] = useState<Comment[]>([]);

//   useEffect(() => {
//     const fetchComments = async () => {
//       const fetchedComments = await apiClient.getPostComments(post._id.toString());
//       const commentsWithUserDetails = await Promise.all(
//         fetchedComments.map(async (comment: Comment) => { // Explicitly type `comment`
//           const user = await apiClient.getUser(comment.user.toString());
//           return {
//             ...comment,
//             _id: comment._id.toString(),
//             user: {
//               name: user.name,
//               avatar: user.avatar,
//             },
//           };
//         })
//       );
//       setComments(commentsWithUserDetails);
//     };
//     fetchComments();
//   }, [post.comments]);

//   const handleLike = async () => {
//     if (!session) return alert("Please log in to like posts.");
//     setIsLiked(!isLiked);
//     setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
//     await apiClient.likePost(post._id.toString());
//   };

//   const handleComment = async (commentText: string, parentId?: string) => {
//     if (!session) return alert("Please log in to comment.");

//     const newComment: Comment = {
//       _id: new mongoose.Types.ObjectId().toString(),
//       user: {
//         name: session.user.name || "Anonymous",
//         avatar: session.user.image || "",
//       },
//       text: commentText,
//       parentId: parentId ? new mongoose.Types.ObjectId(parentId).toString() : undefined,
//       replies: [],
//       createdAt: new Date(),
//     };

//     setComments([...comments, newComment]);
//     await apiClient.commentOnPost(post._id.toString(), commentText, parentId);
//   };

//   return (
//     <div className="card bg-base-100 shadow hover:shadow-lg transition-all duration-300">
//       <figure className="relative px-4 pt-4">
//         <Link href={`/posts/${post._id}`} className="relative group w-full">
//           <div className="rounded-xl overflow-hidden relative w-full" style={{ aspectRatio: "1 / 1" }}>
//             {post.mediaType === "video" ? (
//               <IKVideo path={post.mediaUrl} transformation={[{ height: "1080", width: "1080" }]} controls className="w-full h-full object-cover" />
//             ) : (
//               <IKImage path={post.mediaUrl} transformation={[{ height: "1080", width: "1080" }]} className="w-full h-full object-cover" alt={post.title}/>
//             )}
//           </div>
//         </Link>
//       </figure>

//       <div className="card-body p-4">
//         <Link href={`/posts/${post._id}`} className="hover:opacity-80 transition-opacity">
//           <h2 className="card-title text-lg">{post.title}</h2>
//         </Link>

//         <p className="text-sm text-base-content/70 line-clamp-2">{post.description}</p>

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