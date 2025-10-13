import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const initialCategories = [
  {
    id: 1,
    name: "Receptive Language (F80.2)",
    goals: [
      { id: "RL.01", name: "Localization", scores: [] },
      { id: "RL.02", name: "Joint attention", scores: [] },
      { id: "RL.03", name: "Eye contact", scores: [] },
      { id: "RL.04", name: "Respond on name", scores: [] },
      { id: "RL.05", name: "Vocalization", scores: [] },
      { id: "RL.06", name: "Non-verbal imitation", scores: [] },
      { id: "RL.07", name: "Vocal play", scores: [] },
      { id: "RL.08", name: "Identify objects", scores: [] },
      { id: "RL.09", name: "Action words", scores: [] },
      { id: "RL.10", name: "Match objects", scores: [] },
      { id: "RL.11", name: "Identify actions", scores: [] },
      { id: "RL.12", name: "Exclusion", scores: [] },
      { id: "RL.13", name: "Categorization", scores: [] },
      { id: "RL.14", name: "One-step directions", scores: [] },
      { id: "RL.15", name: "Answers simple questions", scores: [] },
      { id: "RL.16", name: "Understands prepositions", scores: [] },
      { id: "RL.17", name: "Plurals", scores: [] },
      { id: "RL.18", name: "Contrasting concepts", scores: [] },
      { id: "RL.19", name: "Identifies categories", scores: [] },
      { id: "RL.20", name: "Listens to stories", scores: [] },
      { id: "RL.21", name: "Multi-step directions", scores: [] },
      { id: "RL.22", name: "Understands time", scores: [] },
      { id: "RL.23", name: "Sequence", scores: [] },
      { id: "RL.24", name: "Identifies attributes", scores: [] },
      { id: "RL.25", name: "Pronouns", scores: [] },
      { id: "RL.26", name: "Answers story questions", scores: [] },
      { id: "RL.27", name: "What questions", scores: [] },
      { id: "RL.28", name: "Where questions", scores: [] },
      { id: "RL.29", name: "Who questions", scores: [] },
      { id: "RL.30", name: "Makes inferences", scores: [] },
      { id: "RL.31", name: "Nonliteral meanings", scores: [] },
      { id: "RL.32", name: "Proverbs", scores: [] },
      { id: "RL.33", name: "Complex grammar", scores: [] },
      { id: "RL.34", name: "Understands academic topics", scores: [] },
    ],
    unlocked: true,
  },
  {
    id: 2,
    name: "Expressive Language (F80.1)",
    goals: [
      { id: "EL.01", name: "Imitation", scores: [] },
      { id: "EL.02", name: "Naming", scores: [] },
      { id: "EL.03", name: "Vocabulary building", scores: [] },
      { id: "EL.04", name: "Yes/No", scores: [] },
      { id: "EL.05", name: "Action Verbs", scores: [] },
      { id: "EL.06", name: "What questions", scores: [] },
      { id: "EL.07", name: "Prepositions", scores: [] },
      { id: "EL.08", name: "Locations", scores: [] },
      { id: "EL.09", name: "Where questions", scores: [] },
      { id: "EL.10", name: "Phrases", scores: [] },
      { id: "EL.11", name: "Simple sentences", scores: [] },
      { id: "EL.12", name: "Carrier phrases", scores: [] },
      { id: "EL.13", name: "Who questions", scores: [] },
      { id: "EL.14", name: "Pronouns", scores: [] },
      { id: "EL.15", name: "Plurals", scores: [] },
      { id: "EL.16", name: "Descriptive questions", scores: [] },
      { id: "EL.17", name: "Initiating conversation", scores: [] },
      { id: "EL.18", name: "When questions", scores: [] },
      { id: "EL.19", name: "How questions", scores: [] },
      { id: "EL.20", name: "Why questions", scores: [] },
      { id: "EL.21", name: "Temporal concepts", scores: [] },
      { id: "EL.22", name: "Sequencing", scores: [] },
      { id: "EL.23", name: "Inclusion questions", scores: [] },
      { id: "EL.24", name: "Exclusion questions", scores: [] },
      { id: "EL.25", name: "Narration", scores: [] },
      { id: "EL.26", name: "Storytelling", scores: [] },
      { id: "EL.27", name: "Complex sentences", scores: [] },
      { id: "EL.28", name: "Compound sentences", scores: [] },
      { id: "EL.29", name: "Hypothetical questions", scores: [] },
      { id: "EL.30", name: "Reflective questions", scores: [] },
      { id: "EL.31", name: "Question formulation", scores: [] },
      { id: "EL.32", name: "Refining conversational questioning", scores: [] },
    ],
    unlocked: false,
  },
  {
    id: 3,
    name: "Hearing Impairment (H90)",
    goals: [
      { id: "HI.01", name: "Audition", scores: [] },
      { id: "HI.01.01", name: "Awareness", scores: [] },
      { id: "HI.01.02", name: "Discrimination", scores: [] },
      { id: "HI.01.03", name: "Identification", scores: [] },
      { id: "HI.01.04", name: "Comprehension", scores: [] },
      { id: "HI.02", name: "Receptive Language", scores: [] },
      { id: "HI.03", name: "Expressive Language", scores: [] },
      { id: "HI.04", name: "Cognitive", scores: [] },
      { id: "HI.04.01", name: "Memory for auditory tasks", scores: [] },
      { id: "HI.04.02", name: "Categorizes", scores: [] },
      { id: "HI.04.03", name: "Sequences information", scores: [] },
      { id: "HI.04.04", name: "Verbal reasoning", scores: [] },
      { id: "HI.04.05", name: "Inferential questions", scores: [] },
      { id: "HI.04.06", name: "Predictive questions", scores: [] },
      { id: "HI.05", name: "Speech intelligibility", scores: [] },
      { id: "HI.05.01", name: "Sounds in isolation", scores: [] },
      { id: "HI.05.02", name: "Syllables", scores: [] },
      { id: "HI.05.03", name: "Initial position", scores: [] },
      { id: "HI.05.04", name: "Final position", scores: [] },
      { id: "HI.05.05", name: "Middle position", scores: [] },
      { id: "HI.05.06", name: "Sentences", scores: [] },
      { id: "HI.05.07", name: "Oral reading tasks", scores: [] },
      { id: "HI.05.08", name: "Structured conversation", scores: [] },
      { id: "HI.05.09", name: "Spontaneous speech", scores: [] },
      { id: "HI.05.10", name: "Self-monitoring skills", scores: [] },
      { id: "HI.06", name: "Pragmatics", scores: [] },
      { id: "HI.06.01", name: "Initiates conversation", scores: [] },
      { id: "HI.06.02", name: "Maintain conversation", scores: [] },
      { id: "HI.06.03", name: "Takes turns", scores: [] },
      { id: "HI.06.04", name: "Understands social cues", scores: [] },
      { id: "HI.06.05", name: "Adjust communication", scores: [] },
      { id: "HI.07", name: "Literacy", scores: [] },
      { id: "HI.07.01", name: "Recognizes letters", scores: [] },
      { id: "HI.07.02", name: "Blending", scores: [] },
      { id: "HI.07.03", name: "Segments phonemes", scores: [] },
      { id: "HI.07.04", name: "Read simple words", scores: [] },
      { id: "HI.07.05", name: "Read sentences", scores: [] },
      { id: "HI.07.06", name: "Writing with correct spellings", scores: [] },
    ],
    unlocked: false,
  },
];

