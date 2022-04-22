import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { ListItem, Avatar } from "react-native-elements";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { auth, db } from "../firebase";

const CustomListItems = ({ id, chatName, enterChat }) => {
  //   console.log("id", id, "chatName", chatName);

  const [chatMessages, setChatMessages] = useState([]);
  //   console.log("chat messages are : ", chatMessages);
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "chats", id, "Messages"),
        orderBy("timestamp", "desc")
      ),
      (snapshot) => {
        console.log("DOCS messages :", snapshot.docs);
        setChatMessages(
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
  }, []);

  return (
    <ListItem key={id} onPress={() => enterChat(id, chatName)} bottomDivider>
      <Avatar
        rounded
        source={{
          uri:
            chatMessages?.[0]?.data.photoURL ||
            "https://w7.pngwing.com/pngs/725/765/png-transparent-computer-icons-avatar-user-avatar-thumbnail.png",
        }}
      />
      <ListItem.Content>
        <ListItem.Title style={{ fontWeight: "800" }}>
          {chatName}
        </ListItem.Title>
        <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
          {chatMessages?.[0]?.data.displayName}:
          {chatMessages?.[0]?.data.message}
        </ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
};

export default CustomListItems;

const styles = StyleSheet.create({});
