import { useState } from "react";
import { useSession } from "next-auth/react";
import { apiClient } from "@/lib/api-client";

interface CommentItemProps {
  comment: any;
  contentId: string;
  category: string;
  onCommentUpdate: () => void;
}

const CommentItem = ({ comment, contentId, category, onCommentUpdate }: CommentItemProps) => {
  const { data: session } = useSession();
  const [editing, setEditing] = useState(false);
  const [updatedComment, setUpdatedComment] = useState<string>(comment.content || "");

  const commentOwnerId =
    typeof comment.user?._id === "string" ? comment.user._id : comment.user?._id;

  const isOwner = session?.user?.id === commentOwnerId;

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('comment._id', comment._id, 'category', category, 'updatedComment', updatedComment);
      const response =await apiClient.updateComment(comment._id.toString(), category, {
        content: updatedComment,
      });
      console.log('response:: edit:', response);
      setEditing(false);
      onCommentUpdate();
    } catch (error) {
      console.error("Failed to update comment:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await apiClient.deleteComment(comment._id, category);
      onCommentUpdate();
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  return (
    <div className="space-y-3 p-4 border-b">
      {/* Header: Avatar + Name */}
      <div className="flex items-center space-x-2">
        <img
          src={comment.user?.avatar || "/default-avatar.png"}
          alt={comment.user?.name || "User"}
          className="w-8 h-8 rounded-full"
        />
        <span className="font-semibold text-sm">
          {comment.user?.name || "Unknown"}
        </span>
      </div>

      {/* Content or Edit Form */}
      {editing ? (
        <form onSubmit={handleEditSubmit} className="space-y-2">
          <textarea
            value={updatedComment}
            onChange={(e) => setUpdatedComment(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <div className="flex space-x-2">
            <button
              type="submit"
              className="bg-blue-500 px-3 py-1 text-white rounded-md text-sm"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="text-gray-500 text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <p className="text-gray-800 text-sm">{comment.content}</p>
      )}

      {/* Actions (Edit/Delete) */}
      <div className="flex space-x-4 text-sm">
        {isOwner && (
          <>
            <button
              onClick={() => setEditing(true)}
              className="text-blue-500 hover:underline"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="text-red-500 hover:underline"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
