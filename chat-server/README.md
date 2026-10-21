# Chat server (REST + WebSocket + SQLite)

## Run it (one command)

```bash
cd chat-server && npm install && npm start
```

On the first start it creates `chat.db` and copies everything from `data/chats.json` into it.
It then prints the address to use from your phone, for example:

```
From your phone: http://192.168.1.7:3001/chats   ws://192.168.1.7:3001/ws
```

Phone and computer must be on the same Wi-Fi.

## Use your own chats

Replace `data/chats.json` with your file (same format), then:

```bash
npm run reset
```

`reset` deletes `chat.db`, re-seeds from `data/chats.json` and starts the server.

## What it does

| | |
|---|---|
| `GET /chats` | all chats with their last message |
| `GET /chats/:id` | one chat with all messages |
| `POST /chats/:id/read` | set unreadCount to 0 |
| `ws://<ip>:3001/ws` | live messages |

WebSocket messages:

```js
// phone → server
{ type: "send",   chatId: 1, text: "Hi" }
{ type: "typing", chatId: 1 }

// server → every phone
{ type: "message", chatId: 1, message: { id, sender, text, time } }
{ type: "typing",  chatId: 1, from: "Aman" }
```

The other person auto-replies after a moment, so one phone is enough for a demo.
Turn it off with `AUTO_REPLY=false npm start`.

## App side

Copy the files in `app-files/` into your Expo project:

- `config.js`: put the IP the server printed
- `App.js`: the stack (Chats → Chat)
- `screens/ChatList.js`: loads chats from the server
- `screens/IndividualChat.js`: loads history, then live messages, typing indicator and send
