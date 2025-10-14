// components/screens/CategoryListScreen.js
import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

/**
 * Lightweight category list. Data is the master list and lives inside CategoryDetailScreen
 * (so you won't duplicate huge data). We only show main category titles here.
 */

const CATEGORY_META = [
  { id: 1, name: "Receptive Language (F80.2)" },
  { id: 2, name: "Expressive Language (F80.1)" },
  { id: 3, name: "Hearing Impairment (H90)" },
];

export default function CategoryListScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Categories</Text>

      {CATEGORY_META.map((cat) => (
        <TouchableOpacity
          key={cat.id}
          style={styles.card}
          onPress={() => navigation.navigate("CategoryDetail", { categoryId: cat.id })}
        >
          <Text style={styles.cardText}>{cat.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7fafc", padding: 16 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 16, textAlign: "center" },
  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  cardText: { fontSize: 16, fontWeight: "600" },
});
