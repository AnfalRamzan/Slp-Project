// components/screens/CategoryListScreen.js
import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Image,
  Pressable,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useChild } from "../context/ChildContext";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";

const CATEGORY_META = [
  {
    id: "F80.2",
    name: "F80.2 Receptive language disorder",
    unlocked: true,
    goals: [
      "RL.01Listening",
      "RL.02Looking",
      "RL.03Mutual gaze",
      "RL.04Exploratory play",
      "RL.05Non verbal imitation",
      "RL.06Joint attention",
      "RL.07Turn taking",
      "RL.08Anticipation",
      "RL.09Social referencing",
      "RL.10Deictic gestures",
      "RL.11Representational gestures",
      "RL.12Functional play",
      "RL.13Relational play",
      "RL.14Self-directed play",
      "RL.15One step command following",
      "RL.16Nouns",
      "RL.17Action verbs",
      "RL.18Pretend play",
      "RL.19Pronouns",
      "RL.20Symbolic play",
      "RL.21Use of object",
      "RL.222 steps command following",
      "RL.23Quantitative concepts",
      "RL.24Preposition",
      "RL.25Sequence concepts",
      "RL.26Understand negatives in sentences",
    ],
  },
  {
    id: "F80.1",
    name: "F80.1 Expressive language goals",
    unlocked: true,
    goals: [
      "EL.01Cooing",
      "EL.02Babbling",
      "EL.03Vocal turns",
      "EL.04Verbal imitation",
      "EL.05One word",
      "EL.06Nouns",
      "EL.07Social words",
      "EL.08Action verbs",
      "EL.09Phrases",
      "EL.10Adjectives",
      "EL.11Pronouns",
      "EL.12Simple sentences",
      "EL.13Present progressive (verb+ing)",
      "EL.14Plurals",
      "EL.15Who questions",
      "EL.16What questions",
      "EL.17Where questions",
      "EL.18Uses possessives",
      "EL.19Function of object",
      "EL.20Preposition",
      "EL.21Names categories",
      "EL.22Formulated questions",
      "EL.23Why questions",
      "EL.24Retell story",
      "EL.25Describe similarities",
      "EL.26Sequence concepts",
      "EL.27Use –er to indicate",
      "EL.28Rhymes words",
      "EL.29Delete syllables",
      "EL.30Repeat sentences",
    ],
  },
  {
    id: "H90",
    name: "H90 Hearing impairment Goals",
    unlocked: true,
    goals: [
      "HI. 01 Auditory Awareness",
      "HI. 02 Auditory Discrimination",
      "HL.02.01 ENVIRONMENTAL SOUND",
      "HL.02.02 SPEECH SOUND",
      "HI. 03 Auditory Identification",
      "HI. 04 Auditory Comprehension",
      "HL.05 Sentence segmentation",
      "HL.06 Rhyme recognition",
      "HL.07 Rhyme production",
      "HL.08 Syllable blending",
      "HL. 09 Syllable segmentation",
      "HL.10 Syllable deletion",
      "HL.11 Phoneme isolation of initial sounds",
      "HL.12 Phoneme isolation of final sounds",
      "HL.13 Phoneme blending",
      "HL.14 Phoneme Segmentation",
      "HL.15 Phoneme Deletion of initial sounds",
      "HL.16 Phoneme deletion of final sounds",
      "HL.17 Phoneme Deletion of first sound in consonant blend",
      "HL.18 Phoneme Substitution",
      "HL.19 Structured conversation",
      "HL.20 Self-monitoring skills",
    ],
  },
];

