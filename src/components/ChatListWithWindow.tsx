"use client";
import React, { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { EmojiPicker } from "./EmojiPicker";
import { io, Socket } from "socket.io-client";
import type { User } from "../types/index";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import SharedContentPreview from "./SharedContentPreview";

interface Conversation {
  _id: string;
  name?: string;
  avatar?: string;
  participants: User[];
  lastMessage?: {
    content: string;
    senderId: string | User;
    timestamp: string;
    type: string;
  };
  isGroup: boolean;
  admins?: string[];
  type: 'direct' | 'group';
}

interface Message {
  _id: string;
  senderId: string | User;
  content: string;
  type: string;
  timestamp: string;
  media?: { url: string; type: string };
  seenBy: string[];
  reactions: { user: string; emoji: string }[];
  sharedContent?: {
    type: 'post' | 'artwork' | 'tutorial';
    contentId: string;
    title: string;
    description?: string;
    mediaUrl: string;
    author: {
      id: string;
      username: string;
      avatar?: string;
    };
  };
}

export default function ChatListWithWindow() {
  const { data: session } = useSession();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupUsers, setGroupUsers] = useState<string[]>([]);
  const [searchUser, setSearchUser] = useState("");
  const [userResults, setUserResults] = useState<User[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showNewDM, setShowNewDM] = useState(false);
  const [dmSearch, setDmSearch] = useState("");
  const [dmResults, setDmResults] = useState<User[]>([]);
  const [dmSelected, setDmSelected] = useState<string>("");
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    if (session?.user?.id && !socket) {
      const s = io({ path: "/api/socket" });
      s.emit("authenticate", session.user.id);
      setSocket(s);
      return () => { s.disconnect(); };
    }
  }, [session?.user?.id, socket]);

  useEffect(() => {
    if (!session?.user?.id) return;
    fetch("/api/messages/conversations", { headers: { "x-user-id": session.user.id } })
      .then(res => res.json())
      .then(data => {
        setConversations(data);
      });
  }, [session?.user?.id]);

  useEffect(() => {
    if (!selectedConversation || !session?.user?.id) return;
    fetch(`/api/messages/message?conversationId=${selectedConversation._id}`, { headers: { "x-user-id": session.user.id } })
      .then(res => res.json())
      .then(setMessages);
    if (socket) {
      socket.emit("join-conversation", selectedConversation._id);
      socket.on("new-message", (msg: Message) => {
        setMessages(prev => [...prev, msg]);
        scrollToBottom();
      });
    }
    return () => {
      if (socket) {
        socket.emit("leave-conversation", selectedConversation._id);
        socket.off("new-message");
      }
    };
  }, [selectedConversation, session?.user?.id, socket]);

  // On mobile, hide sidebar when conversation selected
  useEffect(() => {
    if (selectedConversation && window.innerWidth < 768) {
      setShowSidebar(false);
    }
  }, [selectedConversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedConversation) return;
    const formData = new FormData();
    formData.append("conversationId", selectedConversation._id);
    formData.append("content", message);
    formData.append("type", "text");
    const res = await fetch("/api/messages/message", {
      method: "POST",
      headers: { "x-user-id": session!.user!.id },
      body: formData,
    });
    if (res.ok) {
      setMessage("");
      const msg = await res.json();
      setMessages(prev => [...prev, msg]);
      if (socket) socket.emit("send-message", { conversationId: selectedConversation._id, message: msg });
      scrollToBottom();
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim() || groupUsers.length < 2) return;
    const res = await fetch("/api/messages/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-user-id": session!.user!.id },
      body: JSON.stringify({
        participants: [session!.user!.id, ...groupUsers],
        type: "group",
        name: groupName,
      }),
    });
    if (res.ok) {
      setShowNewGroup(false);
      setGroupName("");
      setGroupUsers([]);
      setSearchUser("");
      setUserResults([]);
      const group = await res.json();
      setConversations(prev => [group, ...prev]);
      setSelectedConversation(group);
    }
  };

  const handleUserSearch = async (q: string) => {
    setSearchUser(q);
    if (!q.trim()) return setUserResults([]);
    const res = await fetch(`/api/messages/user-search?q=${encodeURIComponent(q)}`, { headers: { "x-user-id": session?.user?.id || "" } });
    if (res.ok) setUserResults(await res.json());
  };

  // Filter unique users by _id for group modal
  const uniqueUserResults: User[] = userResults.filter(
    (u, i, arr) => arr.findIndex(x => x._id === u._id) === i
  );
  // Filter unique users by _id for DM modal
  const uniqueDmResults: User[] = dmResults.filter(
    (u, i, arr) => arr.findIndex(x => x._id === u._id) === i
  );

  // New Message (DM) modal logic
  const handleDmUserSearch = async (q: string) => {
    setDmSearch(q);
    if (!q.trim()) return setDmResults([]);
    const res = await fetch(`/api/messages/user-search?q=${encodeURIComponent(q)}`, { headers: { "x-user-id": session?.user?.id || "" } });
    if (res.ok) setDmResults(await res.json());
  };
  const handleStartDM = async () => {
    if (!dmSelected) return;
    // Check if DM already exists
    const existing = conversations.find(
      conv =>
        conv.type === "direct" &&
        conv.participants.length === 2 &&
        conv.participants.some((u: User) => u._id === dmSelected) &&
        conv.participants.some((u: User) => u._id === session?.user?.id)
    );
    if (existing) {
      setSelectedConversation(existing);
      setShowNewDM(false);
      setDmSearch("");
      setDmResults([]);
      setDmSelected("");
      return;
    }
    // Create new DM
    const res = await fetch("/api/messages/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-user-id": session!.user!.id },
      body: JSON.stringify({
        participants: [session!.user!.id, dmSelected],
        type: "direct",
      }),
    });
    if (res.ok) {
      const dm = await res.json();
      setConversations(prev => [dm, ...prev]);
      setSelectedConversation(dm);
      setShowNewDM(false);
      setDmSearch("");
      setDmResults([]);
      setDmSelected("");
    }
  };

  // Deduplicate messages by _id before rendering
  const uniqueMessages = messages.filter(
    (m, i, arr) => arr.findIndex(x => x._id === m._id) === i
  );

  if (!session?.user?.id) return <div className="p-8 text-center text-white">Please log in to use chat.</div>;

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-12rem)] bg-black rounded-2xl overflow-hidden border border-white/10">
      {/* Conversation List */}
      <div className={`w-full md:w-80 glass-strong border-r border-white/10 flex flex-col transition-all duration-300 ${
        !showSidebar && selectedConversation ? 'hidden md:flex' : 'flex'
      }`}>
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/40">
          <span className="font-bold text-lg text-white">Chats</span>
          <div className="flex gap-2">
            <button 
              className="text-purple-400 hover:text-purple-300 transition-colors text-sm font-medium"
              onClick={() => setShowNewDM(true)}
            >
              New
            </button>
            <button 
              className="text-purple-400 hover:text-purple-300 transition-colors text-sm font-medium"
              onClick={() => setShowNewGroup(true)}
            >
              + Group
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          {conversations.map(conv => (
            <div 
              key={conv._id} 
              className={`p-3 cursor-pointer border-b border-white/5 transition-colors hover:bg-white/5 ${
                selectedConversation?._id === conv._id ? "bg-white/10" : ""
              }`} 
              onClick={() => setSelectedConversation(conv)}
            >
              <div className="font-semibold text-white text-sm">
                {conv.name || conv.participants.find((u: User) => u._id !== session.user.id)?.username || "DM"}
              </div>
              <div className="text-xs text-gray-400 truncate mt-1">
                {conv.lastMessage?.content || "No messages yet"}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Chat Window */}
      <div className={`flex-1 flex flex-col bg-black/60 ${
        !selectedConversation ? 'hidden md:flex' : 'flex'
      }`}>
        {selectedConversation ? (
          <>
            <div className="p-4 border-b border-white/10 font-semibold flex items-center gap-2 bg-black/40 text-white">
              <button
                onClick={() => {
                  setSelectedConversation(null);
                  setShowSidebar(true);
                }}
                className="md:hidden p-1 hover:bg-white/10 rounded transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <span>
                {selectedConversation.name || selectedConversation.participants.find((u: User) => u._id !== session.user.id)?.username || "DM"}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
              {uniqueMessages.length > 0 ? uniqueMessages.map((msg) => {
                // Extract senderId string from msg.senderId object or string
                const senderIdStr = typeof msg.senderId === "string" ? msg.senderId : (msg.senderId?._id ?? "");
                let sender = selectedConversation?.participants.find((u: User) => String(u._id) === String(senderIdStr));
                if (!sender) {
                  // Fallback: try to find sender in userResults
                  sender = userResults.find((u: User) => String(u._id) === String(senderIdStr));
                }
                const isMine = String(senderIdStr) === String(session?.user?.id);
                const senderUsername = sender && typeof sender.username === "string" && !isMine ? sender.username : "";
                const senderAvatar = sender && typeof sender.avatar === "string" && sender.avatar.length > 0 ? sender.avatar : "/default-avatar.png";
                return (
                  <div key={msg._id} className={`flex ${isMine ? "justify-end" : "justify-start"} items-end gap-2`}>
                    {!isMine && (
                      <Image
                        src={senderAvatar}
                        alt={senderUsername}
                        className="w-8 h-8 rounded-full border-2 border-purple-500/50 object-cover"
                        width={32}
                        height={32}
                      />
                    )}
                    <div className={`flex flex-col ${msg.sharedContent ? 'max-w-full' : 'max-w-[70%]'}`}>
                      <div className={`rounded-xl px-4 py-2 ${
                        isMine 
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white" 
                          : "glass border border-white/20 text-white"
                      }`}>
                        {senderUsername && <span className="text-xs text-gray-300 mb-1">{senderUsername}</span>}
                        {msg.sharedContent ? (
                          <SharedContentPreview
                            type={msg.sharedContent.type}
                            contentId={msg.sharedContent.contentId}
                            title={msg.sharedContent.title}
                            description={msg.sharedContent.description}
                            mediaUrl={msg.sharedContent.mediaUrl}
                            author={msg.sharedContent.author}
                          />
                        ) : msg.type === "text" ? (
                          msg.content
                        ) : (
                          <span>[media]</span>
                        )}
                      </div>
                    </div>
                    {isMine && (
                      <Image
                        src={senderAvatar}
                        alt={senderUsername}
                        className="w-8 h-8 rounded-full border-2 border-purple-500/50 object-cover"
                        width={32}
                        height={32}
                      />
                    )}
                  </div>
                );
              }) : (
                <div className="text-center text-gray-400">No messages to display</div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-white/10 bg-black/40">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowEmojiPicker(v => !v)} 
                  className="text-2xl hover:scale-110 transition-transform"
                >
                  😊
                </button>
                {showEmojiPicker && (
                  <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10">
                    <EmojiPicker onEmojiSelect={e => setMessage(m => m + e)} />
                  </div>
                )}
                <input
                  className="flex-1 px-4 py-3 glass border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 text-sm md:text-base"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") handleSendMessage(); }}
                  placeholder="Type a message..."
                />
                <button 
                  onClick={handleSendMessage} 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
                >
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="text-6xl mb-4">💬</div>
              <p>Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
      
      {/* New Group Modal */}
      {showNewGroup && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-strong rounded-2xl p-6 w-full max-w-md border border-white/20">
            <div className="font-bold mb-4 text-white text-xl">Create Group</div>
            <input 
              className="w-full px-4 py-3 glass border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 mb-3" 
              placeholder="Group name" 
              value={groupName} 
              onChange={e => setGroupName(e.target.value)} 
            />
            <input 
              className="w-full px-4 py-3 glass border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 mb-3" 
              placeholder="Add users..." 
              value={searchUser} 
              onChange={e => handleUserSearch(e.target.value)} 
            />
            <div className="mb-3 flex flex-wrap gap-2">
              {groupUsers.map(uid => {
                const user = uniqueUserResults.find(u => u._id === uid);
                return (
                  <span key={uid} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                    {user?.username || user?.username || user?.email || uid}
                  </span>
                );
              })}
            </div>
            <div className="max-h-32 overflow-y-auto mb-4 scrollbar-thin scrollbar-thumb-white/20">
              {uniqueUserResults.map((u: User) => (
                <label key={u._id} className="flex items-center gap-2 p-2 hover:bg-white/5 cursor-pointer rounded">
                  <input
                    type="checkbox"
                    checked={groupUsers.includes(u._id)}
                    onChange={e => {
                      if (e.target.checked) {
                        setGroupUsers(prev => prev.includes(u._id) ? prev : [...prev, u._id]);
                      } else {
                        setGroupUsers(prev => prev.filter(id => id !== u._id));
                      }
                    }}
                    className="rounded"
                  />
                  <span className="text-white text-sm">{u.username || u.username || u.email || u._id}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-2 justify-end">
              <button 
                className="px-4 py-2 rounded-lg glass border border-white/20 text-white hover:bg-white/10 transition-colors" 
                onClick={() => setShowNewGroup(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-700 hover:to-pink-700 transition-all" 
                onClick={handleCreateGroup}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* New DM Modal */}
      {showNewDM && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-strong rounded-2xl p-6 w-full max-w-md border border-white/20">
            <div className="font-bold mb-4 text-white text-xl">Start New Message</div>
            <input 
              className="w-full px-4 py-3 glass border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 mb-4" 
              placeholder="Search users..." 
              value={dmSearch} 
              onChange={e => handleDmUserSearch(e.target.value)} 
            />
            <div className="max-h-40 overflow-y-auto mb-4 scrollbar-thin scrollbar-thumb-white/20">
              {uniqueDmResults.map((u: User) => (
                <label key={u._id} className="flex items-center gap-2 p-2 hover:bg-white/5 cursor-pointer rounded">
                  <input
                    type="radio"
                    name="dm-user"
                    checked={dmSelected === u._id}
                    onChange={() => setDmSelected(u._id)}
                    className="rounded"
                  />
                  <span className="text-white text-sm">{u.username || u.username || u.email || u._id}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-2 justify-end">
              <button 
                className="px-4 py-2 rounded-lg glass border border-white/20 text-white hover:bg-white/10 transition-colors" 
                onClick={() => setShowNewDM(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed" 
                onClick={handleStartDM} 
                disabled={!dmSelected}
              >
                Start Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 