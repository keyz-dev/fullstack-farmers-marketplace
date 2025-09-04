const socketIo = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

let io;

const initializeSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth.token || socket.handshake.headers.authorization;

      if (!token) {
        return next(new Error("Authentication error"));
      }

      const decoded = jwt.verify(
        token.replace("Bearer ", ""),
        process.env.JWT_SECRET
      );
      const user = await User.findById(decoded.id);

      if (!user) {
        return next(new Error("User not found"));
      }

      socket.userId = user._id;
      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log(
      `🔌 User ${socket.userId} (${socket.user.name}) connected - Role: ${socket.user.role}`
    );

    // Join user-specific room (main notification room)
    socket.join(`user-${socket.userId}`);
    console.log(`✅ User ${socket.userId} joined room: user-${socket.userId}`);

    // Join admin room if user is admin
    if (socket.user.role === "admin") {
      socket.join("admin-room");
      console.log(`✅ Admin ${socket.userId} joined admin-room`);
    }

    // Join farmer room if user is a farmer
    if (socket.user.role === "farmer") {
      socket.join(`farmer-${socket.userId}`);
      console.log(`✅ Farmer ${socket.userId} joined farmer-${socket.userId}`);
    }

    // Join delivery agent room if user is a delivery agent
    if (socket.user.role === "delivery_agent") {
      socket.join(`delivery-agent-${socket.userId}`);
      console.log(
        `✅ Delivery Agent ${socket.userId} joined delivery-agent-${socket.userId}`
      );
    }

    // Log all rooms this socket has joined
    console.log(`🏠 Socket ${socket.userId} rooms:`, Array.from(socket.rooms));

    // Handle explicit room joining request from frontend
    socket.on("join-user-room", (data) => {
      const { userId } = data;

      if (userId === socket.userId.toString()) {
        socket.join(`user-${userId}`);
        console.log(`🔄 User ${socket.userId} re-joined room: user-${userId}`);

        // Confirm room joining
        socket.emit("room-joined", {
          room: `user-${userId}`,
          message: "Successfully joined notification room",
        });
      } else {
        console.warn(
          `⚠️ User ${socket.userId} tried to join room for user ${userId}`
        );
      }
    });

    // Handle notification read
    socket.on("notification:read", async (data) => {
      try {
        // Update notification as read in database
        // This would be implemented in a notification service
        console.log(
          `User ${socket.userId} marked notification ${data.notificationId} as read`
        );
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`🔌 User ${socket.userId} disconnected`);
    });
  });

  // Make io available globally for other parts of the application
  global.io = io;

  console.log("🚀 Socket.io initialized successfully");
};

// Helper function to emit notifications to specific users
const emitToUser = (userId, event, data) => {
  if (io) {
    io.to(`user-${userId}`).emit(event, data);
  }
};

// Helper function to emit to admin room
const emitToAdmins = (event, data) => {
  if (io) {
    io.to("admin-room").emit(event, data);
  }
};

// Helper function to emit to all users
const emitToAll = (event, data) => {
  if (io) {
    io.emit(event, data);
  }
};

module.exports = {
  initializeSocket,
  emitToUser,
  emitToAdmins,
  emitToAll,
};
