import ChatListWithWindow from '@/components/ChatListWithWindow';

export default function MessagesPage() {
  return (
    <div className="min-h-screen bg-black pt-24 pb-24">
      <div className="max-w-4xl mx-auto px-4">
        <ChatListWithWindow />
      </div>
    </div>
  );
} 