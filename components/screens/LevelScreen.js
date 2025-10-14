// components/screens/LevelScreen.js
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

/**
 * LevelScreen
 * - receives levelsState (array), categoryId, and levelIndex via route.params
 * - provides onUpdate callback for saving changes for that level
 *
 * Session rule:
 * - A session produces a random score 1..5 (you can replace with a real scoring UI)
 * - For each goal we store last scores array (we keep last 3). If last 3 >= 3 -> passed:true
 */

export default function LevelScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { categoryId, levelIndex, levelsState, onUpdate } = route.params;

  // copy level from provided state
  const [level, setLevel] = useState(() => JSON.parse(JSON.stringify(levelsState[levelIndex])));

  useEffect(() => {
    // safety — if no level, go back
    if (!level) {
      Alert.alert("Error", "Level data missing");
      navigation.goBack();
    }
  }, []);

  // run a session for a goal (simulate scoring)
  const runSession = (goalId) => {
    const updatedGoals = level.goals.map((g) => {
      if (g.id === goalId) {
        // here we simulate a score; in real app you'd collect user input
        const newScore = Math.floor(Math.random() * 5) + 1;
        const updatedScores = [...(g.scores || []), newScore].slice(-3);
        const passed = updatedScores.length === 3 && updatedScores.every((s) => s >= 3);
        Alert.alert("Session Result", `${g.title}\nScore: ${newScore}\nLast scores: ${updatedScores.join(", ")}`);
        return { ...g, scores: updatedScores, passed };
      }
      return g;
    });

    setLevel((prev) => ({ ...prev, goals: updatedGoals }));
  };

  const saveAndReturn = () => {
    // send updated level back to CategoryDetail
    onUpdate(level);
    navigation.goBack();
  };

  const levelProgress = () => {
    const total = level.goals.length || 1;
    const passed = level.goals.filter((g) => g.passed).length;
    return Math.round((passed / total) * 100);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{level.title} — Goals</Text>

      <Text style={styles.progress}>Progress: {levelProgress()}%</Text>

      {level.goals.map((goal) => (
        <View key={goal.id} style={styles.goalCard}>
          <Text style={styles.goalTitle}>{goal.id} — {goal.title}</Text>

          <View style={{ flexDirection: "row", marginTop: 8 }}>
            <TouchableOpacity
              style={styles.sessionBtn}
              onPress={() => runSession(goal.id)}
            >
              <Text style={styles.sessionText}>{goal.passed ? "✅ Passed" : "Start Session"}</Text>
            </TouchableOpacity>

            <View style={{ width: 10 }} />

            <View style={{ justifyContent: "center" }}>
              <Text style={styles.small}>Scores: {(goal.scores || []).join(", ") || "—"}</Text>
            </View>
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.saveBtn} onPress={saveAndReturn}>
        <Text style={styles.saveText}>Save & Return</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f8fafc" },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 6, textAlign: "center" },
  progress: { textAlign: "center", marginBottom: 12, color: "#374151", fontWeight: "600" },
  goalCard: { backgroundColor: "#fff", padding: 12, borderRadius: 8, marginBottom: 10, elevation: 2 },
  goalTitle: { fontSize: 15, fontWeight: "600" },
  sessionBtn: { backgroundColor: "#0ea5a4", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6 },
  sessionText: { color: "#fff", fontWeight: "700" },
  small: { color: "#6b7280" },
  saveBtn: { marginTop: 14, backgroundColor: "#2563eb", padding: 12, borderRadius: 8, alignItems: "center" },
  saveText: { color: "#fff", fontWeight: "700" },
});
