import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { Avatar } from "react-native-elements";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { db, auth } from "../firebase";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  query,
  onSnapshot,
} from "@firebase/firestore";

const ChatScreen = ({ navigation, route }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  //   console.log("messages content : " + messages);
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Chat",
      headerTitleAlign: "left",
      headerTitle: () => (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: 80,
            marginRight: 20,
          }}
        >
          <Avatar
            rounded
            source={{
              uri: messages[0]?.data.photoURL,
            }}
          />
          <Text style={{ color: "white", marginLeft: 10, fontWeight: "700" }}>
            {route.params.chatName}
          </Text>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity
          style={{ marginLeft: 10 }}
          onPress={navigation.goBack}
        >
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: 80,
            marginRight: 20,
          }}
        >
          <TouchableOpacity>
            <FontAwesome name="video-camera" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="call" size={24} color="white" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, messages]);

  //   console.log("id : ", route.params.id);

  const sendMessage = async () => {
    Keyboard.dismiss;
    await addDoc(collection(db, "chats", route.params.id, "Messages"), {
      timestamp: serverTimestamp(),
      message: input,
      displayName: auth.currentUser.displayName,
      email: auth.currentUser.email,
      photoURL: auth.currentUser.photoURL,
    });

    setInput("");
  };
  useLayoutEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "chats", route.params.id, "Messages")),
      (snapshot) => {
        // console.log("DOCS messages :", snapshot.docs);
        setMessages(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        );
      }
    );
    return () => {
      unsubscribe();
    };
  }, [route]);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={90}
      >
        {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
        <>
          <ScrollView contentContainerStyle={{ paddingTop: 15 }}>
            {messages.map(({ id, data }) =>
              data.email === auth.currentUser.email ? (
                <View key={id} style={styles.receiver}>
                  <Avatar
                    //WEB
                    containerStyle={{
                      position: "absolute",
                      bottom: -15,
                      right: -5,
                    }}
                    position="absolute"
                    rounded
                    bottom={-15}
                    right={-5}
                    size={30}
                    source={{
                      uri: data.photoURL,
                    }}
                  />
                  <Text style={styles.receiverText}>{data.message}</Text>
                </View>
              ) : (
                <View key={id} style={styles.sender}>
                  <Avatar
                    //WEB
                    containerStyle={{
                      position: "absolute",
                      bottom: -15,
                      right: -5,
                    }}
                    position="absolute"
                    rounded
                    bottom={-15}
                    right={-5}
                    size={30}
                    source={{
                      uri: data.photoURL,
                    }}
                  />
                  <Text style={styles.senderText}>{data.message}</Text>
                  <Text style={styles.senderName}>{data.displayName}</Text>
                </View>
              )
            )}
          </ScrollView>
          <View key={id} style={styles.footer}>
            <TextInput
              value={input}
              onChangeText={(text) => setInput(text)}
              onSubmitEditing={sendMessage}
              placeholder="signal Message"
              style={styles.textInput}
            />
            <TouchableOpacity onPress={sendMessage} activeOpacity={0.5}>
              <Ionicons name="send" size={24} color="#2B68E6" />
            </TouchableOpacity>
          </View>
        </>
        {/* </TouchableWithoutFeedback> */}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 15,
  },
  textInput: {
    bottom: 0,
    height: 40,
    flex: 1,
    marginRight: 15,
    borderColor: "transparent",
    backgroundColor: "#ECECEC",
    padding: 10,
    color: "grey",
    borderRadius: 30,
  },
  sender: {
    padding: 10,
    backgroundColor: "#2B68E6",
    alignSelf: "flex-start",
    borderRadius: 20,
    margin: 15,
    maxWidth: "80%",
    position: "relative",
  },
  senderText: {
    color: "white",
    fontWeight: "500",
    marginLeft: 10,
    marginBottom: 15,
  },
  receiverText: {
    color: "black",
    fontWeight: "500",
    marginLeft: 10,
    marginBottom: 15,
  },
  senderName: {
    left: 10,
    paddingRight: 10,
    fontSize: 10,
    color: "white",
  },
  receiver: {
    padding: 10,
    backgroundColor: "#ECECEC",
    alignSelf: "flex-end",
    borderRadius: 20,
    marginRight: 15,
    marginBottom: 20,
    maxWidth: "80%",
    position: "relative",
  },
});
