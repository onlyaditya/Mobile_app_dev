import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import ChatItem from "../components/ChatItem";
import initalChat from "../data/chats.json";
import { useState } from "react";

const ChatList = () => {
  const [chats, setChats] = useState(initalChat)
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Chats</Text>
      <FlatList
        windowSize={4}
        data={chats}
        renderItem={({ item }) => {
          return (
            <Pressable onPress={() => selectChat(item)}>
              <ChatItem chat={item} />
            </Pressable>
          );
        }}
        keyExtractor={(item) => item.id}
      />
    </View>

    //   {/* {chats.map((el) => {
    //     console.log("Rendering...");
    //     return <Text>{el.name}</Text>;
    //   })} */}
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    padding: 20,
    color: "#111827",
  },
});

export default ChatList;
