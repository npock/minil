import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

// Настройка Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL, // Наш фронтенд
    methods: ["GET", "POST"],
  },
});

// Логика сокетов
io.on("connection", (socket) => {
  console.log(`Пользователь подключился: ${socket.id}`);

  // Слушаем событие "отправка сообщения"
  socket.on("send_message", (data) => {
    // Рассылаем всем подключенным (пока упрощенно)
    io.emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("Пользователь отключился");
  });
});

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ База мессенджера подключена");
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Сервер чата на порту ${PORT}`);
    });
  })
  .catch((err) => console.log("❌ Ошибка БД:", err));
