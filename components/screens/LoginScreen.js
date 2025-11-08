import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (username === "Doctor" && password === "slp123") {
      navigation.replace("Home");
    } else {
      Alert.alert("Login Failed", "Invalid credentials.", [{ text: "OK" }]);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {/* Logo */}
          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          {/* Username Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              placeholder="Enter your username"
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>

          {/* Password Field with Eye Toggle */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                placeholder="Enter your password"
                style={[styles.input, { paddingRight: responsiveWidth(12) }]}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword} // 👈 hides text when false
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Image
                  source={
                    showPassword
                      ? require("../../assets/images/visible.png") // 👁 (password visible)
                      : require("../../assets/images/hide.png") //  (password hidden)
                  }
                  style={styles.eyeIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Login Button */}
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footerContainer}>
            <Text style={styles.footerLine}>Developed by</Text>
            <Text style={styles.footerLine}>
              Hoor Spoogmay and Anfal Ramzan
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
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
  passwordWrapper: {
    position: "relative",
    justifyContent: "center",
  },
  eyeButton: {
    position: "absolute",
    right: responsiveWidth(3),
    top: responsiveHeight(1.2),
  },
  eyeIcon: {
    width: responsiveWidth(6),
    height: responsiveWidth(6),
    opacity: 0.8,
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
    bottom: responsiveHeight(3),
    alignItems: "center",
  },
  footerLine: {
    fontSize: responsiveFontSize(1.8),
    color: "#999",
  },
});
