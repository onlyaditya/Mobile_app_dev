import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function App() {
  const [text, setText] = useState("");

  useEffect(() => {
    getItem();
  },[text])

  useEffect(() => {
    // Logic
  }, [text]);

  async function getItem() {
    let data = await AsyncStorage.getItem("Message");
    data = JSON.parse(data)
    setText(data);
  }
  
  function handleTextBox(value){
    setText(value)
  }

  

  function saveItem(){
    AsyncStorage.setItem("Message", )
  }
  return (
    <View style={styles.container}>
      <Text>Async Storage</Text>
      <TextInput value={text} onChangeText={(value) => {handleTextBox(value)}} />
      <Button title="Click me" onPress={saveItem}/>  
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});




//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
// import { createNativeBottomTabNavigator } from "@react-navigation/bottom-tabs/unstable";
// import { NavigationContainer } from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import ChatList from "./screens/ChatList";
// import IndividualChat from "./screens/IndividualChat";
// const Stack = createNativeStackNavigator();
// const Tab = createNativeBottomTabNavigator();

// function BottomTabNavigation() {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen name="Chat List" component={ChatList} />
//       <Stack.Screen name="Individual Chat" component={IndividualChat} />
//     </Stack.Navigator>
//   );
// }

{
  /* <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Chat" component={BottomTabNavigation} />
        <Tab.Screen name="Settings" component={Settings} />
      </Tab.Navigator>
    </NavigationContainer> */
}
