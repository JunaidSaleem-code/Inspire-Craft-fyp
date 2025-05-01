"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { X } from "lucide-react";

type NotificationType = "success" | "error" | "warning" | "info";

interface Notification {
  id: number;
  message: string;
  type: NotificationType;
}

interface NotificationContextType {
  showNotification: (message: string, type: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = (message: string, type: NotificationType) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((notification) => notification.id !== id));
    }, 5000);
  };

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}

      {/* Notification Toasts */}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {notifications.map(({ id, message, type }) => (
          <div
            key={id}
            className={`flex items-center justify-between gap-2 p-4 rounded-lg shadow-lg transition-all duration-300 ${
              getAlertClass(type)
            }`}
          >
            <span>{message}</span>
            <button onClick={() => removeNotification(id)} className="text-gray-200 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

function getAlertClass(type: NotificationType): string {
  switch (type) {
    case "success":
      return "bg-green-600 text-white";
    case "error":
      return "bg-red-600 text-white";
    case "warning":
      return "bg-yellow-500 text-black";
    case "info":
      return "bg-blue-600 text-white";
    default:
      return "bg-gray-700 text-white";
  }
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
}

// import { useNotification } from "@/context/NotificationContext";
//   const { showNotification } = useNotification();
// showNotification("Artwork uploaded successfully!", "success")
//   showNotification("Error uploading artwork!", "error")
//   showNotification("Warning: Artwork upload failed!", "warning")
//   showNotification("Info: Artwork upload in progress...", "info")
