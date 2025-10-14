// components/screens/CategoryListScreen.js
import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useChild } from "../context/ChildContext";

const CATEGORY_META = [
  { id: "F80.2", name: "Receptive Language (F80.2)", unlocked: true },
  { id: "F80.1", name: "Expressive Language (F80.1)", unlocked: true },
  { id: "H90", name: "Hearing Impairment (H90)", unlocked: true },
];

export default function CategoryListScreen() {
  const navigation = useNavigation();
  const { selectedChild } = useChild();

  const handleCategoryPress = (cat) => {
    if (!selectedChild) {
      Alert.alert(
        "No Child Selected",
        "Please select a child first before starting therapy sessions.",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Select Child", 
            onPress: () => navigation.navigate("Home")
          }
        ]
      );
      return;
    }

    if (cat.unlocked) {
      navigation.navigate("CategoryDetail", { 
        categoryId: cat.id,
        categoryName: cat.name 
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Therapy Categories</Text>
      
      {selectedChild ? (
        <View style={styles.selectedChildInfo}>
          <Text style={styles.selectedChildText}>
            Working with: <Text style={styles.childName}>{selectedChild.childName}</Text>
          </Text>
          <Text style={styles.mrNumber}>MR: {selectedChild.mrNumber}</Text>
        </View>
      ) : (
        <View style={styles.noChildWarning}>
          <Text style={styles.warningText}>⚠️ No child selected</Text>
          <TouchableOpacity 
            style={styles.selectChildButton}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.selectChildButtonText}>Select a Child</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.subtitle}>
        Select a category to view goals
      </Text>

      {CATEGORY_META.map((cat) => (
        <TouchableOpacity
          key={cat.id}
          style={[
            styles.card,
            !cat.unlocked && styles.lockedCard
          ]}
          onPress={() => handleCategoryPress(cat)}
          disabled={!cat.unlocked || !selectedChild}
        >
          <Text style={[
            styles.cardText,
            !cat.unlocked && styles.lockedText
          ]}>
            {cat.name}
          </Text>
          {!cat.unlocked && (
            <Text style={styles.lockedBadge}>🔒 Locked</Text>
          )}
          {cat.unlocked && selectedChild && (
            <Text style={styles.unlockedBadge}>✅ Available</Text>
          )}
          {cat.unlocked && !selectedChild && (
            <Text style={styles.selectChildHint}>👆 Select a child first</Text>
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f7fafc", 
    padding: 16 
  },
  title: { 
    fontSize: 24, 
    fontWeight: "700", 
    marginBottom: 8, 
    textAlign: "center",
    color: '#1f2937',
  },
  selectedChildInfo: {
    backgroundColor: '#dbeafe',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  selectedChildText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e40af',
  },
  childName: {
    fontWeight: '700',
  },
  mrNumber: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  noChildWarning: {
    backgroundColor: '#fef3c7',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  warningText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#d97706',
    marginBottom: 8,
  },
  selectChildButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  selectChildButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    color: '#6b7280',
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  lockedCard: {
    backgroundColor: "#f3f4f6",
  },
  cardText: { 
    fontSize: 16, 
    fontWeight: "600",
    color: '#1f2937',
    marginBottom: 4,
  },
  lockedText: {
    color: '#6b7280',
  },
  lockedBadge: {
    fontSize: 12,
    color: '#ef4444',
    fontWeight: '600',
  },
  unlockedBadge: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '600',
  },
  selectChildHint: {
    fontSize: 12,
    color: '#f59e0b',
    fontWeight: '600',
  },
});