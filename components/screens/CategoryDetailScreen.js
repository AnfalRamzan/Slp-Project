// components/screens/CategoryDetailScreen.js
import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { GoalContext } from '../context/GoalContext';

export default function CategoryDetailScreen({ route, navigation }) {
  const { disorderId } = route.params;
  const { getDisorder, addSession, disorders } = useContext(GoalContext);
  const [disorder, setDisorder] = useState(() => getDisorder(disorderId));
  const [showScoresFor, setShowScoresFor] = useState(null); // show score buttons for a goal

  useEffect(() => {
    // update local view when global changes
    setDisorder(getDisorder(disorderId));
    // if this disorder just became completed, go back to list automatically after a short delay
    const d = getDisorder(disorderId);
    if (d && d.completed) {
      setTimeout(() => {
        Alert.alert('Category Completed', `${d.title} completed! Next category unlocked (if any).`);
        navigation.goBack();
      }, 400);
    }

    // if all disorders completed -> navigate to Report
    const allDone = disorders.every(x => x.completed);
    if (allDone) {
      navigation.navigate('Report');
    }
  }, [disorders]);

  if (!disorder) return null;

  const scoreOptions = [50, 60, 70, 80, 90];

  const handleAddScore = (goalId, score) => {
    addSession(disorderId, goalId, score);
    setShowScoresFor(null);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>{disorder.title}</Text>
      <Text style={styles.sub}>Tap a goal to open session scores. A goal passes when last 3 consecutive sessions are ≥ 60%.</Text>

      {disorder.goals.map((g) => (
        <View key={g.id} style={[styles.goalCard, g.passed ? styles.passedCard : null]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.goalTitle}>{g.id} — {g.title}</Text>
              <Text style={styles.goalSmall}>
                Passed: {g.passed ? 'Yes' : 'No'} — Sessions: {g.sessions.length}
              </Text>
              {g.sessions.length > 0 && (
                <Text style={styles.goalSmall}>Last scores: {g.sessions.slice(-3).map(s => s.score).join(', ')}</Text>
              )}
            </View>

            <View style={{ alignItems: 'flex-end' }}>
              {g.passed ? (
                <Text style={styles.passedText}>✅ Passed</Text>
              ) : (
                <TouchableOpacity
                  style={styles.addBtn}
                  onPress={() => setShowScoresFor(showScoresFor === g.id ? null : g.id)}
                >
                  <Text style={styles.addBtnText}>Add Session</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {showScoresFor === g.id && !g.passed && (
            <View style={styles.scoresRow}>
              {scoreOptions.map(s => (
                <TouchableOpacity key={s} style={styles.scoreBtn} onPress={() => handleAddScore(g.id, s)}>
                  <Text style={styles.scoreText}>{s}%</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingTop: 24, backgroundColor: '#F6F8FA', minHeight: '100%' },
  header: { fontSize: 20, fontWeight: '700', marginBottom: 6 },
  sub: { color: '#666', marginBottom: 12 },
  goalCard: { backgroundColor: '#fff', padding: 12, borderRadius: 10, marginBottom: 12, elevation: 2 },
  goalTitle: { fontSize: 16, fontWeight: '700' },
  goalSmall: { color: '#666', fontSize: 13 },
  addBtn: { backgroundColor: '#2C5364', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  addBtnText: { color: '#fff', fontWeight: '700' },
  scoresRow: { flexDirection: 'row', marginTop: 10, justifyContent: 'flex-start', flexWrap: 'wrap' },
  scoreBtn: { backgroundColor: '#E7F0FF', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8, marginRight: 8, marginBottom: 8 },
  scoreText: { color: '#004085', fontWeight: '700' },
  passedCard: { backgroundColor: '#E6F9EE' },
  passedText: { color: '#0B8A3E', fontWeight: '800' },
});
