import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

const Home = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Image
        style={{ width: 200, height: 200 }}
        source={require("./assets/homeicon.png")}
      />
      <Text style={styles.text}> Gallery </Text>
      <TouchableOpacity onPress={() => navigation.navigate("Images")}>
        <Text style={styles.enter}>Enter </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  text: {
    marginTop: 20,
    fontSize: 22,
    fontWeight: "bold",
  },
  enter: {
    width: 350,
    padding: 20,
    marginTop: 80,
    borderRadius: 30,
    backgroundColor: "#4da6ff",
    borderWidth: 2,
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});
