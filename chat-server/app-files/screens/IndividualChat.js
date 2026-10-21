// screens/IndividualChat.js — history from the server + live messages over WebSocket
import { useEffect, useRef, useState } from "react";
import {
  View, Text, TextInput, Pressable, FlatList,
  KeyboardAvoidingView, Platform, StyleSheet,
} from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { SERVER } from "../config";

export default function IndividualChat({ route }) {
  const chatId = Number(route.params.chatId);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(null);   // name of whoever is typing
  const socketRef = useRef(null);
  const listRef = useRef(null);
  const lastTypingSent = useRef(0);
  const headerHeight = useHeaderHeight();

  // 1. Load the history once, and mark the chat as read
  useEffect(() => {
    fetch(`http://${SERVER}/chats/${chatId}`)
      .then((res) => res.json())
      .then((chat) => setMessages(chat.messages));
    fetch(`http://${SERVER}/chats/${chatId}/read`, { method: "POST" });
  }, [chatId]);

  // 2. Open a live connection while this screen is open
  useEffect(() => {
    const socket = new WebSocket(`ws://${SERVER}/ws`);
    socketRef.current = socket;

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.chatId !== chatId) return;                 // a message for another chat

      if (data.type === "message") {
        setTyping(null);
        setMessages((prev) => [...prev, data.message]);   // the server is the source of truth
      }
      if (data.type === "typing" && data.from !== "me") {
        setTyping(data.from);
        setTimeout(() => setTyping(null), 3000);
      }
    };

    return () => socket.close();                          // leaving the screen closes it
  }, [chatId]);

  // 3. Tell the server we're typing (at most once every 2 seconds)
  function onChangeText(text) {
    setDraft(text);
    const now = Date.now();
    if (now - lastTypingSent.current > 2000 && socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: "typing", chatId }));
      lastTypingSent.current = now;
    }
  }

  // 4. Send: the message appears when the server broadcasts it back
  function send() {
    const text = draft.trim();
    if (!text || socketRef.current?.readyState !== WebSocket.OPEN) return;
    socketRef.current.send(JSON.stringify({ type: "send", chatId, text }));
    setDraft("");
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={headerHeight}
    >
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        renderItem={({ item }) => {
          const isMe = item.sender === "me";
          return (
            <View style={[styles.bubble, isMe ? styles.mine : styles.theirs]}>
              <Text style={[styles.text, isMe && styles.mineText]}>{item.text}</Text>
              <Text style={[styles.time, isMe && styles.mineText]}>{item.time}</Text>
            </View>
          );
        }}
      />

      {typing && <Text style={styles.typing}>{typing} is typing…</Text>}

      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          value={draft}
          onChangeText={onChangeText}
          placeholder="Message"
          placeholderTextColor="#9aa7ae"
        />
        <Pressable
          onPress={send}
          style={({ pressed }) => [styles.sendButton, !draft.trim() && styles.sendDisabled, pressed && { opacity: 0.8 }]}
        >
          <Text style={styles.sendText}>Send</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f6f8f9" },
  list: { padding: 12 },
  bubble: { maxWidth: "75%", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, marginVertical: 4 },
  theirs: { alignSelf: "flex-start", backgroundColor: "#e7ecef" },
  mine: { alignSelf: "flex-end", backgroundColor: "#1f7aec" },
  text: { fontSize: 16, color: "#13212b" },
  mineText: { color: "#fff" },
  time: { fontSize: 11, color: "#6d7d87", marginTop: 2, alignSelf: "flex-end" },
  typing: { paddingHorizontal: 16, paddingBottom: 6, color: "#6d7d87", fontStyle: "italic" },
  inputBar: { flexDirection: "row", gap: 8, padding: 10, borderTopWidth: 1, borderTopColor: "#e3e8eb", backgroundColor: "#fff" },
  input: { flex: 1, height: 42, borderRadius: 21, paddingHorizontal: 16, backgroundColor: "#f1f4f6", fontSize: 16 },
  sendButton: { height: 42, paddingHorizontal: 18, borderRadius: 21, backgroundColor: "#1f7aec", justifyContent: "center" },
  sendDisabled: { backgroundColor: "#a9c8f3" },
  sendText: { color: "#fff", fontWeight: "700" },
});
