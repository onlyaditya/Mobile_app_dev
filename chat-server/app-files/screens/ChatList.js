// screens/ChatList.js — loads the chat list from the server
import { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { SERVER } from "../config";

export default function ChatList({ navigation }) {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const load = () =>
      fetch(`http://${SERVER}/chats`)
        .then((res) => res.json())
        .then(setChats)
        .catch((err) => console.log("Could not reach server:", err.message));

    load();                                        // first time
    return navigation.addListener("focus", load);  // again whenever we come back
  }, [navigation]);

  return (
    <FlatList
      data={chats}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <Pressable
          style={({ pressed }) => [styles.row, pressed && styles.pressed]}
          onPress={() => navigation.navigate("Chat", { chatId: item.id, name: item.name })}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.avatar}</Text>
          </View>
          <View style={styles.middle}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.last} numberOfLines={1}>{item.lastMessage}</Text>
          </View>
          <View style={styles.right}>
            <Text style={styles.time}>{item.lastTime}</Text>
            {item.unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.unreadCount}</Text>
              </View>
            )}
          </View>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderBottomWidth: 1, borderBottomColor: "#e3e8eb", backgroundColor: "#fff" },
  pressed: { backgroundColor: "#eef2f4" },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#1f7aec", justifyContent: "center", alignItems: "center" },
  avatarText: { color: "#fff", fontWeight: "700" },
  middle: { flex: 1 },
  name: { fontSize: 16, fontWeight: "700" },
  last: { fontSize: 14, color: "#6d7d87", marginTop: 2 },
  right: { alignItems: "flex-end", gap: 4 },
  time: { fontSize: 12, color: "#6d7d87" },
  badge: { minWidth: 20, height: 20, borderRadius: 10, backgroundColor: "#1f7aec", alignItems: "center", justifyContent: "center", paddingHorizontal: 6 },
  badgeText: { color: "#fff", fontSize: 12, fontWeight: "700" },
});
