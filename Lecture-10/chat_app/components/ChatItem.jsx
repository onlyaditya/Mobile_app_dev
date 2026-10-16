import { View, Text, StyleSheet } from "react-native";

export default function ChatItem({ chat }) {
  const lastMessage = chat.messages[chat.messages.length - 1];

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{chat.avatar}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.name}>{chat.name}</Text>

        <Text style={styles.message} numberOfLines={1}>
          {lastMessage ? lastMessage.text : "No messages yet"}
        </Text>
      </View>

      <View style={styles.right}>
        <Text style={styles.time}>{lastMessage?.time}</Text>

        {chat.unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{chat.unreadCount}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 15,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#2563eb",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: "600",
    color: "#111827",
  },
  message: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },
  right: {
    alignItems: "flex-end",
    marginLeft: 8,
  },
  time: {
    fontSize: 11,
    color: "#6b7280",
  },
  badge: {
    backgroundColor: "#16a34a",
    borderRadius: 12,
    minWidth: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 7,
    paddingHorizontal: 5,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});
