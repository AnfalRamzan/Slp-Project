import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView, Button } from 'react-native';
import { goalBank } from '../data/goalBank';

const GoalBankScreen = () => {
  const [goalsData, setGoalsData] = useState(goalBank);

  const handleProgress = (disorderCode, goalId) => {
    const updated = { ...goalsData };
    updated[disorderCode].goals = updated[disorderCode].goals.map((goal) =>
      goal.id === goalId
        ? {
            ...goal,
            progress: goal.progress >= 100 ? 0 : goal.progress + 20, // increase by 20%
          }
        : goal
    );
    setGoalsData(updated);
  };

  const generateReport = () => {
    const allGoals = Object.values(goalsData).flatMap((d) => d.goals);
    const completed = allGoals.filter((g) => g.progress >= 60);
    const percent = ((completed.length / allGoals.length) * 100).toFixed(1);

    alert(
      `✅ Report\nTotal Goals: ${allGoals.length}\nCompleted: ${completed.length}\nProgress: ${percent}%`
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Goal Bank</Text>

      {Object.values(goalsData).map((disorder) => (
        <View key={disorder.code} style={styles.section}>
          <Text style={styles.sectionTitle}>
            {disorder.name} ({disorder.code})
          </Text>

          <FlatList
            data={disorder.goals}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.goalRow}>
                <Text
                  style={[
                    styles.goalItem,
                    { color: item.progress >= 60 ? 'green' : '#555' },
                  ]}
                >
                  {item.id}: {item.title} ({item.progress}%)
                </Text>
                <Button
                  title="+ Progress"
                  onPress={() => handleProgress(disorder.code, item.id)}
                />
              </View>
            )}
          />
        </View>
      ))}

      <View style={{ marginTop: 20 }}>
        <Button title="📊 Generate Report" onPress={generateReport} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#0066cc',
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#f0f8ff',
    borderRadius: 10,
    padding: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  goalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  goalItem: {
    fontSize: 14,
    color: '#555',
  },
});

export default GoalBankScreen;