const GoalTrackingScreen = () => {
  const navigation = useNavigation();
  const [categories, setCategories] = useState(initialCategories || []);

  const handleSession = (catId, goalId) => {
    const updated = categories.map((cat) => {
      if (cat.id === catId) {
        const updatedGoals = cat.goals.map((goal) => {
          if (goal.id === goalId) {
            const newScore = Math.floor(Math.random() * 5) + 1;
            const updatedScores = [...goal.scores, newScore].slice(-3);
            const isPassed =
              updatedScores.length === 3 && updatedScores.every((s) => s >= 3);
            return { ...goal, scores: updatedScores, passed: isPassed };
          }
          return goal;
        });
        return { ...cat, goals: updatedGoals };
      }
      return cat;
    });

    setCategories(updated);
    checkCategoryProgress(updated, catId);
  };

  const checkCategoryProgress = (data, catId) => {
    const category = data.find((c) => c.id === catId);
    if (!category) return;

    const total = category.goals.length;
    const passed = category.goals.filter((g) => g.passed).length;
    const percent = (passed / total) * 100;

    if (percent >= 60) {
      const nextCat = data.find((c) => c.id === catId + 1);
      if (nextCat && !nextCat.unlocked) {
        const updated = data.map((c) =>
          c.id === nextCat.id ? { ...c, unlocked: true } : c
        );
        setCategories(updated);
        Alert.alert("Unlocked!", `${nextCat.name} is now available.`);
      } else if (!nextCat) {
        Alert.alert("Completed", "All Categories Completed. View Report!");
        navigation.navigate("Report");
      }
    }
  };

  if (!Array.isArray(categories) || categories.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          Loading categories...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Goal Tracking</Text>

      {categories.map((category) => (
        <View key={category.id} style={styles.card}>
          <Text style={styles.categoryTitle}>
            {category.name} {category.unlocked ? "🔓" : "🔒"}
          </Text>

          {category.goals.map((goal) => (
            <View
              key={goal.id}
              style={[
                styles.goalContainer,
                !category.unlocked && styles.lockedGoal,
              ]}
            >
              <Text style={styles.goalText}>
                {goal.id} - {goal.name}
              </Text>

              <TouchableOpacity
                style={[
                  styles.sessionBtn,
                  goal.passed && styles.passedGoal,
                  !category.unlocked && { backgroundColor: "#ccc" },
                ]}
                disabled={!category.unlocked}
                onPress={() => handleSession(category.id, goal.id)}
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
        </View>
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
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryTitle: { fontSize: 18, fontWeight: "600", marginBottom: 8 },
  goalContainer: {
    backgroundColor: "#eaeaea",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  goalText: { fontSize: 16, fontWeight: "500" },
  sessionBtn: {
    backgroundColor: "#4CAF50",
    padding: 8,
    borderRadius: 6,
    marginTop: 5,
    alignItems: "center",
  },
  passedGoal: { backgroundColor: "#81C784" },
  lockedGoal: { opacity: 0.6 },
  btnText: { color: "#fff", fontWeight: "bold" },
  scoreText: { marginTop: 5, fontSize: 14, color: "#555" },
});

export default GoalTrackingScreen;
