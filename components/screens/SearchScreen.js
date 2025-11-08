import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

export default function SearchScreen() {
  const [mrNumber, setMrNumber] = useState("");

  const handleSearch = () => {
    alert(`Searching for MR Number: ${mrNumber}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search by MR Number</Text>
      <TextInput
        placeholder="Enter MR Number"
        value={mrNumber}
        onChangeText={setMrNumber}
        style={styles.input}
      />

      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.searchButtonText}>SEARCH</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Developed by{"\n"}Riphah International University</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#D9E7F7" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
  input: { backgroundColor: "#fff", borderRadius: 8, padding: 10, marginBottom: 15 },
  searchButton: { backgroundColor: "#293D55", borderRadius: 8, padding: 12 },
  searchButtonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  footer: { alignItems: "center", marginTop: 20 },
  footerText: { fontSize: 12, color: "#A9A9A9", textAlign: "center" },
});
