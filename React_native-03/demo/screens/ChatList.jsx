import React from "react";
import { View, Text, Button } from "react-native";

const ChatList = ({navigation}) => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ fontWeight: "bold", fontSize: 30 }}>ChatList</Text>
      <Button
        onPress={() => navigation.navigate("Individual Chat")}
        title="Open Individual Chat"
      />
    </View>
  );
};

export default ChatList;