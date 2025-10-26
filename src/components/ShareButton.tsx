'use client';

import { useState } from 'react';
import { Share2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useNotification } from './Notification';

interface ShareButtonProps {
  contentType: 'post' | 'artwork' | 'tutorial';
  contentId: string;
  title: string;
  description?: string;
  mediaUrl: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
  };
}

export default function ShareButton({ 
  contentType, 
  contentId, 
  title, 
  description, 
  mediaUrl, 
  author 
}: ShareButtonProps) {
  const { data: session } = useSession();
  const { showNotification } = useNotification();
  const [showModal, setShowModal] = useState(false);
  const [conversations, setConversations] = useState<Array<{ _id: string; name?: string; participants: Array<{ _id?: string; username?: string }> }>>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchConversations = async () => {
    if (!session?.user?.id) return;
    const res = await fetch('/api/messages/conversations', {
      headers: { 'x-user-id': session.user.id }
    });
    const data = await res.json();
    setConversations(data);
  };

  const handleShare = async () => {
    if (selected.length === 0) return;
    setLoading(true);

    try {
      await Promise.all(
        selected.map(conversationId =>
          fetch('/api/messages/message', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-user-id': session!.user!.id
            },
            body: JSON.stringify({
              conversationId,
              content: `Shared a ${contentType}`,
              type: 'shared',
              sharedContent: {
                type: contentType,
                contentId,
                title,
                description,
                mediaUrl,
                author
              }
            })
          })
        )
      );
      setShowModal(false);
      setSelected([]);
      showNotification(`Shared to ${selected.length} conversation(s)`, 'success');
    } catch (error) {
      console.error('Share failed:', error);
      showNotification('Failed to share content', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => {
          setShowModal(true);
          fetchConversations();
        }}
        className="flex items-center gap-1 text-gray-400 hover:text-purple-400 transition-colors"
      >
        <Share2 className="w-5 h-5" />
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-strong rounded-2xl p-6 w-full max-w-md border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">Share to</h3>
            
            {conversations.length === 0 ? (
              <p className="text-gray-400 text-sm mb-4">No conversations yet. Start a chat to share content!</p>
            ) : (
              <div className="max-h-64 overflow-y-auto mb-4 space-y-2 scrollbar-thin scrollbar-thumb-white/20">
                {conversations.map(conv => (
                  <label
                    key={conv._id}
                    className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-lg cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selected.includes(conv._id)}
                      onChange={e => {
                        if (e.target.checked) {
                          setSelected([...selected, conv._id]);
                        } else {
                          setSelected(selected.filter(id => id !== conv._id));
                        }
                      }}
                      className="rounded accent-purple-600"
                    />
                    <div className="flex-1">
                      <p className="text-white font-medium">
                        {conv.name || conv.participants.find((u) => u._id !== session?.user?.id)?.username || 'DM'}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelected([]);
                }}
                className="px-4 py-2 rounded-lg glass border border-white/20 text-white hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleShare}
                disabled={selected.length === 0 || loading || conversations.length === 0}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sharing...' : selected.length > 0 ? `Share (${selected.length})` : 'Share'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

