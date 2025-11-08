// components/screens/CategoryDetailScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { initialGoalBank } from '../data/goalBank';
import { useChild } from '../context/ChildContext';

export default function CategoryDetailScreen({ route, navigation }) {
  const { categoryId, categoryName } = route.params;
  const { selectedChild, updateChildProgress, getGoalSessionStatus, refreshTrigger } = useChild();
  const [goalBank] = useState(initialGoalBank);
  const [currentCategory, setCurrentCategory] = useState(null);

  useEffect(() => {
    const category = goalBank.find(cat => cat.id === categoryId);
    setCurrentCategory(category);
  }, [categoryId, goalBank]);

  const handleStartSession = (goalId, goalTitle) => {
    if (!currentCategory || !selectedChild) {
      Alert.alert("Error", "Please select a child first");
      navigation.navigate('Home');
      return;
    }

    navigation.navigate('SessionScreen', {
      categoryId: currentCategory.id,
      categoryName: currentCategory.title,
      goalId: goalId,
      goalTitle: goalTitle,
      childId: selectedChild.id,
      onSessionComplete: (sessionData) => {
        updateChildProgress(selectedChild.id, currentCategory.id, goalId, sessionData);

        const message = sessionData.passCount === sessionData.activities.length
          ? `Session passed! ${sessionData.passCount}/${sessionData.activities.length} activities completed successfully.`
          : `Session completed. ${sessionData.passCount}/${sessionData.activities.length} activities passed. Keep practicing!`;

        Alert.alert("Session Saved", message, [{ text: "OK" }]);
      }
    });
  };

  if (!currentCategory) {
    return (
      <View style={styles.container}>
        <Text>Loading category...</Text>
      </View>
    );
  }

  if (!selectedChild) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No child selected</Text>
        <Text style={styles.errorSubtext}>
          Please select a child before starting therapy sessions
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.buttonText}>Select a Child</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Category Title */}
      <Text style={styles.title}>{currentCategory.title}</Text>
      
      {/* Child Info */}
      <View style={styles.childInfo}>
        <Text style={styles.childInfoText}>
          Working with: <Text style={styles.childName}>{selectedChild.childName}</Text>
        </Text>
        <Text style={styles.mrNumber}>MR: {selectedChild.mrNumber}</Text>
      </View>

      <Text style={styles.subtitle}>Select a goal to start a session</Text>

      {/* Goals List */}
      {currentCategory.goals.map((goal) => {
        const sessionStatus = getGoalSessionStatus(selectedChild.id, categoryId, goal.id);

        // Determine session status text
        const sessionStatusText = sessionStatus
          ? sessionStatus.isPassed
            ? 'Result: PASS'
            : sessionStatus.consecutivePasses > 0
              ? `${sessionStatus.consecutivePasses}/3 consecutive passes`
              : sessionStatus.activitiesCompleted > 0
                ? `Result: ${sessionStatus.passCount}/${sessionStatus.activitiesCompleted} activities passed`
                : 'Not started'
          : 'Not started';

        // Determine styling
        const isActiveGoal = sessionStatus && !sessionStatus.isPassed && sessionStatus.consecutivePasses > 0;
        const isCompleted = sessionStatus?.isPassed;

        return (
          <View
            key={goal.id}
            style={[
              styles.goalCard,
              isActiveGoal && { borderWidth: 2, borderColor: '#3b82f6', backgroundColor: '#e0f2fe' },
              isCompleted && { borderWidth: 2, borderColor: '#10b981', backgroundColor: '#dcfce7' } // green for completed
            ]}
          >
            <View style={styles.goalHeader}>
              <View style={styles.goalTitleContainer}>
                <Text style={styles.goalTitle}>{goal.title}</Text>
                <Text style={styles.goalId}>{goal.id}</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={[
                  styles.statusText,
                  (isActiveGoal && { color: '#1e3a8a', fontWeight: '700' }) || 
                  (isCompleted && { color: '#065f46', fontWeight: '700' })
                ]}>
                  {sessionStatusText}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.sessionButton}
              onPress={() => handleStartSession(goal.id, goal.title)}
            >
              <Text style={styles.sessionButtonText}>Start Session</Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7fafc',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
    color: '#1f2937',
  },
  childInfo: {
    backgroundColor: '#dbeafe',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  childInfoText: {
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
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#6b7280',
    fontWeight: '600',
  },
  goalCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  goalTitleContainer: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  goalId: {
    fontSize: 12,
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  statusBadge: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  sessionButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  sessionButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  errorText: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 8,
    color: '#ef4444',
    fontWeight: '600',
  },
  errorSubtext: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#6b7280',
  },
  button: {
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
