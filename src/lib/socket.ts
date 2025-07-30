import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { NextApiRequest } from 'next';
import { NextApiResponse } from 'next';
import { Socket as NetSocket } from 'net';

export const config = {
  api: {
    bodyParser: false,
  },
};

interface SocketUser {
  userId: string;
  socketId: string;
}

interface CustomSocket extends NetSocket {
  server: NetServer & {
    io: SocketIOServer;
  };
}

interface ResponseWithSocket extends NextApiResponse {
  socket: CustomSocket;
}

let io: SocketIOServer;
const users = new Map<string, SocketUser>();
const typingUsers = new Map<string, Set<string>>();

export function initSocket(server: NetServer) {
  if (!io) {
    io = new SocketIOServer(server, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
      },
    });

    io.on('connection', (socket) => {
      // User authentication
      socket.on('authenticate', (userId: string) => {
        users.set(userId, { userId, socketId: socket.id });
        socket.join(`user:${userId}`);
        io.emit('user-online', userId);
      });
      // Join conversation room
      socket.on('join-conversation', (conversationId: string) => {
        socket.join(`conversation:${conversationId}`);
      });
      // Leave conversation room
      socket.on('leave-conversation', (conversationId: string) => {
        socket.leave(`conversation:${conversationId}`);
      });
      // Handle new message
      socket.on('send-message', ({ conversationId, message }) => {
        io.to(`conversation:${conversationId}`).emit('new-message', message);
      });
      // Typing indicators
      socket.on('typing-start', ({ conversationId, userId }) => {
        if (!typingUsers.has(conversationId)) {
          typingUsers.set(conversationId, new Set());
        }
        typingUsers.get(conversationId)?.add(userId);
        io.to(`conversation:${conversationId}`).emit('typing-start', userId);
      });
      socket.on('typing-stop', ({ conversationId, userId }) => {
        typingUsers.get(conversationId)?.delete(userId);
        io.to(`conversation:${conversationId}`).emit('typing-stop', userId);
      });
      // Disconnect
      socket.on('disconnect', () => {
        for (const [userId, user] of users.entries()) {
          if (user.socketId === socket.id) {
            users.delete(userId);
            io.emit('user-offline', userId);
            break;
          }
        }
      });
    });
  }
  return io;
}

export function getIO() {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
}

export default async function SocketHandler(
  req: NextApiRequest,
  res: ResponseWithSocket
) {
  if (!res.socket?.server) return res.status(500).end();
  if (!res.socket.server.io) {
    res.socket.server.io = initSocket(res.socket.server);
  }
  res.end();
} 