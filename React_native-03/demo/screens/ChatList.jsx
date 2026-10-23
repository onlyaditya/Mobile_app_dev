import { createAsyncStorage } from "@react-native-async-storage/async-storage/jest";
import React, { useState } from "react";
import { View, Text, Button, TextInput } from "react-native";

const storage = createAsyncStorage("Mydata")

const ChatList = ({ navigation }) => {
  const [data, setData] = useState({name: "helo"})
  
  function saveData(){
    storage.setItem('name', JSON.stringify(data))
  }

  async function retriveData(){
    let value = await storage.getItem('name');
    value = JSON.parse(value)
  }


  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ fontWeight: "bold", fontSize: 30 }}>ChatList</Text>
      <TextInput placeholder="Name" />
      <Button
        onPress={() => navigation.navigate("Individual Chat")}
        title="Open Individual Chat"
      />
    </View>
  );
};

export default ChatList;
