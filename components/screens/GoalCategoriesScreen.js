import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const GoalCategoriesScreen = ({ route }) => {
  const navigation = useNavigation();

  const categories = [
    { id: 1, name: "Receptive Language (F80.2)", unlocked: true },
    { id: 2, name: "Expressive Language (F80.1)", unlocked: false },
    { id: 3, name: "Hearing Impairment (H90)", unlocked: false },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Goal Bank Categories</Text>

      {categories.map((cat) => (
        <TouchableOpacity
          key={cat.id}
          style={[styles.categoryCard, !cat.unlocked && { opacity: 0.6 }]}
          disabled={!cat.unlocked}
          onPress={() =>
            navigation.navigate("CategoryGoals", { categoryId: cat.id })
          }
        >
          <Text style={styles.categoryText}>
            {cat.name} {cat.unlocked ? "🔓" : "🔒"}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9", padding: 16 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  categoryCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  categoryText: {
    fontSize: 18,
    fontWeight: "600",
  },
});

export default GoalCategoriesScreen;
