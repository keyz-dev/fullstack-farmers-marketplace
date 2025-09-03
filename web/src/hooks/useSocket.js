import { useEffect, useRef, useCallback, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../api";
import { shouldShowNotification } from "../utils/notificationDeduplicator";

export const useSocket = () => {
  const { user } = useAuth();
  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // Notification events are now handled directly in NotificationContext

  const connect = useCallback(() => {
    if (!user) return;

    // Disconnect existing socket if any
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    // Get token from localStorage
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return;

    // Connect to socket server
    socketRef.current = io(API_BASE_URL.replace("/api", ""), {
      auth: {
        token: token,
      },
      transports: ["websocket", "polling"],
    });

    // Expose immediately so consumers re-run effects
    setSocket(socketRef.current);
    setIsConnected(!!socketRef.current.connected);

    // Connection events
    socketRef.current.on("connect", () => {
      setIsConnected(true);
      // Keep state socket in sync
      setSocket(socketRef.current);
      // Explicitly join user notification room
      if (socketRef.current) {
        socketRef.current.emit("join-user-room", { userId: user.id });
      }
    });

    socketRef.current.on("disconnect", () => {
      setIsConnected(false);
      setSocket(null);
    });

    // Handle notification events directly (NotificationContext approach had issues)
    socketRef.current.on("notification:new", (data) => {
      // Check for duplicates before showing
      const shouldShow = shouldShowNotification(
        "socket_notification",
        data.notification.message,
        data.notification.data?.relatedId,
        user.id.toString()
      );

      if (shouldShow) {
        // Show toast immediately
        toast.info(data.notification.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }

      // Always dispatch custom event for other components (they can handle their own deduplication)
      const event = new CustomEvent("notification:received", {
        detail: data.notification,
      });
      window.dispatchEvent(event);
    });

    // to avoid duplicate event listeners. Only keeping WebRTC signaling events here.
  }, [user]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setIsConnected(false);
    setSocket(null);
  }, []);

  const emit = useCallback((event, data) => {
    if (socketRef.current) {
      socketRef.current.emit(event, data);
    }
  }, []);

  // Connect on mount and when user changes
  useEffect(() => {
    if (user) {
      connect();
    } else {
      disconnect();
    }

    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, [user, connect, disconnect]);

  return {
    socket,
    isConnected,
    emit,
    connect,
    disconnect,
  };
};
