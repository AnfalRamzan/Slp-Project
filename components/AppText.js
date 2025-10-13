import React from "react";
import { Text, StyleSheet } from "react-native";
import colors from "./config/colors";

export default function AppText({ children, style, ...otherProps }) {
  return (
    <Text style={[styles.text, style]} {...otherProps}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    color: colors.text,
    fontSize: 16,
  },
});
