import React, { useEffect } from "react";
import { View, StyleSheet, Image, Text } from "react-native";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Login");
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.text}>SMART GOAL TRACKING APP</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D9E7F7",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: responsiveWidth(5),
  },
  logo: {
    width: responsiveWidth(50), // 50% of screen width
    height: responsiveHeight(25), // 25% of screen height
    marginBottom: responsiveHeight(3),
  },
  text: {
    fontSize: responsiveFontSize(2.4), // adjusts based on screen size
    color: "#000",
    fontWeight: "bold",
    textAlign: "center",
  },
});
