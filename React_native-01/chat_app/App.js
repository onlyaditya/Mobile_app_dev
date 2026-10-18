import { StyleSheet } from "react-native";
import initialData from "./data/chats.json";
import { useState } from "react";
import ChatList from "./components/ChatList";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  const [chat, setChat] = useState(initialData);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ChatList chats={chat} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
});
