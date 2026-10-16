import { View, Text, FlatList, StyleSheet } from "react-native";

export default function IndividualChat({ chat }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{chat.avatar}</Text>
        </View>
        <Text style={styles.title}>{chat.name}</Text>
      </View>

      <FlatList
        data={chat.messages}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const isMe = item.sender === "me";
          return (
            <View style={[styles.bubble, isMe ? styles.mine : styles.theirs]}>
              <Text style={[styles.text, isMe && styles.mineText]}>
                {item.text}
              </Text>
              <Text style={[styles.time, isMe && styles.mineText]}>
                {item.time}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f8f9",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e3e8eb",
    backgroundColor: "#ffffff",
  },
  back: {
    fontSize: 17,
    color: "#1f7aec",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#1f7aec",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  list: {
    padding: 12,
  },
  bubble: {
    maxWidth: "75%",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginVertical: 4,
  },
  theirs: {
    alignSelf: "flex-start",
    backgroundColor: "#e7ecef",
  },
  mine: {
    alignSelf: "flex-end",
    backgroundColor: "#1f7aec",
  },
  text: {
    fontSize: 16,
    color: "#13212b",
  },
  mineText: {
    color: "#ffffff",
  },
  time: {
    fontSize: 11,
    color: "#6d7d87",
    marginTop: 2,
    alignSelf: "flex-end",
  },
});
