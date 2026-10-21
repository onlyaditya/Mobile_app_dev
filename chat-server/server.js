// server.js — REST + WebSocket chat server
//   REST:  GET  /chats               → list of chats with last message
//          GET  /chats/:id           → one chat with all its messages
//          POST /chats/:id/read      → mark a chat as read (unreadCount = 0)
//   WS:    ws://<your-ip>:3001/ws
//          client → { type: "send",   chatId, text }
//          client → { type: "typing", chatId }
//          server → { type: "message", chatId, message }
//          server → { type: "typing",  chatId, from }
import express from "express";
import cors from "cors";
import http from "node:http";
import os from "node:os";
import { WebSocketServer } from "ws";
import {
  seedIfEmpty, listChats, getChat, addMessage, setUnread, chatExists,
} from "./db.js";

const PORT = Number(process.env.PORT) || 3001;
const AUTO_REPLY = process.env.AUTO_REPLY !== "false"; // the other person replies, so one phone is enough

// ---------- database ----------
const seed = seedIfEmpty();

// ---------- REST ----------
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => res.json({ ok: true, endpoints: ["/chats", "/chats/:id", "ws://<host>:" + PORT + "/ws"] }));
app.get("/chats", (_req, res) => res.json(listChats()));
app.get("/chats/:id", (req, res) => {
  const chat = getChat(Number(req.params.id));
  if (!chat) return res.status(404).json({ error: "Chat not found" });
  res.json(chat);
});
app.post("/chats/:id/read", (req, res) => {
  const id = Number(req.params.id);
  if (!chatExists(id)) return res.status(404).json({ error: "Chat not found" });
  setUnread(id, 0);
  res.json({ ok: true });
});

// ---------- WebSocket ----------
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: "/ws" });

function broadcast(payload) {
  const data = JSON.stringify(payload);
  for (const client of wss.clients) {
    if (client.readyState === client.OPEN) client.send(data);
  }
}

const REPLIES = [
  "Okay 👍", "Sounds good", "Haha, true", "On my way", "Let me check and tell you",
  "Can we talk after class?", "Done!", "Sure, send it over",
];

wss.on("connection", (socket) => {
  socket.send(JSON.stringify({ type: "hello", message: "Connected to chat server" }));

  socket.on("message", (raw) => {
    let msg;
    try { msg = JSON.parse(raw.toString()); } catch { return; }

    const chatId = Number(msg.chatId);
    if (!chatExists(chatId)) {
      socket.send(JSON.stringify({ type: "error", error: `Chat ${msg.chatId} not found` }));
      return;
    }

    if (msg.type === "typing") {
      broadcast({ type: "typing", chatId, from: "me" });
      return;
    }

    if (msg.type === "send") {
      const text = String(msg.text ?? "").trim();
      if (!text) return;
      const message = addMessage(chatId, "me", text);   // 1. save to the database
      broadcast({ type: "message", chatId, message });  // 2. tell every connected phone

      if (AUTO_REPLY) {
        const chat = getChat(chatId);
        const from = chat.name.split(" ")[0];
        setTimeout(() => broadcast({ type: "typing", chatId, from }), 600);
        setTimeout(() => {
          const reply = addMessage(chatId, from, REPLIES[Math.floor(Math.random() * REPLIES.length)]);
          broadcast({ type: "message", chatId, message: reply });
        }, 1800);
      }
    }
  });
});

// ---------- start ----------
function lanAddresses() {
  return Object.values(os.networkInterfaces())
    .flat()
    .filter((i) => i && i.family === "IPv4" && !i.internal)
    .map((i) => i.address);
}

server.listen(PORT, "0.0.0.0", () => {
  const ips = lanAddresses();
  console.log("\n  Chat server is running");
  console.log(`  Database: chat.db (${seed.seeded ? `seeded ${seed.chats} chats from data/chats.json` : `${seed.chats} chats already saved`})`);
  console.log(`  Auto-reply: ${AUTO_REPLY ? "on" : "off"}\n`);
  console.log(`  This computer:   http://localhost:${PORT}/chats`);
  for (const ip of ips) {
    console.log(`  From your phone: http://${ip}:${PORT}/chats   ws://${ip}:${PORT}/ws`);
  }
  console.log("\n  Phone and computer must be on the same Wi-Fi.\n");
});
