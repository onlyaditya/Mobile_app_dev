// db.js — the local database (one SQLite file: chat.db)
// On first run it creates the tables and copies data/chats.json into them.
import Database from "better-sqlite3";
import { readFileSync, existsSync } from "node:fs";

const DB_FILE = new URL("./chat.db", import.meta.url).pathname;
const SEED_FILE = new URL("./data/chats.json", import.meta.url).pathname;

export const db = new Database(DB_FILE);
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS chats (
    id           INTEGER PRIMARY KEY,
    name         TEXT NOT NULL,
    avatar       TEXT,
    unread_count INTEGER NOT NULL DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS messages (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    chat_id    INTEGER NOT NULL REFERENCES chats(id),
    sender     TEXT NOT NULL,
    text       TEXT NOT NULL,
    time       TEXT NOT NULL,
    created_at INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_messages_chat ON messages(chat_id, id);
`);

// ---------- seed (only when the database is empty) ----------
export function seedIfEmpty() {
  const { n } = db.prepare("SELECT COUNT(*) AS n FROM chats").get();
  if (n > 0) return { seeded: false, chats: n };

  if (!existsSync(SEED_FILE)) {
    throw new Error(`Seed file not found: ${SEED_FILE}. Put your chats.json in the data/ folder.`);
  }
  const chats = JSON.parse(readFileSync(SEED_FILE, "utf8"));

  const insertChat = db.prepare(
    "INSERT INTO chats (id, name, avatar, unread_count) VALUES (@id, @name, @avatar, @unreadCount)"
  );
  const insertMsg = db.prepare(
    "INSERT INTO messages (chat_id, sender, text, time, created_at) VALUES (?, ?, ?, ?, ?)"
  );

  const seed = db.transaction((list) => {
    let t = Date.now() - list.length * 1000 * 60;
    for (const c of list) {
      insertChat.run({
        id: c.id,
        name: c.name,
        avatar: c.avatar ?? initials(c.name),
        unreadCount: c.unreadCount ?? 0,
      });
      for (const m of c.messages ?? []) {
        insertMsg.run(c.id, m.sender, m.text, m.time ?? "", t++);
      }
    }
  });
  seed(chats);
  return { seeded: true, chats: chats.length };
}

// ---------- queries ----------
export function listChats() {
  // every chat + its latest message (for the chat list screen)
  return db
    .prepare(
      `SELECT c.id, c.name, c.avatar, c.unread_count AS unreadCount,
              m.text AS lastMessage, m.time AS lastTime, m.sender AS lastSender
         FROM chats c
         LEFT JOIN messages m ON m.id = (SELECT MAX(id) FROM messages WHERE chat_id = c.id)
        ORDER BY COALESCE(m.created_at, 0) DESC`
    )
    .all();
}

export function getChat(chatId) {
  const chat = db
    .prepare("SELECT id, name, avatar, unread_count AS unreadCount FROM chats WHERE id = ?")
    .get(chatId);
  if (!chat) return null;
  chat.messages = getMessages(chatId);
  return chat;
}

export function getMessages(chatId) {
  return db
    .prepare("SELECT id, sender, text, time FROM messages WHERE chat_id = ? ORDER BY id")
    .all(chatId);
}

export function addMessage(chatId, sender, text) {
  const time = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  const info = db
    .prepare("INSERT INTO messages (chat_id, sender, text, time, created_at) VALUES (?, ?, ?, ?, ?)")
    .run(chatId, sender, text, time, Date.now());
  return { id: Number(info.lastInsertRowid), sender, text, time };
}

export function setUnread(chatId, count) {
  db.prepare("UPDATE chats SET unread_count = ? WHERE id = ?").run(count, chatId);
}

export function chatExists(chatId) {
  return !!db.prepare("SELECT 1 FROM chats WHERE id = ?").get(chatId);
}

function initials(name = "") {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
}
