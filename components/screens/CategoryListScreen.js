// components/screens/CategoryListScreen.js
import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { GoalContext } from '../context/GoalContext';

export default function CategoryListScreen({ navigation }) {
  const { disorders } = useContext(GoalContext);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Select Category</Text>

      {disorders.map((d, index) => {
        const locked = !d.unlocked && !d.completed;
        return (
          <TouchableOpacity
            key={d.id}
            style={[styles.card, locked ? styles.locked : null, d.completed ? styles.completed : null]}
            onPress={() => {
              if (locked) return;
              navigation.navigate('CategoryDetail', { disorderId: d.id });
            }}
            disabled={locked}
          >
            <View>
              <Text style={styles.title}>{d.title}</Text>
              <Text style={styles.subtitle}>
                {d.completed ? '✅ Completed' : (d.unlocked ? '🔓 Open' : '🔒 Locked')}
              </Text>
            </View>
            <Text style={styles.count}>{d.goals.filter(g => g.passed).length}/{d.goals.length}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingTop: 30, backgroundColor: '#F5F7FB', minHeight: '100%' },
  header: { fontSize: 22, fontWeight: '700', marginBottom: 12, textAlign: 'center' },
  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  locked: { opacity: 0.6, backgroundColor: '#F0F0F0' },
  completed: { backgroundColor: '#E8F8EE' },
  title: { fontSize: 16, fontWeight: '700' },
  subtitle: { fontSize: 13, color: '#666' },
  count: { fontSize: 14, fontWeight: '700' },
});
