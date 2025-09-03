require("dotenv").config();
const app = require("./src/app");
const express = require("express");
const db = require("./src/db");
const { initializeSocket } = require("./src/sockets");
db();

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  console.log(`server running on port ${port} in ${process.env.NODE_ENV}Mode.`);
});

// Initialize Socket.io
initializeSocket(server);

// serve images from the src/uploads folder
app.use("/uploads", express.static("src/uploads"));

// for handling promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("shutting down the server due to unhandled promise rejection");
  server.close(() => {
    process.exit(1);
  });
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
