"use client";
import React, { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { EmojiPicker } from "./EmojiPicker";
import { io, Socket } from "socket.io-client";

interface Conversation {
  _id: string;
  name?: string;
  avatar?: string;
  participants: any[];
  lastMessage?: {
    content: string;
    senderId: string;
    timestamp: string;
    type: string;
  };
  isGroup: boolean;
  admins?: string[];
  type: 'direct' | 'group';
}

interface Message {
  _id: string;
  senderId: string;
  content: string;
  type: string;
  timestamp: string;
  media?: { url: string; type: string };
  seenBy: string[];
  reactions: { user: string; emoji: string }[];
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
  const [userResults, setUserResults] = useState<any[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showNewDM, setShowNewDM] = useState(false);
  const [dmSearch, setDmSearch] = useState("");
  const [dmResults, setDmResults] = useState<any[]>([]);
  const [dmSelected, setDmSelected] = useState<string>("");

  useEffect(() => {
    if (session?.user?.id && !socket) {
      const s = io({ path: "/api/socket" });
      s.emit("authenticate", session.user.id);
      setSocket(s);
      return () => { s.disconnect(); };
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (!session?.user?.id) return;
    fetch("/api/messages/conversations", { headers: { "x-user-id": session.user.id } })
      .then(res => res.json())
      .then(setConversations);
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
  const uniqueUserResults = userResults.filter(
    (u, i, arr) => arr.findIndex(x => x._id === u._id) === i
  );
  // Filter unique users by _id for DM modal
  const uniqueDmResults = dmResults.filter(
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
        conv.participants.some((u: any) => u._id === dmSelected) &&
        conv.participants.some((u: any) => u._id === session?.user?.id)
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

  if (!session?.user?.id) return <div className="p-8 text-center">Please log in to use chat.</div>;

  return (
    <div className="flex h-[80vh] border rounded-xl overflow-hidden shadow-lg">
      {/* Conversation List */}
      <div className="w-1/3 border-r bg-white flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <span className="font-bold text-lg">Chats</span>
          <div className="flex gap-2">
            <button className="text-indigo-600" onClick={() => setShowNewDM(true)}>New Message</button>
            <button className="text-indigo-600" onClick={() => setShowNewGroup(true)}>+ Group</button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map(conv => (
            <div key={conv._id} className={`p-4 cursor-pointer hover:bg-gray-100 ${selectedConversation?._id === conv._id ? "bg-gray-100" : ""}`} onClick={() => setSelectedConversation(conv)}>
              <div className="font-semibold">{conv.name || conv.participants.find((u: any) => u._id !== session.user.id)?.username || "DM"}</div>
              <div className="text-xs text-gray-500 truncate">{conv.lastMessage?.content || "No messages yet"}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Chat Window */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {selectedConversation ? (
          <>
            <div className="p-4 border-b font-semibold flex items-center gap-2">
              {selectedConversation.name || selectedConversation.participants.find((u: any) => u._id !== session.user.id)?.username || "DM"}
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {uniqueMessages.map((msg, i) => {
                const sender = selectedConversation?.participants.find((u: any) => u._id === msg.senderId);
                const isMine = msg.senderId === session.user.id;
                return (
                  <div key={msg._id} className={`mb-2 flex ${isMine ? "justify-end" : "justify-start"} items-end`}>
                    {!isMine && (
                      <img
                        src={sender?.avatar || "/default-avatar.png"}
                        alt={sender?.username || sender?.name || sender?.email || "User"}
                        className="w-8 h-8 rounded-full mr-2 border"
                      />
                    )}
                    <div className={`rounded-lg px-3 py-2 max-w-[60%] ${isMine ? "bg-indigo-500 text-white" : "bg-white border"}`}>
                      {msg.type === "text" ? msg.content : <span>[media]</span>}
                    </div>
                    {isMine && (
                      <img
                        src={sender?.avatar || "/default-avatar.png"}
                        alt={sender?.username || sender?.name || sender?.email || "User"}
                        className="w-8 h-8 rounded-full ml-2 border"
                      />
                    )}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t flex items-center gap-2">
              <button onClick={() => setShowEmojiPicker(v => !v)} className="text-xl">😊</button>
              {showEmojiPicker && (
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10">
                  <EmojiPicker onEmojiSelect={e => setMessage(m => m + e)} />
                </div>
              )}
              <input
                className="flex-1 border rounded px-3 py-2"
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") handleSendMessage(); }}
                placeholder="Type a message..."
              />
              <button onClick={handleSendMessage} className="bg-indigo-500 text-white px-4 py-2 rounded">Send</button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">Select a conversation</div>
        )}
      </div>
      {/* New Group Modal */}
      {showNewGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="font-bold mb-2">Create Group</div>
            <input className="border rounded px-3 py-2 w-full mb-2" placeholder="Group name" value={groupName} onChange={e => setGroupName(e.target.value)} />
            <input className="border rounded px-3 py-2 w-full mb-2" placeholder="Add users..." value={searchUser} onChange={e => handleUserSearch(e.target.value)} />
            <div className="mb-2 flex flex-wrap gap-1">
              {groupUsers.map(uid => {
                const user = uniqueUserResults.find(u => u._id === uid);
                return (
                  <span key={uid} className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs">
                    {user?.username || user?.name || user?.email || uid}
                  </span>
                );
              })}
            </div>
            <div className="max-h-32 overflow-y-auto mb-2">
              {uniqueUserResults.map((u: any) => (
                <label key={u._id} className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer rounded">
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
                  />
                  <span>{u.username || u.name || u.email || u._id}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-2 justify-end">
              <button className="px-4 py-2 rounded bg-gray-200" onClick={() => setShowNewGroup(false)}>Cancel</button>
              <button className="px-4 py-2 rounded bg-indigo-500 text-white" onClick={handleCreateGroup}>Create</button>
            </div>
          </div>
        </div>
      )}
      {/* New DM Modal */}
      {showNewDM && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="font-bold mb-2">Start New Message</div>
            <input className="border rounded px-3 py-2 w-full mb-2" placeholder="Search users..." value={dmSearch} onChange={e => handleDmUserSearch(e.target.value)} />
            <div className="max-h-40 overflow-y-auto mb-4">
              {uniqueDmResults.map((u: any) => (
                <label key={u._id} className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer rounded">
                  <input
                    type="radio"
                    name="dm-user"
                    checked={dmSelected === u._id}
                    onChange={() => setDmSelected(u._id)}
                  />
                  <span>{u.username || u.name || u.email || u._id}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-2 justify-end">
              <button className="px-4 py-2 rounded bg-gray-200" onClick={() => setShowNewDM(false)}>Cancel</button>
              <button className="px-4 py-2 rounded bg-indigo-500 text-white" onClick={handleStartDM} disabled={!dmSelected}>Start Chat</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 