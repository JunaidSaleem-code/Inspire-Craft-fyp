// components/LikesDropdown.tsx

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Like } from '@/app/types/page';


interface LikesDropdownProps {
  likes: Like[];
  showLikesDropdown: boolean;
  setShowLikesDropdown: React.Dispatch<React.SetStateAction<boolean>>;
}

const LikesDropdown = ({
  likes,
  showLikesDropdown,
  setShowLikesDropdown,
}: LikesDropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Handle clicking outside of dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowLikesDropdown(false);
      }
    };

    if (showLikesDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showLikesDropdown , setShowLikesDropdown]);

  return (
    showLikesDropdown && (
      <div
        ref={dropdownRef}
        className="absolute glass border border-white/20 shadow-lg p-2 rounded-lg mt-2 w-48 max-h-60 overflow-y-auto z-50"
      >
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold text-sm text-white">Liked By</span>
          <X
            className="w-4 h-4 cursor-pointer text-white"
            onClick={() => setShowLikesDropdown(false)}
          />
        </div>
        <div>
          {likes?.map((like: Like) => (
            <div key={like._id} className="text-sm py-1 text-white">
              {like.user?.username}
            </div>
          ))}
        </div>
      </div>
    )
  );
};

export default LikesDropdown;
