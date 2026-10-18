import React from "react";
import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import ChatItem from "./ChatItem";

const ChatList = ({ chats }) => {
  console.log("Chats :", chats);
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Chats</Text>
      <FlatList
        windowSize={4}
        data={chats}
        renderItem={({ item }) => {
          console.log("Rendering...", item.id);
          return <ChatItem chat={item} />;
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
