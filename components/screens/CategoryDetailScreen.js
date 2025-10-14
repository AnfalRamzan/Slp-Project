// components/screens/CategoryDetailScreen.js
import React, { useMemo, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, Dimensions } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

// === Full master goal bank ===
const GOAL_BANK = {
  1: {
    id: 1,
    name: "Receptive Language (F80.2)",
    goals: [
      "Localization","Joint attention","Eye contact","Respond on name","Vocalization",
      "Non-verbal imitation","Vocal play","Identify objects","Action words","Match objects",
      "Identify actions","Exclusion","Categorization","One-step directions","Answers simple questions",
      "Understands prepositions","Plurals","Contrasting concepts","Identifies categories","Listens to stories",
      "Multi-step directions","Understands time","Sequence","Identifies attributes","Pronouns",
      "Answers story questions","What questions","Where questions","Who questions","Makes inferences",
      "Nonliteral meanings","Proverbs","Complex grammar","Summarizes information","Understands academic topics",
    ],
  },
  2: {
    id: 2,
    name: "Expressive Language (F80.1)",
    goals: [
      "Imitation","Naming","Vocabulary building","Yes/no","Action Verbs","What questions",
      "Preposition","Locations","Where questions","Phrases","Simple sentences","Carrier phrases",
      "Who questions","Pronouns","Plurals","Descriptive questions","Initiating conversation",
      "When questions","How questions","Why questions","Temporal concepts","Sequencing",
      "Inclusion questions","Exclusion questions","Narration","Storytelling","Complex sentences",
      "Compound sentences","Hypothetical questions","Reflective questions","Question formulation",
      "Refining conversational questioning",
    ],
  },
  3: {
    id: 3,
    name: "Hearing Impairment (H90)",
    goals: [
      "Audition","Awareness","Discrimination","Identification","Comprehension","Receptive Language",
      "Expressive Language","Cognitive","Memory for auditory tasks","Categorizes","Sequences information",
      "Verbal reasoning","Inferential questions","Predictive questions","Speech intelligibility",
      "Sounds in isolation","Syllables","Initial position","Final position","Middle position",
      "Sentences","Oral reading tasks","Structured conversation","Spontaneous speech","Self-monitoring skills",
      "Pragmatics","Initiates conversation","Maintain conversation","Takes turns","Understands social cues",
      "Adjust communication","Literacy","Recognizes letters","Blending","Segments phonemes","Read simple words",
      "Read sentences","Writing with correct spellings"
    ],
  },
};

