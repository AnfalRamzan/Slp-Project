// components/screens/CategoryDetailScreen.js
import React, { useMemo, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

/**
 * CategoryDetailScreen
 *
 * - Loads full goal list per category (hardcoded from your bank).
 * - Splits goals into levels (levelSize = how many goals per level).
 * - Tracks which levels are unlocked/completed in local component state (per patient).
 *
 * NOTE: This uses in-memory state. If you want persistence across app restarts,
 * we can add AsyncStorage later.
 */

// === Full master goal bank (only the category requested will be used) ===
// For brevity we include full RL/EL/HI lists as arrays. (You had many items; I've included them.)
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

  // levelSize controls how many goals per level (you can tune)
  const levelSize = 8;

  // Build levels from the selected category goals
  const category = GOAL_BANK[categoryId];
  const levels = useMemo(() => {
    if (!category) return [];
    const goalObjs = category.goals.map((g, idx) => ({
      id: `${categoryId}-G${(idx + 1).toString().padStart(3, "0")}`,
      title: g,
      scores: [], // track per-goal last scores here (in child screen we will manipulate this)
      passed: false,
    }));
    return chunk(goalObjs, levelSize).map((goalsChunk, idx) => ({
      id: `${categoryId}-L${idx + 1}`,
      title: `Level ${idx + 1}`,
      goals: goalsChunk,
      unlocked: idx === 0, // only first level unlocked initially
      completed: false,
    }));
  }, [categoryId]);

  // Local state representing the user's progress for this patient+category
  // We'll keep levelsState as object so we can update per-level and per-goal.
  const [levelsState, setLevelsState] = useState(levels);

  // compute percentage for a level
  const levelPercent = (level) => {
    const total = level.goals.length || 1;
    const passed = level.goals.filter((g) => g.passed).length;
    return Math.round((passed / total) * 100);
  };

  const openLevel = (levelIndex) => {
    const lv = levelsState[levelIndex];
    if (!lv.unlocked) {
      Alert.alert("Locked", "You must complete the previous level (60%) to unlock this level.");
      return;
    }
    if (lv.completed) {
      Alert.alert("Completed", "This level has been completed and locked for re-testing.");
      return;
    }
    navigation.navigate("LevelScreen", {
      categoryId,
      levelIndex,
      levelsState,
      onUpdate: (updatedLevelState) => {
        // Get updated levels state with the returned update
        const copy = [...levelsState];
        copy[levelIndex] = updatedLevelState;

        // check if level completed >= 60% -> unlock next
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
          // not enough for passing level; it remains unlocked so sessions can continue
          Alert.alert("Level Update", `Level progress: ${percent}%. Need 60% to complete.`);
        }
        setLevelsState(copy);
      },
    });
  };

  // Overall category percent across all levels
  const overallPercent = () => {
    const allGoals = levelsState.flatMap((l) => l.goals);
    const total = allGoals.length || 1;
    const passed = allGoals.filter((g) => g.passed).length;
    return Math.round((passed / total) * 100);
  };

  const generateReport = () => {
    const percent = overallPercent();
    const passThreshold = 30; // per your instruction pass if >=30%
    const pass = percent >= passThreshold;
    Alert.alert(
      "Report",
      `Overall: ${percent}%\nResult: ${pass ? "PASS" : "FAIL"}\n(Note: Each level requires >=60% to unlock the next level.)`
    );
  };

  if (!category) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Category not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{category.name}</Text>

      <View style={{ marginBottom: 12 }}>
        <Text style={styles.sub}>Levels</Text>
        {levelsState.map((level, idx) => (
          <View key={level.id} style={styles.levelCard}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={styles.levelTitle}>{level.title}</Text>
              <Text style={styles.levelPercent}>{levelPercent(level)}%</Text>
            </View>

            <Text style={styles.small}>
              {level.unlocked ? (level.completed ? "Completed" : "Unlocked") : "Locked"}
            </Text>

            <View style={{ flexDirection: "row", marginTop: 8 }}>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: level.unlocked && !level.completed ? "#2563eb" : "#9aa6bd" }]}
                onPress={() => openLevel(idx)}
              >
                <Text style={styles.btnText}>Open</Text>
              </TouchableOpacity>

              <View style={{ width: 8 }} />

              <TouchableOpacity
                style={[styles.btn, { backgroundColor: "#6b7280" }]}
                onPress={() => {
                  // quick view: number of goals & passed
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
  container: { flex: 1, backgroundColor: "#f7fafc", padding: 16 },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 12, textAlign: "center" },
  sub: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  levelCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
  },
  levelTitle: { fontSize: 16, fontWeight: "600" },
  levelPercent: { fontSize: 14, fontWeight: "700", color: "#0f172a" },
  small: { color: "#6b7280", marginTop: 4 },
  btn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6 },
  btnText: { color: "#fff", fontWeight: "700" },
  reportBtn: { backgroundColor: "#059669", padding: 12, borderRadius: 8, alignItems: "center", marginTop: 12 },
  reportText: { color: "#fff", fontWeight: "700" },
});
