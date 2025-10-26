"use client";

import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

export default function LoadingSpinner({ 
  text, 
  size = 'md',
  fullScreen = true 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const spinner = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center gap-4"
    >
      <div className={`${sizeClasses[size]} relative`}>
        <Loader2 className="w-full h-full animate-spin text-purple-500" />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-md opacity-50" />
      </div>
      {text && (
        <p className="text-gray-300 text-sm font-medium">{text}</p>
      )}
    </motion.div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-black pt-24 pb-24 flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
}