// Helper: chunk array into levels
const chunk = (arr, size) => {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

export default function CategoryDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { categoryId } = route.params || { categoryId: 1 };

  const levelSize = 5; // 5 goals per level
  const category = GOAL_BANK[categoryId];

  const levels = useMemo(() => {
    if (!category) return [];
    const goalObjs = category.goals.map((g, idx) => ({
      id: `${categoryId}-G${(idx + 1).toString().padStart(3, "0")}`,
      title: g,
      sessionsPassed: 0,
      passed: false,
    }));
    return chunk(goalObjs, levelSize).map((goalsChunk, idx) => ({
      id: `${categoryId}-L${idx + 1}`,
      title: `Level ${idx + 1}`,
      goals: goalsChunk,
      unlocked: idx === 0,
      completed: false,
    }));
  }, [categoryId]);

  const [levelsState, setLevelsState] = useState(levels);

  const levelPercent = (level) => {
    const total = level.goals.length || 1;
    const passed = level.goals.filter((g) => g.passed).length;
    return Math.round((passed / total) * 100);
  };

  const openLevel = (levelIndex) => {
    const lv = levelsState[levelIndex];
    if (!lv.unlocked) {
      Alert.alert("Locked", "Complete previous level first (≥60% goals).");
      return;
    }
    if (lv.completed) {
      Alert.alert("Completed", "This level is already passed.");
      return;
    }
    navigation.navigate("LevelScreen", {
      categoryId,
      levelIndex,
      levelsState,
      onUpdate: (updatedLevelState) => {
        const copy = [...levelsState];
        copy[levelIndex] = updatedLevelState;

        const percent = levelPercent(updatedLevelState);
        if (percent >= 60) {
          copy[levelIndex] = { ...copy[levelIndex], completed: true, unlocked: true };
          if (copy[levelIndex + 1]) {
            copy[levelIndex + 1] = { ...copy[levelIndex + 1], unlocked: true };
            Alert.alert("Level Passed", `${copy[levelIndex].title} passed — next level unlocked.`);
          } else {
            Alert.alert("Category Completed", `All levels completed for ${category.name}`);
          }
        } else {
          Alert.alert("Level Progress", `${percent}% — need 60% to pass.`);
        }
        setLevelsState(copy);
      },
    });
  };

  const overallPercent = () => {
    const allGoals = levelsState.flatMap((l) => l.goals);
    const total = allGoals.length || 1;
    const passed = allGoals.filter((g) => g.passed).length;
    return Math.round((passed / total) * 100);
  };

  const generateReport = () => {
    const percent = overallPercent();
    const pass = percent >= 30;
    Alert.alert("Report", `Overall: ${percent}%\nResult: ${pass ? "PASS" : "FAIL"}`);
  };

  if (!category) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Category not found</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={true}>
      <Text style={styles.title}>{category.name}</Text>

      <View style={styles.levelsContainer}>
        <Text style={styles.sub}>Levels</Text>
        {levelsState.map((level, idx) => (
          <View key={level.id} style={styles.levelCard}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={styles.levelTitle}>{level.title}</Text>
              <Text style={styles.levelPercent}>{levelPercent(level)}%</Text>
            </View>
            <Text style={styles.small}>{level.unlocked ? (level.completed ? "Completed" : "Unlocked") : "Locked"}</Text>
            <View style={{ flexDirection: "row", marginTop: height * 0.015 }}>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: level.unlocked && !level.completed ? "#293D55" : "#9aa6bd" }]}
                onPress={() => openLevel(idx)}
              >
                <Text style={styles.btnText}>Open</Text>
              </TouchableOpacity>
              <View style={{ width: width * 0.02 }} />
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: "#293D55" }]}
                onPress={() => {
                  const passed = level.goals.filter((g) => g.passed).length;
                  Alert.alert("Level Info", `${level.title}\nGoals: ${level.goals.length}\nPassed: ${passed}`);
                }}
              >
                <Text style={styles.btnText}>Info</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.reportBtn} onPress={generateReport}>
        <Text style={styles.reportText}>Generate Report</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7fafc" },
  scrollContainer: { flexGrow: 1, padding: width * 0.04 },
  title: { fontSize: width * 0.05, fontWeight: "700", marginBottom: height * 0.02, textAlign: "center" },
  sub: { fontSize: width * 0.045, fontWeight: "600", marginBottom: height * 0.015 },
  levelsContainer: { marginBottom: height * 0.02 },
  levelCard: { backgroundColor: "#fff", borderRadius: 8, padding: width * 0.04, marginBottom: height * 0.015, elevation: 2 },
  levelTitle: { fontSize: width * 0.045, fontWeight: "600" },
  levelPercent: { fontSize: width * 0.04, fontWeight: "700", color: "#0f172a" },
  small: { color: "#6b7280", marginTop: height * 0.005, fontSize: width * 0.035 },
  btn: { paddingVertical: height * 0.012, paddingHorizontal: width * 0.03, borderRadius: 6 },
  btnText: { color: "#fff", fontWeight: "700", fontSize: width * 0.04 },
  reportBtn: { backgroundColor: "#293D55", padding: height * 0.015, borderRadius: 8, alignItems: "center", marginTop: height * 0.02 },
  reportText: { color: "#fff", fontWeight: "700", fontSize: width * 0.045 },
});
