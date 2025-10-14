// components/screens/LevelScreen.js
import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from "react-native";

export default function LevelScreen({ route, navigation }) {
  const { levelIndex, levelsState, onUpdate } = route.params;
  const level = levelsState[levelIndex];

  const [goalsState, setGoalsState] = useState(
    level.goals.map((g) => ({ ...g, sessionsPassed: g.sessionsPassed || 0, passed: g.passed || false }))
  );

  const updateGoal = (goalIndex, success) => {
    const copy = [...goalsState];
    if (success) {
      copy[goalIndex].sessionsPassed += 1;
      if (copy[goalIndex].sessionsPassed >= 3) copy[goalIndex].passed = true;
    } else {
      copy[goalIndex].sessionsPassed = 0;
      copy[goalIndex].passed = false;
    }
    setGoalsState(copy);
  };

  const submitLevel = () => {
    const updatedLevel = { ...level, goals: goalsState };
    onUpdate(updatedLevel);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{level.title}</Text>
      {goalsState.map((goal, idx) => (
        <View key={goal.id} style={styles.goalCard}>
          <Text style={styles.goalTitle}>
            {goal.title} {goal.passed ? "✓ Passed" : ""}
          </Text>
          <Text style={styles.small}>Sessions Completed: {goal.sessionsPassed}/3</Text>
          <View style={{ flexDirection: "row", marginTop: 8 }}>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: "#059669" }]}
              onPress={() => updateGoal(idx, true)}
            >
              <Text style={styles.btnText}>Pass Session</Text>
            </TouchableOpacity>
            <View style={{ width: 8 }} />
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: "#b91c1c" }]}
              onPress={() => updateGoal(idx, false)}
            >
              <Text style={styles.btnText}>Fail Session</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.submitBtn} onPress={submitLevel}>
        <Text style={styles.submitText}>Submit Level</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f7fafc" },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 12, textAlign: "center" },
  goalCard: { backgroundColor: "#fff", padding: 12, borderRadius: 8, marginBottom: 10, elevation: 2 },
  goalTitle: { fontSize: 16, fontWeight: "600" },
  small: { color: "#6b7280", marginTop: 4 },
  btn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6 },
  btnText: { color: "#fff", fontWeight: "700" },
  submitBtn: { backgroundColor: "#2563eb", padding: 12, borderRadius: 8, alignItems: "center", marginTop: 12 },
  submitText: { color: "#fff", fontWeight: "700" },
});
