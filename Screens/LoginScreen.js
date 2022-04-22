import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import { Button, Input, Image } from "react-native-elements";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        navigation.replace("Home");
      }
    });
    return unsubscribe;
  }, []);
  const auth = getAuth();
  const signIn = () => {
    signInWithEmailAndPassword(auth, email, password).catch((error) =>
      alert(error)
    );
  };
  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <StatusBar style="light" />
      <Image
        source={{
          uri: "https://images.hindustantimes.com/tech/img/2021/05/12/960x540/signal_app_1610868805441_1610868819838_1620837476101.png",
        }}
        style={{ width: 200, height: 200 }}
      />
      <View style={styles.inputContainer}>
        <Input
          placeholder="Email"
          autoFocus
          type="email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <Input
          placeholder="Password"
          secureTextEntry
          type="password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          onSubmitEditing={signIn}
        />
      </View>
      <Button containerStyle={styles.button} title="Login" onPress={signIn} />
      <Button
        onPress={() => navigation.navigate("Register")}
        containerStyle={styles.button}
        title="Register"
        type="outline"
      />
      <View style={{ height: 100 }}></View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "white",
  },
  inputContainer: { width: 300 },
  button: {
    width: 200,
    marginTop: 10,
    borderRadius: 20,
  },
});
