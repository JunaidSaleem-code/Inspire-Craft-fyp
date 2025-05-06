import { useState } from "react";
import  {apiClient} from "@/lib/api-client";
import { useSession } from "next-auth/react";

interface CommentFormProps {
  contentId: string;
  category: string;
  parentId?: string;
  onSubmit: () => void;
}

const CommentForm = ({ contentId, category, parentId, onSubmit }: CommentFormProps) => {
  const [comment, setComment] = useState<string>("");
  const { data: session } = useSession();

  if (!session) return <p className="text-sm text-gray-500">Login to post a comment.</p>;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.commentOnContent(contentId, category, comment, parentId);
      setComment("");
      onSubmit(); // Call parent handler to refresh comments
    } catch (error) {
      console.error("Failed to post comment:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md"
        placeholder="Write a comment..."
        required
      />
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">
        Post Comment
      </button>
    </form>
  );
};

export default CommentForm;
