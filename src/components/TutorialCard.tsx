// components/tutorial/TutorialCard.tsx
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ITutorial } from '@/models/Tutorial';
import Link from 'next/link';
import { Button } from './ui/button';

interface Props {
  tutorial: ITutorial;
}

export default function TutorialCard({ tutorial }: Props) {

  return (
    <Link href={`/tutorial/${tutorial._id}`}>
    <Card className="hover:shadow-lg">
      <CardContent className="p-4">
        <video controls className="w-full max-h-64 rounded-xl shadow">
          <source src={tutorial.mediaUrl} type="video/mp4" />
        </video>

        <h3 className="text-xl font-semibold mt-2">{tutorial.title}</h3>
        <p className="text-gray-600">{tutorial.description}</p>

      </CardContent>
    </Card>
    </Link>
  );
}
