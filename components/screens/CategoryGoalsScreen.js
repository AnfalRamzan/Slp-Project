import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { initialCategories } from "./GoalData"; // move your initial data here for reuse

const CategoryGoalsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { categoryId } = route.params;
  const [categories, setCategories] = useState(initialCategories);

  const category = categories.find((c) => c.id === categoryId);

  const handleSession = (goalId) => {
    const updated = categories.map((cat) => {
      if (cat.id === categoryId) {
        const updatedGoals = cat.goals.map((goal) => {
          if (goal.id === goalId) {
            const newScore = Math.floor(Math.random() * 5) + 1;
            const updatedScores = [...goal.scores, newScore].slice(-3);
            const passed =
              updatedScores.length === 3 && updatedScores.every((s) => s >= 3);
            return { ...goal, scores: updatedScores, passed };
          }
          return goal;
        });
        return { ...cat, goals: updatedGoals };
      }
      return cat;
    });

    setCategories(updated);
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backBtn}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{category?.name}</Text>

      {category?.goals.map((goal) => (
        <View key={goal.id} style={styles.goalCard}>
          <Text style={styles.goalText}>{goal.id} - {goal.name}</Text>

          <TouchableOpacity
            style={[
              styles.sessionBtn,
              goal.passed && { backgroundColor: "#81C784" },
            ]}
            onPress={() => handleSession(goal.id)}
          >
            <Text style={styles.btnText}>
              {goal.passed ? "✅ Passed" : "Start Session"}
            </Text>
          </TouchableOpacity>

          {goal.scores.length > 0 && (
            <Text style={styles.scoreText}>
              Scores: {goal.scores.join(", ")}
            </Text>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9", padding: 16 },
  backBtn: { fontSize: 16, color: "#007AFF", marginBottom: 10 },
  title: { fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  goalCard: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  goalText: { fontSize: 16, fontWeight: "500" },
  sessionBtn: {
    backgroundColor: "#4CAF50",
    padding: 8,
    borderRadius: 6,
    marginTop: 6,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "bold" },
  scoreText: { marginTop: 5, fontSize: 14, color: "#555" },
});

export default CategoryGoalsScreen;
