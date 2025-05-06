// "use client";

// import { useState } from "react";
// import { Reply } from "lucide-react";
// import { useSession } from "next-auth/react";

// interface Comment {
//   _id: string;
//   user: { name: string; avatar?: string };
//   text: string;
//   parentId?: string;
//   replies?: Comment[];
// }

// interface CommentSectionProps {
//   comments: Comment[];
//   onComment: (comment: string, parentId?: string) => void;
// }

// export default function CommentSection({ comments, onComment }: CommentSectionProps) {
//   const { data: session } = useSession();
//   const [replyingTo, setReplyingTo] = useState<string | null>(null);
//   const [replyText, setReplyText] = useState("");

//   const handleReply = (parentId: string) => {
//     if (!session) return alert("Please log in to reply.");
//     if (!replyText.trim()) return;
    
//     onComment(replyText, parentId);
//     setReplyText("");
//     setReplyingTo(null);
//   };

//   return (
//     <div className="mt-2">
//       {comments.length === 0 && <p className="text-gray-500 text-sm">No comments yet. Be the first to comment!</p>}
//       {comments.map((comment) => (
//         <div key={comment._id} className="border-l-2 border-gray-300 pl-2 mb-2">
//           <p className="text-sm text-gray-600">
//             <b>{comment.user.name}:</b> {comment.text}
//           </p>
//           <button 
//             className="text-xs text-blue-500 flex items-center gap-1" 
//             onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
//           >
//             <Reply className="w-4 h-4" /> Reply
//           </button>
          
//           {replyingTo === comment._id && (
//             <div className="mt-2">
//               <input
//                 type="text"
//                 placeholder="Write a reply..."
//                 className="input input-bordered w-full mt-2"
//                 value={replyText}
//                 onChange={(e) => setReplyText(e.target.value)}
//                 onKeyDown={(e) => e.key === "Enter" && handleReply(comment._id)}
//               />
//             </div>
//           )}

//           {/* Recursive replies */}
//           {comment.replies && <CommentSection comments={comment.replies} onComment={onComment} />}
//         </div>
//       ))}
//     </div>
//   );
// }
