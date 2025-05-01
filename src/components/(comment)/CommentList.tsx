import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
import { IComment } from "@/models/Comment";

interface CommentListProps {
  contentId: string;
  category: string;
}

const CommentList = ({ contentId, category }: CommentListProps) => {
  const [comments, setComments] = useState<IComment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [totalComments, setTotalComments] = useState<number>(0);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await apiClient.getComments(category, contentId,  page);
      setComments(response.comments);
      setTotalComments(response.total);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePagination = (newPage: number) => {
    setPage(newPage);
    fetchComments();
  };

  useEffect(() => {
    fetchComments();
  }, [contentId, page]);

  return (
    <div className="space-y-6">
      <CommentForm contentId={contentId} category={category} onSubmit={fetchComments} />
      {loading ? (
        <div className="space-y-4">
        {[...Array(3)].map((_, idx) => (
          <div key={idx} className="animate-pulse h-6 bg-gray-200 rounded w-full" />
        ))}
      </div>
      ) : (
        <div>
          {comments.map((comment) => (
            <CommentItem
              key={comment._id?.toString()}
              comment={comment}
              contentId={contentId}
              category={category}
              onCommentUpdate={fetchComments}
            />
          ))}
        </div>
      )}
      <div className="flex justify-between">
        <button
          disabled={page === 1}
          onClick={() => handlePagination(page - 1)}
          className="bg-gray-300 px-4 py-2 rounded-md"
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button
          disabled={comments.length < 5}
          onClick={() => handlePagination(page + 1)}
          className="bg-gray-300 px-4 py-2 rounded-md"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CommentList;
