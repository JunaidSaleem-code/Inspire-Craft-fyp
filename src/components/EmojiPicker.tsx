"use client";
import * as React from 'react';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  theme?: 'light' | 'dark';
}

const commonEmojis = [
  '👍', '❤️', '😂', '😊', '🙌', '👏', '🔥', '🎉',
  '😍', '🥰', '😘', '😭', '😅', '🤣', '😳', '🥺',
  '🙏', '💕', '💯', '✨', '⭐', '💫', '💥', '💪',
  '🤔', '🤗', '🤭', '😉', '😌', '😏', '😬', '🙄'
];

export const EmojiPicker: React.FC<EmojiPickerProps> = ({ onEmojiSelect, theme = 'light' }) => {
  const handleEmojiClick = (emoji: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onEmojiSelect(emoji);
  };
  return (
    <div className={`p-2 rounded-lg shadow-lg grid grid-cols-8 gap-1 w-[320px] ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
      {commonEmojis.map((emoji, index) => (
        <button
          key={index}
          onClick={handleEmojiClick(emoji)}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          type="button"
        >
          <span className="text-xl">{emoji}</span>
        </button>
      ))}
    </div>
  );
}; 