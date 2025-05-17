// components/PostSkeleton.tsx
const PostSkeleton = () => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md animate-pulse mb-6">
      {/* Image/Video Placeholder */}
      <div className="w-full aspect-square bg-gray-300" />

      {/* Title & Description */}
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-300 rounded w-2/3" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-5/6" />
        <div className="h-3 bg-gray-200 rounded w-4/6" />
      </div>
    </div>
  );
};

export default PostSkeleton;
