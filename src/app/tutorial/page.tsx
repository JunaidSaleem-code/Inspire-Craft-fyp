// app/tutorial/page.tsx
'use client';

import TutorialCard from '@/components/TutorialCard';
import CardSkeleton from '@/components/skeletons/CardSkeleton';
import { useTutorials } from '@/hooks/useData';

export default function TutorialsPage() {
  const { data: tutorials, isLoading: loading } = useTutorials();

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-24 pb-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              <span className="gradient-text">Art Tutorials</span>
            </h1>
            <p className="text-gray-400 text-lg">Learn new skills from talented artists</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <CardSkeleton count={6} aspectRatio="video" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">
            <span className="gradient-text">Art Tutorials</span>
          </h1>
          <p className="text-gray-400 text-base sm:text-lg">Learn new skills from talented artists</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {tutorials?.map((tutorial) => (
            <TutorialCard key={tutorial._id?.toString()} tutorial={tutorial} />
          ))}
        </div>
      </div>
    </div>
  );
}
