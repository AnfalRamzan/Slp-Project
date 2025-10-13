import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    navigation.replace("Home"); // 🔹 No alert, directly navigate
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require("../../assets/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Email Field */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="Enter your email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Password Field */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          placeholder="Enter your password"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      {/* Login Button */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      {/* Footer */}
      <View style={styles.footerContainer}>
        <Text style={styles.footerLine}>Developed by</Text>
        <Text style={styles.footerLine}>Riphah International University</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D9E7F7",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: responsiveWidth(5),
  },
  logo: {
    width: responsiveWidth(50),
    height: responsiveHeight(25),
    marginBottom: responsiveHeight(4),
  },
  inputContainer: {
    width: "100%",
    marginBottom: responsiveHeight(2),
  },
  label: {
    fontSize: responsiveFontSize(1.8),
    fontWeight: "600",
    marginBottom: responsiveHeight(0.8),
    color: "#000",
  },
  input: {
    width: "100%",
    height: responsiveHeight(6),
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: responsiveWidth(4),
    backgroundColor: "#fff",
    fontSize: responsiveFontSize(1.9),
  },
  button: {
    width: responsiveWidth(50),
    height: responsiveHeight(6),
    backgroundColor: "#293D55",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: responsiveHeight(3),
  },
  buttonText: {
    color: "#fff",
    fontSize: responsiveFontSize(2.2),
    fontWeight: "bold",
  },
  footerContainer: {
    position: "absolute",
    bottom: responsiveHeight(5),
    alignItems: "center",
  },
  footerLine: {
    fontSize: responsiveFontSize(1.8),
    color: "#555",
  },
});
