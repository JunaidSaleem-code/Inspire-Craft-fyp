// components/tutorial/TutorialCard.tsx
'use client';

import { Tutorial } from '@/app/types/page';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

interface Props {
  tutorial: Tutorial;
}

export default function TutorialCard({ tutorial }: Props) {
  return (
    <Link href={`/tutorial/${tutorial._id}`}>
      <motion.div
        className="group relative card-artist hover-lift transition-all duration-300 overflow-hidden cursor-pointer"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative aspect-video overflow-hidden bg-black">
          <video 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            preload="metadata"
            muted
            playsInline
          >
            <source src={tutorial.mediaUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
          
          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="p-4 glass rounded-full border border-white/20"
              whileHover={{ scale: 1.1 }}
            >
              <Play className="w-8 h-8 text-white fill-white" />
            </motion.div>
          </div>
        </div>

        <CardContent className="p-4 space-y-2">
          <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
            {tutorial.title}
          </h3>
          <p className="text-sm text-gray-400 line-clamp-2">
            {tutorial.description}
          </p>
        </CardContent>
      </motion.div>
    </Link>
  );
}