export default function CategoryListScreen() {
  const navigation = useNavigation();
  const { selectedChild } = useChild();

  const handleCategoryPress = (cat) => {
    if (!selectedChild) {
      Alert.alert(
        "No Child Selected",
        "Please select or add a child first before starting therapy sessions.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Select Child", onPress: () => navigation.navigate("Home") },
          { text: "Add New Child", onPress: () => navigation.navigate("AddChild") },
        ]
      );
      return;
    }

    if (cat.unlocked) {
      navigation.navigate("CategoryDetail", {
        categoryId: cat.id,
        categoryName: cat.name,
        goals: cat.goals,
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: responsiveHeight(5) }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Back Button and Title */}
        <View style={styles.headerContainer}>
          {/* <Pressable onPress={() => navigation.goBack()} style={styles.backButton}> */}
            {/* <Image */}
              {/* source={require("../../assets/images/back.png")} */}
              {/* style={styles.backIcon} */}
            {/* /> */}
          {/* </Pressable> */}
          {/* <Text style={styles.title}>Therapy Goals</Text> */}
        </View>

        {/* Selected Child Card */}
        {selectedChild ? (
          <View style={styles.selectedChildCard}>
            <Text style={styles.childLabel}>Currently Working With</Text>
            <Text style={styles.childName}>{selectedChild.childName}</Text>
            <Text style={styles.childMr}>MR #: {selectedChild.mrNumber}</Text>
          </View>
        ) : (
          <View style={styles.noChildCard}>
            <Text style={styles.warningText}>⚠️ No Child Selected</Text>
            <TouchableOpacity
              style={styles.selectChildButton}
              onPress={() => navigation.navigate("Home")}
            >
              <Text style={styles.selectChildButtonText}>
                Select Existing Child
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Category Cards */}
        {CATEGORY_META.map((cat) => (
          <Pressable
            key={cat.id}
            style={({ pressed }) => [
              styles.categoryCard,
              !cat.unlocked && styles.lockedCard,
              !selectedChild && styles.disabledCard,
              pressed && { opacity: 0.6 },
            ]}
            onPress={() => handleCategoryPress(cat)}
            disabled={!cat.unlocked || !selectedChild}
          >
            <Text style={[styles.categoryText, !cat.unlocked && styles.lockedText]}>
              {cat.name}
            </Text>
            {cat.unlocked && selectedChild && (
              <Text style={styles.badgeAvailable}>✅ Available</Text>
            )}
            {!selectedChild && (
              <Text style={styles.badgeWarning}>👆 Select or Add Child</Text>
            )}
          </Pressable>
        ))}

        {/* Add New Child */}
        <View style={styles.addChildContainer}>
          <Text style={styles.addChildText}>Need to add a new child?</Text>
          <Pressable
            style={({ pressed }) => [styles.addChildButton, pressed && { opacity: 0.7 }]}
            onPress={() => navigation.navigate("AddChild")}
          >
            <Text style={styles.addChildButtonText}>＋ Add New Child</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#f7fafc",
  },
  container: {
    flex: 1,
    paddingHorizontal: responsiveWidth(4),
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: responsiveHeight(2),
  },
  backButton: {
    marginRight: responsiveWidth(3),
    padding: responsiveWidth(1),
  },
  backIcon: {
    width: responsiveWidth(5),
    height: responsiveWidth(5),
    resizeMode: "contain",
  },
  title: {
    fontSize: responsiveFontSize(3),
    fontWeight: "700",
    color: "#1f2937",
  },
  selectedChildCard: {
    backgroundColor: "#dbeafe",
    padding: responsiveHeight(2),
    borderRadius: responsiveWidth(2),
    marginBottom: responsiveHeight(2),
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 3,
  },
  childLabel: {
    fontSize: responsiveFontSize(1.7),
    color: "#1e3a8a",
    fontWeight: "600",
  },
  childName: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: "700",
    color: "#1e40af",
    marginTop: responsiveHeight(0.5),
  },
  childMr: {
    fontSize: responsiveFontSize(1.6),
    color: "#6b7280",
    marginTop: responsiveHeight(0.5),
  },
  noChildCard: {
    backgroundColor: "#fef3c7",
    padding: responsiveHeight(2),
    borderRadius: responsiveWidth(2),
    marginBottom: responsiveHeight(2),
    alignItems: "center",
  },
  warningText: {
    fontSize: responsiveFontSize(1.9),
    fontWeight: "600",
    color: "#d97706",
    marginBottom: responsiveHeight(1),
  },
  selectChildButton: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(1),
    borderRadius: responsiveWidth(1.5),
  },
  selectChildButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: responsiveFontSize(1.7),
  },
  categoryCard: {
    backgroundColor: "#fff",
    padding: responsiveHeight(2),
    borderRadius: responsiveWidth(3),
    marginBottom: responsiveHeight(1.5),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  lockedCard: {
    backgroundColor: "#f3f4f6",
  },
  disabledCard: {
    opacity: 0.7,
  },
  categoryText: {
    fontSize: responsiveFontSize(2),
    fontWeight: "600",
    color: "#1f2937",
  },
  lockedText: {
    color: "#6b7280",
  },
  badgeAvailable: {
    fontSize: responsiveFontSize(1.5),
    color: "#10b981",
    fontWeight: "600",
    marginTop: responsiveHeight(0.5),
  },
  badgeWarning: {
    fontSize: responsiveFontSize(1.5),
    color: "#f59e0b",
    fontWeight: "600",
    marginTop: responsiveHeight(0.5),
  },
  addChildContainer: {
    marginTop: responsiveHeight(3),
    backgroundColor: "#e0f2fe",
    paddingVertical: responsiveHeight(2),
    borderRadius: responsiveWidth(3),
    alignItems: "center",
  },
  addChildText: {
    fontSize: responsiveFontSize(1.8),
    color: "#1e3a8a",
    fontWeight: "600",
    marginBottom: responsiveHeight(1),
  },
  addChildButton: {
    backgroundColor: "#293D55",
    paddingVertical: responsiveHeight(1.5),
    paddingHorizontal: responsiveWidth(5),
    borderRadius: responsiveWidth(2),
  },
  addChildButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: responsiveFontSize(1.8),
  },
});
