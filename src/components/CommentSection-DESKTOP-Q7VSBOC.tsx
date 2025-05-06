import CommentList from "./(comment)/CommentList";

const CommentSection = ({ contentId, category }: { contentId: string, category: string }) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Comments</h2>
      <CommentList contentId={contentId} category={category} />
    </div>
  );
};

export default CommentSection;
