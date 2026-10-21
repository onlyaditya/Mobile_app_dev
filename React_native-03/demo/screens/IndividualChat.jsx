import React from "react";
import { View, Text } from "react-native";

const IndividualChat = ({ route }) => {
  const id = route.params;
  console.log("Data Received :", id);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ fontWeight: "bold", fontSize: 30 }}>Individual Chat</Text>
    </View>
  );
};

export default IndividualChat;
