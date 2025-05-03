// app/tutorial/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import TutorialCard from '@/components/TutorialCard';
import { ITutorial } from '@/models/Tutorial';

export default function TutorialsPage() {
  const [tutorials, setTutorials] = useState<ITutorial[]>([]);

  useEffect(() => {
    const fetchTutorials = async () => {
      try {
        const response = await apiClient.getTutorials();
        setTutorials(response?.data || []);
      } catch (error) {
        console.error('Error fetching tutorials:', error);
      }
    };

    fetchTutorials();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 mb-9 bg-gray-100">
      <h1 className="text-3xl font-bold text-center mb-8">Art Tutorials</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {tutorials.map((tutorial) => (
          <TutorialCard key={tutorial._id?.toString()} tutorial={tutorial} />
        ))}
      </div>
    </div>
  );
}
