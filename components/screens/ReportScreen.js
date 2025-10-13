// components/screens/ReportScreen.js
import React, { useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { GoalContext } from '../context/GoalContext';

export default function ReportScreen({ navigation }) {
  const { disorders } = useContext(GoalContext);

  const allGoals = disorders.flatMap(d => d.goals);
  const passed = allGoals.filter(g => g.passed).length;
  const percent = ((passed / allGoals.length) * 100).toFixed(1);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Progress Report</Text>

      {disorders.map(d => (
        <View key={d.id} style={styles.section}>
          <Text style={styles.sectionTitle}>{d.title}</Text>
          <Text>{d.goals.filter(g => g.passed).length} / {d.goals.length} goals passed</Text>
        </View>
      ))}

      <View style={styles.summary}>
        <Text style={styles.summaryText}>Total Goals: {allGoals.length}</Text>
        <Text style={styles.summaryText}>Passed: {passed}</Text>
        <Text style={styles.summaryText}>Overall Progress: {percent}%</Text>
      </View>

      <TouchableOpacity style={styles.doneBtn} onPress={() => navigation.navigate('CategoryList')}>
        <Text style={styles.doneText}>Back to Categories</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingTop: 30, backgroundColor: '#F6F8FA', minHeight: '100%' },
  header: { fontSize: 22, fontWeight: '800', marginBottom: 18, textAlign: 'center' },
  section: { backgroundColor: '#fff', padding: 12, borderRadius: 10, marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700' },
  summary: { marginTop: 18, alignItems: 'center' },
  summaryText: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  doneBtn: { marginTop: 24, alignSelf: 'center', backgroundColor: '#2C5364', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 8 },
  doneText: { color: '#fff', fontWeight: '700' },
});
